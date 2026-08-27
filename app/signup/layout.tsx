import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

// The signup page is a client component, so its metadata lives here.
export const metadata: Metadata = buildPageMetadata({
  path: "/signup",
  title: "Sign Up",
  description:
    "Create a TokenMart account and call GPT, Claude, Gemini and 40+ models through one API at up to 65% below retail.",
});

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
