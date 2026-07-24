// Groups the live public model endpoint into the warehouse card shape.
// Pure TS (no React) — run by scripts/build-tm-models.ts at build time.
//
// The raw endpoint JSON has every level optional and a confusing shape (a map
// named "pricing" whose entries contain a field named "pricing"). The zod
// schemas below are the ONLY place that deals with that: they validate the
// untrusted response and transform it into flat, fully-parsed records.
// Everything downstream works with plain named fields.
import { z } from "zod";
import { FAMILIES, type Family, type TMModel } from "../components/tm/families";

const round = (n: number) => Math.round(n * 10000) / 10000;

/**
 * A price block rates a model either per token ("tokens", LLMs) or per unit
 * ("units", video/image — a per-token metric like video_tokens). Both
 * normalize to $ per 1M tokens; a block with neither (or a malformed one)
 * becomes null.
 */
const zPer1M = z
  .object({
    tokens: z.object({ output_per_1m: z.number() }).optional(),
    units: z.array(z.object({ price: z.number() })).nonempty().optional(),
  })
  .transform((block): number | null => {
    if (block.tokens) return block.tokens.output_per_1m;
    if (block.units) return block.units[0].price * 1_000_000;
    return null;
  })
  .catch(null);

const zPricingEntry = z
  .object({
    pricing: zPer1M.default(null), // discounted rates the customer pays
    reference: zPer1M.default(null), // published list rates; absent when undiscounted
    discount_pct: z.number().catch(0).default(0),
  })
  .catch({ pricing: null, reference: null, discount_pct: 0 });

const zEndpoint = z.object({
  tier: z.string().optional(),
  models: z.array(z.string()).default([]),
  videoModels: z.array(z.string()).default([]),
  imageModels: z.array(z.string()).default([]),
  pricing: z.record(z.string(), zPricingEntry).default({}),
});

/** The wire shape scripts/build-tm-models.ts fetches (pre-validation). */
export type EndpointData = z.input<typeof zEndpoint>;

/** One model's prices, $ per 1M output (or video) tokens, parsed once. */
type ModelPrice = {
  /** Discounted rate the customer pays. */
  effectivePer1M: number;
  /** Published list rate; equals effectivePer1M when there is no discount. */
  listPer1M: number;
  discountPct: number;
};

type Catalog = {
  /** Every model id the tier exposes, in endpoint order. */
  ids: string[];
  /** Parsed prices for the ids that carry pricing. */
  priceById: Map<string, ModelPrice>;
};

const EMPTY_CATALOG: Catalog = { ids: [], priceById: new Map() };

const zCatalog = zEndpoint
  .transform((data): Catalog => {
    const ids = [...data.models, ...data.videoModels, ...data.imageModels];
    const priceById = new Map<string, ModelPrice>();
    for (const id of ids) {
      const entry = data.pricing[id];
      if (!entry || entry.pricing === null) continue;
      priceById.set(id, {
        effectivePer1M: round(entry.pricing),
        listPer1M: round(entry.reference === null ? entry.pricing : entry.reference),
        discountPct: entry.discount_pct,
      });
    }
    return { ids, priceById };
  })
  .catch(EMPTY_CATALOG);

/** Validate + flatten an untrusted endpoint response; empty catalog on garbage. */
function parseCatalog(data: unknown): Catalog {
  return zCatalog.parse(data);
}

const MAX_VARIANTS = 8;

// Model-id shapes, named once. Ids are machine strings, so display names and
// product grouping are necessarily derived by string surgery — kept to these
// three module-level patterns plus prettyVariant below.
/** Trailing release datestamp: "-260128", "-20251001". */
const DATE_SUFFIX_RE = /-(?:\d{6,}|\d{4})$/;
/** Internal upstream-channel twins of the same model: "-hc", "-ep". */
const CHANNEL_SUFFIX_RE = /-(?:hc|ep)$/;
/** Image-generation variants (sink below text models in the variant line). */
const IMAGE_ID_RE = /image/i;

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

/** "claude-opus-4-8" -> "Opus 4.8", "gpt-5.2-codex" -> "GPT-5.2 Codex". Approximate. */
export function prettyVariant(id: string): string {
  let s = id.toLowerCase().replace(DATE_SUFFIX_RE, "");
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

/**
 * Dated releases and -hc/-ep channel twins are the same product; collapsing to
 * this key makes the variant line list products, not routing variants.
 */
function canonicalProductId(id: string): string {
  return id.toLowerCase().replace(DATE_SUFFIX_RE, "").replace(CHANNEL_SUFFIX_RE, "");
}

/** Tier label from an untrusted response, for build logging. */
export function endpointTier(data: unknown): string | undefined {
  const parsed = z.object({ tier: z.string().optional() }).safeParse(data);
  return parsed.success ? parsed.data.tier : undefined;
}

/** Highest discount across every id the tier exposes — the "up to X%" claim. */
export function liveMaxDiscountPct(data: unknown): number {
  const { priceById } = parseCatalog(data);
  let max = 0;
  for (const price of priceById.values()) {
    if (price.discountPct > max) max = price.discountPct;
  }
  return Math.round(max);
}

export function groupEndpointModels(data: unknown, families: Family[] = FAMILIES): TMModel[] {
  const { ids, priceById } = parseCatalog(data);
  const out: TMModel[] = [];

  for (const f of families) {
    const famIds = ids.filter(f.match);
    if (famIds.length === 0) continue; // family not offered in this tier -> drop the card

    // Order the variant line: text/LLM variants first (image variants sink to
    // the end so a text flagship leads), then by list price desc (so a
    // discounted new flagship outranks an undiscounted old one), then newest
    // version first on ties (e.g. Opus 4.8 before 4.7).
    const listPriceOf = (id: string) => priceById.get(id)?.listPer1M ?? -1;
    const sorted = [...famIds].sort((a, b) => {
      const aImage = IMAGE_ID_RE.test(a);
      if (aImage !== IMAGE_ID_RE.test(b)) return aImage ? 1 : -1;
      const byPrice = listPriceOf(b) - listPriceOf(a);
      if (byPrice !== 0) return byPrice;
      return b.localeCompare(a, undefined, { numeric: true, sensitivity: "base" });
    });

    const variants = [...new Set(sorted.map(canonicalProductId))];
    const shown = variants.slice(0, MAX_VARIANTS).map(prettyVariant);
    const extra = variants.length - shown.length;
    const line = shown.join(" · ") + (extra > 0 ? ` · +${extra} more` : "");

    // Headline price = the family's representative model (falls back to the
    // priciest), and the static fallback when the endpoint carries no price.
    const priceId = famIds.includes(f.primaryId) ? f.primaryId : sorted[0];
    const live = priceById.get(priceId);
    const retail = live !== undefined ? live.listPer1M : f.fallback.retail;
    const wholesale = live !== undefined ? live.effectivePer1M : f.fallback.wholesale;

    // Badge = the highest discount across the whole group (marketing "up to X%").
    let maxDiscount = 0;
    for (const id of famIds) {
      const price = priceById.get(id);
      if (price !== undefined && price.discountPct > maxDiscount) maxDiscount = price.discountPct;
    }
    maxDiscount = Math.round(maxDiscount);

    out.push({
      id: f.key,
      name: f.name,
      provider: f.provider,
      line,
      retail,
      wholesale,
      maxDiscount,
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
