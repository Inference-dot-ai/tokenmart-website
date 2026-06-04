// Groups the live public model endpoint into the warehouse card shape.
// Pure TS (no React) — run by scripts/build-tm-models.ts at build time.
import { FAMILIES, type Family, type TMModel } from "../components/tm/families";

type TokenBlock = { tokens?: { input_per_1m?: number; output_per_1m?: number } };
type PricingEntry = {
  pricing?: TokenBlock & { units?: unknown };
  reference?: TokenBlock & { units?: unknown };
  discount_pct?: number;
};

export type EndpointData = {
  tier?: string;
  models?: string[];
  videoModels?: string[];
  imageModels?: string[];
  pricing?: Record<string, PricingEntry>;
};

const MAX_VARIANTS = 8;
const round = (n: number) => Math.round(n * 10000) / 10000;

const PREFIXES: [RegExp, string][] = [
  [/^claude-/, ""],
  [/^gpt-/, "GPT-"],
  [/^gemini-/, ""],
  [/^grok-/, "Grok "],
  [/^deepseek-/, "DeepSeek "],
  [/^qwen-?/, "Qwen "],
  [/^kimi-?/, "Kimi "],
  [/^minimax-?/, "MiniMax "],
  [/^glm-?/, "GLM-"],
  [/^dreamina-seedance-?/, "Seedance "],
];
const DATE_RE = /-(?:\d{6,}|\d{4})$/;

/** "claude-opus-4-8" -> "Opus 4.8", "gpt-5.2-codex" -> "GPT-5.2 Codex". Approximate. */
export function prettyVariant(id: string): string {
  let s = id.toLowerCase().replace(DATE_RE, "");
  let prefix = "";
  for (const [re, p] of PREFIXES) {
    if (re.test(s)) {
      s = s.replace(re, "");
      prefix = p;
      break;
    }
  }
  s = s
    .replace(/(\d)-(\d)/g, "$1.$2") // 4-8 -> 4.8
    .replace(/-/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()); // title-case words
  return `${prefix}${s}`.replace(/\s+/g, " ").trim();
}

function outputPrices(e?: PricingEntry): { wholesale: number; retail: number } | null {
  const w = e?.pricing?.tokens?.output_per_1m;
  if (typeof w !== "number") return null; // units-priced (video) -> use fallback
  const r = e?.reference?.tokens?.output_per_1m;
  return { wholesale: round(w), retail: typeof r === "number" ? round(r) : round(w) };
}

export function groupEndpointModels(data: EndpointData, families: Family[] = FAMILIES): TMModel[] {
  const ids = [
    ...(data.models ?? []),
    ...(data.videoModels ?? []),
    ...(data.imageModels ?? []),
  ];
  const pricing = data.pricing ?? {};
  const out: TMModel[] = [];

  for (const f of families) {
    const famIds = ids.filter(f.match);
    if (famIds.length === 0) continue; // family not offered in this tier -> drop the card

    // Order the variant line: text/LLM variants first (image variants sink to
    // the end so a text flagship leads), then by output price desc, then newest
    // version first on ties (e.g. Opus 4.8 before 4.7).
    const priceOf = (id: string) => pricing[id]?.pricing?.tokens?.output_per_1m ?? -1;
    const isImage = (id: string) => /image/i.test(id);
    const sorted = [...famIds].sort((a, b) => {
      if (isImage(a) !== isImage(b)) return isImage(a) ? 1 : -1;
      const dp = priceOf(b) - priceOf(a);
      return dp !== 0 ? dp : b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" });
    });

    const shown = sorted.slice(0, MAX_VARIANTS).map(prettyVariant);
    const extra = sorted.length - shown.length;
    const line = shown.join(" · ") + (extra > 0 ? ` · +${extra} more` : "");

    const priceId = famIds.includes(f.primaryId) ? f.primaryId : sorted[0];
    const live = outputPrices(pricing[priceId]);

    out.push({
      id: f.key,
      name: f.name,
      provider: f.provider,
      line,
      retail: live?.retail ?? f.fallback.retail,
      wholesale: live?.wholesale ?? f.fallback.wholesale,
      unit: f.unit,
      blurb: f.blurb,
      tags: f.tags,
      size: "sm",
      tint: f.tint,
      glyph: f.glyph,
      logo: f.logo,
    });
  }

  return out;
}
