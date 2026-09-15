// Drift gate: does the baked snapshot still match what drr400000 serves?
// `npm run verify:models` exits 1 when a price, discount or the headline
// "up to N%" claim has moved since the last build.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildCatalog, CATALOG_ENDPOINT, isCatalog, parseMarkup } from "../lib/catalog";

const ENDPOINT = process.env.TM_MODELS_ENDPOINT || CATALOG_ENDPOINT;

async function main() {
  const snapshot: unknown = JSON.parse(readFileSync(join(process.cwd(), "public", "catalog.json"), "utf8"));
  const stats = JSON.parse(readFileSync(join(process.cwd(), "lib", "live-stats.json"), "utf8"));
  if (!isCatalog(snapshot)) throw new Error("public/catalog.json is not a catalog; run npm run prebuild");

  const res = await fetch(ENDPOINT, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const live = buildCatalog(await res.json(), { markupPct: parseMarkup(process.env.TM_DISPLAY_MARKUP_PCT) });

  const key = (m: (typeof live.models)[number]) =>
    `${m.discountPct}|${m.headline?.price ?? "-"}|${m.headline?.list ?? "-"}`;
  const before = new Map(snapshot.models.map((m) => [m.id, key(m)]));
  const after = new Map(live.models.map((m) => [m.id, key(m)]));

  const drift: string[] = [];
  for (const [id, k] of after) {
    if (!before.has(id)) drift.push(`+ ${id} (${k})`);
    else if (before.get(id) !== k) drift.push(`~ ${id}: ${before.get(id)} -> ${k}`);
  }
  for (const id of before.keys()) if (!after.has(id)) drift.push(`- ${id}`);
  if (stats.maxDiscountPct !== live.stats.maxDiscountPct) {
    drift.push(`live-stats maxDiscountPct: ${stats.maxDiscountPct} -> ${live.stats.maxDiscountPct}`);
  }

  if (drift.length) {
    console.error(`[verify-catalog] ${drift.length} change(s) since the last build:\n${drift.join("\n")}`);
    process.exit(1);
  }
  console.log(`[verify-catalog] snapshot matches live (${live.stats.modelCount} models)`);
}

main().catch((err) => {
  console.error("[verify-catalog] failed", err);
  process.exit(1);
});
