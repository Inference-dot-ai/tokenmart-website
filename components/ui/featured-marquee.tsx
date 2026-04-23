"use client";

import { useEffect, useRef } from "react";
import { ModelCard } from "@/components/ui/model-card";
import type { Model } from "@/lib/google-sheets";

const CARD_WIDTH_PX = 300;
const GAP_PX = 20;
const PX_PER_SECOND = 60;

export function FeaturedMarquee({ models }: { models: Model[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (models.length === 0) return;
    const container = scrollRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let lastTime = performance.now();
    const step = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;
      if (!pausedRef.current) {
        container.scrollLeft += (PX_PER_SECOND * dt) / 1000;
      }
      const firstCopyWidth = track.scrollWidth / 2;
      if (firstCopyWidth > 0) {
        if (container.scrollLeft >= firstCopyWidth) {
          container.scrollLeft -= firstCopyWidth;
        } else if (container.scrollLeft < 0) {
          container.scrollLeft += firstCopyWidth;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [models.length]);

  if (models.length === 0) return null;

  const track = [...models, ...models];

  return (
    <div className="relative w-full">
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24"
        style={{
          background:
            "linear-gradient(to right, var(--color-bg) 0%, var(--pink-lo) 55%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24"
        style={{
          background:
            "linear-gradient(to left, var(--color-bg) 0%, var(--pink-lo) 55%, transparent 100%)",
        }}
      />

      <div
        ref={scrollRef}
        className="featured-marquee-scroll overflow-x-auto overflow-y-hidden"
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
      >
        <div
          ref={trackRef}
          className="flex w-max"
          style={{ gap: `${GAP_PX}px` }}
        >
          {track.map((m, i) => (
            <div
              key={`${i}|${m.category}|${m.provider}|${m.name}`}
              className="shrink-0"
              style={{ width: `${CARD_WIDTH_PX}px` }}
              aria-hidden={i >= models.length}
            >
              <ModelCard
                model={m}
                index={i % models.length}
                hideAsset
                hideProvider
                hideDescription
                featured
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .featured-marquee-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .featured-marquee-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
