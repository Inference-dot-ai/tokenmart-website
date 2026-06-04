// Curated warehouse content for the home sections (deal ticker, hero "works
// with your stack" logos, the HowItWorks network, benefits).
//
// The marketplace catalog moved to ./families and is filled from the live
// public models endpoint at build time (scripts/build-tm-models.ts). The card
// type + data are re-exported here for the existing import sites.
import type { Tone } from "./primitives";

export { FAMILIES, TM_MODELS, discountOf } from "./families";
export type { TMModel, Family } from "./families";

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
