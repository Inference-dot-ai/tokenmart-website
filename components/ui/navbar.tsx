"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { InferenceLogo } from "@/components/ui/inference-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_LINKS = [
  { label: "Models", href: "/models" },
  { label: "Pricing", href: "/#pricing" },
];

const FORM_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL || "";
const FORM_HREF =
  FORM_URL && !FORM_URL.includes("your-form-url") ? FORM_URL : "/signup";
const FORM_IS_EXTERNAL = FORM_HREF !== "/signup";

interface NavbarProps {
  fixed?: boolean;
}

export function Navbar({ fixed = true }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    <nav
      className={`glass-nav z-50 flex items-center justify-between gap-2 md:gap-6 px-3 md:px-6 py-1.5 w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] max-w-7xl rounded-full ${
        fixed
          ? "fixed top-4 left-1/2 -translate-x-1/2"
          : "sticky top-4 mx-auto mb-2"
      }`}
    >
      <a href="/" className="flex items-center gap-2 shrink-0">
        <InferenceLogo className="h-7 w-7 md:h-8 md:w-8" />
        <span className="text-xl md:text-2xl font-bold" style={{ color: "var(--color-text)" }}>
          Token<span style={{ color: "var(--pink)" }}>Mart</span>
        </span>
      </a>

      <div className="nav-links hidden md:flex items-center space-x-1 p-1">
        {NAV_LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="rounded-full px-5 py-1.5 text-lg font-normal"
          >
            {l.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <ThemeToggle />
        <a
          href={FORM_HREF}
          target={FORM_IS_EXTERNAL ? "_blank" : undefined}
          rel={FORM_IS_EXTERNAL ? "noopener noreferrer" : undefined}
          className="hidden sm:inline-flex items-center justify-center whitespace-nowrap text-sm md:text-base font-medium px-5 md:px-6 py-2 md:py-2.5 rounded-full transition-all duration-200"
          style={{
            background: "var(--pink)",
            color: "#FFFFFF",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 24px var(--pink-glow)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Contact Sales
        </a>
        <a
          href="/signup"
          className="hidden sm:inline-flex items-center justify-center whitespace-nowrap text-sm md:text-base font-medium px-5 md:px-6 py-2 md:py-2.5 rounded-full transition-all duration-200"
          style={{
            background: "var(--cta-bg)",
            color: "var(--cta-fg)",
          }}
        >
          Sign Up
        </a>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full cursor-pointer"
          style={{ color: "var(--color-text)" }}
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </nav>
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 w-full h-full cursor-default"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        tabIndex={open ? 0 : -1}
      />
      <div
        className={`absolute top-4 right-4 left-4 rounded-2xl p-4 transition-transform duration-200 ${
          open ? "translate-y-0" : "-translate-y-4"
        }`}
        style={{
          background: "var(--color-surface-hi)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}
          >
            Menu
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full cursor-pointer"
            style={{ color: "var(--color-text)" }}
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <nav className="flex flex-col">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={onClose}
              className="py-3 px-2 text-lg font-medium border-b last:border-b-0"
              style={{
                color: "var(--color-text)",
                borderColor: "var(--color-border)",
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={FORM_HREF}
          target={FORM_IS_EXTERNAL ? "_blank" : undefined}
          rel={FORM_IS_EXTERNAL ? "noopener noreferrer" : undefined}
          onClick={onClose}
          className="mt-4 inline-flex items-center justify-center w-full whitespace-nowrap text-base font-medium px-4 py-3 rounded-full transition-all duration-200"
          style={{
            background: "var(--pink)",
            color: "#FFFFFF",
          }}
        >
          Contact Sales
        </a>
        <a
          href="/signup"
          onClick={onClose}
          className="mt-3 inline-flex items-center justify-center w-full whitespace-nowrap text-base font-medium px-4 py-3 rounded-full transition-all duration-200"
          style={{
            background: "var(--cta-bg)",
            color: "var(--cta-fg)",
          }}
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}
