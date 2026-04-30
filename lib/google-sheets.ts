import fs from "node:fs";
import path from "node:path";
import { google } from "googleapis";

export type Category = "LLM" | "Image" | "Video" | "Audio";

export interface Model {
  name: string;
  provider: string;
  category: Category;
  description: string;
  price: string;                      // discounted output price, e.g. "$12.75"
  unit: string;                       // e.g. "/1M tokens", "/img", "/s"
  originalPrice: string | null;       // "from" output price when discount > 0
  discountPct: number | null;         // 0-100; null when no discount
  inputPrice: string | null;          // discounted input price (LLMs), null when no input pricing
  inputUnit: string | null;           // input unit (typically "/1M tokens")
  originalInputPrice: string | null;  // "from" input price when discount > 0
  featured: boolean;
  assetUrl: string | null;
  assetType: "image" | "video" | null;
}

type ModelCore = Omit<Model, "assetUrl" | "assetType">;

const ASSETS_DIR = path.join(process.cwd(), "public", "model-assets");

const ASSET_INDEX: Map<string, { url: string; type: "image" | "video" }> = (() => {
  const m = new Map<string, { url: string; type: "image" | "video" }>();
  try {
    for (const f of fs.readdirSync(ASSETS_DIR)) {
      const ext = path.extname(f).toLowerCase();
      const slug = path.basename(f, ext);
      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".webp") {
        m.set(slug, { url: `/model-assets/${f}`, type: "image" });
      } else if (ext === ".mp4" || ext === ".webm") {
        m.set(slug, { url: `/model-assets/${f}`, type: "video" });
      }
    }
  } catch {
    // No assets folder; models render without media.
  }
  return m;
})();

