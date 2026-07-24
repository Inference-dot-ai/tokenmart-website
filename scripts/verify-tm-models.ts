// Checks the baked site data (public/tm-models.json + lib/live-stats.json)
// against the live public model endpoint — the sanctioned projection of DRR's
// pricing DB. Exits 1 on drift so it can gate CI or run as a freshness cron.
// Fix drift by rebuilding: npx tsx scripts/build-tm-models.ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { groupEndpointModels, liveMaxDiscountPct } from "../lib/tm-models";
import type { TMModel } from "../components/tm/families";

const ENDPOINT =
  process.env.TM_MODELS_ENDPOINT || "https://model.service-inference.ai/public/models";

function readJson<T>(rel: string): T {
  return JSON.parse(readFileSync(join(process.cwd(), rel), "utf8")) as T;
}

async function main() {
  const res = await fetch(ENDPOINT, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`endpoint HTTP ${res.status}`);
  const data: unknown = await res.json();

  const fresh = groupEndpointModels(data);
  const freshMaxPct = liveMaxDiscountPct(data);
  const baked = readJson<TMModel[]>("public/tm-models.json");
  const bakedStats = readJson<{ maxDiscountPct: number }>("lib/live-stats.json");

  const drift: string[] = [];

  if (bakedStats.maxDiscountPct !== freshMaxPct) {
    drift.push(`maxDiscountPct: baked ${bakedStats.maxDiscountPct}% vs live ${freshMaxPct}%`);
  }

  const bakedById = new Map(baked.map((m) => [m.id, m]));
  for (const f of fresh) {
    const b = bakedById.get(f.id);
    if (!b) {
      drift.push(`${f.id}: missing from baked catalog`);
      continue;
    }
    bakedById.delete(f.id);
    for (const field of ["retail", "wholesale", "maxDiscount", "line", "unit"] as const) {
      if (b[field] !== f[field]) {
        drift.push(`${f.id}.${field}: baked ${JSON.stringify(b[field])} vs live ${JSON.stringify(f[field])}`);
      }
    }
  }
  for (const id of bakedById.keys()) {
    drift.push(`${id}: baked but no longer in the live catalog`);
  }

  if (drift.length > 0) {
    console.error(`[verify-tm-models] DRIFT against ${ENDPOINT}:`);
    for (const d of drift) console.error(`  - ${d}`);
    console.error("[verify-tm-models] rebuild with: npx tsx scripts/build-tm-models.ts");
    process.exit(1);
  }
  console.log(`[verify-tm-models] baked catalog matches live endpoint (${fresh.length} families, up to ${freshMaxPct}%)`);
}

main().catch((err) => {
  console.error("[verify-tm-models] failed", err);
  process.exit(1);
});
