"use client";

import { useEffect, useRef, useState } from "react";
import type { Model } from "@/lib/google-sheets";
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
  "alibaba / qwen": { kind: "svg",      file: "alibabacloud.svg" },
  "moonshot ai":    { kind: "wordmark", text: "Kimi",     color: "#1E1E2E" },
  "z.ai":           { kind: "wordmark", text: "Z.AI",     color: "#0A66F5" },
  minimax:          { kind: "wordmark", text: "MiniMax",  color: "#FF5A1F" },
  "kling ai":       { kind: "wordmark", text: "Kling",    color: "#111827" },
  fishaudio:        { kind: "wordmark", text: "Fish",     color: "#3B82F6" },
};

const MAX_PROVIDERS = 12;

export function ProvidersConstellation() {
  const [providers, setProviders] = useState<string[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/models")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Model[]) => {
        const seen = new Set<string>();
        const list: string[] = [];
        for (const m of data) {
          const p = (m.provider || "").trim();
          if (p && !seen.has(p)) {
            seen.add(p);
            list.push(p);
          }
        }
        setProviders(list);
      })
      .catch(() => {});
  }, []);

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
  const providerCount = providers.length || MAX_PROVIDERS;

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
      {/* Curved lines: strip → tokenmart */}
      {size.w > 0 && size.h > 0 && (
        <svg
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
        >
          {visible.map((_, i) => {
            const y = ((i + 0.5) / visible.length) * size.h;
            const d = buildWavyPath(stripX, y, tmX, tmY, i);
            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth={1}
                opacity={0.75}
              />
            );
          })}
        </svg>
      )}

      {/* Flowing dots along each path */}
      {size.w > 0 &&
        size.h > 0 &&
        visible.map((_, i) => {
          const y = ((i + 0.5) / visible.length) * size.h;
          const d = buildWavyPath(stripX, y, tmX, tmY, i);
          const dur = 3.6 + (i % 3) * 0.7;
          const delay = (i * 0.32) % 2.4;
          return (
            <div
              key={`dot-${i}`}
              aria-hidden
              className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full pointer-events-none z-10"
              style={{
                background: "var(--pink)",
                boxShadow: "0 0 10px var(--pink-glow)",
                offsetPath: `path("${d}")`,
                offsetDistance: "0%",
                animation: `flow-dot ${dur}s linear ${delay}s infinite`,
              }}
            />
          );
        })}

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
        className="absolute pointer-events-none"
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
            aria-label="tokenmart"
          >
            <InferenceLogo className="w-[54%] h-[54%]" color="#ffffff" />
          </div>

          <div className="absolute left-1/2 top-full -translate-x-1/2 mt-4 flex flex-col items-center gap-2 whitespace-nowrap">
            <div
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: "var(--color-text)" }}
            >
              tokenmart
            </div>
            <div
              className="text-xs md:text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              {providerCount}+ providers · one platform
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
  index,
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
        animation: `fadeIn 0.6s ease ${0.15 + index * 0.06}s forwards`,
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
