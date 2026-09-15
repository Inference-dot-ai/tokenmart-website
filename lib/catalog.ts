// The TokenMart catalog, normalized for display.
//
// Source of truth is drr400000's public endpoint
// (https://model.service-inference.ai/public/models). It already carries the
// price a customer pays (`pricing`), the provider list price (`reference`,
// null when undiscounted) and `discount_pct` for the public tier. The website
// never invents discounts: every number rendered comes from that payload.
//
// Pure TS (no React, no Node APIs) so it runs in the build scripts, in server
// components, and in the Cloudflare Pages Function at functions/api/catalog.ts.
//
// The raw wire shape is loose and every level is optional, so the zod schemas
// below are the only place that touches it. Anything malformed degrades to
// "price on request" for that model rather than failing the page.
import { z } from "zod";
import { PROVIDER_ORDER, providerForId } from "./providers";
import { unitLabel, unitScale } from "./units";

export { unitLabel, unitScale };

export const CATALOG_ENDPOINT = "https://model.service-inference.ai/public/models";

// ---------------------------------------------------------------------------
// Wire schemas

const num = z.number().finite().nonnegative();

const zTierBand = z.object({
  up_to: num.optional(),
  input_per_1m: num,
  output_per_1m: num,
});

const zTokens = z.object({
  input_per_1m: num,
  output_per_1m: num,
  cache_read_per_1m: num.optional(),
  cache_write_per_1m: num.optional(),
  image_input_per_1m: num.optional(),
  image_output_per_1m: num.optional(),
  video_output_per_1m: num.optional(),
  context_tiers: z.array(zTierBand).optional().catch(undefined),
});

const zUnit = z.object({
  metric: z.string(),
  price: num,
  by: z
    .object({ key: z.string(), prices: z.record(z.string(), num) })
    .optional()
    .catch(undefined),
});

const zWirePricing = z.object({
  tokens: zTokens.optional().catch(undefined),
  per_request: num.optional().catch(undefined),
  units: z.array(zUnit.catch(null as never)).optional().catch(undefined),
});

const zEntry = z.object({
  pricing: zWirePricing.nullable().catch(null),
  reference: zWirePricing.nullable().optional().catch(null),
  discount_pct: z.number().catch(0).default(0),
});

const zEndpoint = z.object({
  models: z.array(z.string()).catch([]).default([]),
  videoModels: z.array(z.string()).catch([]).default([]),
  imageModels: z.array(z.string()).catch([]).default([]),
  pricing: z.record(z.string(), zEntry.nullable().catch(null)).catch({}).default({}),
});

type WirePricing = z.infer<typeof zWirePricing>;

// ---------------------------------------------------------------------------
// Display types (serialized to JSON for the client, keep them plain)

export type ModelKind = "text" | "image" | "video";

export type TokenRates = {
  input: number;
  output: number;
  cacheRead?: number;
  cacheWrite?: number;
  imageInput?: number;
  imageOutput?: number;
  videoOutput?: number;
};

export type UnitRate = {
  metric: string;
  price: number;
  /** Dimension the price varies by (resolution, bucket, pixel tier). */
  byKey?: string;
  byPrices?: Record<string, number>;
};

export type ContextBand = { upTo?: number; input: number; output: number };

export type Rates = {
  tokens?: TokenRates;
  contextBands?: ContextBand[];
  units?: UnitRate[];
  perRequest?: number;
};

export type Headline = {
  /** What the customer pays for the headline unit. */
  price: number;
  /** Provider list price for the same unit (equals price when undiscounted). */
  list: number;
  /** Human label for the unit, e.g. "per 1M output tokens". */
  unit: string;
};

export type CatalogModel = {
  id: string;
  name: string;
  provider: string;
  kind: ModelKind;
  /** Displayed rates, null when the endpoint lists the model without a price. */
  price: Rates | null;
  /** Provider list rates; null when the model has no discount. */
  list: Rates | null;
  /** Displayed discount against list, whole percent. 0 means list price. */
  discountPct: number;
  headline: Headline | null;
};

export type CatalogStats = {
  modelCount: number;
  providerCount: number;
  /** Highest displayed discount across the catalog, the "up to N%" claim. */
  maxDiscountPct: number;
  discountedCount: number;
};

export type Catalog = {
  generatedAt: string;
  models: CatalogModel[];
  stats: CatalogStats;
};

export const EMPTY_CATALOG: Catalog = {
  generatedAt: new Date(0).toISOString(),
  models: [],
  stats: { modelCount: 0, providerCount: 0, maxDiscountPct: 0, discountedCount: 0 },
};

// ---------------------------------------------------------------------------
// Names

