import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import HomeClient from "./home-client";

// The page body needs `useGetuHref`, so it stays a client component and lives
// in ./home-client. This wrapper exists purely so the route can export
// metadata — client components can't.
export const metadata: Metadata = buildPageMetadata({
  path: "/",
  title: "TokenMart",
  absoluteTitle: true,
});

export default function Page() {
  return <HomeClient />;
}
