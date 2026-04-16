import { google } from "googleapis";

export type Badge = "PREMIUM" | "BEST VALUE";

export interface Model {
  name: string;
  provider: string;
  description: string;
  badge: Badge;
  tags: string[];
  input: { original: string; price: string };
  output: { original: string; price: string };
}

const FALLBACK_MODELS: Model[] = [
  {
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Most advanced multimodal model with vision, audio, and text.",
    badge: "PREMIUM",
    tags: ["128K Context", "Vision & Audio", "Function Calling"],
    input: { original: "$5.00", price: "$3.50/M" },
    output: { original: "$15.00", price: "$7.50/M" },
  },
  {
    name: "GPT-4o mini",
    provider: "OpenAI",
    description: "Fast, efficient model for everyday tasks.",
    badge: "BEST VALUE",
    tags: ["128K Context", "Fast Inference"],
    input: { original: "$0.30", price: "$0.075/M" },
    output: { original: "$1.20", price: "$0.30/M" },
  },
  {
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "Most intelligent Claude model with coding.",
    badge: "PREMIUM",
    tags: ["200K Context", "Best for Code"],
    input: { original: "$3.00", price: "$1.50/M" },
    output: { original: "$15.00", price: "$5.00/M" },
  },
  {
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    description: "Fastest Claude model with vision capabilities.",
    badge: "BEST VALUE",
    tags: ["200K Context", "Fast Inference"],
    input: { original: "$1.00", price: "$0.40/M" },
    output: { original: "$5.00", price: "$1.50/M" },
  },
  {
    name: "Gemini 1.5 Pro",
    provider: "Google",
    description: "Advanced multimodal model with large context window.",
    badge: "PREMIUM",
    tags: ["1M Context", "Multimodal", "Advanced Reasoning"],
    input: { original: "$3.50", price: "$1.25/M" },
    output: { original: "$10.50", price: "$5.75/M" },
  },
  {
    name: "Gemini 1.5 Flash",
    provider: "Google",
    description: "Fast, cost-effective model for high-volume tasks.",
    badge: "BEST VALUE",
    tags: ["1M Context", "Fastest"],
    input: { original: "$0.15", price: "$0.045/M" },
    output: { original: "$0.60", price: "$0.18/M" },
  },
  {
    name: "DALL-E 3",
    provider: "OpenAI",
    description: "State-of-the-art image generation with precise prompt following.",
    badge: "PREMIUM",
    tags: ["1024×1024", "High Quality"],
    input: { original: "$0.080", price: "$0.054/image" },
    output: { original: "", price: "$0.048/image" },
  },
  {
    name: "Flux.1 Pro",
    provider: "Black Forest Labs",
    description: "Professional image generation with photorealistic capabilities.",
    badge: "PREMIUM",
    tags: ["Photorealistic", "Photography Grade"],
    input: { original: "$0.10", price: "$0.055/image" },
    output: { original: "", price: "$0.055/image" },
  },
  {
    name: "Whisper Large v3",
    provider: "OpenAI",
    description: "Advanced speech-to-text with multilingual support.",
    badge: "BEST VALUE",
    tags: ["99 Languages", "Multilingual", "Audio"],
    input: { original: "$0.006/min", price: "$0.003/min" },
    output: { original: "", price: "" },
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

/**
 * Expected sheet columns (row 1 = headers):
 * A: Name | B: Provider | C: Description | D: Badge | E: Tags (comma-separated)
 * F: Input Original Price | G: Input Price | H: Output Original Price | I: Output Price
 */
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
    const tab = process.env.GOOGLE_SHEET_TAB || "Sheet1";

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${tab}!A2:I`,
    });

    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      console.log("[google-sheets] Sheet is empty — using fallback data");
      return FALLBACK_MODELS;
    }

    return rows.map((row) => ({
      name: row[0] || "",
      provider: row[1] || "",
      description: row[2] || "",
      badge: (row[3] === "BEST VALUE" ? "BEST VALUE" : "PREMIUM") as Badge,
      tags: (row[4] || "").split(",").map((t: string) => t.trim()).filter(Boolean),
      input: { original: row[5] || "", price: row[6] || "" },
      output: { original: row[7] || "", price: row[8] || "" },
    }));
  } catch (err) {
    console.error("[google-sheets] Fetch failed — using fallback data", err);
    return FALLBACK_MODELS;
  }
}
