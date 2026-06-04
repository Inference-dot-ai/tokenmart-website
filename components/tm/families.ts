// Curated family presentation map + the card data type. Pure data (no React /
// JSX) so it can be imported by the build script (tsx) as well as the client.
//
// The live endpoint (https://model.service-inference.ai/public/models) only
// provides model ids + token/unit pricing + reference price + discount. Every
// *presentation* field below (brand, logo, tint, glyph, blurb, tags, unit, and
// which ids form a family) is not in the endpoint and is curated here. The
// build script merges the live prices + variant lists onto these families.

export type TMModel = {
  id: string;
  name: string;
  provider: string;
  line: string;
  retail: number;
  wholesale: number;
  unit: string;
  blurb: string;
  tags: string[];
  size: "sm" | "md" | "lg";
  tint: string;
  glyph: string;
  logo: string;
};

export type Family = {
  key: string;
  name: string;
  provider: string;
  category: "LLM" | "Image" | "Video";
  unit: string;
  tint: string;
  glyph: string;
  logo: string;
  blurb: string;
  tags: string[];
  /** Whether an endpoint model id belongs to this family. */
  match: (id: string) => boolean;
  /** Endpoint id whose price headlines the card (falls back to the priciest in-family id). */
  primaryId: string;
  /** Used when the endpoint is unavailable at build time or the family has no token price (video). */
  fallback: { retail: number; wholesale: number; line: string };
};

const has = (s: string) => (id: string) => id.toLowerCase().startsWith(s);

export const FAMILIES: Family[] = [
  {
    key: "claude", name: "Claude", provider: "Anthropic", category: "LLM", unit: "/1M out",
    tint: "#ff7a45", glyph: "✳", logo: "/tm-assets/claude-logo.png",
    blurb: "Top-shelf reasoning & code. Flies off the shelf.",
    tags: ["Reasoning", "Coding", "200K ctx"],
    match: has("claude"), primaryId: "claude-opus-4-8",
    fallback: { retail: 25, wholesale: 20, line: "Opus 4.8 · Sonnet 4.6 · Haiku 4.5" },
  },
  {
    key: "gpt", name: "GPT", provider: "OpenAI", category: "LLM", unit: "/1M out",
    tint: "#19c37d", glyph: "◍", logo: "/tm-assets/openai-logo.png",
    blurb: "The crowd favorite. Stocked deep, priced low.",
    tags: ["General", "Tools", "Vision"],
    match: has("gpt"), primaryId: "gpt-5.4",
    fallback: { retail: 15, wholesale: 12, line: "GPT-5.5 · GPT-5.4 · GPT-5.2 Codex · GPT-5.1" },
  },
  {
    key: "gemini", name: "Gemini", provider: "Google", category: "LLM", unit: "/1M out",
    tint: "#4d8bff", glyph: "✦", logo: "/tm-assets/gemini-logo.png",
    blurb: "2M-token cart capacity. Bulk context, bulk savings.",
    tags: ["2M ctx", "Multimodal"],
    match: has("gemini"), primaryId: "gemini-3-pro-preview",
    fallback: { retail: 12, wholesale: 9.6, line: "3.1 Pro · 3 Pro · 3.5 Flash · 3 Flash" },
  },
  {
    key: "grok", name: "Grok", provider: "xAI", category: "LLM", unit: "/1M out",
    tint: "#d6d6d6", glyph: "✕", logo: "/tm-assets/grok-logo.png",
    blurb: "Real-time feed, sharp tongue. Just landed.",
    tags: ["Realtime", "Reasoning"],
    match: has("grok"), primaryId: "grok-4.3",
    fallback: { retail: 2.5, wholesale: 2, line: "Grok 4.3 · Grok 4.20 · Grok 4.1 Fast" },
  },
  {
    key: "deepseek", name: "DeepSeek", provider: "DeepSeek", category: "LLM", unit: "/1M out",
    tint: "#5b6cff", glyph: "◆", logo: "/tm-assets/deepseek-logo.png",
    blurb: "The warehouse-brand reasoner. Same job, a fraction of the price.",
    tags: ["Reasoning", "Chat"],
    match: has("deepseek"), primaryId: "deepseek-v4-pro",
    fallback: { retail: 3.48, wholesale: 0.87, line: "V4 Pro · V4 Flash · V3.2" },
  },
  {
    key: "qwen", name: "Qwen", provider: "Alibaba", category: "LLM", unit: "/1M out",
    tint: "#615ced", glyph: "◇", logo: "/tm-assets/qwen-logo.png",
    blurb: "Open-shelf workhorse. Coder, vision, chat — all in one bin.",
    tags: ["Open", "Coding", "Vision"],
    match: has("qwen"), primaryId: "qwen3.7-max",
    fallback: { retail: 7.5, wholesale: 4.875, line: "Qwen 3.7 Max · 3.6 Plus · 3.5 Flash" },
  },
  {
    key: "kimi", name: "Kimi", provider: "Kimi AI", category: "LLM", unit: "/1M out",
    tint: "#ff8a3d", glyph: "◤", logo: "/tm-assets/kimi-logo.png",
    blurb: "Long-context specialist. Fast, frugal, multilingual.",
    tags: ["Long Context", "Vision"],
    match: has("kimi"), primaryId: "kimi-k2.6",
    fallback: { retail: 4, wholesale: 2.4, line: "Kimi K2.6 · K2.5" },
  },
  {
    key: "glm", name: "GLM", provider: "Z.AI", category: "LLM", unit: "/1M out",
    tint: "#a45bff", glyph: "◈", logo: "/tm-assets/zai-logo.png",
    blurb: "Overstocked & priced to move. Huge context, tiny bill.",
    tags: ["Long Context", "Chat"],
    match: has("glm"), primaryId: "glm-5",
    fallback: { retail: 2.08, wholesale: 1.248, line: "GLM-5 · GLM-5.1" },
  },
  {
    key: "minimax", name: "MiniMax", provider: "MiniMax", category: "LLM", unit: "/1M out",
    tint: "#f5246b", glyph: "∞", logo: "/tm-assets/minimax-logo.png",
    blurb: "Buy in bulk, run anywhere. No membership card.",
    tags: ["Open", "Multimodal"],
    match: has("minimax"), primaryId: "MiniMax-M3",
    fallback: { retail: 2.4, wholesale: 1.2, line: "M3 · M2.7 · M2.5" },
  },
  {
    key: "seedance", name: "Seedance", provider: "ByteDance", category: "Video", unit: "/5s clip",
    tint: "#1fc7c2", glyph: "►", logo: "/tm-assets/seedance-logo.png",
    blurb: "Fresh off the reel. Cinematic clips by the cartload.",
    tags: ["Video gen", "1080p", "Text→Video"],
    match: (id) => id.toLowerCase().includes("seedance"),
    primaryId: "dreamina-seedance-2-0-260128",
    fallback: { retail: 0.07, wholesale: 0.035, line: "Seedance 2.0" },
  },
];

export const discountOf = (m: { retail: number; wholesale: number }): number =>
  Math.round((1 - m.wholesale / m.retail) * 100);

/** Static fallback catalog (also the SSG/first-paint content) derived from the curated families. */
export const TM_MODELS: TMModel[] = FAMILIES.map((f) => ({
  id: f.key,
  name: f.name,
  provider: f.provider,
  line: f.fallback.line,
  retail: f.fallback.retail,
  wholesale: f.fallback.wholesale,
  unit: f.unit,
  blurb: f.blurb,
  tags: f.tags,
  size: "sm",
  tint: f.tint,
  glyph: f.glyph,
  logo: f.logo,
}));
