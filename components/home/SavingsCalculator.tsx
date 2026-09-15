"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCatalog } from "@/components/catalog/CatalogProvider";
import { ProviderLogo } from "@/components/catalog/ProviderLogo";
import { ButtonLink } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { trackPlanIntent } from "@/lib/attribution";
import { flagshipOf } from "@/lib/catalog-select";
import { money } from "@/lib/format";
import { CONTACT_URL, VOLUME_THRESHOLD_USD } from "@/lib/site";

const STEPS = [100, 250, 500, 1_000, 2_500, 5_000, 10_000, 25_000, 50_000, 100_000];
const PROVIDERS = ["anthropic", "openai", "google", "xai"];

export function SavingsCalculator() {
  const { catalog } = useCatalog();
  const reduce = useReducedMotion();
  const sliderId = useId();

  const options = useMemo(
    () =>
      PROVIDERS.map((p) => flagshipOf(catalog.models, p, "text")).filter(
        (m): m is NonNullable<typeof m> => !!m,
      ),
    [catalog.models],
  );
  const [modelIdx, setModelIdx] = useState(0);
  const [step, setStep] = useState(3);

  const model = options[Math.min(modelIdx, options.length - 1)];
  if (!model) return null;

  const listSpend = STEPS[step];
  const pct = model.discountPct;
  const pay = listSpend * (1 - pct / 100);
  const saved = listSpend - pay;
  const volume = listSpend >= VOLUME_THRESHOLD_USD;
  const fill = `${(step / (STEPS.length - 1)) * 100}%`;

  return (
    <section className="border-y border-line bg-surface py-20 lg:py-28">
      <Container>
        <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em] text-ink md:text-[42px] md:leading-[1.08]">
          See what your current bill looks like here.
        </h2>
        <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-muted">
          Pick the model you use most and what you spend on it at list price.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="text-sm font-medium text-ink" id={`${sliderId}-models`}>
              Model
            </p>
            <div role="radiogroup" aria-labelledby={`${sliderId}-models`} className="mt-3 flex flex-wrap gap-2">
              {options.map((m, i) => (
                <button
                  key={m.id}
                  role="radio"
                  aria-checked={i === modelIdx}
                  onClick={() => setModelIdx(i)}
                  className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm transition-colors ${
                    i === modelIdx
                      ? "border-accent-line bg-accent-soft text-ink"
                      : "border-line text-muted hover:border-line-strong hover:text-ink"
                  }`}
                >
                  <ProviderLogo provider={m.provider} size="sm" />
                  {m.name}
                </button>
              ))}
            </div>

            <div className="mt-10 flex items-baseline justify-between gap-4">
              <label htmlFor={sliderId} className="text-sm font-medium text-ink">
                Monthly spend at list price
              </label>
              <span className="tnum text-2xl font-semibold text-ink">{money(listSpend)}</span>
            </div>
            <input
              id={sliderId}
              type="range"
              min={0}
              max={STEPS.length - 1}
              step={1}
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
              aria-valuetext={`${money(listSpend)} per month`}
              className="tm-range mt-5 w-full"
              style={{ ["--fill" as string]: fill }}
            />
            <div className="tnum mt-2 flex justify-between text-xs text-faint">
              <span>{money(STEPS[0])}</span>
              <span>{money(STEPS[STEPS.length - 1])}+</span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8 rounded-[var(--radius-card)] bg-bg p-6 ring-1 ring-line sm:p-8">
            <dl className="grid grid-cols-2 gap-6">
              <div>
                <dt className="text-sm text-muted">On TokenMart</dt>
                <dd className="tnum mt-1 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{money(pay)}</dd>
                <dd className="tnum text-sm text-faint">
                  instead of <s>{money(listSpend)}</s>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">You save each year</dt>
                <dd className="tnum mt-1 text-3xl font-semibold tracking-tight text-accent sm:text-4xl">
                  {money(saved * 12)}
                </dd>
                <dd className="tnum text-sm text-faint">{pct > 0 ? `${pct}% off ${model.name}` : "List price for this model"}</dd>
              </div>
            </dl>

            <AnimatePresence initial={false} mode="wait">
              {volume ? (
                <motion.div
                  key="volume"
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-lg border border-accent-line bg-accent-soft p-5"
                >
                  <p className="font-medium text-ink">Spending this much? Ask for a volume rate.</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    Committed monthly volume gets a custom price below the public rate shown here.
                  </p>
                  <ButtonLink
                    href={CONTACT_URL}
                    size="sm"
                    className="mt-4"
                    onClick={() => trackPlanIntent("volume", listSpend)}
                  >
                    Talk to sales
                    <ArrowRight size={15} strokeWidth={1.75} />
                  </ButtonLink>
                </motion.div>
              ) : (
                <motion.p
                  key="payg"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm leading-relaxed text-muted"
                >
                  Pay as you go at this level. Above {money(VOLUME_THRESHOLD_USD)} a month, committed volume unlocks a
                  custom rate.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
