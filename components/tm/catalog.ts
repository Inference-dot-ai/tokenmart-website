// Curated warehouse catalog — ported from the prototype's tm-data.jsx /
// tm-sections-*.jsx. Static content (per product decision: the marketplace is a
// curated catalog, not wired to the live models.json pipeline). Illustrative
// "wholesale" pricing — believable $/unit with up to ~75% off retail.
import type { Tone } from "./primitives";

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

export const discountOf = (m: { retail: number; wholesale: number }): number =>
  Math.round((1 - m.wholesale / m.retail) * 100);

export const TM_MODELS: TMModel[] = [
  {
    id: "claude", name: "Claude", provider: "Anthropic",
    line: "Opus 4.8 · Sonnet 4.6 · Sonnet 4.5 · Sonnet 4.0 · Opus 4.7 · Opus 4.5 · Opus 4.1 · Haiku 4.5",
    retail: 25.0, wholesale: 20.0, unit: "/1M out",
    blurb: "Top-shelf reasoning & code. Flies off the shelf.",
    tags: ["Reasoning", "Coding", "200K ctx"],
    size: "sm", tint: "#ff7a45", glyph: "✳", logo: "/tm-assets/claude-logo.png",
  },
  {
    id: "gpt", name: "GPT", provider: "OpenAI",
    line: "GPT-5.5 · GPT-5.3 Codex · GPT-5.2 Codex · GPT-5.1 · GPT-5 · GPT-4.1 Mini · GPT-4.1",
    retail: 15.0, wholesale: 12.0, unit: "/1M out",
    blurb: "The crowd favorite. Stocked deep, priced low.",
    tags: ["General", "Tools", "Vision"],
    size: "sm", tint: "#19c37d", glyph: "◍", logo: "/tm-assets/openai-logo.png",
  },
  {
    id: "gemini", name: "Gemini", provider: "Google",
    line: "3.1 Pro · 3.1 Flash · 3 Flash · 2.5 Pro · 2.5 Flash Lite · 2.5 Flash",
    retail: 12.0, wholesale: 9.6, unit: "/1M out",
    blurb: "2M-token cart capacity. Bulk context, bulk savings.",
    tags: ["2M ctx", "Multimodal"],
    size: "sm", tint: "#4d8bff", glyph: "✦", logo: "/tm-assets/gemini-logo.png",
  },
  {
    id: "nanobanana", name: "Nano Banana", provider: "Google",
    line: "Nano Banana 2 · Nano Banana · Pro",
    retail: 0.13, wholesale: 0.104, unit: "/1K img",
    blurb: "The image-gen aisle’s hottest item. Studio-grade pictures & edits, bought by the pallet.",
    tags: ["Image gen", "Editing"],
    size: "sm", tint: "#ffcf33", glyph: "◗", logo: "/tm-assets/nanobanana-logo.png",
  },
  {
    id: "seedance", name: "Seedance", provider: "ByteDance",
    line: "Seedance 1.0 Pro · 1.0 Lite",
    retail: 0.07, wholesale: 0.035, unit: "/5s clip",
    blurb: "Fresh off the reel. Cinematic clips by the cartload.",
    tags: ["Video gen", "1080p", "Text→Video"],
    size: "sm", tint: "#1fc7c2", glyph: "►", logo: "/tm-assets/seedance-logo.png",
  },
  {
    id: "grok", name: "Grok", provider: "xAI",
    line: "Grok 4 · Grok 4.1-Fast · Grok 4-fast-non-reasoning · Grok 4-fast-reasoning",
    retail: 15.0, wholesale: 13.5, unit: "/1M out",
    blurb: "Real-time feed, sharp tongue. Just landed.",
    tags: ["Realtime", "Reasoning"],
    size: "sm", tint: "#d6d6d6", glyph: "✕", logo: "/tm-assets/grok-logo.png",
  },
  {
    id: "minimax", name: "MiniMax", provider: "MiniMax",
    line: "M2.7 · M2.5",
    retail: 0.9, wholesale: 0.765, unit: "/1M out",
    blurb: "Buy in bulk, run anywhere. No membership card.",
    tags: ["Open", "Multimodal"],
    size: "sm", tint: "#f5246b", glyph: "∞", logo: "/tm-assets/minimax-logo.png",
  },
  {
    id: "deepseek", name: "DeepSeek", provider: "DeepSeek",
    line: "V4 Pro · V4 Pro Flash · V3.2",
    retail: 1.65, wholesale: 0.4125, unit: "/1M out",
    blurb: "The warehouse-brand reasoner. Same job, 1/4 the price.",
    tags: ["Reasoning", "Chat"],
    size: "sm", tint: "#5b6cff", glyph: "◆", logo: "/tm-assets/deepseek-logo.png",
  },
  {
    id: "kimi", name: "Kimi", provider: "Kimi AI",
    line: "Kimi K2.5 · Kimi K2.6",
    retail: 0.89, wholesale: 0.623, unit: "/1M out",
    blurb: "European stock. Fast, frugal, multilingual.",
    tags: ["Long Context", "Vision"],
    size: "sm", tint: "#ff8a3d", glyph: "◤", logo: "/tm-assets/kimi-logo.png",
  },
  {
    id: "glm", name: "GLM", provider: "Z.AI",
    line: "GLM-5 · GLM5.1",
    retail: 0.57, wholesale: 0.399, unit: "/1M out",
    blurb: "Overstocked & priced to move. Huge context, tiny bill.",
    tags: ["Long Context", "Chat"],
    size: "sm", tint: "#a45bff", glyph: "◈", logo: "/tm-assets/zai-logo.png",
  },
  {
    id: "qwen", name: "Qwen", provider: "Alibaba",
    line: "Qwen3.7 Max · Qwen3.6 · Qwen3.5 Omni · Qwen3 Coder",
    retail: 1.2, wholesale: 0.6, unit: "/1M out",
    blurb: "Open-shelf workhorse. Coder, vision, chat — all in one bin.",
    tags: ["Open", "Coding", "Vision"],
    size: "sm", tint: "#615ced", glyph: "◇", logo: "/tm-assets/qwen-logo.png",
  },
];

