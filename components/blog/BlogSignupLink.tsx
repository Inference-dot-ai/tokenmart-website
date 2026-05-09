"use client";

import type { ReactNode } from "react";
import { trackCtaClick, useGetuHref } from "@/lib/attribution";

export function BlogSignupLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const trackedHref = useGetuHref(href);

  function source(): string {
    if (typeof window === "undefined") return "blog_post";
    const path = window.location.pathname.replace(/^\/+/, "").replace(/\/+$/, "");
    return path || "blog_post";
  }

  return (
    <a
      href={trackedHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackCtaClick(source(), { surface: "blog_post" })}
      style={{ color: "var(--pink)" }}
      className="underline underline-offset-4 decoration-1 hover:decoration-2"
    >
      {children}
    </a>
  );
}
