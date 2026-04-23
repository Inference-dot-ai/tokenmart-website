"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Model } from "@/lib/google-sheets";

type Anchor = { x: number; y: number; rotation: number };

// Positioned around the headline — cards must stay out of the central text band
// (roughly ~25–75% x, ~25–70% y). Top/bottom rows pushed further apart,
// side anchors pushed outward so the middle row clears the headline.
// Cards ring the title — top and bottom strips only, never crossing the
// central vertical band (~y: 20-80%) where the headline, subtext, and CTAs live.
const PRIMARY_ANCHORS: Anchor[] = [
  // Left column — flanks the title on the left
  { x: 15, y: 12, rotation: -7 },
  { x: 17, y: 50, rotation: 4 },
  { x: 15, y: 88, rotation: -3 },
  // Right column — flanks the title on the right
  { x: 85, y: 10, rotation: 6 },
  { x: 83, y: 52, rotation: -5 },
  { x: 85, y: 86, rotation: 5 },
];

const BONUS_ANCHORS: Anchor[] = [
  { x: 17, y: 30, rotation: -2 },
  { x: 83, y: 28, rotation: 3 },
  { x: 17, y: 70, rotation: -6 },
];

const REPEL_RADIUS = 170;
const REPEL_STRENGTH = 55;

export function FloatingModelCards() {
  const [models, setModels] = useState<Model[]>([]);
  const [hovered, setHovered] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  useEffect(() => {
    fetch("/api/models")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Model[]) => {
        const discounted = data.filter((m) => m.discountPct !== null);
        // One model per provider first, then fill remaining slots
        // so we don't end up with six Claudes on screen.
        const byProvider = new Map<string, Model>();
        for (const m of discounted) {
          if (!byProvider.has(m.provider)) byProvider.set(m.provider, m);
        }
        const oneEach = Array.from(byProvider.values());
        const taken = new Set(oneEach);
        const leftovers = discounted.filter((m) => !taken.has(m));
        setModels([...oneEach, ...leftovers].slice(0, 9));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ w: width, h: height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
      const inside =
        x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      setHovered(inside);
    };
    const onLeave = () => {
      mouseX.set(-9999);
      mouseY.set(-9999);
      setHovered(false);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY]);

  const primary = models.slice(0, PRIMARY_ANCHORS.length);
  const bonus = models.slice(
    PRIMARY_ANCHORS.length,
    PRIMARY_ANCHORS.length + BONUS_ANCHORS.length,
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden md:block overflow-visible"
    >
      {primary.map((model, i) => (
        <FloatingCard
          key={`${model.provider}|${model.name}`}
          model={model}
          anchor={PRIMARY_ANCHORS[i]}
          seed={i}
          mouseX={mouseX}
          mouseY={mouseY}
          size={size}
        />
      ))}
      <AnimatePresence>
        {hovered &&
          bonus.map((model, i) => (
            <FloatingCard
              key={`bonus-${model.provider}|${model.name}`}
              model={model}
              anchor={BONUS_ANCHORS[i]}
              seed={i + PRIMARY_ANCHORS.length}
              mouseX={mouseX}
              mouseY={mouseY}
              size={size}
              isBonus
            />
          ))}
      </AnimatePresence>
    </div>
  );
}