export const TM_TICKER: string[] = [
  "SAVE UP TO 75%", "PAY AS YOU GO", "NO COMMITMENT", "NO MIN. ORDER",
  "ONE API · EVERY FRONTIER MODEL", "WHOLESALE TOKEN PRICING",
  "BULK READY", "PRICES SLASHED DAILY",
];

export type HeroStackItem = { name: string; logo: string };
export const HERO_STACK: HeroStackItem[] = [
  { name: "GPT", logo: "/tm-assets/openai-logo.png" },
  { name: "Claude", logo: "/tm-assets/claude-logo.png" },
  { name: "Gemini", logo: "/tm-assets/gemini-logo.png" },
  { name: "Nano Banana", logo: "/tm-assets/nanobanana-logo.png" },
  { name: "Grok", logo: "/tm-assets/grok-logo.png" },
  { name: "MiniMax", logo: "/tm-assets/minimax-logo.png" },
  { name: "DeepSeek", logo: "/tm-assets/deepseek-logo.png" },
  { name: "Kimi", logo: "/tm-assets/kimi-logo.png" },
  { name: "GLM", logo: "/tm-assets/zai-logo.png" },
  { name: "Seedance", logo: "/tm-assets/seedance-logo.png" },
  { name: "Qwen", logo: "/tm-assets/qwen-logo.png" },
];

export type V2Model = { name: string; logo?: string; more?: boolean };
export const TM_V2_MODELS: V2Model[] = [
  { name: "Claude", logo: "/tm-assets/claude-logo.png" },
  { name: "GPT", logo: "/tm-assets/openai-logo.png" },
  { name: "Gemini", logo: "/tm-assets/gemini-logo.png" },
  { name: "More", more: true },
];

export type Benefit = { t: string; d: string; tag: string; tone: Tone; icon: string };
export const TM_BENEFITS: Benefit[] = [
  { t: "One API", d: "A single key for the whole frontier. Hot-swap models with one string — zero re-platforming.", tag: "UNIVERSAL", tone: "lime", icon: "🔑" },
  { t: "No Commitment", d: "Cancel any second. No contracts, no seats, no renewal traps. Turn the tap on and off.", tag: "FLEXIBLE", tone: "lime", icon: "🚫" },
  { t: "Transparent Pricing", d: "Every model, every rate, posted on the shelf. What you see is what you pay — to the token.", tag: "NO TRICKS", tone: "cyan", icon: "🔎" },
  { t: "High-Volume Ready", d: "Process millions of tokens while paying less for every request. Scale usage, not your costs.", tag: "BULK", tone: "pink", icon: "📦" },
];

export type CompareRow = { model: string; retail: number; whole: number };
export const TM_COMPARE: CompareRow[] = [
  { model: "Claude (Opus/Sonnet)", retail: 15.0, whole: 3.75 },
  { model: "GPT-5.5", retail: 10.0, whole: 3.0 },
  { model: "Gemini 3.5 Pro", retail: 7.0, whole: 1.75 },
  { model: "Grok 4", retail: 15.0, whole: 4.5 },
  { model: "Qwen3 Max", retail: 1.6, whole: 0.48 },
  { model: "DeepSeek V3.2", retail: 1.1, whole: 0.28 },
];