/** Trailing or embedded release datestamps: "-260128", "-20251001", "-0309". */
const DATE_RE = /-(?:\d{8}|\d{6}|0\d{3})(?=-|$)/g;

const BRAND_PREFIXES: [RegExp, string][] = [
  [/^claude-/, "Claude "],
  [/^gpt-(?=\d)/, "GPT-"],
  [/^gpt-/, "GPT "],
  [/^gemini-/, "Gemini "],
  [/^grok-/, "Grok "],
  [/^deepseek-/, "DeepSeek "],
  [/^qwen-?/, "Qwen "],
  [/^kimi-?/, "Kimi "],
  [/^minimax-?/, "MiniMax "],
  [/^glm-?/, "GLM-"],
  [/^(?:doubao-|dreamina-)?seedance-/, "Seedance "],
  [/^(?:doubao-|dola-)?seedream-/, "Seedream "],
];

const UPPER_WORDS = new Set(["ai", "api", "hd", "4k", "2k", "1k"]);

/** "claude-opus-4-8" -> "Claude Opus 4.8", "gpt-5.2-codex" -> "GPT-5.2 Codex". */
export function displayName(id: string): string {
  let s = id.toLowerCase().replace(DATE_RE, "");
  let prefix = "";
  for (const [re, p] of BRAND_PREFIXES) {
    if (re.test(s)) {
      s = s.replace(re, "");
      prefix = p;
      break;
    }
  }
  s = s
    .replace(/(\d)-(\d)/g, "$1.$2")
    .split("-")
    .filter(Boolean)
    .map((w) => (UPPER_WORDS.has(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
  return `${prefix}${s}`.replace(/\s+/g, " ").trim();
}

// ---------------------------------------------------------------------------
// Rates

/** Round to 6 significant digits so tiny per-token video prices survive. */
const round = (n: number) => (n === 0 ? 0 : Number(n.toPrecision(6)));

function toRates(w: WirePricing | null | undefined): Rates | null {
  if (!w) return null;
  const out: Rates = {};
  if (w.tokens) {
    const t = w.tokens;
    out.tokens = {
      input: t.input_per_1m,
      output: t.output_per_1m,
      cacheRead: t.cache_read_per_1m,
      cacheWrite: t.cache_write_per_1m,
      imageInput: t.image_input_per_1m,
      imageOutput: t.image_output_per_1m,
      videoOutput: t.video_output_per_1m,
    };
    if (t.context_tiers && t.context_tiers.length > 1) {
      out.contextBands = t.context_tiers.map((b) => ({
        upTo: b.up_to,
        input: b.input_per_1m,
        output: b.output_per_1m,
      }));
    }
  }
  const units = (w.units ?? []).filter(Boolean);
  if (units.length > 0) {
    out.units = units.map((u) => ({
      metric: u.metric,
      price: u.price,
      byKey: u.by?.key,
      byPrices: u.by?.prices,
    }));
  }
  if (w.per_request !== undefined) out.perRequest = w.per_request;
  if (!out.tokens && !out.units && out.perRequest === undefined) return null;
  return out;
}

/** Scale every rate by `factor`, never exceeding the matching list rate. */
function scaleRates(r: Rates, factor: number, cap: Rates | null): Rates {
  const s = (v: number | undefined, c: number | undefined) =>
    v === undefined ? undefined : round(c === undefined ? v * factor : Math.min(v * factor, c));
  const out: Rates = {};
  if (r.tokens) {
    const t = r.tokens;
    const c = cap?.tokens;
    out.tokens = {
      input: s(t.input, c?.input)!,
      output: s(t.output, c?.output)!,
      cacheRead: s(t.cacheRead, c?.cacheRead),
      cacheWrite: s(t.cacheWrite, c?.cacheWrite),
      imageInput: s(t.imageInput, c?.imageInput),
      imageOutput: s(t.imageOutput, c?.imageOutput),
      videoOutput: s(t.videoOutput, c?.videoOutput),
    };
  }
  if (r.contextBands) {
    out.contextBands = r.contextBands.map((b, i) => ({
      upTo: b.upTo,
      input: s(b.input, cap?.contextBands?.[i]?.input)!,
      output: s(b.output, cap?.contextBands?.[i]?.output)!,
    }));
  }
  if (r.units) {
    out.units = r.units.map((u, i) => {
      const cu = cap?.units?.[i];
      return {
        ...u,
        price: s(u.price, cu?.price)!,
        byPrices: u.byPrices
          ? Object.fromEntries(
              Object.entries(u.byPrices).map(([k, v]) => [k, s(v, cu?.byPrices?.[k])!]),
            )
          : undefined,
      };
    });
  }
  if (r.perRequest !== undefined) out.perRequest = s(r.perRequest, cap?.perRequest);
  return out;
}

const PRIMARY_UNIT_METRICS = ["video_seconds", "video_tokens", "image_count", "audio_seconds"];

function primaryUnit(units: UnitRate[] | undefined): UnitRate | undefined {
  if (!units || units.length === 0) return undefined;
  for (const m of PRIMARY_UNIT_METRICS) {
    const u = units.find((x) => x.metric === m);
    if (u) return u;
  }
  return units[0];
}

function headlineOf(kind: ModelKind, price: Rates, list: Rates): Headline | null {
  const pu = primaryUnit(price.units);
  if (pu) {
    const lu = list.units?.find((u) => u.metric === pu.metric) ?? pu;
    const k = unitScale(pu.metric);
    return { price: round(pu.price * k), list: round(lu.price * k), unit: unitLabel(pu.metric) };
  }
  const t = price.tokens;
  const lt = list.tokens ?? t;
  if (t && lt) {
    if (kind === "image" && t.imageOutput !== undefined) {
      return { price: t.imageOutput, list: lt.imageOutput ?? t.imageOutput, unit: "per 1M image output tokens" };
    }
    return { price: t.output, list: lt.output, unit: "per 1M output tokens" };
  }
  if (price.perRequest !== undefined) {
    return { price: price.perRequest, list: list.perRequest ?? price.perRequest, unit: "per request" };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Build

const IMAGE_ID_RE = /image|seedream/i;

function kindOf(id: string, video: Set<string>, image: Set<string>): ModelKind {
  if (video.has(id)) return "video";
  if (image.has(id) || IMAGE_ID_RE.test(id)) return "image";
  return "text";
}

export type BuildOptions = {
  /**
   * Interim display markup, in percent, applied on top of the endpoint price
   * and capped at list. Keep at 0 once drr400000 serves a dedicated public
   * tier; the endpoint is then already the price we want to show.
   */
  markupPct?: number;
  now?: Date;
};

export function parseMarkup(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 && n < 100 ? n : 0;
}

export function buildCatalog(raw: unknown, opts: BuildOptions = {}): Catalog {
  const parsed = zEndpoint.safeParse(raw);
  if (!parsed.success) return EMPTY_CATALOG;
  const data = parsed.data;
  const factor = 1 + (opts.markupPct ?? 0) / 100;
  const video = new Set(data.videoModels);
  const image = new Set(data.imageModels);

  const seen = new Set<string>();
  const models: CatalogModel[] = [];
  for (const id of [...data.models, ...data.videoModels, ...data.imageModels]) {
    if (seen.has(id)) continue;
    seen.add(id);
    const kind = kindOf(id, video, image);
    const provider = providerForId(id)?.key ?? "other";
    const entry = data.pricing[id] ?? null;
    const effective = toRates(entry?.pricing);
    const reference = toRates(entry?.reference);

    if (!effective) {
      models.push({ id, name: displayName(id), provider, kind, price: null, list: null, discountPct: 0, headline: null });
      continue;
    }

    const listRates = reference ?? effective;
    const price = factor === 1 ? effective : scaleRates(effective, factor, listRates);
    const headline = headlineOf(kind, price, listRates);
    const discountPct =
      headline && headline.list > 0 ? Math.max(0, Math.round((1 - headline.price / headline.list) * 100)) : 0;

    models.push({
      id,
      name: displayName(id),
      provider,
      kind,
      price,
      list: discountPct > 0 ? listRates : null,
      discountPct,
      headline: headline && discountPct === 0 ? { ...headline, list: headline.price } : headline,
    });
  }

  models.sort((a, b) => {
    const pa = PROVIDER_ORDER.indexOf(a.provider);
    const pb = PROVIDER_ORDER.indexOf(b.provider);
    if (pa !== pb) return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
    return (b.headline?.list ?? -1) - (a.headline?.list ?? -1) || a.name.localeCompare(b.name, undefined, { numeric: true });
  });

  const discounted = models.filter((m) => m.discountPct > 0);
  return {
    generatedAt: (opts.now ?? new Date()).toISOString(),
    models,
    stats: {
      modelCount: models.length,
      providerCount: new Set(models.map((m) => m.provider)).size,
      maxDiscountPct: discounted.reduce((max, m) => Math.max(max, m.discountPct), 0),
      discountedCount: discounted.length,
    },
  };
}

/** Structural check for a catalog fetched from /api/catalog or /catalog.json. */
export function isCatalog(v: unknown): v is Catalog {
  const c = v as Catalog | null;
  return !!c && Array.isArray(c.models) && typeof c.stats?.modelCount === "number";
}
