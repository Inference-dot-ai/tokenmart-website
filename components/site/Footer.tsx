/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Container } from "./Container";

const LINKS = [
  { href: "/models", label: "Models" },
  { href: "/blog", label: "Blog" },
  { href: "/signup", label: "Sign up" },
  { href: "/terms-and-services", label: "Terms of Service" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <img src="/tm-assets/tokenmart-logo.png" alt="TokenMart" width={112} height={32} className="h-7 w-auto" />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Official frontier model APIs through one key, billed per token, priced under provider list.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
          {LINKS.map((l) =>
            l.href.startsWith("http") ? (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-ink">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className="text-muted hover:text-ink">
                {l.label}
              </Link>
            ),
          )}
        </nav>
      </Container>
      <Container className="pb-10 text-xs text-faint">© 2026 TokenMart. Operated by Distribyte Inc. dba inference.ai.</Container>
    </footer>
  );
}
