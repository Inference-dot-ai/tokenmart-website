type Env = {
  GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;
  GOOGLE_PRIVATE_KEY?: string;
  GOOGLE_SHEET_ID?: string;
  GOOGLE_SUBSCRIBE_SHEET_ID?: string;
  GOOGLE_SUBSCRIBE_RANGE?: string;
};

interface PagesContext {
  request: Request;
  env: Env;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBSCRIBE_RANGE_DEFAULT = "Sheet1!A:B";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

function b64url(input: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof input === "string") {
    bytes = new TextEncoder().encode(input);
  } else if (input instanceof Uint8Array) {
    bytes = input;
  } else {
    bytes = new Uint8Array(input);
  }
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// Cloudflare's plain-text env vars keep surrounding quotes (`"-----BEGIN..."`)
// when copy-pasted from .env, which breaks PEM parsing. Strip them first.
function normalizePem(raw: string): string {
  let k = raw.trim();
  if (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'"))
  ) {
    k = k.slice(1, -1);
  }
  return k.replace(/\\n/g, "\n");
}

function pemToPkcs8(pem: string): ArrayBuffer {
  const body = normalizePem(pem)
    .replace(/-----BEGIN [^-]+-----/, "")
    .replace(/-----END [^-]+-----/, "")
    .replace(/\s+/g, "");
  const bin = atob(body);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

async function getAccessToken(env: Env): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      scope: SCOPE,
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );
  const signingInput = `${header}.${claim}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToPkcs8(env.GOOGLE_PRIVATE_KEY!),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput),
  );
  const jwt = `${signingInput}.${b64url(sig)}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!tokenRes.ok) {
    throw new Error(`token_exchange_failed:${tokenRes.status}`);
  }
  const { access_token } = (await tokenRes.json()) as { access_token: string };
  return access_token;
}

async function appendRow(env: Env, email: string): Promise<void> {
  const spreadsheetId = env.GOOGLE_SUBSCRIBE_SHEET_ID || env.GOOGLE_SHEET_ID!;
  const range = env.GOOGLE_SUBSCRIBE_RANGE || SUBSCRIBE_RANGE_DEFAULT;
  const accessToken = await getAccessToken(env);

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}` +
    `/values/${encodeURIComponent(range)}:append` +
    `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      values: [[new Date().toISOString(), email]],
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`sheets_append_failed:${res.status}:${detail.slice(0, 200)}`);
  }
}

function isConfigured(env: Env): boolean {
  return !!(
    env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    env.GOOGLE_PRIVATE_KEY &&
    (env.GOOGLE_SUBSCRIBE_SHEET_ID || env.GOOGLE_SHEET_ID) &&
    !env.GOOGLE_SERVICE_ACCOUNT_EMAIL.startsWith("your-")
  );
}

export const onRequestPost = async ({ request, env }: PagesContext): Promise<Response> => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const email = (body as { email?: unknown })?.email;
  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !EMAIL_RE.test(email.trim())
  ) {
    return json({ error: "invalid_email" }, 400);
  }

  if (!isConfigured(env)) {
    return json({ error: "subscribe_not_configured" }, 503);
  }

  try {
    await appendRow(env, email.trim());
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("[functions/api/subscribe] failed", msg);
    return json({ error: msg }, 500);
  }

  return json({ ok: true });
};
