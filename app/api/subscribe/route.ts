import { NextResponse } from "next/server";
import { appendSubscriberEmail } from "@/lib/google-sheets";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = (body as { email?: unknown })?.email;
  if (
    typeof email !== "string" ||
    email.length > 254 ||
    !EMAIL_RE.test(email.trim())
  ) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  try {
    await appendSubscriberEmail(email.trim());
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    const status = msg === "subscribe_not_configured" ? 503 : 500;
    console.error("[api/subscribe] failed", err);
    return NextResponse.json({ error: msg }, { status });
  }

  return NextResponse.json({ ok: true });
}
