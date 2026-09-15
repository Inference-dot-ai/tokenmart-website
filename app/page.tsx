import { CatalogProvider } from "@/components/catalog/CatalogProvider";
import { DealsGrid } from "@/components/home/DealsGrid";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { Integration } from "@/components/home/Integration";
import { LatestPosts } from "@/components/home/LatestPosts";
import { ProviderWall } from "@/components/home/ProviderWall";
import { SavingsCalculator } from "@/components/home/SavingsCalculator";
import { WhyCheaper } from "@/components/home/WhyCheaper";
import { PageShell } from "@/components/site/PageShell";
import { listPosts } from "@/lib/blog";
import { getCatalog } from "@/lib/catalog-server";

export default async function Home() {
  const [catalog, posts] = await Promise.all([getCatalog(), listPosts()]);

  return (
    <CatalogProvider initial={catalog}>
      <PageShell>
        <Hero />
        <ProviderWall />
        <DealsGrid />
        <SavingsCalculator />
        <Integration />
        <WhyCheaper />
        <LatestPosts posts={posts.slice(0, 4)} />
        <FinalCTA />
      </PageShell>
    </CatalogProvider>
  );
}
