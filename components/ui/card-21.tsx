"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturedModelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string | null;
  assetType?: "image" | "video" | null;
  modelName: string;
  price: string;
  unit?: string;
  originalPrice?: string | null;
  discountPct?: number | null;
  href: string;
  themeColor: string;
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function fallbackBackground(seed: string): string {
  const h = hashString(seed);
  const hue = h % 360;
  const x = 20 + (h % 60);
  const y = 20 + ((h >> 3) % 60);
  return [
    `radial-gradient(circle at ${x}% ${y}%, hsl(${hue}, 70%, 35%) 0%, transparent 55%)`,
    `linear-gradient(135deg, hsl(${(hue + 30) % 360}, 60%, 18%), hsl(${(hue + 90) % 360}, 55%, 10%))`,
  ].join(", ");
}

const FeaturedModelCard = React.forwardRef<HTMLDivElement, FeaturedModelCardProps>(
  (
    {
      className,
      imageUrl,
      assetType,
      modelName,
      price,
      unit,
      originalPrice,
      discountPct,
      href,
      themeColor,
      ...props
    },
    ref
  ) => {
    const hasVideo = !!imageUrl && assetType === "video";
    const hasImage = !!imageUrl && assetType === "image";

    return (
      <div
        ref={ref}
        style={
          {
            "--theme-color": themeColor,
          } as React.CSSProperties
        }
        className={cn("group featured-strike-host w-full h-full", className)}
        {...props}
      >
        <a
          href={href}
          className="relative block w-full h-full rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.6)]"
          aria-label={`Explore ${modelName}`}
          style={{
            boxShadow: "0 0 40px -15px hsl(var(--theme-color) / 0.5)",
          }}
        >
          {/* Background: video if asset is video, else image */}
          {hasVideo ? (
            <video
              src={imageUrl!}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
          ) : hasImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-110"
              style={{ backgroundImage: fallbackBackground(modelName) }}
            />
          )}

          {/* Themed gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, hsl(var(--theme-color) / 0.7), hsl(var(--theme-color) / 0.4) 30%, transparent 60%)",
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col justify-between h-full p-6 text-white">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-bold tracking-tight leading-tight text-left">
                {modelName}
              </h3>
              {discountPct ? (
                <span
                  className="shrink-0 origin-top-right px-3.5 py-1.5 rounded-md text-xl font-extrabold tracking-tight tabular-nums leading-none text-white shadow-md transition-transform duration-300 ease-out group-hover:scale-[1.6] group-hover:-rotate-12 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
                  style={{ background: "var(--pink)" }}
                >
                  -{discountPct}%
                </span>
              ) : null}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold tabular-nums">{price}</span>
                {unit && <span className="text-sm text-white/80">{unit}</span>}
                {originalPrice && (
                  <span className="strike-anim-xl text-2xl font-extrabold tabular-nums text-white/60 inline-block w-fit">
                    {originalPrice}
                  </span>
                )}
              </div>

              {/* Get API */}
              <div className="mt-8 flex items-center justify-between bg-white/80 backdrop-blur-md border border-white/60 rounded-lg px-4 py-3 text-neutral-900 transition-all duration-300 group-hover:bg-white/95 group-hover:border-white/80">
                <span className="text-sm font-semibold tracking-wide">Get API</span>
                <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </a>
      </div>
    );
  }
);
FeaturedModelCard.displayName = "FeaturedModelCard";

export { FeaturedModelCard };
