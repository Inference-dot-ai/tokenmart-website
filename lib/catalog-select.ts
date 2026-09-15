// Pure selectors over a normalized catalog. Type-only import keeps zod out of
// client bundles.
import type { Catalog, CatalogModel, ModelKind } from "./catalog";

export function savingsOf(m: CatalogModel): number {
  return m.headline ? Math.max(0, m.headline.list - m.headline.price) : 0;
}

/**
 * The model that best represents a provider on the site: its most expensive
 * discounted model of the preferred kind (flagships are where savings are
 * largest), falling back to any priced model.
 */
export function flagshipOf(
  models: CatalogModel[],
  provider: string,
  kind?: ModelKind,
  excludeId?: string,
): CatalogModel | undefined {
  const pool = models.filter(
    (m) => m.provider === provider && m.headline && (!kind || m.kind === kind) && m.id !== excludeId,
  );
  const byList = (a: CatalogModel, b: CatalogModel) => (b.headline!.list ?? 0) - (a.headline!.list ?? 0);
  return pool.filter((m) => m.discountPct > 0).sort(byList)[0] ?? pool.sort(byList)[0];
}

export function providersIn(catalog: Catalog): string[] {
  return [...new Set(catalog.models.map((m) => m.provider))];
}

export function countByProvider(models: CatalogModel[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const m of models) out[m.provider] = (out[m.provider] ?? 0) + 1;
  return out;
}
