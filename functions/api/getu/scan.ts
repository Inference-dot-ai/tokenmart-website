type Env = {
  GETU_API_KEY?: string;
  GETU_API_SECRET?: string;
};

interface PagesContext {
  request: Request;
  env: Env;
}

const GETU_ENDPOINT =
  "https://attribution.getu.ai/dashboard/api/open/events/scan";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

function toHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

async function hmacSha256Hex(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(msg),
  );
  return toHex(sig);
}

function sortedBodyString(body: Record<string, unknown>): string {
  return Object.keys(body)
    .filter((k) => body[k] !== undefined && body[k] !== null)
    .sort()
    .map((k) => `${k}=${body[k]}`)
    .join("&");
}

function isConfigured(env: Env): boolean {
  return !!(env.GETU_API_KEY && env.GETU_API_SECRET);
}

export const onRequestPost = async ({
  request,
  env,
}: PagesContext): Promise<Response> => {
  if (!isConfigured(env)) {
    return json({ error: "getu_not_configured" }, 503);
  }

  const internalKey = request.headers.get("x-internal-key");
  if (!internalKey || internalKey !== env.GETU_API_KEY) {
    return json({ error: "unauthorized" }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const signStr = timestamp + nonce + sortedBodyString(body);

  let signature: string;
  try {
    signature = await hmacSha256Hex(env.GETU_API_SECRET!, signStr);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("[functions/api/getu/scan] sign_failed", msg);
    return json({ error: "sign_failed" }, 500);
  }

  let upstream: Response;
  try {
    upstream = await fetch(GETU_ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.GETU_API_KEY!,
        "x-signature": signature,
        "x-timestamp": timestamp,
        "x-nonce": nonce,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("[functions/api/getu/scan] fetch_failed", msg);
    return json({ error: "upstream_unreachable" }, 502);
  }

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") || "application/json",
    },
  });
};
