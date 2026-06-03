/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Btn } from "./primitives";
import { trackCtaClick, useGetuHref } from "@/lib/attribution";

const MODELS_HREF = "https://console.service-inference.ai/models";

export function TMHeader({ activeBlog = false }: { activeBlog?: boolean }) {
  const modelsHref = useGetuHref(MODELS_HREF);
  return (
    <header className="tm-header">
      <Link className="tm-logo" href="/">
        <img className="tm-logo-img" src="/tm-assets/tokenmart-logo.png" alt="TokenMart" />
        <span className="tm-logo-tag">WHOLESALE&nbsp;AI</span>
      </Link>
      <nav className="tm-nav">
        <Link className={activeBlog ? "is-active" : undefined} href="/blog">
          Blog
        </Link>
      </nav>
      <div className="tm-head-right">
        <ThemeToggle />
        <Btn variant="primary" href={modelsHref} onClick={() => trackCtaClick("tm_header")}>
          Get API key →
        </Btn>
      </div>
    </header>
  );
}