function slugifyName(name: string): string {
  return name.toLowerCase().replace(/[\s./_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function attachAsset(m: ModelCore): Model {
  const a = ASSET_INDEX.get(slugifyName(m.name));
  return { ...m, assetUrl: a?.url ?? null, assetType: a?.type ?? null };
}

const SHEET_RANGE = "All Model!A2:Q" as const;

// Cloudflare's plain-text env vars store the value verbatim, so a key
// pasted with surrounding quotes from .env (e.g. `"-----BEGIN..."`) keeps
// them. The JWT signer then chokes on a quoted PEM. Strip them defensively.
function normalizePrivateKey(raw: string | undefined): string | undefined {
  if (!raw) return raw;
  let k = raw.trim();
  if (
    (k.startsWith('"') && k.endsWith('"')) ||
    (k.startsWith("'") && k.endsWith("'"))
  ) {
    k = k.slice(1, -1);
  }
  return k.replace(/\\n/g, "\n");
}

const TYPE_TO_CATEGORY: Record<string, Category> = {
  "Text Generation": "LLM",
  "Image Generation": "Image",
  "Video Generation": "Video",
  "Audio Generation": "Audio",
};

const FALLBACK_MODELS: ModelCore[] = [
  {
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    category: "LLM",
    description: "Premium balanced Claude for fast, capable answers across production workloads.",
    price: "$12.75",
    unit: "/1M tokens",
    originalPrice: "$15.00",
    discountPct: 15,
    inputPrice: "$2.55",
    inputUnit: "/1M tokens",
    originalInputPrice: "$3.00",
    featured: true,
  },
  {
    name: "GPT 5.4",
    provider: "OpenAI",
    category: "LLM",
    description: "Most capable GPT-5 line for professional use and reasoning-forward tasks.",
    price: "$12.75",
    unit: "/1M tokens",
    originalPrice: "$15.00",
    discountPct: 15,
    inputPrice: "$2.55",
    inputUnit: "/1M tokens",
    originalInputPrice: "$3.00",
    featured: true,
  },
  {
    name: "Gemini 3.1 Pro Preview",
    provider: "Google",
    category: "LLM",
    description: "Preview flagship Gemini for stronger reasoning.",
    price: "$9.60",
    unit: "/1M tokens",
    originalPrice: "$12.00",
    discountPct: 20,
    inputPrice: "$2.40",
    inputUnit: "/1M tokens",
    originalInputPrice: "$3.00",
    featured: true,
  },
  {
    name: "Nano Banana 2",
    provider: "Google",
    category: "Image",
    description: "Upgraded Gemini image model with sharper natural-language control.",
    price: "$0.04",
    unit: "/img",
    originalPrice: "$0.05",
    discountPct: 20,
    inputPrice: null,
    inputUnit: null,
    originalInputPrice: null,
    featured: true,
  },
];

function isConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    process.env.GOOGLE_SHEET_ID &&
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.startsWith("your-")
  );
}

function parsePercent(s: string): number | null {
  const m = s.match(/^([\d.]+)/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseRow(row: string[]): ModelCore | null {
  const onHomePage = row[1]?.trim() ?? "";
  const name = row[2]?.trim() ?? "";
  const typeLabel = row[3]?.trim() ?? "";
  const fromPrice = row[4]?.trim() ?? "";
  const unit = row[5]?.trim() ?? "";
  const discountStr = row[7]?.trim() ?? "";
  const discountedPrice = row[8]?.trim() ?? "";
  const provider = row[10]?.trim() ?? "";
  const description = row[11]?.trim() ?? "";
  const inputFromPrice = row[13]?.trim() ?? "";
  const inputUnitRaw = row[14]?.trim() ?? "";
  const inputDiscountedPrice = row[15]?.trim() ?? "";

  if (!name) return null;
  const category = TYPE_TO_CATEGORY[typeLabel];
  if (!category) return null;

  const discountPct = parsePercent(discountStr);
  const hasDiscount = discountPct !== null && !!discountedPrice && !!fromPrice;
  const hasInput = !!inputFromPrice;
  const hasInputDiscount = hasInput && hasDiscount && !!inputDiscountedPrice;

  return {
    name,
    provider,
    category,
    description,
    price: hasDiscount ? discountedPrice : fromPrice,
    unit,
    originalPrice: hasDiscount ? fromPrice : null,
    discountPct: hasDiscount ? discountPct : null,
    inputPrice: hasInput ? (hasInputDiscount ? inputDiscountedPrice : inputFromPrice) : null,
    inputUnit: hasInput ? inputUnitRaw || unit : null,
    originalInputPrice: hasInputDiscount ? inputFromPrice : null,
    featured: onHomePage.toLowerCase() === "featured",
  };
}

const SUBSCRIBE_RANGE_DEFAULT = "Sheet1!A:B";

function isSubscribeConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY &&
    (process.env.GOOGLE_SUBSCRIBE_SHEET_ID || process.env.GOOGLE_SHEET_ID) &&
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.startsWith("your-")
  );
}

export async function appendSubscriberEmail(email: string): Promise<void> {
  if (!isSubscribeConfigured()) {
    throw new Error("subscribe_not_configured");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId:
      process.env.GOOGLE_SUBSCRIBE_SHEET_ID || process.env.GOOGLE_SHEET_ID,
    range: process.env.GOOGLE_SUBSCRIBE_RANGE || SUBSCRIBE_RANGE_DEFAULT,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[new Date().toISOString(), email]],
    },
  });
}

export async function fetchModels(): Promise<Model[]> {
  if (!isConfigured()) {
    console.log("[google-sheets] Not configured — using fallback data");
    return FALLBACK_MODELS.map(attachAsset);
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: SHEET_RANGE,
    });

    const rows = (res.data.values || []) as string[][];
    const models = rows
      .map(parseRow)
      .filter((m): m is ModelCore => m !== null);

    if (models.length === 0) {
      console.log("[google-sheets] Sheet empty — using fallback data");
      return FALLBACK_MODELS.map(attachAsset);
    }

    return models.map(attachAsset);
  } catch (err) {
    console.error("[google-sheets] Fetch failed — using fallback data", err);
    return FALLBACK_MODELS.map(attachAsset);
  }
}
