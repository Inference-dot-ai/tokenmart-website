/* eslint-disable @next/next/no-img-element */
// Warehouse merchandising primitives — ported from the prototype's tm-data.jsx.
// Presentational only (no hooks) so they render in both server and client trees.
import type { CSSProperties, ReactNode } from "react";

/** Allow CSS custom properties in inline style objects. */
type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

export type Tone = "pink" | "lime" | "cyan";

export const fmt = (n: number): string => n.toFixed(2);

export function Sticker({
  children,
  tone = "pink",
  rot = -8,
  style,
  big,
  deco,
  dhi,
}: {
  children: ReactNode;
  tone?: Tone;
  rot?: number;
  style?: CSSProperties;
  big?: boolean;
  deco?: boolean;
  dhi?: boolean;
}) {
  return (
    <span
      className={`tm-sticker tone-${tone}${big ? " big" : ""}${deco ? " deco" : ""}${dhi ? " deco-hi" : ""}`}
      style={{ "--rot": `${rot}deg`, ...style } as CSSVars}
    >
      {children}
    </span>
  );
}

/** Starburst “% OFF” badge. */
export function Burst({
  pct,
  size = 86,
  tone = "pink",
  style,
}: {
  pct: number;
  size?: number;
  tone?: Tone;
  style?: CSSProperties;
}) {
  const pts: string[] = [];
  const spikes = 14;
  const cx = 50;
  const cy = 50;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? 50 : 41;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    // Round to a fixed precision: Math.cos/Math.sin can differ in their last
    // digits between the Node (server) and browser (client) engines, which
    // makes the SSR-rendered `points` string mismatch on hydration. Rounding
    // far above that divergence guarantees identical server/client output.
    pts.push(`${(cx + r * Math.cos(a)).toFixed(3)},${(cy + r * Math.sin(a)).toFixed(3)}`);
  }
  return (
    <span className={`tm-burst tone-${tone}`} style={{ width: size, height: size, fontSize: size, ...style }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <polygon points={pts.join(" ")} />
      </svg>
      <span className="tm-burst-txt">
        <b>{pct}%</b>
        <em>OFF</em>
      </span>
    </span>
  );
}

export function CornerBadge({ children, tone = "pink" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`tm-cbadge tone-${tone}`}>{children}</span>;
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className="tm-pill">{children}</span>;
}

export function Btn({
  children,
  variant = "primary",
  as = "a",
  href = "#",
  onClick,
  full,
}: {
  children: ReactNode;
  variant?: "primary" | "ghost";
  as?: "a" | "button";
  href?: string;
  onClick?: () => void;
  full?: boolean;
}) {
  const cls = `tm-btn v-${variant}${full ? " full" : ""}`;
  if (as === "button") {
    return (
      <button type="button" className={cls} onClick={onClick}>
        {children}
      </button>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <a
      className={cls}
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

export function GlyphChip({
  glyph,
  tint,
  size = 46,
  logo,
}: {
  glyph?: string;
  tint: string;
  size?: number;
  logo?: string;
}) {
  return (
    <span
      className="tm-glyph"
      style={{
        width: size,
        height: size,
        color: tint,
        borderColor: tint + "55",
        background: logo
          ? "transparent"
          : `radial-gradient(circle at 30% 25%, ${tint}26, transparent 70%), #0d0d10`,
        fontSize: size * 0.5,
        overflow: "hidden",
      }}
    >
      {logo ? (
        <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      ) : (
        glyph
      )}
    </span>
  );
}

/** Retail → wholesale price block. */
export function PriceTag({
  retail,
  wholesale,
  unit,
  discount,
  align = "left",
  sz = "md",
}: {
  retail: number;
  wholesale: number;
  unit: string;
  discount: number;
  align?: "left" | "right" | "center";
  sz?: "sm" | "md" | "lg";
}) {
  return (
    <div className={`tm-price sz-${sz}`} style={{ textAlign: align }}>
      <div className="tm-price-row">
        <span className="tm-retail">${fmt(retail)}</span>
        <span className="tm-disc">−{discount}%</span>
      </div>
      <div className="tm-whole">
        <span className="tm-cur">$</span>
        {fmt(wholesale)}
        <span className="tm-unit">{unit}</span>
      </div>
    </div>
  );
}

export function SectionLabel({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <div className="tm-seclabel">
      {kicker && <div className="tm-kicker">{kicker}</div>}
      <h2 className="tm-h2">{title}</h2>
      {sub && <p className="tm-sub">{sub}</p>}
    </div>
  );
}
