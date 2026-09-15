import { RatePair } from "@/components/catalog/Price";
import type { CatalogModel, UnitRate } from "@/lib/catalog";
import { unitLabel, unitScale } from "@/lib/units";
import { tokensShort, usd } from "@/lib/format";

function prettyBucket(key: string): string {
  return key
    .replace(/_no_ref$/, ", text only")
    .replace(/_with_ref$/, ", with reference")
    .replace(/^le_/, "up to ")
    .replace(/_/g, " ");
}

function UnitBlock({ unit, list }: { unit: UnitRate; list?: UnitRate }) {
  const k = unitScale(unit.metric);
  const entries = unit.byPrices ? Object.entries(unit.byPrices) : [];
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm text-muted first-letter:uppercase">{unitLabel(unit.metric).replace(/^per /, "Per ")}</span>
        <RatePair price={unit.price * k} list={list ? list.price * k : undefined} className="text-sm" />
      </div>
      {entries.length > 0 ? (
        <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1.5 rounded-lg bg-surface-2 p-3 sm:grid-cols-2">
          {entries.map(([bucket, price]) => (
            <div key={bucket} className="flex items-baseline justify-between gap-3 text-[13px]">
              <dt className="text-muted">{prettyBucket(bucket)}</dt>
              <dd>
                <RatePair price={price * k} list={list?.byPrices?.[bucket] !== undefined ? list.byPrices[bucket] * k : undefined} />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

/** Every published rate for a model, straight from the catalog. */
export function RateDetails({ model }: { model: CatalogModel }) {
  const p = model.price;
  if (!p) return <p className="text-sm text-muted">This model is priced on request. Contact us for a quote.</p>;
  const l = model.list;
  const t = p.tokens;
  const lt = l?.tokens;

  const tokenRows = t
    ? [
        { label: "Input tokens", price: t.input, list: lt?.input },
        { label: "Output tokens", price: t.output, list: lt?.output },
        { label: "Cache read", price: t.cacheRead, list: lt?.cacheRead },
        { label: "Cache write", price: t.cacheWrite, list: lt?.cacheWrite },
        { label: "Image input tokens", price: t.imageInput, list: lt?.imageInput },
        { label: "Image output tokens", price: t.imageOutput, list: lt?.imageOutput },
        { label: "Video output tokens", price: t.videoOutput, list: lt?.videoOutput },
      ].filter((r) => r.price !== undefined && !(r.label === "Output tokens" && r.price === 0 && t.imageOutput !== undefined))
    : [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {tokenRows.length > 0 ? (
        <div>
          <p className="text-xs font-medium text-faint">Per 1M tokens</p>
          <dl className="mt-2 space-y-2">
            {tokenRows.map((r) => (
              <div key={r.label} className="flex items-baseline justify-between gap-3">
                <dt className="text-sm text-muted">{r.label}</dt>
                <dd>
                  <RatePair price={r.price} list={r.list} className="text-sm" />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {p.contextBands && p.contextBands.length > 1 ? (
        <div>
          <p className="text-xs font-medium text-faint">Long-context pricing, per 1M tokens</p>
          <dl className="mt-2 space-y-2">
            {p.contextBands.map((b, i) => {
              const prev = p.contextBands![i - 1]?.upTo;
              const label =
                b.upTo !== undefined ? `Prompts up to ${tokensShort(b.upTo)}` : `Prompts over ${tokensShort(prev ?? 0)}`;
              const lb = l?.contextBands?.[i];
              return (
                <div key={label} className="flex items-baseline justify-between gap-3">
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd className="tnum text-sm text-ink">
                    {usd(b.input)} in, {usd(b.output)} out
                    {lb && lb.output > b.output ? <s className="ml-2 text-faint">{usd(lb.output)}</s> : null}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ) : null}

      {p.units && p.units.length > 0 ? (
        <div className="space-y-4 md:col-span-2">
          {p.units.map((u, i) => (
            <UnitBlock key={`${u.metric}-${i}`} unit={u} list={l?.units?.find((x) => x.metric === u.metric)} />
          ))}
        </div>
      ) : null}

      {p.perRequest !== undefined ? (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-muted">Per request</span>
          <RatePair price={p.perRequest} list={l?.perRequest} className="text-sm" />
        </div>
      ) : null}
    </div>
  );
}
