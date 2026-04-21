import { google } from "googleapis";

export type Category = "LLM" | "Image" | "Video" | "Audio";

export interface Model {
  name: string;
  provider: string;
  category: Category;
  description: string;
  price: string;                 // discounted price, e.g. "$12.75"
  unit: string;                  // e.g. "/1M tokens", "/img", "/s"
  originalPrice: string | null;  // "from" price when discount > 0
  discountPct: number | null;    // 0-100; null when no discount
  featured: boolean;
}

const SHEET_RANGE = "All Model!A2:L" as const;

const TYPE_TO_CATEGORY: Record<string, Category> = {
  "Text Generation": "LLM",
  "Image Generation": "Image",
  "Video Generation": "Video",
  "Audio Generation": "Audio",
};

const FALLBACK_MODELS: Model[] = [
  {
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    category: "LLM",
    description: "Premium balanced Claude for fast, capable answers across production workloads.",
    price: "$12.75",
    unit: "/1M tokens",
    originalPrice: "$15.00",
    discountPct: 15,
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

function parseRow(row: string[]): Model | null {
  const onHomePage = row[1]?.trim() ?? "";
  const name = row[2]?.trim() ?? "";
  const typeLabel = row[3]?.trim() ?? "";
  const fromPrice = row[4]?.trim() ?? "";
  const unit = row[5]?.trim() ?? "";
  const discountStr = row[7]?.trim() ?? "";
  const discountedPrice = row[8]?.trim() ?? "";
  const provider = row[10]?.trim() ?? "";
  const description = row[11]?.trim() ?? "";

  if (!name) return null;
  const category = TYPE_TO_CATEGORY[typeLabel];
  if (!category) return null;

  const discountPct = parsePercent(discountStr);
  const hasDiscount = discountPct !== null && !!discountedPrice && !!fromPrice;

  return {
    name,
    provider,
    category,
    description,
    price: hasDiscount ? discountedPrice : fromPrice,
    unit,
    originalPrice: hasDiscount ? fromPrice : null,
    discountPct: hasDiscount ? discountPct : null,
    featured: onHomePage.toLowerCase() === "featured",
  };
}

export async function fetchModels(): Promise<Model[]> {
  if (!isConfigured()) {
    console.log("[google-sheets] Not configured — using fallback data");
    return FALLBACK_MODELS;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
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
      .filter((m): m is Model => m !== null);

    if (models.length === 0) {
      console.log("[google-sheets] Sheet empty — using fallback data");
      return FALLBACK_MODELS;
    }

    return models;
  } catch (err) {
    console.error("[google-sheets] Fetch failed — using fallback data", err);
    return FALLBACK_MODELS;
  }
}
