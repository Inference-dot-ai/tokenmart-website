"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, ArrowRight, Zap, DollarSign, Shield } from "lucide-react";
import { ButtonCta } from "@/components/ui/button-shiny";
import { HeroSection } from "@/components/ui/hero-section-shadcnui";
import { GlowCard } from "@/components/ui/spotlight-card";
import { InferenceLogo } from "@/components/ui/inference-logo";
import { DottedSurface } from "@/components/ui/dotted-surface";

const NAV_LINKS = ["Models", "Pricing", "Docs", "API"];

const TABS = ["Tokens / AI Models", "GPUs / Hardware"];

const USE_CASES = [
  "Select use case",
  "Chatbot",
  "Code Generation",
  "Summarization",
  "Embeddings",
  "Image Generation",
  "Vision",
];

const USAGE_LEVELS = [
  "Expected usage",
  "< 1M tokens/day",
  "1M–10M tokens/day",
  "10M–100M tokens/day",
  "> 100M tokens/day",
];

const SUGGESTION_PILLS = [
  "GPT-4o mini",
  "Claude 3.5 Sonnet",
  "Llama 3.3 70B",
  "Gemini 1.5 Flash",
  "Mistral Large",
  "DeepSeek V3",
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [query, setQuery] = useState("");
  const [useCase, setUseCase] = useState("Select use case");
  const [usage, setUsage] = useState("Expected usage");
  const [rankByPrice, setRankByPrice] = useState(false);
  const [autoBest, setAutoBest] = useState(true);

  return (
    <div className="min-h-screen bg-bg text-text relative overflow-hidden">
      <DottedSurface />

{/* ── NAV ── */}
      <nav
        className="glass-nav fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-6 px-6 py-1.5 w-[calc(100%-2rem)] max-w-7xl rounded-full"
      >
        <div className="flex items-center gap-2">
          <InferenceLogo className="h-8 w-8" />
          <span className="text-2xl font-bold text-white">
            Inference<span style={{ color: "var(--pink)" }}>.ai</span>
          </span>
        </div>

        <div className="nav-links hidden md:flex items-center space-x-1 p-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href="#"
              className="rounded-full px-5 py-1.5 text-lg font-normal"
            >
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-white text-black text-lg font-normal px-5 py-2 rounded-full hover:bg-white/90 transition-all duration-200"
          >
            Get Started
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <main className="relative z-20 max-w-5xl mx-auto px-6 pt-24 pb-8 flex flex-col items-center text-center">
        <HeroSection />

        {/* ── SEARCH CARD ── */}
        <motion.div
          className="w-full flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.75 }}
          onAnimationComplete={(e) => {
            const target = e as unknown as HTMLDivElement;
            if (target && target.style) target.style.transform = "";
          }}
        >
        <GlowCard
          glowColor="pink"
          customSize
          className="w-full max-w-3xl !p-6 md:!p-8 !grid-rows-none !gap-0 text-left"
        >
          {/* Tabs */}
          <div
            className="flex gap-1 mb-6 p-1 rounded-lg"
            style={{ background: "var(--color-bg)" }}
          >
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="flex-1 py-2.5 px-4 rounded-md text-sm transition-all duration-200 cursor-pointer"
                style={
                  activeTab === i
                    ? {
                        background: "var(--pink)",
                        color: "#ffffff",
                      }
                    : { color: "var(--color-text-muted)" }
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search input — pill style */}
          <div className="relative mb-4">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--color-text-muted)" }}
              strokeWidth={2}
            />
            <input
              type="text"
              placeholder={
                activeTab === 0
                  ? "Search AI models — GPT-4o, Claude, Gemini…"
                  : "Search GPU hardware — H100, A100, RTX 4090…"
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-full text-sm outline-none transition-all duration-200"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--border-pink)";
                e.currentTarget.style.boxShadow = "0 0 0 3px var(--pink-lo)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Suggestion pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {SUGGESTION_PILLS.map((pill) => (
              <button
                key={pill}
                onClick={() => setQuery(pill)}
                className="px-3 py-1 rounded-full text-xs transition-all duration-200 cursor-pointer"
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-pink)";
                  e.currentTarget.style.color = "var(--color-text-dim)";
                  e.currentTarget.style.background = "var(--pink-lo)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.color = "var(--color-text-muted)";
                  e.currentTarget.style.background = "var(--color-bg)";
                }}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="select-field w-full px-4 py-3 pr-10 rounded-xl text-sm cursor-pointer appearance-none"
                style={{
                  color:
                    useCase === "Select use case"
                      ? "var(--color-text-muted)"
                      : "var(--color-text)",
                }}
              >
                {USE_CASES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--color-text-muted)" }}
                strokeWidth={2}
              />
            </div>

            <div className="relative flex-1">
              <select
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                className="select-field w-full px-4 py-3 pr-10 rounded-xl text-sm cursor-pointer appearance-none"
                style={{
                  color:
                    usage === "Expected usage"
                      ? "var(--color-text-muted)"
                      : "var(--color-text)",
                }}
              >
                {USAGE_LEVELS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "var(--color-text-muted)" }}
                strokeWidth={2}
              />
            </div>

            <label
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 shrink-0"
              style={{
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <input
                type="checkbox"
                checked={rankByPrice}
                onChange={(e) => setRankByPrice(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: "var(--pink)" }}
              />
              <span
                className="text-sm whitespace-nowrap"
                style={{ color: "var(--color-text-dim)" }}
              >
                Rank by price
              </span>
            </label>
          </div>

          {/* CTA + Toggle row */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ButtonCta className="flex-1 w-full sm:w-auto">
              Find Models
              <ArrowRight className="h-4 w-4" />
            </ButtonCta>

            <div
              className="hidden sm:block w-px h-10 shrink-0"
              style={{ background: "var(--color-border)" }}
            />

            <label className="flex items-center gap-3 cursor-pointer shrink-0">
              <div
                className="relative w-11 h-6 rounded-full transition-all duration-300"
                onClick={() => setAutoBest((v) => !v)}
                style={{
                  background: autoBest ? "var(--pink)" : "var(--color-surface-hi)",
                  boxShadow: autoBest ? "0 0 12px var(--pink-mid)" : "none",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                }}
              >
                <div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                  style={{ left: autoBest ? "24px" : "3px" }}
                />
              </div>
              <span
                className="text-sm font-[family-name:var(--font-outfit)]"
                style={{ color: "var(--color-text-dim)" }}
              >
                Auto Best Value
              </span>
            </label>
          </div>
        </GlowCard>
        </motion.div>

      </main>

      {/* bottom fade */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 w-full h-32 z-10"
        style={{
          background: "linear-gradient(to top, #050509 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
