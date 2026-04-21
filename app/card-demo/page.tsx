"use client";

import { Clock } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";

type SampleModel = {
  name: string;
  provider: string;
  type: string;
  description: string;
  originalPrice: string;
  discountedPrice: string;
  unit: string;
  discountPct: number;
};

const SAMPLES: SampleModel[] = [
  {
    name: "Claude Sonnet 4.6",
    provider: "ANTHROPIC",
    type: "Text Generation",
    description: "Premium balanced Claude for fast, capable answers across production workloads.",
    originalPrice: "$15.00",
    discountedPrice: "$12.75",
    unit: "/1M tokens",
    discountPct: 15,
  },
  {
    name: "Nano Banana 2",
    provider: "GOOGLE",
    type: "Image Generation",
    description: "Upgraded Gemini image model with sharper natural-language control.",
    originalPrice: "$0.05",
    discountedPrice: "$0.04",
    unit: "/img",
    discountPct: 20,
  },
  {
    name: "GPT 5.4",
    provider: "OPENAI",
    type: "Text Generation",
    description: "Most capable GPT-5 line for professional use and reasoning-forward tasks.",
    originalPrice: "$15.00",
    discountedPrice: "$10.50",
    unit: "/1M tokens",
    discountPct: 30,
  },
  {
    name: "Sora 2",
    provider: "OPENAI",
    type: "Video Generation",
    description: "Audio support with watermark removal for studio-grade clips.",
    originalPrice: "$0.142",
    discountedPrice: "$0.085",
    unit: "/s",
    discountPct: 40,
  },
  {
    name: "Suno",
    provider: "SUNO",
    type: "Audio Generation",
    description: "High-quality music generation with lyric control and stem export.",
    originalPrice: "$0.236",
    discountedPrice: "$0.118",
    unit: "/2 tracks",
    discountPct: 50,
  },
];

function pinkBand(pct: number): string {
  // Darker pink = bigger discount. Tiered to keep it readable.
  if (pct >= 40) return "linear-gradient(90deg, #8B004E, #B8005F)"; // deepest
  if (pct >= 25) return "linear-gradient(90deg, #A8005C, #D10076)"; // dark
  if (pct >= 15) return "linear-gradient(90deg, #D10076, #EC3A97)"; // mid (brand pink)
  return "linear-gradient(90deg, #EC3A97, #F78FBF)"; // light
}

const GREEN = "#10b981";

