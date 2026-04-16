"use client";

import { ArrowRight } from "lucide-react";
import { InferenceLogo } from "@/components/ui/inference-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_LINKS = [
  { label: "Models", href: "/models" },
  { label: "Docs", href: "#" },
  { label: "API", href: "#" },
];

interface NavbarProps {
  fixed?: boolean;
}

export function Navbar({ fixed = true }: NavbarProps) {
  return (
    <nav
      className={`glass-nav z-50 flex items-center justify-between gap-6 px-6 py-1.5 w-[calc(100%-2rem)] max-w-7xl rounded-full ${
        fixed
          ? "fixed top-4 left-1/2 -translate-x-1/2"
          : "relative mx-auto mt-4 mb-2"
      }`}
    >
      <a href="/" className="flex items-center gap-2">
        <InferenceLogo className="h-8 w-8" />
        <span className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
          Inference<span style={{ color: "var(--pink)" }}>.ai</span>
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

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <a
          href="/signup"
          className="inline-flex items-center gap-2 text-lg font-normal px-5 py-2 rounded-full transition-all duration-200"
          style={{
            background: "var(--color-text)",
            color: "var(--color-bg)",
          }}
        >
          Get Started
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </a>
      </div>
    </nav>
  );
}
