// Build-time fetch of the live public model endpoint -> grouped warehouse cards.
// The endpoint does not send CORS headers for the site origin, so it cannot be
// fetched from the browser; we fetch it here at build and write a same-origin
// JSON that the Marketplace reads at runtime (with the static catalog as a
// first-paint + offline fallback).
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { groupEndpointModels, type EndpointData } from "../lib/tm-models";
import { TM_MODELS } from "../components/tm/families";

const ENDPOINT =
  process.env.TM_MODELS_ENDPOINT || "https://model.service-inference.ai/public/models";

async function main() {
  let models = TM_MODELS;

  try {
    const res = await fetch(ENDPOINT, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as EndpointData;
    const grouped = groupEndpointModels(data);
    if (grouped.length > 0) {
      models = grouped;
      console.log(`[build-tm-models] grouped ${grouped.length} families from live endpoint (tier=${data.tier ?? "?"})`);
    } else {
      console.warn("[build-tm-models] grouping produced no families — using static fallback");
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