export default function CardDemoPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <Navbar fixed={false} />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Card Variations</h1>
        <p className="text-sm mb-10" style={{ color: "var(--color-text-muted)" }}>
          Same 3 sample models rendered in each variation. Pick one.
        </p>

        <Section title="Variation 1 — Corner ribbon">
          {SAMPLES.map((m) => (
            <V1 key={m.name} m={m} />
          ))}
        </Section>

        <Section title="Variation 2 — Price-forward split (green)">
          {SAMPLES.map((m) => (
            <V2 key={m.name} m={m} />
          ))}
        </Section>

        <Section title="Variation 2a — Pink soft pill">
          {SAMPLES.map((m) => (
            <V2PinkSoft key={m.name} m={m} />
          ))}
        </Section>

        <Section title="Variation 2b — Pink solid pill">
          {SAMPLES.map((m) => (
            <V2PinkSolid key={m.name} m={m} />
          ))}
        </Section>

        <Section title="Variation 2c — Pink tiered (darker = bigger discount)">
          {SAMPLES.map((m) => (
            <V2PinkTiered key={m.name} m={m} />
          ))}
        </Section>

        <Section title="Variation 3 — Hero discount band">
          {SAMPLES.map((m) => (
            <V3 key={m.name} m={m} />
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {children}
      </div>
    </section>
  );
}

function TypePill({ label }: { label: string }) {
  return (
    <span
      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
      style={{
        background: "var(--color-surface)",
        color: "var(--color-text-dim)",
        border: "1px solid var(--color-border)",
      }}
    >
      {label}
    </span>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="model-card overflow-hidden relative"
      style={{
        background: "var(--color-surface-hi)",
        border: "1px solid var(--color-border)",
      }}
    >
      {children}
    </div>
  );
}

function V1({ m }: { m: SampleModel }) {
  return (
    <div
      className="model-card model-card-urgent overflow-hidden relative group"
      style={{
        background: "var(--color-surface-hi)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        className="ribbon absolute top-0 left-0 z-10 px-3 py-1 text-[11px] font-bold tracking-wide rounded-br-lg"
        style={{ background: GREEN, color: "white" }}
      >
        -{m.discountPct}% OFF
      </div>

      <div className="p-5 pt-12 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}
          >
            {m.provider}
          </p>
          <TypePill label={m.type} />
        </div>

        <h3 className="text-lg font-bold mb-3 leading-tight">{m.name}</h3>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--color-text-dim)" }}>
          {m.description}
        </p>

        <div className="h-px w-full mb-4 mt-auto opacity-40" style={{ background: "var(--color-border)" }} />

        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm line-through" style={{ color: "var(--color-text-muted)" }}>
              {m.originalPrice}
              {m.unit}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="deal-price text-2xl font-bold">{m.discountedPrice}</span>
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {m.unit}
              </span>
            </div>
          </div>
          <span
            className="urgency flex items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{ color: "var(--pink)" }}
            aria-label="Limited time"
          >
            <Clock className="w-4 h-4 shake" strokeWidth={2.25} />
          </span>
        </div>
      </div>
    </div>
  );
}

function V2({ m }: { m: SampleModel }) {
  return (
    <CardShell>
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
            {m.provider}
          </p>
          <TypePill label={m.type} />
        </div>
        <h3 className="text-lg font-bold mb-3 leading-tight">{m.name}</h3>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--color-text-dim)" }}>
          {m.description}
        </p>

        <div className="h-px w-full mb-4 mt-auto opacity-40" style={{ background: "var(--color-border)" }} />

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-xs line-through mb-0.5" style={{ color: "var(--color-text-muted)" }}>
              {m.originalPrice}
              {m.unit}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold">{m.discountedPrice}</span>
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {m.unit}
              </span>
            </div>
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-md shrink-0"
            style={{ background: `${GREEN}20`, color: GREEN }}
          >
            -{m.discountPct}% OFF
          </span>
        </div>
      </div>
    </CardShell>
  );
}

function V2Base({
  m,
  pill,
}: {
  m: SampleModel;
  pill: React.ReactNode;
}) {
  return (
    <CardShell>
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
            {m.provider}
          </p>
          <TypePill label={m.type} />
        </div>
        <h3 className="text-lg font-bold mb-3 leading-tight">{m.name}</h3>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--color-text-dim)" }}>
          {m.description}
        </p>

        <div className="h-px w-full mb-4 mt-auto opacity-40" style={{ background: "var(--color-border)" }} />

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-xs line-through mb-0.5" style={{ color: "var(--color-text-muted)" }}>
              {m.originalPrice}
              {m.unit}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold">{m.discountedPrice}</span>
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {m.unit}
              </span>
            </div>
          </div>
          {pill}
        </div>
      </div>
    </CardShell>
  );
}

function V2PinkSoft({ m }: { m: SampleModel }) {
  return (
    <V2Base
      m={m}
      pill={
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-md shrink-0"
          style={{ background: "var(--pink-lo)", color: "var(--pink)" }}
        >
          -{m.discountPct}% OFF
        </span>
      }
    />
  );
}

function V2PinkSolid({ m }: { m: SampleModel }) {
  return (
    <V2Base
      m={m}
      pill={
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-md shrink-0"
          style={{ background: "var(--pink)", color: "white" }}
        >
          -{m.discountPct}% OFF
        </span>
      }
    />
  );
}

function pinkPillTier(pct: number): { bg: string; color: string } {
  if (pct >= 40) return { bg: "#8B004E", color: "white" };
  if (pct >= 25) return { bg: "#D10076", color: "white" };
  if (pct >= 15) return { bg: "rgba(209, 0, 118, 0.18)", color: "#D10076" };
  return { bg: "rgba(209, 0, 118, 0.10)", color: "#D10076" };
}

function V2PinkTiered({ m }: { m: SampleModel }) {
  const { bg, color } = pinkPillTier(m.discountPct);
  return (
    <V2Base
      m={m}
      pill={
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-md shrink-0"
          style={{ background: bg, color }}
        >
          -{m.discountPct}% OFF
        </span>
      }
    />
  );
}

function V3({ m }: { m: SampleModel }) {
  return (
    <CardShell>
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          background: pinkBand(m.discountPct),
          color: "white",
        }}
      >
        <span className="text-sm font-bold tracking-wide">SAVE {m.discountPct}%</span>
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.22)", color: "white" }}
        >
          {m.type}
        </span>
      </div>
      <div className="p-5 flex flex-col h-full">
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>
          {m.provider}
        </p>
        <h3 className="text-lg font-bold mb-3 leading-tight">{m.name}</h3>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--color-text-dim)" }}>
          {m.description}
        </p>

        <div className="h-px w-full mb-4 mt-auto opacity-40" style={{ background: "var(--color-border)" }} />

        <div className="flex flex-col gap-0.5">
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            from{" "}
            <span className="line-through">
              {m.originalPrice}
              {m.unit}
            </span>
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold" style={{ color: "var(--pink)" }}>
              {m.discountedPrice}
            </span>
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {m.unit}
            </span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}
