import { google } from "googleapis";
import { extractPriceUSD } from "./price";

export type Category = "LLM" | "Image" | "Video" | "Audio";
export type Badge = "PREMIUM" | "BEST VALUE";

export interface Model {
  name: string;
  provider: string;
  category: Category;
  description: string;
  price: string;
  tags: string[];
  badge: Badge;
}

const SHEET_RANGES = [
  "Text Generation!A2:E",
  "Image Generation!A2:D",
  "Video Generation!A2:E",
  "Audio Generation!A2:C",
] as const;

const FALLBACK_MODELS: Model[] = [
  {
    name: "GPT-5.2",
    provider: "OpenAI",
    category: "LLM",
    description: "Flagship with prompt caching",
    price: "$1.483",
    tags: ["400K context"],
    badge: "PREMIUM",
  },
  {
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    category: "LLM",
    description: "Speed/intelligence/cost balance",
    price: "$2.700",
    tags: ["200K context"],
    badge: "PREMIUM",
  },
  {
    name: "Gemini 2.5 Flash Lite",
    provider: "Google",
    category: "LLM",
    description: "Cost-efficient data processing",
    price: "$0.095",
    tags: [],
    badge: "BEST VALUE",
  },
  {
    name: "Nano Banana",
    provider: "Google",
    category: "Image",
    description: "Natural language-driven image generation",
    price: "$0.024/img",
    tags: [],
    badge: "PREMIUM",
  },
  {
    name: "GPT Image 1.5",
    provider: "OpenAI",
    category: "Image",
    description: "True-color precision, structured tasks",
    price: "$0.014/img",
    tags: [],
    badge: "BEST VALUE",
  },
  {
    name: "Sora 2",
    provider: "OpenAI",
    category: "Video",
    description: "Audio support, watermark removal",
    price: "$0.085/s",
    tags: ["10-15s"],
    badge: "PREMIUM",
  },
  {
    name: "Seedance 1.0 Pro Fast",
    provider: "BytePlus",
    category: "Video",
    description: "720p/1080p quality",
    price: "$0.014/s",
    tags: ["2-12s"],
    badge: "BEST VALUE",
  },
  {
    name: "Suno",
    provider: "Suno",
    category: "Audio",
    description: "",
    price: "$0.118/2 tracks",
    tags: [],
    badge: "BEST VALUE",
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

type RawRow = string[];
type ParsedModel = Omit<Model, "badge">;

function parseLLMRow(row: RawRow): ParsedModel | null {
  const [name, provider, price, ctx, description] = row;
  if (!name) return null;
  const tags = ctx && ctx !== "Not listed" ? [`${ctx} context`] : [];
  return {
    name,
    provider: provider || "",
    category: "LLM",
    description: description || "",
    price: price || "",
    tags,
  };
}

function parseImageRow(row: RawRow): ParsedModel | null {
  const [name, provider, price, description] = row;
  if (!name) return null;
  return {
    name,
    provider: provider || "",
    category: "Image",
    description: description || "",
    price: price || "",
    tags: [],
  };
}

function parseVideoRow(row: RawRow): ParsedModel | null {
  const [name, provider, duration, price, description] = row;
  if (!name) return null;
  const tags = duration && duration !== "Not listed" ? [duration] : [];
  return {
    name,
    provider: provider || "",
    category: "Video",
    description: description || "",
    price: price || "",
    tags,
  };
}

function parseAudioRow(row: RawRow): ParsedModel | null {
  const [name, provider, price] = row;
  if (!name) return null;
  return {
    name,
    provider: provider || "",
    category: "Audio",
    description: "",
    price: price || "",
    tags: [],
  };
}

function applyBadgeRule(models: ParsedModel[]): Model[] {
  // Cheapest model per category gets BEST VALUE; ties = first in sheet order wins.
  const cheapestIdxByCategory = new Map<Category, { idx: number; price: number }>();
  models.forEach((m, idx) => {
    const n = extractPriceUSD(m.price);
    if (n === null) return;
    const cur = cheapestIdxByCategory.get(m.category);
    if (!cur || n < cur.price) {
      cheapestIdxByCategory.set(m.category, { idx, price: n });
    }
  });
  return models.map((m, idx) => ({
    ...m,
    badge:
      cheapestIdxByCategory.get(m.category)?.idx === idx
        ? "BEST VALUE"
        : "PREMIUM",
  }));
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

    const res = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      ranges: [...SHEET_RANGES],
    });

    const valueRanges = res.data.valueRanges || [];
    const llmRows = (valueRanges[0]?.values || []) as RawRow[];
    const imageRows = (valueRanges[1]?.values || []) as RawRow[];
    const videoRows = (valueRanges[2]?.values || []) as RawRow[];
    const audioRows = (valueRanges[3]?.values || []) as RawRow[];

    const parsed: (ParsedModel | null)[] = [
      ...llmRows.map(parseLLMRow),
      ...imageRows.map(parseImageRow),
      ...videoRows.map(parseVideoRow),
      ...audioRows.map(parseAudioRow),
    ];
    const models = parsed.filter((m): m is ParsedModel => m !== null);

    if (models.length === 0) {
      console.log("[google-sheets] All tabs empty — using fallback data");
      return FALLBACK_MODELS;
    }

    return applyBadgeRule(models);
  } catch (err) {
    console.error("[google-sheets] Fetch failed — using fallback data", err);
    return FALLBACK_MODELS;
  }
}
