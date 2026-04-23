"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Zap, ArrowRight } from "lucide-react";

const STORAGE_KEY = "inference_discount_popup_dismissed";
const SHOW_DELAY_MS = 3000;
const SUCCESS_HOLD_MS = 1400;

type Status = "idle" | "submitting" | "success" | "error";

export function DiscountPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV === "production") {
      try {
        if (localStorage.getItem(STORAGE_KEY) === "1") return;
      } catch {
        // localStorage blocked — still show once per session
      }
    }
    const t = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        const code = data?.error ?? "unknown";
        setErrorMsg(
          code === "invalid_email"
            ? "That email doesn't look right."
            : "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      window.setTimeout(dismiss, SUCCESS_HOLD_MS);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-labelledby="discount-popup-title"
        >
          {/* Blurred backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0, 0, 0, 0.35)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl p-8 text-center"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--border-pink)",
              boxShadow:
                "0 0 0 4px var(--pink-lo), 0 0 60px 8px var(--pink-glow), 0 24px 60px rgba(0, 0, 0, 0.25)",
            }}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-4 right-4 p-1 rounded-full transition-colors duration-150 cursor-pointer"
              style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Pill */}
            <div
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-6"
              style={{
                background: "var(--pink-lo)",
                color: "var(--pink)",
                border: "1px solid var(--border-pink)",
              }}
            >
              <Zap className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />
              <span className="text-xs font-semibold tracking-wider">TODAY ONLY</span>
            </div>

            {/* Heading */}
            <h2
              id="discount-popup-title"
              className="text-3xl font-bold leading-tight mb-4"
              style={{ color: "var(--color-text)" }}
            >
              Get{" "}
              <span style={{ color: "var(--pink)" }}>300M free tokens</span>{" "}
              instantly
            </h2>

            {/* Body */}
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--color-text-dim)" }}>
              Drop your email to claim 300M free tokens across 40+ models. No card
              required.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                ref={inputRef}
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "submitting" || status === "success"}
                className="w-full px-5 py-3.5 rounded-full text-sm outline-none transition-all duration-200 disabled:opacity-60"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-pink)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px var(--pink-lo)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                disabled={status === "submitting" || status === "success"}
                className="w-full py-3.5 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-80 disabled:cursor-default"
                style={{ background: "var(--pink)" }}
                onMouseEnter={(e) => {
                  if (status === "idle" || status === "error") {
                    e.currentTarget.style.boxShadow = "0 0 24px var(--pink-glow)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {status === "submitting" && "Claiming…"}
                {status === "success" && "You're in! Check your inbox"}
                {(status === "idle" || status === "error") && (
                  <>
                    Claim 300M Tokens
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </>
                )}
              </button>
            </form>

            {/* Error / Fine print */}
            {status === "error" && errorMsg ? (
              <p className="text-xs mt-5" style={{ color: "var(--pink)" }}>
                {errorMsg}
              </p>
            ) : (
              <p className="text-xs mt-5" style={{ color: "var(--color-text-muted)" }}>
                No credit card. Unsubscribe anytime.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
