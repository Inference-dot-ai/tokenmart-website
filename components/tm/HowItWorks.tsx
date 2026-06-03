/* eslint-disable @next/next/no-img-element */
"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Burst } from "./primitives";
import { TM_V2_MODELS } from "./catalog";

function Step2Network() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useLayoutEffect(() => {
    function compute() {
      const wrap = wrapRef.current;
      const hub = hubRef.current;
      if (!wrap || !hub) return;
      const wr = wrap.getBoundingClientRect();
      const hb = hub.getBoundingClientRect();
      const sx = hb.right - wr.left;
      const sy = hb.top + hb.height / 2 - wr.top;
      const ps = chipRefs.current.filter(Boolean).map((chip) => {
        const cb = (chip as HTMLDivElement).getBoundingClientRect();
        const ex = cb.left - wr.left;
        const ey = cb.top + cb.height / 2 - wr.top;
        const mx = sx + (ex - sx) * 0.55;
        return `M${sx.toFixed(1)} ${sy.toFixed(1)} C ${mx.toFixed(1)} ${sy.toFixed(1)}, ${mx.toFixed(1)} ${ey.toFixed(1)}, ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      });
      setDims({ w: wr.width, h: wr.height });
      setPaths(ps);
    }
    compute();
    const ro = new ResizeObserver(compute);
    if (wrapRef.current) ro.observe(wrapRef.current);
    const imgs = wrapRef.current ? Array.from(wrapRef.current.querySelectorAll("img")) : [];
    imgs.forEach((im) => im.addEventListener("load", compute));
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      imgs.forEach((im) => im.removeEventListener("load", compute));
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div className="tm-v2" ref={wrapRef}>
      <svg className="tm-v2-lines" width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w || 1} ${dims.h || 1}`}>
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
      <div className="tm-v2-hub" ref={hubRef}>
        API
      </div>
      <div className="tm-v2-chips">
        {TM_V2_MODELS.map((m, i) => (
          <div
            className={`tm-v2-chip ${m.more ? "is-more" : ""}`}
            key={m.name}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
          >
            {m.logo ? <img src={m.logo} alt="" /> : <span className="tm-v2-more-dot">+</span>}
            <span>{m.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="tm-how" id="how">
      <div className="tm-flow-wrap">
        <div className="tm-flow-head">
          <div className="tm-flow-kicker">HOW IT WORKS</div>
          <h2 className="tm-flow-title">One key to the whole frontier</h2>
          <p className="tm-flow-sub">From your API key to wholesale savings — four steps, left to right.</p>
        </div>
        <div className="tm-flow">
          {/* STEP 1 — Connect Your API */}
          <div className="tm-stage">
            <div className="tm-stage-visual">
              <span className="tm-stage-num">01</span>
              <div className="tm-v1-wire" />
              <div className="tm-v1-key">
                <span className="tm-v1-keyic">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="8" r="4.5" />
                    <path d="M11 11l8 8M16 16l2-2M18.5 18.5l1.5-1.5" />
                  </svg>
                </span>
                <span className="tm-v1-keytxt">sk-•••7Q2</span>
              </div>
              <div className="tm-v1-socket">
                <span />
              </div>
            </div>
            <div className="tm-stage-txt">
              <h3>Connect Your API</h3>
              <p>Drop one base URL + key into the SDK you already use.</p>
            </div>
          </div>

          {/* STEP 2 — Access Every Model */}
          <div className="tm-stage">
            <div className="tm-stage-visual">
              <span className="tm-stage-num">02</span>
              <Step2Network />
            </div>
            <div className="tm-stage-txt">
              <h3>Access Every Model</h3>
              <p>One endpoint fans out to every frontier model.</p>
            </div>
          </div>

          {/* STEP 3 — Pay As You Go */}
          <div className="tm-stage">
            <div className="tm-stage-visual">
              <span className="tm-stage-num">03</span>
              <div className="tm-v3">
                <div className="tm-v3-num" />
                <div className="tm-v3-label">tokens metered</div>
                <div className="tm-v3-meter">
                  <i />
                </div>
                <div className="tm-v3-bill">$0.0034 so far</div>
              </div>
            </div>
            <div className="tm-stage-txt">
              <h3>Pay As You Go</h3>
              <p>Only pay for the tokens you use. No seats, no minimums, no monthly lock-in.</p>
            </div>
          </div>

          {/* STEP 4 — Save Up To 75% */}
          <div className="tm-stage">
            <div className="tm-stage-visual">
              <span className="tm-stage-num">04</span>
              <div className="tm-v4">
                <Burst pct={75} tone="pink" size={56} style={{ position: "absolute", top: 6, right: 10 }} />
                <div className="tm-v4-bar">
                  <span className="tm-v4-col retail" />
                  <span className="tm-v4-price retail">$10,000</span>
                </div>
                <div className="tm-v4-bar">
                  <span className="tm-v4-col whole" />
                  <span className="tm-v4-price whole">$3,500</span>
                </div>
              </div>
            </div>
            <div className="tm-stage-txt">
              <h3>Save Up To 75%</h3>
              <p>Wholesale rates kick in automatically — bulk volume, bulk discount.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
