"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, Hourglass, Flame } from "lucide-react";
import { getSessionOfferDeadline } from "@/lib/utils";

const STORAGE_KEY = "inference_discount_popup_dismissed";
const SHOW_DELAY_MS = 15000;
const SUCCESS_HOLD_MS = 1400;

type Status = "idle" | "submitting" | "success" | "error";

export function DiscountPopup() {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const tick = () => {
      const end = getSessionOfferDeadline();
      setSecondsLeft(Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

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
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
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

  const pad = (n: number) => String(n).padStart(2, "0");
  const hh =
    secondsLeft == null ? "--" : pad(Math.floor((secondsLeft % 86400) / 3600));
  const mm =
    secondsLeft == null ? "--" : pad(Math.floor((secondsLeft % 3600) / 60));
  const ss = secondsLeft == null ? "--" : pad(secondsLeft % 60);

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
            className="relative w-full max-w-lg rounded-2xl p-6 md:p-7"
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-muted)")
              }
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Top label */}
            <div
              className="text-sm font-semibold text-center mb-5"
              style={{ color: "var(--color-text)" }}
            >
              <span aria-hidden>🎉</span> Special Offer Just for You!
            </div>

            {/* Hero heading */}
            <h2
              id="discount-popup-title"
              className="text-xl md:text-2xl font-bold leading-tight text-center"
              style={{ color: "var(--color-text)" }}
            >
              Don&apos;t let your{" "}
              <span style={{ color: "var(--pink)" }}>$5 FREE credits</span> go
              to waste
            </h2>

            {/* Timer + claimed count */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                className="rounded-xl p-3 flex items-center gap-2"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Hourglass
                  className="w-4 h-4 shrink-0"
                  strokeWidth={2.5}
                  style={{ color: "var(--pink)" }}
                />
                <div className="flex flex-col leading-tight text-left">
                  <span
                    className="text-[10px] font-semibold tracking-[0.15em] uppercase"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Offer expires in
                  </span>
                  <span
                    suppressHydrationWarning
                    className="font-[family-name:var(--font-mono)] text-base font-bold tabular-nums tracking-wider"
                    style={{ color: "var(--color-text)" }}
                  >
                    {hh}:{mm}:{ss}
                  </span>
                </div>
              </div>
              <div
                className="rounded-xl p-3 flex items-center gap-2"
                style={{
                  background: "var(--color-bg)",
                  border: "1px dashed var(--border-pink)",
                }}
              >
                <Flame
                  className="w-5 h-5 shrink-0"
                  fill="currentColor"
                  strokeWidth={0}
                  style={{ color: "var(--pink)" }}
                />
                <span
                  className="text-sm leading-tight text-left"
                  style={{ color: "var(--color-text)" }}
                >
                  <span className="font-bold">2,184 users</span>
                  <br />
                  claimed this today
                </span>
              </div>
            </div>

            {/* Pricing block */}
            <div
              className="mt-5 relative rounded-2xl p-5"
              style={{
                background:
                  "linear-gradient(180deg, var(--pink-lo) 0%, var(--color-surface) 100%)",
                border: "1px solid var(--border-pink)",
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="flex flex-col leading-none text-left">
                  <span
                    className="text-[10px] font-semibold tracking-[0.15em] uppercase"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    You Pay
                  </span>
                  <span
                    className="mt-1 text-2xl font-bold tracking-tight"
                    style={{ color: "var(--color-text)" }}
                  >
                    $100
                  </span>
                </div>
                <ArrowRight
                  className="w-5 h-5"
                  style={{ color: "var(--color-text-muted)" }}
                  strokeWidth={2.5}
                />
                <div className="flex flex-col leading-none text-left">
                  <span
                    className="text-[10px] font-semibold tracking-[0.15em] uppercase"
                    style={{ color: "var(--pink)" }}
                  >
                    You Get
                  </span>
                  <span
                    className="mt-1 text-2xl font-bold tracking-tight"
                    style={{ color: "var(--pink)" }}
                  >
                    $125{" "}
                    <span className="text-base font-semibold">Credits</span>
                  </span>
                </div>
              </div>

              <div
                className="absolute -top-3 -right-3 flex flex-col items-center justify-center w-16 h-16 rounded-full text-white"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #FF3D9A 0%, var(--pink) 55%, #B8005F 100%)",
                  boxShadow:
                    "0 10px 24px rgba(209, 0, 118, 0.5), 0 0 0 3px rgba(255, 255, 255, 0.9)",
                  transform: "rotate(8deg)",
                }}
              >
                <span className="text-base font-extrabold leading-none tracking-tight">
                  +25%
                </span>
                <span className="text-[10px] font-bold leading-none mt-1 uppercase tracking-wider">
                  Bonus
                </span>
              </div>
            </div>

            {/* CTA — email + unlock */}
            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") {
                    setStatus("idle");
                    setErrorMsg(null);
                  }
                }}
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
                className="group w-full py-3.5 rounded-full text-base font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-80 disabled:cursor-default"
                style={{
                  background: "var(--pink)",
                  boxShadow: "0 8px 24px var(--pink-glow)",
                }}
                onMouseEnter={(e) => {
                  if (status === "idle" || status === "error") {
                    e.currentTarget.style.boxShadow =
                      "0 12px 30px var(--pink-glow)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px var(--pink-glow)";
                }}
              >
                {status === "submitting"
                  ? "Unlocking…"
                  : status === "success"
                    ? "You're in! Bonus locked"
                    : (
                      <>
                        Yes! Unlock My Bonus
                        <ArrowRight
                          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                          strokeWidth={2}
                        />
                      </>
                    )}
              </button>
            </form>

            {status === "error" && errorMsg && (
              <p className="text-xs mt-3 text-center" style={{ color: "var(--pink)" }}>
                {errorMsg}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
