"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const DEALS: { model: string; discount: number }[] = [
  { model: "GPT-4o", discount: 40 },
  { model: "Claude 3.5 Sonnet", discount: 35 },
  { model: "Gemini 1.5 Pro", discount: 50 },
  { model: "Veo 3", discount: 30 },
  { model: "Sora-2", discount: 25 },
  { model: "Nano Banana Pro", discount: 55 },
  { model: "DeepSeek V3", discount: 60 },
  { model: "Llama 3.3 70B", discount: 45 },
  { model: "Mistral Large", discount: 40 },
  { model: "Midjourney v7", discount: 25 },
  { model: "Kling AI 1.6", discount: 45 },
  { model: "Grok-2", discount: 35 },
];

// Sale ends every Friday at 23:59:59 local time. After that, reset to next Friday.
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

function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export function FlashDealsBanner() {
  const [remaining, setRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = getNextFridayEnd(now);
      setRemaining(splitDuration(end.getTime() - now.getTime()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative z-20 w-screen mt-4 overflow-hidden"
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-stretch h-12 md:h-11">
        {/* Flash Deals pill */}
        <div
          className="relative flex items-center gap-2 px-4 md:px-5 shrink-0 overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, #D10076 0%, #E10082 55%, #FF5EB0 100%)",
          }}
        >
          <span
            className="pointer-events-none absolute inset-0 opacity-60 animate-flash-shimmer"
            style={{
              background:
                "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
            }}
            aria-hidden
          />
          <Zap
            className="relative w-3.5 h-3.5 text-white"
            fill="currentColor"
            strokeWidth={0}
          />
          <span className="relative font-[family-name:var(--font-mono)] text-[11px] md:text-xs font-bold tracking-[0.22em] uppercase text-white whitespace-nowrap">
            Flash Deals
          </span>
        </div>

        {/* Countdown */}
        <div
          className="flex items-center gap-2.5 px-4 md:px-5 shrink-0"
          style={{ borderRight: "1px solid var(--color-border)" }}
        >
          <span className="relative flex items-center justify-center w-2 h-2 shrink-0">
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "var(--pink)", opacity: 0.6 }}
              aria-hidden
            />
            <span
              className="relative w-2 h-2 rounded-full"
              style={{ background: "var(--pink)" }}
            />
          </span>
          <span
            className="hidden sm:inline font-[family-name:var(--font-mono)] text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase whitespace-nowrap"
            style={{ color: "var(--color-text-muted)" }}
          >
            Ends in
          </span>
          <span
            className="font-[family-name:var(--font-mono)] text-[13px] md:text-sm font-bold tabular-nums whitespace-nowrap"
            style={{ color: "var(--color-text)" }}
          >
            <TimeChunk value={remaining.days} unit="d" />
            <Sep />
            <TimeChunk value={remaining.hours} unit="h" pad />
            <Sep />
            <TimeChunk value={remaining.minutes} unit="m" pad />
            <Sep />
            <TimeChunk value={remaining.seconds} unit="s" pad highlight />
          </span>
        </div>

        {/* Ticker */}
        <div className="flex-1 relative overflow-hidden">
          <div
            className="pointer-events-none absolute left-0 top-0 h-full w-12 z-10"
            style={{
              background:
                "linear-gradient(90deg, var(--color-surface), transparent)",
            }}
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-12 z-10"
            style={{
              background:
                "linear-gradient(270deg, var(--color-surface), transparent)",
            }}
          />
          <div className="flex w-max h-full items-center animate-marquee">
            {[...DEALS, ...DEALS].map((deal, i) => (
              <div
                key={i}
                className="shrink-0 flex items-center gap-2 px-5"
              >
                <span
                  className="font-[family-name:var(--font-mono)] text-sm font-semibold whitespace-nowrap"
                  style={{ color: "var(--color-text)" }}
                >
                  {deal.model}
                </span>
                <span
                  className="font-[family-name:var(--font-mono)] text-[11px] font-bold tracking-wide px-1.5 py-0.5 rounded whitespace-nowrap"
                  style={{
                    background: "var(--pink-lo)",
                    color: "var(--pink)",
                  }}
                >
                  −{deal.discount}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          href="https://console.service-inference.ai/models"
          className="hidden md:flex shrink-0 items-center gap-1.5 px-5 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors group"
          style={{
            color: "var(--color-text)",
            borderLeft: "1px solid var(--color-border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--pink)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text)";
          }}
        >
          See all
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2.5}
          />
        </Link>
      </div>
    </div>
  );
}

function TimeChunk({
  value,
  unit,
  pad: padded,
  highlight,
}: {
  value: number;
  unit: string;
  pad?: boolean;
  highlight?: boolean;
}) {
  const display = padded ? pad(value) : String(value);
  return (
    <span style={highlight ? { color: "var(--pink)" } : undefined}>
      {display}
      <span
        className="text-[10px] font-semibold ml-0.5"
        style={{ color: "var(--color-text-muted)" }}
      >
        {unit}
      </span>
    </span>
  );
}

function Sep() {
  return (
    <span
      className="mx-1"
      style={{ color: "var(--color-text-muted)", opacity: 0.5 }}
    >
      :
    </span>
  );
}
