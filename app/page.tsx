"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  DollarSign,
  TrendingDown,
  Check,
  CreditCard,
  KeyRound,
  Mail,
  Apple,
  Globe,
  GitBranch,
  ChevronDown,
  Layers,
  Gauge,
} from "lucide-react";
import Link from "next/link";
// import { ButtonCta } from "@/components/ui/button-shiny"; // commented out with search card
import { HeroSection } from "@/components/ui/hero-section-shadcnui";
// import { FlashDealsBanner } from "@/components/ui/flash-deals-banner";
import { FlashDealsCountdown } from "@/components/ui/flash-deals-countdown";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { DiscountPopup } from "@/components/ui/discount-popup";
import { PriceTagFab } from "@/components/ui/price-tag-fab";
// import { SaleCountdown } from "@/components/ui/sale-countdown";
import { FeaturedMarquee } from "@/components/ui/featured-marquee";
import type { Model } from "@/lib/google-sheets";

// ── Search card constants (commented out with search card) ──
// const TABS = ["Tokens / AI Models", "GPUs / Hardware"];
// const USE_CASES = ["Select use case","Chatbot","Code Generation","Summarization","Embeddings","Image Generation","Vision"];
// const USAGE_LEVELS = ["Expected usage","< 1M tokens/day","1M–10M tokens/day","10M–100M tokens/day","> 100M tokens/day"];
// const SUGGESTION_PILLS = ["GPT-4o mini","Claude 3.5 Sonnet","Llama 3.3 70B","Gemini 1.5 Flash","Mistral Large","DeepSeek V3"];


