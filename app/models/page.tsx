import type { Metadata } from "next";
import { CatalogProvider } from "@/components/catalog/CatalogProvider";
import { FinalCTA } from "@/components/home/FinalCTA";
import { ModelExplorer } from "@/components/models/ModelExplorer";
import { Container } from "@/components/site/Container";
import { PageShell } from "@/components/site/PageShell";
import { SITE_URL } from "@/lib/blog";
import { getCatalog } from "@/lib/catalog-server";
import { STATS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Models and pricing",
  description: `Input, output and cache pricing for ${STATS.modelCount} models from ${STATS.providerCount} providers, with the discount against provider list price on every rate.`,
  alternates: { canonical: `${SITE_URL}/models` },
};

export default async function ModelsPage() {
  const catalog = await getCatalog();
  const { modelCount, providerCount, maxDiscountPct } = catalog.stats;

  return (
    <CatalogProvider initial={catalog}>
      <PageShell>
        <Container className="pb-20 pt-12 lg:pt-16">
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.035em] text-ink md:text-5xl">
            Models and pricing
          </h1>
          <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-muted">
            {modelCount} models from {providerCount} providers
            {maxDiscountPct > 0 ? `, up to ${maxDiscountPct}% under list price` : ""}. Prices come from the live
            TokenMart catalog and refresh every hour.
          </p>
          <div className="mt-10">
            <ModelExplorer />
          </div>
        </Container>
        <FinalCTA source="tm_models" />
      </PageShell>
    </CatalogProvider>
  );
}
