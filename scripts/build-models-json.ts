import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fetchModels } from "../lib/google-sheets";

async function main() {
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
