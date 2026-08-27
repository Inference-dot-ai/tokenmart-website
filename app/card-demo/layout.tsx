import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";

// Internal component gallery — publicly reachable but not something we want
// in search results.
export const metadata: Metadata = NOINDEX;

export default function CardDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
