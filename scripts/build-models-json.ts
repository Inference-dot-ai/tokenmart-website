import { loadEnvConfig } from "@next/env";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

async function main() {
  // Load .env.local / .env the same way `next build` does, so this script
  // sees the same Google credentials Next.js would.
  loadEnvConfig(process.cwd());

  // Dynamic import so env vars are populated before lib/google-sheets is loaded.
  const { fetchModels } = await import("../lib/google-sheets");

  const models = await fetchModels();
  const outPath = join(process.cwd(), "public", "models.json");
  mkdirSync(join(process.cwd(), "public"), { recursive: true });
  writeFileSync(outPath, JSON.stringify(models));
  console.log(`[build-models-json] wrote ${models.length} models -> ${outPath}`);
}

main().catch((err) => {
  console.error("[build-models-json] failed", err);
  process.exit(1);
});
