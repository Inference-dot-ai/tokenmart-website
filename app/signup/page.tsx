"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
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
            <span style={{ color: "var(--pink)" }}>Inference.AI</span>
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

        {/* ── RIGHT PANEL — video ── */}
        <div className="order-1 lg:order-2 flex w-full lg:w-[65%] p-4 lg:p-6">
          <div
            className="w-full aspect-video lg:aspect-auto rounded-2xl overflow-hidden relative"
            style={{
              background: "var(--color-surface-hi)",
              border: "1px solid var(--color-border)",
            }}
          >
            <video
              src="/signup%20vid.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay text */}
            <div className="absolute inset-x-0 top-6 lg:top-24 z-10 text-center px-6 lg:px-8">
              <p
                className="text-xl md:text-4xl font-bold mb-2 lg:mb-3"
                style={{
                  color: "#ffffff",
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                }}
              >
                Start building today
              </p>
              <p
                className="text-sm md:text-lg max-w-md mx-auto"
                style={{
                  color: "rgba(255,255,255,0.9)",
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}
              >
                Get started with Inference in minutes. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
