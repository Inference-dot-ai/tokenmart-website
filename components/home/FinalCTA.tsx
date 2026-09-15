"use client";

import { useOptionalCatalog } from "@/components/catalog/CatalogProvider";
import { ButtonLink } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { trackCtaClick, useGetuHref } from "@/lib/attribution";
import { CONSOLE_MODELS_URL, STATS } from "@/lib/site";

/** Closing call to action. Uses the live catalog when present, else build stats. */
export function FinalCTA({ source = "tm_finalcta" }: { source?: string }) {
  const ctx = useOptionalCatalog();
  const href = useGetuHref(CONSOLE_MODELS_URL);
  const pct = ctx?.catalog.stats.maxDiscountPct ?? STATS.maxDiscountPct;

  return (
    <section className="pb-20 lg:pb-28">
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface px-6 py-16 text-center shadow-card sm:px-12 lg:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-1/2 mx-auto h-full max-w-3xl rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, var(--accent-soft), transparent)" }}
          />
          <h2 className="relative mx-auto max-w-3xl text-balance text-3xl font-semibold tracking-[-0.03em] text-ink md:text-5xl md:leading-[1.05]">
            {pct > 0 ? `Stop paying list price. Save up to ${pct}% today.` : "Every frontier model, one API key."}
          </h2>
          <p className="relative mx-auto mt-5 max-w-[48ch] text-lg text-muted">
            Create a key in the console and point your SDK at TokenMart.
          </p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href={href} size="lg" onClick={() => trackCtaClick(source)}>
              Get API key
            </ButtonLink>
            <ButtonLink href="/models" size="lg" variant="secondary">
              Browse models
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
