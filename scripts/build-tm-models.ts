// Build-time fetch of the live public model endpoint -> grouped warehouse cards.
// The endpoint does not send CORS headers for the site origin, so it cannot be
// fetched from the browser; we fetch it here at build and write a same-origin
// JSON that the Marketplace reads at runtime (with the static catalog as a
// first-paint + offline fallback).
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { endpointTier, groupEndpointModels, liveMaxDiscountPct } from "../lib/tm-models";
import { TM_MODELS } from "../components/tm/families";

const ENDPOINT =
  process.env.TM_MODELS_ENDPOINT || "https://model.service-inference.ai/public/models";

async function main() {
  let models = TM_MODELS;

  try {
    const res = await fetch(ENDPOINT, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: unknown = await res.json();
    const grouped = groupEndpointModels(data);
    if (grouped.length > 0) {
      models = grouped;
      console.log(`[build-tm-models] grouped ${grouped.length} families from live endpoint (tier=${endpointTier(data) ?? "?"})`);
    } else {
      console.warn("[build-tm-models] grouping produced no families — using static fallback");
    }

    // The hero / ticker "SAVE UP TO X%" claim is derived from the live tier so
    // the marketing number can never overstate the public catalog. Only
    // written on a successful fetch — otherwise the checked-in value stands.
    const maxPct = liveMaxDiscountPct(data);
    if (maxPct > 0) {
      writeFileSync(
        join(process.cwd(), "lib", "live-stats.json"),
        JSON.stringify({ maxDiscountPct: maxPct }, null, 2) + "\n"
      );
      console.log(`[build-tm-models] live max discount ${maxPct}% -> lib/live-stats.json`);
    }
  } catch (err) {
    console.warn("[build-tm-models] live fetch failed — using static fallback:", err);
  }

  const outPath = join(process.cwd(), "public", "tm-models.json");
  mkdirSync(join(process.cwd(), "public"), { recursive: true });
  writeFileSync(outPath, JSON.stringify(models));
  console.log(`[build-tm-models] wrote ${models.length} families -> ${outPath}`);
}

main().catch((err) => {
  console.error("[build-tm-models] failed", err);
  process.exit(1);
});
