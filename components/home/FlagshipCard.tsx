"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCatalog } from "@/components/catalog/CatalogProvider";
import { HeadlinePrice, RatePair } from "@/components/catalog/Price";
import { ProviderLogo, providerName } from "@/components/catalog/ProviderLogo";
import { DiscountBadge } from "@/components/site/DiscountBadge";
import { flagshipOf, savingsOf } from "@/lib/catalog-select";
import { usd } from "@/lib/format";

const TABS = ["anthropic", "openai", "google", "xai"];

export function FlagshipCard() {
  const { catalog } = useCatalog();
  const reduce = useReducedMotion();
  const baseId = useId();

  const flagships = useMemo(
    () =>
      TABS.map((p) => ({ provider: p, model: flagshipOf(catalog.models, p, "text") })).filter(
        (f): f is { provider: string; model: NonNullable<typeof f.model> } => !!f.model,
      ),
    [catalog.models],
  );
  const [active, setActive] = useState(0);
  const current = flagships[Math.min(active, flagships.length - 1)];

  if (!current) {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-lift">
        <div className="h-5 w-40 animate-pulse rounded bg-surface-2" />
        <div className="mt-6 h-14 w-48 animate-pulse rounded bg-surface-2" />
        <div className="mt-8 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-surface-2" />
          ))}
        </div>
      </div>
    );
  }

  const m = current.model;
  const t = m.price?.tokens;
  const lt = m.list?.tokens;
  const rows = t
    ? [
        { label: "Input", price: t.input, list: lt?.input },
        { label: "Output", price: t.output, list: lt?.output },
        ...(t.cacheRead !== undefined ? [{ label: "Cache read", price: t.cacheRead, list: lt?.cacheRead }] : []),
      ]
    : [];

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface shadow-lift">
      <div role="tablist" aria-label="Flagship models by provider" className="flex gap-1 overflow-x-auto border-b border-line p-2">
        {flagships.map((f, i) => (
          <button
            key={f.provider}
            role="tab"
            id={`${baseId}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            onClick={() => setActive(i)}
            className={`flex shrink-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm transition-colors ${
              i === active ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
            }`}
          >
            <ProviderLogo provider={f.provider} size="sm" />
            {providerName(f.provider)}
          </button>
        ))}
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${active}`} className="p-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={m.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-ink">{m.name}</h2>
                <p className="mt-0.5 truncate font-mono text-xs text-faint">{m.id}</p>
              </div>
              <DiscountBadge pct={m.discountPct} size="lg" />
            </div>

            <div className="mt-6">
              <HeadlinePrice headline={m.headline} size="lg" />
            </div>

            {rows.length > 0 ? (
              <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
                {rows.map((r) => (
                  <div key={r.label}>
                    <dt className="text-xs text-muted">{r.label}</dt>
                    <dd className="mt-1 text-[15px]">
                      <RatePair price={r.price} list={r.list} className="flex-col !gap-0" />
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-accent-soft px-4 py-3">
              <p className="text-sm text-ink">
                {savingsOf(m) > 0 ? (
                  <>
                    You save <span className="tnum font-semibold">{usd(savingsOf(m))}</span> on every{" "}
                    {m.headline?.unit.replace(/^per /, "")}.
                  </>
                ) : (
                  <>Provider list price, one key for every model.</>
                )}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <Link
          href={`/models?provider=${current.provider}`}
          className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink"
        >
          All {providerName(current.provider)} models
          <ArrowRight size={15} strokeWidth={1.75} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
