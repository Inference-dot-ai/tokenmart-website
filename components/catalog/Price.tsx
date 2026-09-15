import type { Headline } from "@/lib/catalog";
import { usd } from "@/lib/format";

/** Rate with the list price struck through beside it when discounted. */
export function RatePair({ price, list, className = "" }: { price?: number; list?: number; className?: string }) {
  if (price === undefined) return <span className="text-faint">-</span>;
  const discounted = list !== undefined && list > price;
  return (
    <span className={`tnum inline-flex items-baseline gap-1.5 whitespace-nowrap ${className}`}>
      <span className="text-ink">{usd(price)}</span>
      {discounted ? (
        <s className="text-[0.85em] text-faint decoration-faint/70">
          <span className="sr-only">list price </span>
          {usd(list)}
        </s>
      ) : null}
    </span>
  );
}

/** The big number on cards: price, unit, struck list price. */
export function HeadlinePrice({ headline, size = "md" }: { headline: Headline | null; size?: "md" | "lg" }) {
  if (!headline) return <p className="text-sm text-muted">Price on request</p>;
  const discounted = headline.list > headline.price;
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span
          className={`tnum font-semibold tracking-tight text-ink ${size === "lg" ? "text-5xl sm:text-6xl" : "text-3xl"}`}
        >
          {usd(headline.price)}
        </span>
        {discounted ? (
          <s className={`tnum text-faint ${size === "lg" ? "text-xl" : "text-base"}`}>
            <span className="sr-only">list price </span>
            {usd(headline.list)}
          </s>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-muted">{headline.unit}</p>
    </div>
  );
}
