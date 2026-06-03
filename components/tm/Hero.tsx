/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef } from "react";
import { HERO_STACK } from "./catalog";
import { trackCtaClick, useGetuHref } from "@/lib/attribution";

const MODELS_HREF = "https://console.service-inference.ai/models";

function HIcon({ name, size = 26 }: { name: "wallet" | "handshake"; size?: number }) {
  const paths = {
    wallet: (
      <g>
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
      </g>
    ),
    handshake: (
      <g>
        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25H21" />
        <path d="m21 3 1 11h-2" />
        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
        <path d="M3 4h8" />
      </g>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

export function Hero() {
  const apiHref = useGetuHref(MODELS_HREF);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = stackRef.current;
    if (!wrap) return;
    const track = wrap.querySelector<HTMLElement>(".tm-stack-track");
    const measure = () => {
      if (!track) return;
      const cs = getComputedStyle(track);
      const gap = parseFloat(cs.columnGap || cs.gap) || 0;
      const kids = Array.from(track.children) as HTMLElement[];
      let need = 0;
      kids.forEach((k) => {
        need += k.getBoundingClientRect().width;
      });
      need += gap * Math.max(0, kids.length - 1);
      const should = need > wrap.clientWidth + 1;
      if (should !== wrap.classList.contains("is-marquee")) {
        wrap.classList.toggle("is-marquee", should);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener("resize", measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    wrap.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", measure, { once: true });
    });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="tm-hero hero-promo" id="top">
      <div className="tm-hero-grid">
        <div className="tm-hero-left">
          <div className="tm-bb-eyebrow">WHOLESALE PRICES ON FRONTIER AI</div>
          <h1 className="tm-save">
            <span className="tm-save-up">SAVE UP TO</span>
            <span className="tm-save-big">
              75<span className="tm-pctsign">%</span>
            </span>
            <span className="tm-save-on">ON AI TOKENS</span>
          </h1>
          <p className="tm-hero-sub">
            Wholesale token pricing across <b>every frontier model.</b> The easiest way to buy AI
            compute: one key, flexible usage, zero commitment.
          </p>
        </div>

        <div className="tm-hero-right">
          <div className="tm-coupons">
            <article className="tm-coupon lime">
              <div className="tm-coupon-top">
                <span className="tm-coupon-icon">
                  <HIcon name="wallet" size={26} />
                </span>
                <h3 className="tm-coupon-title">
                  PAY AS
                  <br />
                  YOU GO
                </h3>
              </div>
              <p className="tm-coupon-desc">Only pay for what you use. No subscriptions.</p>
            </article>
            <article className="tm-coupon cyan">
              <div className="tm-coupon-top">
                <span className="tm-coupon-icon">
                  <HIcon name="handshake" size={26} />
                </span>
                <h3 className="tm-coupon-title">
                  NO
                  <br />
                  COMMITMENT
                </h3>
              </div>
              <p className="tm-coupon-desc">No contracts. No minimums. Cancel anytime.</p>
            </article>
          </div>

          <a
            className="tm-cta-fullbtn"
            href={apiHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCtaClick("tm_hero")}
          >
            Get Started
          </a>
        </div>
      </div>

      <div className="tm-stackbar">
        <span className="tm-stack-label">Works with your stack</span>
        <div className="tm-stack-logos" ref={stackRef}>
          <div className="tm-stack-marquee">
            <div className="tm-stack-track">
              {HERO_STACK.map((s) => (
                <span className="tm-stack-logo" key={s.name}>
                  <img className="tm-stack-logo-img" src={s.logo} alt={s.name} />
                  {s.name}
                </span>
              ))}
            </div>
            <div className="tm-stack-track dup" aria-hidden="true">
              {HERO_STACK.map((s) => (
                <span className="tm-stack-logo" key={s.name + "-dup"}>
                  <img className="tm-stack-logo-img" src={s.logo} alt="" />
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
