import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";

// app/models/page.tsx calls notFound() unconditionally. Under `output: "export"`
// that renders an empty document which Cloudflare Pages then serves with HTTP
// 200 — a soft 404. The route was also listed in sitemap.xml at priority 0.9,
// so Google was being pointed at a blank page as the site's second-most
// important URL. It is now dropped from the sitemap.
//
// Next.js already emits its own `noindex` on the not-found render, so while
// notFound() stays this adds a second (identical in effect) robots tag —
// crawlers combine them and take the most restrictive. It is kept because it
// is the only thing standing between a restored /models page and the index:
// whoever brings the page back should replace this with buildPageMetadata().
export const metadata: Metadata = NOINDEX;

export default function ModelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
