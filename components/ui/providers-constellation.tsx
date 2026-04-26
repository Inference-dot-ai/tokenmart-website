"use client";

import { useEffect, useRef, useState } from "react";
import { InferenceLogo } from "@/components/ui/inference-logo";

type BrandEntry =
  | { kind: "svg"; file: string; monoDark?: boolean }
  | { kind: "wordmark"; text: string; color: string };

// Lookup key is the lower-cased provider string as it appears in the sheet.
// monoDark: logo is solid black — invert to white in dark theme.
const PROVIDER_BRAND: Record<string, BrandEntry> = {
  anthropic:        { kind: "svg",      file: "anthropic.svg", monoDark: true },
  openai:           { kind: "svg",      file: "openai.svg",    monoDark: true },
  google:           { kind: "svg",      file: "google.svg" },
  deepseek:         { kind: "svg",      file: "deepseek.svg",  monoDark: true },
  bytedance:        { kind: "svg",      file: "bytedance.svg" },
  xai:              { kind: "svg",      file: "x.svg",         monoDark: true },
  "moonshot ai":    { kind: "wordmark", text: "Kimi",     color: "#1E1E2E" },
  "z.ai":           { kind: "wordmark", text: "Z.AI",     color: "#0A66F5" },
  minimax:          { kind: "wordmark", text: "MiniMax",  color: "#FF5A1F" },
  "kling ai":       { kind: "wordmark", text: "Kling",    color: "#111827" },
  fishaudio:        { kind: "svg",      file: "fishaudio.svg", monoDark: true },
};

// Constellation is purely decorative — hardcode the providers so it renders
// the same in dev and production regardless of what the models API returns.
const HARDCODED_PROVIDERS: string[] = [
  "deepseek",
  "xai",
  "z.ai",
  "anthropic",
  "openai",
  "google",
  "moonshot ai",
  "kling ai",
  "bytedance",
  "minimax",
  "fishaudio",
];

const MAX_PROVIDERS = 12;

export function ProvidersConstellation() {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const providers = HARDCODED_PROVIDERS;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        setSize({ w: e.contentRect.width, h: e.contentRect.height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Keep Anthropic / OpenAI / Google centered in the strip;
  // split the rest evenly above and below them.
  const PRIME = ["anthropic", "openai", "google"];
  const ordered = (() => {
    const all = providers.slice(0, MAX_PROVIDERS);
    const primes = PRIME
      .map((k) => all.find((p) => p.toLowerCase().trim() === k))
      .filter((p): p is string => Boolean(p));
    const rest = all.filter((p) => !primes.includes(p));
    const half = Math.floor(rest.length / 2);
    return [...rest.slice(0, half), ...primes, ...rest.slice(half)];
  })();
  const visible = ordered;

  // Lines start at the right edge of the logo strip and end at the tokenmart node.
  const STRIP_X_PCT = 14;    // center of the vertical strip
  const TM_X_PCT = 64;       // tokenmart center
  const TM_Y_PCT = 50;
  const stripX = (size.w * (STRIP_X_PCT + 5)) / 100; // right edge of logo cells
  const tmX = (size.w * TM_X_PCT) / 100;
  const tmY = (size.h * TM_Y_PCT) / 100;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[600px] h-[640px]"
    >
      {/* Curved lines + flowing dots, all inside one SVG so the dots can
          ride the exact paths via <animateMotion><mpath/>. */}
      {size.w > 0 && size.h > 0 && (
        <svg
          aria-hidden
          className="absolute inset-0 pointer-events-none z-10"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
        >
          {visible.map((_, i) => {
            const y = ((i + 0.5) / visible.length) * size.h;
            const d = buildWavyPath(stripX, y, tmX, tmY, i);
            const pathId = `constellation-path-${i}`;
            const dur = 1.8 + (i % 3) * 0.35;
            const dotsPerPath = 3;
            return (
              <g key={i}>
                <path
                  id={pathId}
                  d={d}
                  fill="none"
                  stroke="var(--color-text-muted)"
                  strokeWidth={1}
                  opacity={0.5}
                />
                {Array.from({ length: dotsPerPath }).map((_, k) => {
                  const stagger = (dur / dotsPerPath) * k + (i * 0.13) % dur;
                  const begin = -stagger;
                  return (
                    <circle key={k} r={3.5} fill="var(--pink)" opacity={0}>
                      <animateMotion
                        dur={`${dur}s`}
                        begin={`${begin}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                      >
                        <mpath href={`#${pathId}`} />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0"
                        keyTimes="0;0.08;0.92;1"
                        dur={`${dur}s`}
                        begin={`${begin}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  );
                })}
              </g>
            );
          })}
        </svg>
      )}

      {/* Vertical strip of logos */}
      {visible.map((p, i) => {
        const yPct = ((i + 0.5) / visible.length) * 100;
        return (
          <ProviderLogo
            key={p}
            provider={p}
            xPct={STRIP_X_PCT}
            yPct={yPct}
            index={i}
          />
        );
      })}

      {/* Tokenmart node — only the logo square is centered at (TM_X, TM_Y)
          so the incoming curves converge at the logo's visual center.
          Text floats absolutely below the logo. */}
      <div
        className="absolute pointer-events-none z-20"
        style={{
          left: `${TM_X_PCT}%`,
          top: `${TM_Y_PCT}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="relative">
          <div
            className="rounded-2xl flex items-center justify-center shadow-xl"
            style={{
              width: "clamp(84px, 11vw, 120px)",
              height: "clamp(84px, 11vw, 120px)",
              background: "var(--color-text)",
            }}
            aria-label="TokenMart"
          >
            <InferenceLogo className="w-[54%] h-[54%]" color="#ffffff" />
          </div>

          <div className="absolute left-1/2 top-full -translate-x-1/2 mt-4 flex flex-col items-center whitespace-nowrap">
            <div className="text-2xl md:text-3xl font-bold tracking-tight">
              <span style={{ color: "var(--color-text)" }}>Token</span>
              <span style={{ color: "var(--pink)" }}>Mart</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildWavyPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  seed: number,
): string {
  const dx = x2 - x1;
  const direction = seed % 2 === 0 ? 1 : -1;
  const wobble = direction * (22 + (seed % 3) * 10);
  const cp1x = x1 + dx * 0.35;
  const cp1y = y1 + wobble;
  const cp2x = x1 + dx * 0.65;
  const cp2y = y2 - wobble;
  return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
}

function ProviderLogo({
  provider,
  xPct,
  yPct,
}: {
  provider: string;
  xPct: number;
  yPct: number;
  index: number;
}) {
  const key = provider.toLowerCase().trim();
  const brand = PROVIDER_BRAND[key];

  const size = "clamp(54px, 7vw, 72px)";

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        transform: "translate(-50%, -50%)",
        opacity: 0,
        animation: "fadeIn 0.6s ease 0.15s forwards",
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
        title={provider}
      >
        {brand?.kind === "svg" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/provider-logos/${brand.file}`}
            alt={provider}
            className={`h-[70%] w-[70%] object-contain ${brand.monoDark ? "logo-dark-invert" : ""}`}
            loading="lazy"
          />
        ) : brand?.kind === "wordmark" ? (
          <span
            className="font-bold text-sm md:text-base tracking-tight leading-none"
            style={{ color: brand.color }}
          >
            {brand.text}
          </span>
        ) : (
          <span
            className="font-bold text-base"
            style={{ color: "var(--color-text-muted)" }}
          >
            {provider.trim().charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}
