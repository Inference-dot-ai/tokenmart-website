"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

export function PriceTagFab() {
  const [scrolledPast, setScrolledPast] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const getThreshold = () => window.innerHeight * 0.8;
    const update = () => setScrolledPast(window.scrollY > getThreshold());
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const open = scrolledPast && !dismissed;

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[90]">
      <AnimatePresence>
        {open && (
          <motion.div
            key="sms-popup"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-[21rem] rounded-2xl p-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow:
                "0 0 0 3px var(--pink-lo), 0 20px 48px rgba(0, 0, 0, 0.18)",
            }}
            role="dialog"
            aria-label="Special offer"
          >
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Close"
              className="absolute top-3 right-3 p-1 rounded-full cursor-pointer"
              style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-muted)")
              }
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>

            <h3
              className="text-base font-bold leading-snug pr-6 flex items-center gap-1.5"
              style={{ color: "var(--color-text)" }}
            >
              <span aria-hidden>🎁</span>
              <span style={{ color: "var(--pink)" }}>Special Offer</span>
            </h3>

            <div className="mt-3 mb-4 flex items-center justify-center gap-3">
              <div className="flex items-baseline gap-2 leading-none">
                <span
                  className="text-2xl font-extrabold tracking-tight font-[family-name:var(--font-chakra)]"
                  style={{ color: "var(--color-text)" }}
                >
                  $99
                </span>
                <ArrowRight
                  className="w-4 h-4"
                  strokeWidth={2.5}
                  style={{ color: "var(--color-text-muted)" }}
                />
                <span
                  className="text-2xl font-extrabold tracking-tight font-[family-name:var(--font-chakra)]"
                  style={{ color: "var(--pink)" }}
                >
                  $118.80
                </span>
              </div>
              <span
                className="px-3 py-1.5 rounded-lg text-xs font-extrabold text-white shrink-0 tracking-tight uppercase"
                style={{ background: "rgba(209, 0, 118, 0.85)" }}
              >
                20% Bonus
              </span>
            </div>

            <a
              href="https://console.service-inference.ai/signin"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200"
              style={{ background: "var(--pink)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 24px var(--pink-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Sign in to access
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
