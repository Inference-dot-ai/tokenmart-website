"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { ProvidersConstellation } from "@/components/ui/providers-constellation";
import Link from "next/link";

function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fill="currentColor"
        d="M12 .5C5.73.5.73 5.5.73 11.77c0 5.01 3.23 9.24 7.72 10.74.56.1.77-.25.77-.55 0-.27-.01-1.17-.02-2.12-3.14.68-3.8-1.34-3.8-1.34-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.5-.29-5.14-1.25-5.14-5.57 0-1.23.44-2.23 1.17-3.02-.12-.29-.51-1.44.11-3 0 0 .96-.31 3.14 1.15A10.9 10.9 0 0 1 12 6.13c.97.01 1.95.13 2.87.38 2.18-1.46 3.14-1.15 3.14-1.15.62 1.56.23 2.71.11 3 .73.79 1.17 1.79 1.17 3.02 0 4.33-2.65 5.28-5.17 5.56.41.35.77 1.04.77 2.1 0 1.51-.01 2.73-.01 3.1 0 .3.2.66.78.55 4.49-1.5 7.72-5.73 7.72-10.74C23.27 5.5 18.27.5 12 .5z"
      />
    </svg>
  );
}

const FORM_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL || "";
const isConfigured = FORM_URL && !FORM_URL.includes("your-form-url");

export default function SignupPage() {
  const formHref = isConfigured ? FORM_URL : "#";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {/* Navbar */}
      <header className="flex justify-center pt-4">
        <Navbar fixed={false} />
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ── LEFT PANEL — signup form, vertically centered ── */}
        <div className="order-2 lg:order-1 w-full lg:w-[35%] flex flex-col justify-center items-center text-center px-6 pt-10 pb-32">
          <h1 className="text-3xl md:text-4xl font-bold mb-10 leading-tight">
            Create your account to
            <br />
            <span style={{ color: "var(--pink)" }}>TokenMart</span>
          </h1>

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

          {/* Social sign-up placeholders */}
          <div className="w-full max-w-sm mt-3 flex flex-col gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full px-5 py-3 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-pink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            >
              <GoogleGIcon className="w-5 h-5" />
              Sign up with Google
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-3 w-full px-5 py-3 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-pink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }}
            >
              <GithubIcon className="w-5 h-5" />
              Sign up with GitHub
            </button>
          </div>

          {/* Terms — directly under Sign Up button */}
          <p
            className="text-xs mt-4 max-w-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms-and-services"
              className="underline"
              style={{ color: "var(--color-text-dim)" }}
            >
              Terms of Service.
            </Link>
          </p>
        </div>

        {/* ── RIGHT PANEL — providers constellation ── */}
        <div className="order-1 lg:order-2 flex w-full lg:w-[65%] p-4 lg:p-6 items-center justify-center">
          <ProvidersConstellation />
        </div>
      </div>
    </div>
  );
}
