/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCatalog } from "@/components/catalog/CatalogProvider";
import { HeadlinePrice } from "@/components/catalog/Price";
import { ProviderLogo, providerName } from "@/components/catalog/ProviderLogo";
import { Container } from "@/components/site/Container";
import { DiscountBadge } from "@/components/site/DiscountBadge";
import type { CatalogModel } from "@/lib/catalog";
import { countByProvider, flagshipOf, providersIn, savingsOf } from "@/lib/catalog-select";
import { usd } from "@/lib/format";
import { getProvider } from "@/lib/providers";

/** Model the hero card opens on; the grid features something else. */
const HERO_PROVIDER = "anthropic";

function pickDeals(models: CatalogModel[], providers: string[]) {
  const heroId = flagshipOf(models, HERO_PROVIDER, "text")?.id;
  const featured = [...models]
    .filter((m) => m.kind === "text" && m.discountPct > 0 && m.id !== heroId && m.provider !== HERO_PROVIDER)
    .sort((a, b) => savingsOf(b) - savingsOf(a))[0];

  const tiles = providers
    .filter((p) => p !== featured?.provider)
    // Text flagships first; media-only providers show their best media model.
    // The hero card already shows one Anthropic model, so skip that one here.
    .map((p) => flagshipOf(models, p, "text", heroId) ?? flagshipOf(models, p, undefined, heroId))
    .filter((m): m is CatalogModel => !!m && m.discountPct > 0);
  // A 4-column bento: the featured tile takes 2x2, so tiles fill in fours.
  const count = tiles.length >= 8 ? 8 : tiles.length >= 4 ? 4 : tiles.length;
  return { featured, tiles: tiles.slice(0, count) };
}

export function DealsGrid() {
  const { catalog } = useCatalog();
  const { featured, tiles } = pickDeals(catalog.models, providersIn(catalog));
  const counts = countByProvider(catalog.models);

  if (!featured) return null;

  // Reduced motion is handled globally by <MotionConfig reducedMotion="user">.
  const reveal = (i: number) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.55, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] as const },
  });

  const featuredArt = getProvider(featured.provider)?.art;
  const ft = featured.price?.tokens;
  const flt = featured.list?.tokens;

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em] text-ink md:text-[42px] md:leading-[1.08]">
            Every major provider, priced under list.
          </h2>
          <Link href="/models" className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink">
            All {catalog.stats.modelCount} models
            <ArrowRight size={15} strokeWidth={1.75} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <motion.li {...reveal(0)} className="sm:col-span-2 lg:row-span-2">
            <Link
              href={`/models?provider=${featured.provider}`}
              className="group relative flex h-full min-h-[380px] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] bg-[#0d0d11] p-6 text-white shadow-card"
            >
              {featuredArt ? (
                <img
                  src={featuredArt}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : null}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0d0d11] via-[#0d0d11]/70 to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <ProviderLogo provider={featured.provider} size="sm" />
                  <span className="text-sm text-white/75">{providerName(featured.provider)}</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <h3 className="text-2xl font-semibold tracking-tight">{featured.name}</h3>
                  <span className="tnum inline-flex h-7 items-center rounded-full bg-[#ff5a9d] px-2.5 text-sm font-semibold text-[#0b0b0e]">
                    -{featured.discountPct}%
                  </span>
                </div>
                {ft ? (
                  <dl className="mt-5 grid max-w-sm grid-cols-2 gap-4">
                    {[
                      { label: "Input per 1M", price: ft.input, list: flt?.input },
                      { label: "Output per 1M", price: ft.output, list: flt?.output },
                    ].map((r) => (
                      <div key={r.label}>
                        <dt className="text-xs text-white/60">{r.label}</dt>
                        <dd className="tnum mt-1 flex items-baseline gap-2">
                          <span className="text-2xl font-semibold">{usd(r.price)}</span>
                          {r.list !== undefined ? <s className="text-sm text-white/50">{usd(r.list)}</s> : null}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            </Link>
          </motion.li>

          {tiles.map((m, i) => {
            const art = getProvider(m.provider)?.art;
            return (
              <motion.li key={m.id} {...reveal(i + 1)}>
                <Link
                  href={`/models?provider=${m.provider}`}
                  className="group relative flex h-full min-h-[184px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-card transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong"
                >
                  {art ? (
                    <img
                      src={art}
                      alt=""
                      loading="lazy"
                      className="art-fade pointer-events-none absolute inset-y-0 right-0 w-1/2 object-cover opacity-30 transition-opacity duration-300 group-hover:opacity-45"
                    />
                  ) : null}
                  <div className="relative flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <ProviderLogo provider={m.provider} size="sm" />
                      <span className="truncate text-xs text-muted">
                        {providerName(m.provider)} · {counts[m.provider]} {counts[m.provider] === 1 ? "model" : "models"}
                      </span>
                    </div>
                    <DiscountBadge pct={m.discountPct} />
                  </div>
                  <h3 className="relative mt-4 truncate text-[15px] font-medium text-ink">{m.name}</h3>
                  <div className="relative mt-auto pt-3">
                    <HeadlinePrice headline={m.headline} />
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
