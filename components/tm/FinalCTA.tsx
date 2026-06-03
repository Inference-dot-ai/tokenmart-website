"use client";

import { Btn, Sticker } from "./primitives";
import { trackCtaClick, useGetuHref } from "@/lib/attribution";

const MODELS_HREF = "https://console.service-inference.ai/models";

export function FinalCTA() {
  const apiHref = useGetuHref(MODELS_HREF);
  return (
    <section className="tm-finalcta" id="cta">
      <Sticker tone="lime" rot={-9} big deco style={{ position: "absolute", top: 22, left: "clamp(12px,6vw,90px)" }}>
        SAVE ON EVERY TOKEN
      </Sticker>
      <Sticker tone="cyan" rot={8} big deco style={{ position: "absolute", bottom: 30, right: "clamp(12px,6vw,90px)" }}>
        SHIP IN MINUTES
      </Sticker>
      <Sticker tone="pink" rot={-5} deco dhi style={{ position: "absolute", top: "46%", left: "clamp(8px,4vw,70px)" }}>
        ★ MEMBER PRICE
      </Sticker>
      <div className="tm-finalcta-in">
        <div className="tm-bb-eyebrow">OPEN 24/7</div>
        <h2 className="tm-finalcta-h">
          Stop paying <s>retail</s> for AI.
        </h2>
        <p className="tm-finalcta-sub">
          One API key. Every frontier model. Up to 75% off list price, billed to the token. Connect once. Start
          saving immediately.
        </p>
        <div className="tm-hero-ctas center">
          <Btn variant="primary" href={apiHref} onClick={() => trackCtaClick("tm_finalcta")}>
            Get your API key →
          </Btn>
          <Btn variant="ghost" href={apiHref}>
            See all prices
          </Btn>
        </div>
        <div className="tm-finalcta-fine">No commitment · No minimums · Cancel anytime</div>
      </div>
    </section>
  );
}
