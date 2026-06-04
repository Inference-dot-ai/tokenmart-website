"use client";

import { useEffect, useState } from "react";
import { Burst, GlyphChip, Pill, PriceTag, Btn, Sticker } from "./primitives";
import { TM_MODELS, discountOf, type TMModel } from "./catalog";

function ModelCard({ m, apiHref }: { m: TMModel; apiHref: string }) {
  const d = discountOf(m);
  // Badge shows the family's highest discount (marketing "up to X%"); the price
  // row's −% stays tied to the specific representative price shown.
  const badge = m.maxDiscount ?? d;
  const lg = m.size === "lg";
  return (
    <article className={`tm-card sz-${m.size}`} style={{ ["--tint" as string]: m.tint }}>
      <Burst
        pct={badge}
        tone="pink"
        size={lg ? 128 : 110}
        style={{ position: "absolute", top: -24, right: -20, zIndex: 6, color: m.tint }}
      />
      <div className="tm-card-head">
        <GlyphChip glyph={m.glyph} tint={m.tint} size={lg ? 56 : 44} logo={m.logo} />
        <div className="tm-card-id">
          <span className="tm-card-provider">{m.provider}</span>
          <h3 className="tm-card-name">{m.name}</h3>
        </div>
      </div>
      <div className="tm-card-line">{m.line}</div>
      <div className="tm-card-tags">
        {m.tags.map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </div>
      <div className="tm-card-foot">
        <PriceTag retail={m.retail} wholesale={m.wholesale} unit={m.unit} discount={d} sz={lg ? "lg" : "md"} />
        <Btn variant={lg ? "primary" : "ghost"} href={apiHref}>
          Get API ↗
        </Btn>
      </div>
    </article>
  );
}

export function Marketplace({ apiHref }: { apiHref: string }) {
  // First paint / offline fallback = the curated static catalog (also what the
  // SSG HTML contains). Live prices + variant lists are fetched from the
  // same-origin JSON written at build by scripts/build-tm-models.ts.
  const [models, setModels] = useState<TMModel[]>(TM_MODELS);

  useEffect(() => {
    let alive = true;
    fetch("/tm-models.json")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: TMModel[]) => {
        if (alive && Array.isArray(data) && data.length > 0) setModels(data);
      })
      .catch(() => {
        /* keep the static fallback */
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="tm-market" id="market">
      <div className="tm-market-banner">
        <Sticker tone="pink" rot={-6} big deco style={{ position: "absolute", top: -16, left: 24 }}>
          EVERYTHING IN STOCK
        </Sticker>
        <Sticker tone="cyan" rot={7} deco dhi style={{ position: "absolute", top: -12, right: 30 }}>
          HOT-SWAP ANY MODEL
        </Sticker>
        <div className="tm-market-banner-in">
          <div>
            <div className="tm-kicker">AISLE 01 — FRONTIER MODELS</div>
            <h2 className="tm-h2">The Frontier Models Marketplace</h2>
          </div>
          <p className="tm-market-note">
            One API key. Switch models with a string —
            <br />
            no new contracts, no re-platforming.
          </p>
        </div>
      </div>
      <div className="tm-grid">
        {models.map((m) => (
          <ModelCard key={m.id} m={m} apiHref={apiHref} />
        ))}
      </div>
      <div className="tm-shelf-tag">
        ↑ Prices shown per unit · retail = published list price · wholesale = TokenMart member rate
      </div>
    </section>
  );
}
