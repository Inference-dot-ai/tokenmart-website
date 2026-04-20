"use client";

// import { useState } from "react"; // commented out with search card
import { motion } from "framer-motion";
// import { Search, ChevronDown } from "lucide-react"; // commented out with search card
import { ArrowRight, Zap, DollarSign, Shield, TrendingDown } from "lucide-react";
// import { ButtonCta } from "@/components/ui/button-shiny"; // commented out with search card
import { HeroSection } from "@/components/ui/hero-section-shadcnui";
import { GlowCard } from "@/components/ui/spotlight-card";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

// ── Search card constants (commented out with search card) ──
// const TABS = ["Tokens / AI Models", "GPUs / Hardware"];
// const USE_CASES = ["Select use case","Chatbot","Code Generation","Summarization","Embeddings","Image Generation","Vision"];
// const USAGE_LEVELS = ["Expected usage","< 1M tokens/day","1M–10M tokens/day","10M–100M tokens/day","> 100M tokens/day"];
// const SUGGESTION_PILLS = ["GPT-4o mini","Claude 3.5 Sonnet","Llama 3.3 70B","Gemini 1.5 Flash","Mistral Large","DeepSeek V3"];

const TOP_DEALS = [
  {
    model: "GPT-4o",
    provider: "OpenAI",
    inputPrice: "$1.25",
    outputPrice: "$5.00",
    originalInput: "$2.50",
    originalOutput: "$10.00",
    context: "128K",
    uptime: "99.9%",
    savings: "50%",
    badge: "Most Popular",
  },
  {
    model: "Claude Sonnet 4",
    provider: "Anthropic",
    inputPrice: "$1.50",
    outputPrice: "$7.50",
    originalInput: "$3.00",
    originalOutput: "$15.00",
    context: "200K",
    uptime: "99.8%",
    savings: "50%",
    badge: "Best for Code",
  },
  {
    model: "Gemini 2.5 Flash",
    provider: "Google",
    inputPrice: "$0.08",
    outputPrice: "$0.30",
    originalInput: "$0.15",
    originalOutput: "$0.60",
    context: "1M",
    uptime: "99.9%",
    savings: "50%",
    badge: "Best Value",
  },
  {
    model: "Llama 3.3 70B",
    provider: "Meta",
    inputPrice: "$0.18",
    outputPrice: "$0.18",
    originalInput: "$0.40",
    originalOutput: "$0.40",
    context: "128K",
    uptime: "99.7%",
    savings: "55%",
    badge: "Open Source",
  },
  {
    model: "DeepSeek V3",
    provider: "DeepSeek",
    inputPrice: "$0.07",
    outputPrice: "$0.14",
    originalInput: "$0.14",
    originalOutput: "$0.28",
    context: "64K",
    uptime: "99.5%",
    savings: "50%",
    badge: "Budget Pick",
  },
  {
    model: "Mistral Large",
    provider: "Mistral AI",
    inputPrice: "$1.00",
    outputPrice: "$3.00",
    originalInput: "$2.00",
    originalOutput: "$6.00",
    context: "128K",
    uptime: "99.8%",
    savings: "50%",
    badge: "Enterprise",
  },
];

export default function Home() {
  // ── Search card state (commented out with search card) ──
  // const [activeTab, setActiveTab] = useState(0);
  // const [query, setQuery] = useState("");
  // const [useCase, setUseCase] = useState("Select use case");
  // const [usage, setUsage] = useState("Expected usage");
  // const [rankByPrice, setRankByPrice] = useState(false);
  // const [autoBest, setAutoBest] = useState(true);

  return (
    <div className="min-h-screen bg-bg text-text relative overflow-hidden">
      <DottedSurface />

      <Navbar />

      {/* ── HERO ── */}
      <main className="relative z-20 max-w-5xl mx-auto px-6 pt-24 pb-8 flex flex-col items-center text-center">
        <HeroSection />

        {/* ── TOP DEALS ── */}
        <motion.div
          className="w-full max-w-6xl mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.75 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: "var(--pink)" }} />
              <h2 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
                Top Deals Right Now
              </h2>
            </div>
            <a
              href="#"
              className="text-sm flex items-center gap-1 transition-colors duration-200"
              style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--pink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
            >
              View all deals
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOP_DEALS.map((deal, i) => (
              <motion.div
                key={deal.model}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.85 + i * 0.08 }}
              >
                <GlowCard
                  glowColor="pink"
                  customSize
                  className="!p-0 !grid-rows-none !gap-0 group"
                >
                  <div className="p-5 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-semibold leading-tight" style={{ color: "var(--color-text)" }}>
                          {deal.model}
                        </h3>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {deal.provider}
                        </p>
                      </div>
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          background: "var(--pink-lo)",
                          color: "var(--pink)",
                          border: "1px solid var(--border-pink)",
                        }}
                      >
                        {deal.badge}
                      </span>
                    </div>

                    {/* Pricing */}
                    <div
                      className="rounded-xl p-3 mb-4"
                      style={{ background: "var(--color-bg)" }}
                    >
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span
                          className="text-[10px] uppercase tracking-wider"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          Input / 1M tokens
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs line-through"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {deal.originalInput}
                          </span>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: "var(--color-text)" }}
                          >
                            {deal.inputPrice}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span
                          className="text-[10px] uppercase tracking-wider"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          Output / 1M tokens
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs line-through"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {deal.originalOutput}
                          </span>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: "var(--color-text)" }}
                          >
                            {deal.outputPrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: "var(--color-text-dim)" }}
                      >
                        <Shield className="w-3 h-3" style={{ color: "var(--color-text-muted)" }} />
                        {deal.uptime}
                      </div>
                      <div
                        className="w-px h-3"
                        style={{ background: "var(--color-border)" }}
                      />
                      <div
                        className="flex items-center gap-1.5 text-xs"
                        style={{ color: "var(--color-text-dim)" }}
                      >
                        <DollarSign className="w-3 h-3" style={{ color: "var(--color-text-muted)" }} />
                        {deal.context} ctx
                      </div>
                      <div
                        className="w-px h-3"
                        style={{ background: "var(--color-border)" }}
                      />
                      <div
                        className="flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: "#34d399" }}
                      >
                        <TrendingDown className="w-3 h-3" />
                        {deal.savings} off
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      className="w-full py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200"
                      style={{
                        background: "var(--pink-lo)",
                        color: "var(--pink)",
                        border: "1px solid var(--border-pink)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--pink)";
                        e.currentTarget.style.color = "#ffffff";
                        e.currentTarget.style.boxShadow = "0 0 20px var(--pink-mid)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "var(--pink-lo)";
                        e.currentTarget.style.color = "var(--pink)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      Get Deal
                    </button>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── SEARCH CARD (commented out — replaced by Top Deals above) ── */}
        {/*
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
        */}

      </main>

      {/* bottom fade */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 w-full h-32 z-10"
        style={{
          background: "linear-gradient(to top, var(--color-bg) 0%, transparent 100%)",
        }}
      />

      <Footer />
    </div>
  );
}
