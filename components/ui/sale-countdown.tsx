"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PINK = "209, 0, 118";

// Sale ends every Friday at 23:59:59 local time. After that, reset to next Friday.
// (Kept in sync with flash-deals-countdown.tsx.)
function getNextFridayEnd(now: Date): Date {
  const target = new Date(now);
  const daysUntilFriday = (5 - now.getDay() + 7) % 7;
  target.setDate(now.getDate() + daysUntilFriday);
  target.setHours(23, 59, 59, 999);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 7);
  }
  return target;
}

export function SaleCountdown({ compact = false }: { compact?: boolean }) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = getNextFridayEnd(now);
      setSecondsLeft(Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const days    = secondsLeft == null ? "--" : pad(Math.floor(secondsLeft / 86400));
  const hours   = secondsLeft == null ? "--" : pad(Math.floor((secondsLeft % 86400) / 3600));
  const minutes = secondsLeft == null ? "--" : pad(Math.floor((secondsLeft % 3600) / 60));
  const seconds = secondsLeft == null ? "--" : pad(secondsLeft % 60);

  const units: { label: string; value: string }[] = [
    { label: "Days",    value: days },
    { label: "Hours",   value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:block fixed top-1/2 -translate-y-1/2 right-6 z-40 pointer-events-none"
    >
          <div className="relative pointer-events-auto">
            {/* Soft pink atmospheric glow — replaces the dark panel */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background: `radial-gradient(60% 60% at 50% 50%, rgba(${PINK}, 0.22), transparent 70%)`,
                filter: "blur(24px)",
                transform: "scale(1.15)",
              }}
            />

            <div className={compact ? "mb-2 text-center" : "mb-4 text-center"}>
              <h3
                className={`font-[family-name:var(--font-chakra)] font-bold tracking-tight leading-none ${
                  compact ? "text-[0.95rem]" : "text-[1.25rem]"
                }`}
                style={{ color: "var(--color-text)" }}
              >
                Sale Ends In
              </h3>
              <div
                className={`h-[2px] mx-auto rounded-full ${compact ? "mt-1.5" : "mt-2"}`}
                style={{
                  width: "82%",
                  background: `linear-gradient(90deg, transparent, rgba(${PINK}, 0.9), transparent)`,
                }}
              />
            </div>

            <div className={compact ? "grid grid-cols-4 gap-1.5" : "grid grid-cols-4 gap-2.5"}>
              {units.map(({ label, value }) => (
                <div
                  key={label}
                  className={`rounded-xl text-center ${compact ? "px-2 py-1.5" : "px-3 py-3"}`}
                  style={{
                    background: "transparent",
                    border: `1.5px solid rgba(${PINK}, 0.75)`,
                    boxShadow: `0 0 16px rgba(${PINK}, 0.18), inset 0 0 12px rgba(${PINK}, 0.06)`,
                    minWidth: compact ? "52px" : "72px",
                  }}
                >
                  <div
                    suppressHydrationWarning
                    className={`font-[family-name:var(--font-chakra)] font-extrabold leading-none tabular-nums ${
                      compact ? "text-[1.25rem] mb-1" : "text-[2rem] mb-1.5"
                    }`}
                    style={{ color: "var(--color-text)" }}
                  >
                    {value}
                  </div>
                  <div
                    className={`font-semibold uppercase tracking-[0.14em] ${
                      compact ? "text-[8px]" : "text-[10px]"
                    }`}
                    style={{ color: "var(--pink)" }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
    </motion.div>
  );
}
