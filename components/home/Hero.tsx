"use client";

import { useCatalog } from "@/components/catalog/CatalogProvider";
import { ButtonLink } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { trackCtaClick, useGetuHref } from "@/lib/attribution";
import { CONSOLE_MODELS_URL } from "@/lib/site";
import { FlagshipCard } from "./FlagshipCard";

export function Hero() {
  const { catalog } = useCatalog();
  const ctaHref = useGetuHref(CONSOLE_MODELS_URL);
  const { maxDiscountPct, modelCount } = catalog.stats;
  const more = Math.max(0, modelCount - 3);

  const rise = (delayMs: number) => ({ className: "tm-rise", style: { animationDelay: `${delayMs}ms` } });

  return (
    <section className="relative overflow-hidden">
      {/* Soft accent wash behind the price card; decorative only. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 size-[720px] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--accent-soft), transparent)" }}
      />
      <Container className="relative grid grid-cols-1 items-center gap-12 pb-20 pt-12 md:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-20">
        <div className="lg:col-span-7">
          <h1 className="text-balance text-[40px] font-semibold leading-[1.04] tracking-[-0.035em] text-ink sm:text-5xl lg:text-[60px]"
          >
            The same frontier models,{" "}
            {maxDiscountPct > 0 ? (
              <span className="text-accent">up to {maxDiscountPct}% under list.</span>
            ) : (
              <span className="text-accent">one API key.</span>
            )}
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted">
            One API key for Claude, GPT, Gemini and {more > 0 ? `${more} more models` : "more"}. Pay per token, with
            no contract.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={ctaHref} size="lg" onClick={() => trackCtaClick("tm_hero")}>
              Get API key
            </ButtonLink>
            <ButtonLink href="/models" variant="secondary" size="lg">
              Browse models
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div {...rise(80)}>
            <FlagshipCard />
          </div>
        </div>
      </Container>
    </section>
  );
}
