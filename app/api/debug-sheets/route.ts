import { NextResponse } from "next/server";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

function peek(v: string | undefined): string {
  if (!v) return "MISSING";
  if (v.length < 20) return `len=${v.length} (suspiciously short)`;
  return `len=${v.length} first10="${v.slice(0, 10)}" last10="${v.slice(-10)}"`;
}

export async function GET() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const diag: Record<string, unknown> = {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: peek(email),
    GOOGLE_SHEET_ID: peek(sheetId),
    GOOGLE_PRIVATE_KEY_meta: key
      ? {
          length: key.length,
          starts_with_BEGIN: key.startsWith("-----BEGIN"),
          ends_with_END_newline: key.trimEnd().endsWith("-----END PRIVATE KEY-----"),
          has_literal_backslash_n: key.includes("\\n"),
          has_real_newlines: key.includes("\n"),
          starts_with_quote: key.startsWith('"'),
          ends_with_quote: key.endsWith('"'),
        }
      : "MISSING",
  };

  if (!email || !key || !sheetId) {
    return NextResponse.json({ stage: "env_check", ok: false, diag }, { status: 500 });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: email,
        private_key: key.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "All Model!A2:L",
    });

    const rowCount = (res.data.values ?? []).length;
    return NextResponse.json({ stage: "success", ok: true, diag, rowCount });
  } catch (err) {
    const error = err as { message?: string; code?: number; errors?: unknown };
    return NextResponse.json(
      {
        stage: "sheets_call_threw",
        ok: false,
        diag,
        errorMessage: error.message ?? String(err),
        errorCode: error.code,
        errorDetails: error.errors,
      },
      { status: 500 }
    );
  }
}