const FAQS: { q: string; a: string }[] = [
  {
    q: "How much can I save using TokenMart instead of direct API access?",
    a: "TokenMart users typically save 20-70% on their AI API costs. Our intelligent routing system continuously monitors real-time prices across providers like OpenAI, Anthropic, Google, and more. For example, GPT-4 requests can cost $0.03 directly from OpenAI, but through our routing, you might pay as low as $0.014 when alternate providers offer better rates. The exact savings depend on your usage patterns and model selection.",
  },
  {
    q: "How does TokenMart pricing work? Are there hidden fees?",
    a: "TokenMart uses transparent pay-as-you-go pricing with no hidden fees. You only pay for what you use, calculated per token or request depending on the model. We don't charge platform fees - you pay the best available market rate plus a small routing fee (typically 5-10%). No monthly minimums, no setup costs, and new users get free bonus credits to test our service.",
  },
  {
    q: "How long does it take to integrate TokenMart into my existing application?",
    a: "Integration typically takes less than 10 minutes. If you're already using OpenAI or similar APIs, you just need to change your base URL and API key. Our API is compatible with OpenAI's format, so most existing code works without modification. We provide SDKs for Python, JavaScript, Go, and more, plus comprehensive documentation and migration guides.",
  },
  {
    q: "Which AI models and providers does TokenMart support?",
    a: "TokenMart supports 40+ models from leading providers including OpenAI (GPT-4, GPT-3.5), Anthropic (Claude 3 Opus, Sonnet), Google (Gemini Pro, PaLM), Meta (Llama 2), Mistral, Cohere, and more. We continuously add new models and providers. All models are accessible through our unified API endpoint, so you can switch models with a single parameter change.",
  },
  {
    q: "What happens if a provider goes down? Will my application fail?",
    a: "No, your application stays online. TokenMart provides automatic failover across multiple providers. If OpenAI experiences an outage, we instantly route your requests to alternate providers like Anthropic or Google. Our system maintains 99.9% uptime by monitoring provider health in real-time and pre-emptively routing away from degraded services. You get reliability that's impossible with a single provider.",
  },
  {
    q: "Does routing through TokenMart add latency to my API calls?",
    a: "TokenMart adds very little overhead, and in many cases smart routing helps maintain reliable performance across providers.",
  },
  {
    q: "Is my data secure when using TokenMart? Do you store my prompts?",
    a: "Your requests go through TokenMart's secure proxy. We do not store prompts by default, and all traffic is handled with security best practices.",
  },
  {
    q: "Do I need API keys from each provider, or just TokenMart?",
    a: "You only need one TokenMart key - we handle all provider relationships for you. This means less security risk (fewer keys to manage), simplified billing (one invoice), and instant access to new providers without additional setup. Your TokenMart key works across all supported models and providers.",
  },
  {
    q: "How does TokenMart handle rate limits across different providers?",
    a: "TokenMart intelligently manages rate limits by distributing your requests across multiple providers. If you hit OpenAI's rate limit, we automatically route to Anthropic or another provider with available capacity. This gives you effectively unlimited throughput - far beyond what any single provider offers. We also provide rate limit monitoring in your dashboard.",
  },
  {
    q: "Can I try TokenMart for free before committing?",
    a: "Yes! Sign up to get free bonus credits - no credit card required. This gives you enough usage to test multiple models, evaluate performance, and see real cost savings. Our dashboard shows detailed analytics so you can compare costs versus direct provider access. Most developers see 30-50% savings with their free bonus credits alone.",
  },
  {
    q: "Do you offer enterprise plans with dedicated support?",
    a: "Yes, TokenMart offers enterprise plans with dedicated support, custom contracts, and volume discounts. Enterprise features include: dedicated infrastructure, custom model routing rules, advanced security controls, priority support, and detailed compliance documentation. Contact our sales team for pricing based on your usage volume.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [featuredModels, setFeaturedModels] = useState<Model[]>([]);

  useEffect(() => {
    fetch("/api/models")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((models: Model[]) =>
        setFeaturedModels(models.filter((m) => m.featured))
      )
      .catch((err) => console.error("Failed to load featured models", err));
  }, []);

  // ── Search card state (commented out with search card) ──
  // const [activeTab, setActiveTab] = useState(0);
  // const [query, setQuery] = useState("");
  // const [useCase, setUseCase] = useState("Select use case");
  // const [usage, setUsage] = useState("Expected usage");
  // const [rankByPrice, setRankByPrice] = useState(false);
  // const [autoBest, setAutoBest] = useState(true);

  return (
    <div className="min-h-screen bg-bg text-text relative overflow-x-clip">
      <DottedSurface />

      <DiscountPopup />

      <PriceTagFab />

      <Navbar />

      {/* <SaleCountdown /> */}

      {/* ── HERO (full-width so floating cards can spread to edges) ── */}
      <section className="relative z-20 w-full pt-28 flex flex-col items-center text-center">
        <HeroSection />
      </section>

      <main className="relative z-20 max-w-5xl mx-auto px-6 pt-4 pb-8 flex flex-col items-center text-center">
        {/* <FlashDealsBanner /> */}

        {/* ── FEATURED MODELS ── */}
        {featuredModels.length > 0 && (
          <motion.div
            className="w-full max-w-6xl mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.75 }}
          >
            <div className="relative">
              <div className="relative mb-8 text-center">
                <div className="inline-flex items-center gap-2">
                  <Zap className="w-7 h-7 md:w-8 md:h-8" style={{ color: "var(--pink)" }} fill="currentColor" strokeWidth={0} />
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
                    Featured This Week
                  </h2>
                </div>
              </div>

              <FlashDealsCountdown />

              <div className="relative mt-10">
                <FeaturedMarquee models={featuredModels} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── GET STARTED ── */}
        <motion.div
          className="w-full max-w-6xl mt-16 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.9 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
              Get started in 60 seconds
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
              Claim your free bonus credits first — they stack on everything else.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Card 0 — Lock in Discount (highlighted) */}
            <div
              className="relative rounded-2xl p-5 flex flex-col sm:col-span-2 lg:col-span-2"
              style={{
                background:
                  "linear-gradient(180deg, var(--pink-lo) 0%, var(--color-surface) 100%)",
                border: "1px solid var(--border-pink)",
                boxShadow:
                  "0 0 0 3px var(--pink-lo), 0 0 40px var(--pink-glow)",
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white mb-4"
                style={{ background: "var(--pink)" }}
              >
                0
              </div>

              <div className="flex items-center gap-2 mb-3">
                <h3
                  className="text-lg font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  Lock in Discount
                </h3>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider text-white"
                  style={{ background: "#111" }}
                >
                  <Zap className="w-3 h-3" fill="currentColor" strokeWidth={0} />
                  LIMITED
                </span>
              </div>

              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "var(--color-text-dim)" }}
              >
                Claim your{" "}
                <span
                  className="font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  20% bonus credits + 300M free tokens
                </span>{" "}
                before the deal ends. Stackable with every model discount.
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5 text-sm">
                <span
                  className="inline-flex items-center gap-1.5"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: "var(--pink)" }} strokeWidth={3} />
                  <span className="font-semibold" style={{ color: "var(--pink)" }}>
                    +20%
                  </span>{" "}
                  credits
                </span>
                <span
                  className="inline-flex items-center gap-1.5"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: "var(--pink)" }} strokeWidth={3} />
                  <span className="font-semibold" style={{ color: "var(--pink)" }}>
                    300M
                  </span>{" "}
                  free tokens
                </span>
                <span
                  className="inline-flex items-center gap-1.5"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: "var(--pink)" }} strokeWidth={3} />
                  No card
                </span>
              </div>

              <Link
                href="/signup"
                className="mt-auto w-full py-3 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200"
                style={{ background: "var(--pink)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 24px var(--pink-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Get Free Bonus Credits
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            {/* Card 1 — Signup */}
            <div
              className="rounded-2xl p-5 flex flex-col"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold mb-4"
                style={{ background: "var(--pink-lo)", color: "var(--pink)" }}
              >
                1
              </div>
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: "var(--color-text)" }}
              >
                Signup
              </h3>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "var(--color-text-dim)" }}
              >
                Create an account to get started. Set up an org for your team later.
              </p>
              <div className="mt-auto flex items-center gap-2">
                {[Globe, Apple, GitBranch, Mail].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2 — Buy credits */}
            <div
              className="rounded-2xl p-5 flex flex-col"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold mb-4"
                style={{ background: "var(--pink-lo)", color: "var(--pink)" }}
              >
                2
              </div>
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: "var(--color-text)" }}
              >
                Buy credits
              </h3>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "var(--color-text-dim)" }}
              >
                Credits can be used with any model or provider. $80 → 100 credits.
              </p>
              <div className="mt-auto flex items-center gap-2">
                {[CreditCard, DollarSign].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3 — API key */}
            <div
              className="rounded-2xl p-5 flex flex-col"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold mb-4"
                style={{ background: "var(--pink-lo)", color: "var(--pink)" }}
              >
                3
              </div>
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: "var(--color-text)" }}
              >
                Get your API key
              </h3>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "var(--color-text-dim)" }}
              >
                Create an API key and start making requests.{" "}
                <span style={{ color: "var(--pink)" }}>Fully OpenAI compatible.</span>
              </p>
              <div className="mt-auto flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <KeyRound className="w-4 h-4" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── WHY CHOOSE TOKENMART ── */}
        <motion.div
          className="w-full max-w-6xl mt-16 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.95 }}
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--color-text)" }}>
              Why Choose tokenmart?
            </h2>
            <p className="text-base mt-3 max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
              The unified API platform that makes AI integration simple, reliable, and cost-effective.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1 — Access Top AI Models */}
            <WhyCard
              icon={<Layers className="w-5 h-5" strokeWidth={2} style={{ color: "var(--pink)" }} />}
              tag="Models"
              title="Access Top AI Models"
              body={
                <>
                  Connect to <Strong>Veo 3</Strong>, <Strong>Sora-2</Strong>, <Strong>Nano Banana Pro</Strong> and 40+ leading models through one <Strong>unified gateway</Strong>.
                </>
              }
              readout={
                <>
                  <ReadoutJson model="veo-3" />
                  <ReadoutJson model="sora-2" />
                  <ReadoutJson model="nano-banana-pro" />
                </>
              }
              statValue="40+"
              statLabel="AI models"
            />

            {/* Card 2 — Always Pay the Lowest Price (highlighted, middle) */}
            <WhyCard
              highlighted
              icon={<TrendingDown className="w-5 h-5" strokeWidth={2} style={{ color: "var(--pink)" }} />}
              tag="Savings"
              title="Always Pay the Lowest Price"
              body={
                <>
                  <Strong>Smart routing</Strong> saves up to <Strong>70%</Strong> on AI costs, automatically.
                </>
              }
              readout={
                <>
                  <ReadoutCompare label="GPT-4" value="$0.030" status="bad" />
                  <ReadoutCompare label="Best" value="$0.014" status="good" />
                  <ReadoutLine label="saved" value="53%" accent="green" />
                </>
              }
              statValue="70%"
              statLabel="savings"
            />

            {/* Card 3 — One Dashboard, Total Control */}
            <WhyCard
              icon={<Gauge className="w-5 h-5" strokeWidth={2} style={{ color: "var(--pink)" }} />}
              tag="Control"
              title="One Dashboard, Total Control"
              body={
                <>
                  <Strong>Track usage</Strong> and <Strong>costs</Strong> across every model in <Strong>real-time</Strong>.
                </>
              }
              readout={
                <>
                  <ReadoutLine label="calls (24h)" value="45,218" />
                  <ReadoutLine label="spend" value="$412.80" />
                  <ReadoutLine label="saved" value="$89.14" accent="green" />
                </>
              }
              statValue="1"
              statLabel="dashboard"
              rightStat={
                <div className="text-right leading-tight font-[family-name:var(--font-mono)] text-xs">
                  <div style={{ color: "var(--color-text-muted)" }}>45K calls</div>
                  <div style={{ color: "var(--pink)" }} className="font-semibold">$89 saved</div>
                </div>
              }
            />
          </div>
        </motion.div>

        {/* ── FAQ ── */}
        <motion.div
          className="w-full max-w-6xl mt-24 text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.0 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left column — title & subtitle */}
            <div className="lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
              <h2
                className="text-4xl font-bold leading-tight"
                style={{ color: "var(--color-text)" }}
              >
                Frequently Asked Questions
              </h2>
              <p
                className="mt-4 text-base leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                Everything you need to know about saving money and improving
                reliability with TokenMart
              </p>
            </div>

            {/* Right column — questions */}
            <div className="lg:col-span-2">
              {FAQS.map((item, i) => {
                if (!item.q) return null;
                const isOpen = openFaq === i;
                const num = String(i + 1).padStart(2, "0");
                return (
                  <div
                    key={i}
                    className="border-t"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-start gap-6 py-6 text-left cursor-pointer"
                    >
                      <span
                        className="text-2xl font-serif italic shrink-0 pt-0.5"
                        style={{ color: "var(--color-text-dim)" }}
                      >
                        {num}
                      </span>
                      <span
                        className="flex-1 text-xl font-medium leading-snug"
                        style={{ color: "var(--color-text)" }}
                      >
                        {item.q}
                      </span>
                      <ChevronDown
                        className="w-5 h-5 shrink-0 mt-0.5 transition-transform duration-200"
                        style={{
                          color: "var(--color-text-muted)",
                          transform: isOpen ? "rotate(180deg)" : "none",
                        }}
                        strokeWidth={2}
                      />
                    </button>
                    {isOpen && item.a && (
                      <div
                        className="pb-6 pl-[3.5rem] pr-10 text-base leading-relaxed"
                        style={{ color: "var(--color-text-dim)" }}
                      >
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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

function Strong({ children }: { children: React.ReactNode }) {
  return (
    <strong className="font-semibold" style={{ color: "var(--color-text)" }}>
      {children}
    </strong>
  );
}

function ReadoutLine({
  label,
  value,
  accent = "pink",
}: {
  label: string;
  value: string;
  accent?: "pink" | "green";
}) {
  const valueColor = accent === "green" ? "var(--terminal-green)" : "var(--terminal-pink)";
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: "var(--pink)" }}>›</span>
      <span style={{ color: "var(--terminal-label)" }} className="tracking-wide">
        {label}
      </span>
      <span className="ml-auto font-medium" style={{ color: valueColor }}>
        {value}
      </span>
    </div>
  );
}

function ReadoutJson({ model }: { model: string }) {
  return (
    <div>
      <span style={{ color: "var(--terminal-punct)" }}>{"{ "}</span>
      <span style={{ color: "var(--terminal-pink)" }}>&quot;model&quot;</span>
      <span style={{ color: "var(--terminal-punct)" }}>: </span>
      <span style={{ color: "var(--terminal-green)" }}>&quot;{model}&quot;</span>
      <span style={{ color: "var(--terminal-punct)" }}>{" }"}</span>
    </div>
  );
}

function ReadoutCompare({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "good" | "bad";
}) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: "var(--pink)" }}>›</span>
      <span style={{ color: "var(--terminal-label)" }}>{label}</span>
      <span className="ml-auto font-medium" style={{ color: "var(--terminal-value)" }}>
        {value}
      </span>
      <span style={{ color: status === "good" ? "var(--terminal-green)" : "var(--terminal-red)" }}>
        {status === "good" ? "✓" : "✗"}
      </span>
    </div>
  );
}

