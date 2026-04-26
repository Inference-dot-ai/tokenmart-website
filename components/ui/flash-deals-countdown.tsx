"use client";

import { useEffect, useState } from "react";
import { getSessionOfferDeadline } from "@/lib/utils";

// Pink gradient stroke — same treatment as the hero's "65%" underline
const STROKE = "linear-gradient(90deg, transparent, rgba(209, 0, 118, 0.9), transparent)";

export function FlashDealsCountdown() {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const end = getSessionOfferDeadline();
      setSecondsLeft(Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000)));
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
    { label: "days",  value: days },
    { label: "hours", value: hours },
    { label: "mins",  value: minutes },
    { label: "secs",  value: seconds },
  ];

  return (
    <div className="relative z-20 w-full max-w-3xl mx-auto" style={{ color: "var(--color-text)" }}>
      {/* top pink-gradient stroke */}
      <div className="h-[2px] w-full rounded-full" style={{ background: STROKE }} />

      <div className="px-6 py-5 flex items-center justify-center gap-6 md:gap-10 flex-wrap">
        <div className="flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-chakra)] font-bold text-xl md:text-2xl tracking-tight">
            Flash Deals
          </span>
          <span
            className="text-sm md:text-base font-semibold"
            style={{ color: "var(--pink)" }}
          >
            end in
          </span>
        </div>

        <div className="flex items-start gap-4 md:gap-6 font-[family-name:var(--font-mono)]">
          {units.map(({ label, value }, i) => (
            <div key={label} className="flex items-start gap-4 md:gap-6">
              <div className="flex flex-col items-center leading-none">
                <span
                  suppressHydrationWarning
                  className="text-2xl md:text-3xl font-bold tabular-nums"
                  style={label === "secs" ? { color: "var(--pink)" } : undefined}
                >
                  {value}
                </span>
                <span
                  className="mt-1.5 text-[10px] md:text-[11px] uppercase tracking-[0.14em]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {label}
                </span>
              </div>
              {i < units.length - 1 && (
                <span
                  className="text-2xl md:text-3xl font-bold leading-none"
                  style={{ color: "var(--color-text-muted)" }}
                  aria-hidden
                >
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* bottom pink-gradient stroke */}
      <div className="h-[2px] w-full rounded-full" style={{ background: STROKE }} />
    </div>
  );
}
