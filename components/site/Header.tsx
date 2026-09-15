/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { trackCtaClick, useGetuHref } from "@/lib/attribution";
import { CONSOLE_MODELS_URL } from "@/lib/site";
import { ButtonLink } from "./Button";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/models", label: "Models" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const pathname = usePathname() ?? "/";
  const ctaHref = useGetuHref(CONSOLE_MODELS_URL);
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  const isActive = (href: string) => !href.startsWith("http") && pathname.startsWith(href);

  return (
    <header
      className="sticky z-40 border-b border-line bg-[var(--header-bg)] backdrop-blur-xl"
      style={{ top: "env(safe-area-inset-top, 0px)" }}
    >
      <Container className="flex h-16 items-center gap-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="TokenMart home">
          <img src="/tm-assets/tokenmart-logo.png" alt="TokenMart" width={112} height={32} className="h-7 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((item) =>
            item.href.startsWith("http") ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-sm transition-colors hover:text-ink ${
                  isActive(item.href) ? "text-ink" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <ButtonLink href={ctaHref} size="sm" onClick={() => trackCtaClick("tm_header")}>
            Get API key
          </ButtonLink>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full text-ink hover:bg-surface-2 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            {open ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
          </button>
        </div>
      </Container>

      {open ? (
        <nav id="mobile-nav" className="border-t border-line md:hidden" aria-label="Mobile">
          <Container className="flex flex-col py-2">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="py-3 text-[15px] text-ink"
              >
                {item.label}
              </a>
            ))}
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
