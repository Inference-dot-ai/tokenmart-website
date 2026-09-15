import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import { buildCatalog, CATALOG_ENDPOINT, EMPTY_CATALOG, isCatalog, parseMarkup, type Catalog } from "./catalog";

/**
 * Catalog for server-rendered (statically exported) pages. Prefers the
 * snapshot written by scripts/build-catalog.ts; in `next dev` without a
 * prebuild it fetches the endpoint directly. Clients refresh from
 * /api/catalog after hydration, so this only has to be right at build time.
 */
export const getCatalog = cache(async (): Promise<Catalog> => {
  try {
    const snap: unknown = JSON.parse(await readFile(join(process.cwd(), "public", "catalog.json"), "utf8"));
    if (isCatalog(snap) && snap.models.length > 0) return snap;
  } catch {
    // no snapshot yet
  }
  try {
    const res = await fetch(process.env.TM_MODELS_ENDPOINT || CATALOG_ENDPOINT, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
    });
    if (res.ok) {
      return buildCatalog(await res.json(), { markupPct: parseMarkup(process.env.TM_DISPLAY_MARKUP_PCT) });
    }
  } catch {
    // offline
  }
  return EMPTY_CATALOG;
});