function FloatingCard({
  model,
  anchor,
  seed,
  mouseX,
  mouseY,
  size,
  isBonus = false,
}: {
  model: Model;
  anchor: Anchor;
  seed: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  size: { w: number; h: number };
  isBonus?: boolean;
}) {
  const driftX = 10 + ((seed * 7) % 12);
  const driftY = 8 + ((seed * 11) % 14);
  const driftDuration = 6 + (seed % 4) * 0.9;

  const cardX = (anchor.x / 100) * size.w;
  const cardY = (anchor.y / 100) * size.h;

  const repelX = useTransform([mouseX, mouseY], (latest) => {
    const [cx, cy] = latest as number[];
    const dx = cardX - cx;
    const dy = cardY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > REPEL_RADIUS || dist === 0) return 0;
    const strength = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
    return (dx / dist) * strength;
  });
  const repelY = useTransform([mouseX, mouseY], (latest) => {
    const [cx, cy] = latest as number[];
    const dx = cardX - cx;
    const dy = cardY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > REPEL_RADIUS || dist === 0) return 0;
    const strength = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
    return (dy / dist) * strength;
  });
  const sx = useSpring(repelX, { stiffness: 170, damping: 18, mass: 0.6 });
  const sy = useSpring(repelY, { stiffness: 170, damping: 18, mass: 0.6 });

  return (
    <div
      className="absolute"
      style={{ left: `${anchor.x}%`, top: `${anchor.y}%` }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, scale: isBonus ? 0.7 : 0.9, y: isBonus ? -220 : -560 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={
            isBonus
              ? { type: "spring", stiffness: 220, damping: 12, mass: 0.7 }
              : {
                  type: "spring",
                  stiffness: 120,
                  damping: 9,
                  mass: 0.9,
                  delay: 0.35 + Math.floor(seed / 2) * 0.38,
                }
          }
        >
          <motion.div
            animate={{
              x: [0, driftX, -driftX * 0.5, driftX * 0.8, 0],
              y: [0, -driftY, driftY * 0.6, -driftY * 0.3, 0],
              rotate: [
                anchor.rotation - 2,
                anchor.rotation + 2,
                anchor.rotation - 1,
                anchor.rotation + 1.5,
                anchor.rotation - 2,
              ],
            }}
            transition={{
              duration: driftDuration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div style={{ x: sx, y: sy }}>
              <Pill model={model} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

type Brand = {
  src: string;
  bg: string;
  multicolor?: boolean;
};

// Keys must be lowercased/trimmed to match `provider.toLowerCase().trim()`.
// Aliases handle common variations from the Google Sheet provider column.
const PROVIDER_BRAND: Record<string, Brand> = {
  anthropic:       { src: "/provider-logos/anthropic.svg",    bg: "#D97757" },
  openai:          { src: "/provider-logos/openai.svg",       bg: "#000000" },
  google:          { src: "/provider-logos/google.svg",       bg: "#FFFFFF", multicolor: true },
  deepseek:        { src: "/provider-logos/deepseek.svg",     bg: "#4D6BFE" },
  bytedance:       { src: "/provider-logos/bytedance.svg",    bg: "#3C6FF9" },
  xai:             { src: "/provider-logos/x.svg",            bg: "#111111" },
  "x.ai":          { src: "/provider-logos/x.svg",            bg: "#111111" },
  x:               { src: "/provider-logos/x.svg",            bg: "#111111" },
  alibaba:         { src: "/provider-logos/alibabacloud.svg", bg: "#FF6A00" },
  alibabacloud:    { src: "/provider-logos/alibabacloud.svg", bg: "#FF6A00" },
  qwen:            { src: "/provider-logos/alibabacloud.svg", bg: "#FF6A00" },
  "z.ai":          { src: "/provider-logos/zai.svg",          bg: "#FFFFFF", multicolor: true },
  zai:             { src: "/provider-logos/zai.svg",          bg: "#FFFFFF", multicolor: true },
  zhipu:           { src: "/provider-logos/zai.svg",          bg: "#FFFFFF", multicolor: true },
  "zhipu ai":      { src: "/provider-logos/zai.svg",          bg: "#FFFFFF", multicolor: true },
  glm:             { src: "/provider-logos/zai.svg",          bg: "#FFFFFF", multicolor: true },
  meta:            { src: "https://cdn.simpleicons.org/meta/FFFFFF",       bg: "#0866FF", multicolor: true },
  mistral:         { src: "https://cdn.simpleicons.org/mistralai/FFFFFF",  bg: "#FA520F", multicolor: true },
  mistralai:       { src: "https://cdn.simpleicons.org/mistralai/FFFFFF",  bg: "#FA520F", multicolor: true },
  "mistral ai":    { src: "https://cdn.simpleicons.org/mistralai/FFFFFF",  bg: "#FA520F", multicolor: true },
  nvidia:          { src: "https://cdn.simpleicons.org/nvidia/FFFFFF",     bg: "#76B900", multicolor: true },
  perplexity:      { src: "https://cdn.simpleicons.org/perplexity/FFFFFF", bg: "#1F6F7B", multicolor: true },
};

function Pill({ model }: { model: Model }) {
  const key = (model.provider || "").toLowerCase().trim();
  const brand = PROVIDER_BRAND[key];
  const initial = (model.provider || model.name).trim().charAt(0).toUpperCase();
  const isLightBg = brand?.bg === "#FFFFFF";
  const discount = model.discountPct ?? 0;

  return (
    <div
      className="relative w-56 rounded-2xl px-3.5 py-2.5 flex items-center gap-3 overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.55)",
        backdropFilter: "blur(14px) saturate(180%)",
        WebkitBackdropFilter: "blur(14px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.7)",
        boxShadow:
          "0 10px 30px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
      }}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold text-white"
        style={{
          background: brand?.bg ?? "#6B7280",
          border: isLightBg ? "1px solid var(--color-border)" : undefined,
        }}
      >
        {brand ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.src}
            alt=""
            className="h-4 w-4"
            loading="lazy"
            style={
              brand.multicolor
                ? undefined
                : { filter: "brightness(0) invert(1)" }
            }
          />
        ) : (
          initial
        )}
      </span>

      <div
        className="min-w-0 flex-1 text-[13px] font-bold leading-tight truncate"
        style={{ color: "var(--color-text)" }}
      >
        {model.name}
      </div>

      <div
        className="shrink-0 font-extrabold leading-none tracking-tight select-none text-2xl"
        style={{ color: "var(--pink)" }}
      >
        -{discount}%
      </div>
    </div>
  );
}
