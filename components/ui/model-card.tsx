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
}: {
  model: Model;
  index?: number;
}) {
  const hasDiscount = model.discountPct !== null && model.originalPrice !== null;

  const original = hasDiscount ? parsePrice(model.originalPrice) : null;
  const discounted = hasDiscount ? parsePrice(model.price) : null;
  const canAnimate = !!original && !!discounted;

  const [animValue, setAnimValue] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);

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

  const displayPrice =
    animValue !== null && discounted
      ? `${discounted.prefix}${animValue.toFixed(discounted.decimals)}`
      : model.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.04 }}
      onMouseEnter={startCountdown}
      onMouseLeave={stopCountdown}
      className={`model-card ${hasDiscount ? "model-card-urgent group" : ""} overflow-hidden relative text-left`}
      style={{
        background: "var(--color-surface-hi)",
        border: "1px solid var(--color-border)",
      }}
    >
      {hasDiscount && (
        <div
          className="ribbon absolute top-0 left-0 z-10 px-3 py-1 text-[11px] font-bold tracking-wide rounded-br-lg"
          style={{ background: SAVINGS_GREEN, color: "white" }}
        >
          -{model.discountPct}% OFF
        </div>
      )}

      <div className={`p-5 ${hasDiscount ? "pt-12" : ""} flex flex-col h-full`}>
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

        <h3
          className="text-lg font-bold mb-3 leading-tight"
          style={{ color: "var(--color-text)" }}
        >
          {model.name}
        </h3>

        {model.description && (
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
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-0.5">
              <span
                className="text-sm line-through"
                style={{ color: "var(--color-text-muted)" }}
              >
                {model.originalPrice}
                {model.unit}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="deal-price text-2xl font-bold tabular-nums">
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
        ) : (
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span
              className="text-xs shrink-0"
              style={{ color: "var(--color-text-muted)" }}
            >
              from
            </span>
            <span
              className="text-2xl font-bold truncate"
              style={{ color: "var(--color-text)" }}
            >
              {model.price}
            </span>
            {model.unit && (
              <span
                className="text-sm shrink-0"
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
