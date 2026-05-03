"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowRight, Flame } from "lucide-react";

const STORAGE_KEY = "inference_discount_popup_dismissed";
const SHOW_DELAY_MS = 15000;
const CONSOLE_URL = "https://console.service-inference.ai/";

export function DiscountPopup() {
  const [open, setOpen] = useState(false);

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
              <span style={{ color: "var(--pink)" }}>+20% bonus</span> go to
              waste
            </h2>

            {/* Claimed count */}
            <div className="mt-5">
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
                  <span className="font-bold">184 users</span> claimed this
                  today
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
                    $99
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
                    $118.80{" "}
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
                  +20%
                </span>
                <span className="text-[10px] font-bold leading-none mt-1 uppercase tracking-wider">
                  Bonus
                </span>
              </div>
            </div>

            {/* CTA — link to console */}
            <a
              href={CONSOLE_URL}
              onClick={dismiss}
              className="group mt-5 w-full py-3.5 rounded-full text-base font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                background: "var(--pink)",
                boxShadow: "0 8px 24px var(--pink-glow)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 12px 30px var(--pink-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 8px 24px var(--pink-glow)";
              }}
            >
              Yes! Unlock My Bonus
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