function WhyCard({
  icon,
  tag,
  title,
  body,
  readout,
  statValue,
  statLabel,
  rightStat,
  highlighted = false,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  body: React.ReactNode;
  readout: React.ReactNode;
  statValue: string;
  statLabel: string;
  rightStat?: React.ReactNode;
  highlighted?: boolean;
}) {
  const baseStyle = highlighted
    ? {
        background:
          "linear-gradient(180deg, var(--pink-lo) 0%, var(--color-surface) 100%)",
        border: "1px solid var(--border-pink)",
        boxShadow:
          "0 0 0 3px var(--pink-lo), 0 0 40px var(--pink-glow)",
      }
    : {
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      };

  return (
    <div
      className="group relative rounded-2xl p-7 flex flex-col overflow-hidden transition-all duration-300"
      style={baseStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-pink)";
        e.currentTarget.style.boxShadow = highlighted
          ? "0 0 0 3px var(--pink-lo), 0 18px 48px -12px var(--pink-mid), 0 0 40px var(--pink-glow)"
          : "0 18px 48px -12px var(--pink-mid), 0 0 0 1px var(--border-pink)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = highlighted
          ? "var(--border-pink)"
          : "var(--color-border)";
        e.currentTarget.style.boxShadow = highlighted
          ? "0 0 0 3px var(--pink-lo), 0 0 40px var(--pink-glow)"
          : "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Soft top gradient — reveals on hover */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, var(--pink-lo) 0%, transparent 100%)",
        }}
      />

      <div className="relative flex items-center justify-between mb-6">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "var(--pink-lo)",
            border: "1px solid var(--border-pink)",
          }}
        >
          {icon}
        </div>
        <span
          className="text-[10px] font-semibold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full font-[family-name:var(--font-mono)]"
          style={{
            background: "var(--color-bg)",
            color: "var(--color-text-muted)",
            border: "1px solid var(--color-border)",
          }}
        >
          {tag}
        </span>
      </div>

      <h3
        className="relative text-[1.55rem] leading-tight font-semibold tracking-tight mb-3 font-[family-name:var(--font-chakra)]"
        style={{ color: "var(--color-text)" }}
      >
        {title}
      </h3>
      <p
        className="relative text-[15px] leading-relaxed mb-6"
        style={{ color: "var(--color-text-dim)" }}
      >
        {body}
      </p>

      {/* Terminal readout — theme-adaptive (dark in dark mode, light in light mode) */}
      <div
        className="relative rounded-xl mb-6 overflow-hidden"
        style={{
          background: "var(--terminal-bg)",
          border: "1px solid var(--terminal-border)",
        }}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-2 border-b"
          style={{ borderColor: "var(--terminal-border)" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: "rgba(248,113,113,0.5)" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "rgba(251,191,36,0.5)" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "rgba(74,222,128,0.5)" }} />
        </div>
        <div className="px-4 py-3 text-[12.5px] leading-relaxed font-[family-name:var(--font-mono)] space-y-0.5">
          {readout}
        </div>
      </div>

      <div className="relative mt-auto flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span
            className="text-4xl font-bold tracking-tight font-[family-name:var(--font-chakra)]"
            style={{ color: "var(--pink)" }}
          >
            {statValue}
          </span>
          <span
            className="text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            {statLabel}
          </span>
        </div>
        {rightStat}
      </div>
    </div>
  );
}
