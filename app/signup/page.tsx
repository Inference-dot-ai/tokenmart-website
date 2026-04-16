"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import { InferenceLogo } from "@/components/ui/inference-logo";
import Link from "next/link";

const FORM_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL || "";
const isConfigured = FORM_URL && !FORM_URL.includes("your-form-url");

export default function SignupPage() {
  const formHref = isConfigured ? FORM_URL : "#";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ── LEFT PANEL ── */}
        <div className="w-full lg:w-[45%] flex flex-col px-8 md:px-14 py-10">
          {/* Logo — pinned top */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
              <InferenceLogo className="w-9 h-9" />
              <span
                className="text-lg font-semibold tracking-tight"
                style={{ color: "var(--color-text)" }}
              >
                inference.ai
              </span>
            </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              Create your account to{" "}
              <span style={{ color: "var(--pink)" }}>Inference.AI</span>
            </h1>
            <p
              className="text-sm mb-10"
              style={{ color: "var(--color-text-dim)" }}
            >
              Start building with Inference today
            </p>

            {/* Sign up button */}
            <a
              href={formHref}
              target={isConfigured ? "_blank" : undefined}
              rel={isConfigured ? "noopener noreferrer" : undefined}
              className="flex items-center justify-center gap-2.5 w-full max-w-sm px-5 py-3 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: "var(--pink)",
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 24px var(--pink-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Sign Up
              {isConfigured ? (
                <ExternalLink className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </a>
          </div>

          {/* Bottom: Terms */}
          <div className="mt-12">
            <p
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="underline"
                style={{ color: "var(--color-text-dim)" }}
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="underline"
                style={{ color: "var(--color-text-dim)" }}
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL — media placeholder ── */}
        <div className="hidden lg:flex w-[55%] p-6">
          <div
            className="w-full rounded-2xl overflow-hidden flex flex-col items-center justify-end relative"
            style={{
              background: "var(--color-surface-hi)",
              border: "1px solid var(--color-border)",
            }}
          >
            {/* Placeholder visual */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: 0.15 }}
            >
              <InferenceLogo className="w-48 h-48" color="var(--color-text)" />
            </div>

            {/* Bottom overlay text */}
            <div className="relative z-10 text-center px-8 pb-10 pt-20"
              style={{
                background: "linear-gradient(to top, var(--color-surface-hi) 60%, transparent)",
              }}
            >
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--color-text)" }}
              >
                Start Building Today
              </h2>
              <p
                className="text-sm max-w-xs mx-auto"
                style={{ color: "var(--color-text-dim)" }}
              >
                Get started with Inference in minutes. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="flex">
        <div
          className="w-full lg:w-[45%] px-8 md:px-14 py-4 flex items-center gap-4 text-xs"
          style={{
            color: "var(--color-text-muted)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <span style={{ color: "var(--color-border)" }}>|</span>
          <Link href="/terms" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
