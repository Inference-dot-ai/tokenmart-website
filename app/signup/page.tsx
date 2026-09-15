/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { PageShell } from "@/components/site/PageShell";
import { trackCtaClick, trackSignupIntent, useGetuHref } from "@/lib/attribution";
import { PROVIDERS, providerLogo } from "@/lib/providers";
import { CONSOLE_MODELS_URL, STATS } from "@/lib/site";

const FORM_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL || "";
const isConfigured = !!FORM_URL && !FORM_URL.includes("your-form-url");

export default function SignupPage() {
  const consoleHref = useGetuHref(CONSOLE_MODELS_URL);

  return (
    <PageShell>
      <Container className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:col-span-6">
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.035em] text-ink md:text-5xl">
            Create your TokenMart account
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-muted">
            Tell us a little about your usage and we will set up your API key.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {isConfigured ? (
              <ButtonLink
                href={FORM_URL}
                size="lg"
                onClick={() => {
                  trackCtaClick("signup_page");
                  trackSignupIntent("google_form");
                }}
              >
                Sign up
                <ArrowUpRight size={17} strokeWidth={1.75} />
              </ButtonLink>
            ) : (
              <ButtonLink href={consoleHref} size="lg" onClick={() => trackCtaClick("signup_page")}>
                Get API key
              </ButtonLink>
            )}
          </div>
          {isConfigured ? (
            <p className="mt-6 text-sm text-muted">
              Already have an account?{" "}
              <a href={consoleHref} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4">
                Open the console
              </a>
            </p>
          ) : null}
        </div>

        <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-card sm:p-8 lg:col-span-6">
          <dl className="grid grid-cols-2 gap-6 border-b border-line pb-6">
            <div>
              <dt className="text-sm text-muted">Models</dt>
              <dd className="tnum mt-1 text-4xl font-semibold tracking-tight text-ink">{STATS.modelCount}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Under list price</dt>
              <dd className="tnum mt-1 text-4xl font-semibold tracking-tight text-accent">
                {STATS.maxDiscountPct > 0 ? `${STATS.maxDiscountPct}%` : "-"}
              </dd>
            </div>
          </dl>
          <ul className="mt-6 grid grid-cols-5 gap-3" aria-label="Providers">
            {PROVIDERS.map((p) => (
              <li key={p.key} className="grid aspect-square place-items-center rounded-xl bg-logo-tile p-3 ring-1 ring-black/5">
                <img src={providerLogo(p)} alt={p.name} width={40} height={40} className="size-full max-w-10 object-contain" />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </PageShell>
  );
}
