"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Model, Category } from "@/lib/google-sheets";

const SAVINGS_GREEN = "#10b981";
const COUNTDOWN_MS = 650;

const CATEGORY_LABEL: Record<Category, string> = {
  LLM: "Text Generation",
  Image: "Image Generation",
  Video: "Video Generation",
  Audio: "Audio Generation",
};

type ParsedPrice = { value: number; prefix: string; decimals: number };

function parsePrice(s: string | null): ParsedPrice | null {
  if (!s) return null;
  const m = s.match(/^(\$?)(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const digits = m[2];
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  return { value: parseFloat(digits), prefix: m[1], decimals };
}

export function ModelCard({
  model,
  index = 0,
  hideAsset = false,
  hideProvider = false,
  hideDescription = false,
  featured = false,
}: {
  model: Model;
  index?: number;
  hideAsset?: boolean;
  hideProvider?: boolean;
  hideDescription?: boolean;
  featured?: boolean;
}) {
  const assetUrl = hideAsset ? null : model.assetUrl;
  const hasDiscount = model.discountPct !== null && model.originalPrice !== null;

  const original = hasDiscount ? parsePrice(model.originalPrice) : null;
  const discounted = hasDiscount ? parsePrice(model.price) : null;
  const canAnimate = !!original && !!discounted;

  const [animValue, setAnimValue] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const startCountdown = () => {
    if (!canAnimate) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const from = original!.value;
    const to = discounted!.value;
    const step = (t: number) => {
      const progress = Math.min((t - start) / COUNTDOWN_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimValue(from + (to - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const stopCountdown = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setAnimValue(null);
  };

  const handleMouseEnter = () => {
    startCountdown();
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    stopCountdown();
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  const displayPrice =
    animValue !== null && discounted
      ? `${discounted.prefix}${animValue.toFixed(discounted.decimals)}`
      : model.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.04 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`model-card ${hasDiscount ? "model-card-urgent group" : ""} overflow-hidden relative text-left flex flex-col`}
      style={{
        background: "var(--color-surface-hi)",
        border: "1px solid var(--color-border)",
      }}
    >
      {hasDiscount && !featured && (
        <div
          className="ribbon absolute top-0 left-0 z-10 rounded-br-xl px-3 py-1 text-[11px] font-bold tracking-wide"
          style={{ background: SAVINGS_GREEN, color: "white" }}
        >
          -{model.discountPct}% OFF
        </div>
      )}
      {hasDiscount && featured && (
        <div
          className="absolute top-4 right-5 z-10 px-2.5 py-1 rounded-lg text-lg font-extrabold tracking-tight tabular-nums leading-none"
          style={{ background: "var(--pink)", color: "white" }}
        >
          -{model.discountPct}%
        </div>
      )}

      {assetUrl && (
        <div
          className="aspect-[4/3] w-full overflow-hidden"
          style={{ background: "var(--color-surface)" }}
        >
          {model.assetType === "video" ? (
            <video
              ref={videoRef}
              src={assetUrl}
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={assetUrl}
              alt={model.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      <div className={`p-5 ${hasDiscount && !assetUrl && !featured ? "pt-12" : ""} flex flex-col flex-1 min-h-0`}>
        {!hideProvider && (
          <div className="flex items-center justify-between mb-2">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              {model.provider}
            </p>
            <span
              className="text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-dim)",
                border: "1px solid var(--color-border)",
              }}
            >
              {CATEGORY_LABEL[model.category]}
            </span>
          </div>
        )}

        <h3
          className="text-lg font-bold mb-3 leading-tight"
          style={{ color: "var(--color-text)" }}
        >
          {model.name}
        </h3>

        {!hideDescription && model.description && (
          <p
            className="text-sm leading-relaxed mb-4 line-clamp-2"
            style={{ color: "var(--color-text-dim)" }}
          >
            {model.description}
          </p>
        )}

        <div
          className="h-px w-full mb-4 mt-auto opacity-40"
          style={{ background: "var(--color-border)" }}
        />

        {hasDiscount ? (
          featured ? (
            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    className="text-lg font-extrabold tracking-tight"
                    style={{ color: SAVINGS_GREEN }}
                  >
                    Now
                  </span>
                  <span
                    className="deal-price text-4xl font-extrabold tabular-nums leading-none"
                    style={animValue !== null ? { color: "var(--pink)" } : undefined}
                  >
                    {displayPrice}
                  </span>
                  <span
                    className="strike-anim text-base font-semibold inline-block w-fit"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {model.originalPrice}
                  </span>
                </div>
                {model.unit && (
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {model.unit}
                  </span>
                )}
              </div>
              <span
                className="urgency flex items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 shrink-0"
                style={{ color: "var(--pink)" }}
                aria-label="Limited time"
              >
                <Clock className="w-5 h-5 shake" strokeWidth={2.25} />
              </span>
            </div>
          ) : (
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-0.5">
                <span
                  className="strike-anim text-sm inline-block w-fit"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {model.originalPrice}
                  {model.unit}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="deal-price text-2xl font-bold tabular-nums"
                    style={animValue !== null ? { color: "var(--pink)" } : undefined}
                  >
                    {displayPrice}
                  </span>
                  {model.unit && (
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {model.unit}
                    </span>
                  )}
                </div>
              </div>
              <span
                className="urgency flex items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{ color: "var(--pink)" }}
                aria-label="Limited time"
              >
                <Clock className="w-4 h-4 shake" strokeWidth={2.25} />
              </span>
            </div>
          )
        ) : (
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span
              className={`shrink-0 ${featured ? "text-sm font-semibold" : "text-xs"}`}
              style={{ color: "var(--color-text-muted)" }}
            >
              from
            </span>
            <span
              className={`${featured ? "text-4xl font-extrabold leading-none" : "text-2xl font-bold"} truncate`}
              style={{ color: "var(--color-text)" }}
            >
              {model.price}
            </span>
            {model.unit && (
              <span
                className={`shrink-0 ${featured ? "text-sm" : "text-sm"}`}
                style={{ color: "var(--color-text-muted)" }}
              >
                {model.unit}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
