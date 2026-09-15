// Build-time snapshot of the drr400000 public catalog.
//
// Writes public/catalog.json (served same-origin as the first paint and as the
// fallback for functions/api/catalog.ts) and lib/live-stats.json (the numbers
// baked into static metadata, e.g. "up to N% off"). The live endpoint sends no
// CORS headers for this origin, so browsers never call it directly: they get
// the snapshot, then the hourly-cached copy from /api/catalog.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildCatalog, CATALOG_ENDPOINT, parseMarkup } from "../lib/catalog";

const ENDPOINT = process.env.TM_MODELS_ENDPOINT || CATALOG_ENDPOINT;
const MARKUP = parseMarkup(process.env.TM_DISPLAY_MARKUP_PCT);
const SNAPSHOT = join(process.cwd(), "public", "catalog.json");
const STATS = join(process.cwd(), "lib", "live-stats.json");
const LLMS = join(process.cwd(), "public", "llms.txt");

/** Keep the llms.txt summary line in step with the live numbers. */
function syncLlmsTxt(modelCount: number, maxDiscountPct: number) {
  if (!existsSync(LLMS)) return;
  const tagline =
    `> Claude, GPT, Gemini and ${modelCount}+ frontier models through one API,\n` +
    `> up to ${maxDiscountPct}% under provider list price.`;
  const before = readFileSync(LLMS, "utf8");
  const after = before.replace(/^(# TokenMart\n\n)(?:> .*\n)+/m, `$1${tagline}\n`);
  if (after !== before) writeFileSync(LLMS, after);
}

async function main() {
  try {
    const res = await fetch(ENDPOINT, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const catalog = buildCatalog(await res.json(), { markupPct: MARKUP });
    if (catalog.models.length === 0) throw new Error("endpoint returned no models");

    mkdirSync(join(process.cwd(), "public"), { recursive: true });
    writeFileSync(SNAPSHOT, JSON.stringify(catalog));
    const { maxDiscountPct, modelCount, providerCount } = catalog.stats;
    writeFileSync(STATS, JSON.stringify({ maxDiscountPct, modelCount, providerCount }, null, 2) + "\n");
    syncLlmsTxt(modelCount, maxDiscountPct);
    console.log(
      `[build-catalog] ${modelCount} models, ${providerCount} providers, up to ${maxDiscountPct}% off` +
        (MARKUP ? ` (display markup ${MARKUP}%)` : ""),
    );
  } catch (err) {
    // Never fail the deploy on an upstream hiccup: the checked-in live-stats
    // stand, and pages fall back to a live fetch or an empty catalog.
    console.warn(
      `[build-catalog] live fetch failed, ${existsSync(SNAPSHOT) ? "keeping previous snapshot" : "no snapshot written"}:`,
      err,
    );
  }
}

main();
