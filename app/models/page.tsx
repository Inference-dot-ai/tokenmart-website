"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, ChevronUp, LayoutGrid, Tag, Check } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import type { Model, Badge } from "@/lib/google-sheets";

const BADGE_STYLES: Record<Badge, { bg: string; text: string; border: string }> = {
  PREMIUM: {
    bg: "var(--pink-lo)",
    text: "var(--pink)",
    border: "var(--border-pink)",
  },
  "BEST VALUE": {
    bg: "rgba(16, 185, 129, 0.10)",
    text: "#10b981",
    border: "rgba(16, 185, 129, 0.25)",
  },
};

const MODEL_TYPES = ["All Models", "Text Generation", "Image Generation", "Video Generation", "Audio Generation"];

const PROVIDERS = ["All Providers", "OpenAI", "Anthropic", "Google", "Meta", "Mistral AI", "Black Forest Labs"];

const SORT_OPTIONS = ["Trending", "Price: Low to High", "Price: High to Low", "Name A–Z"];

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("All Models");
  const [activeProvider, setActiveProvider] = useState("All Providers");
  const [sort, setSort] = useState("Trending");
  const [providerOpen, setProviderOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(true);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts["All Models"] = models.length;
    MODEL_TYPES.slice(1).forEach((type) => {
      counts[type] = models.filter((m) =>
        m.tags.some((t) => t.toLowerCase().includes(type.replace(" Generation", "").toLowerCase()))
      ).length;
    });
    return counts;
  }, [models]);

  useEffect(() => {
    fetch("/api/models")
      .then((res) => res.json())
      .then((data) => setModels(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = models;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeProvider !== "All Providers") {
      result = result.filter((m) => m.provider === activeProvider);
    }
    return result;
  }, [models, query, activeProvider]);

  const resultCount = filtered.length;

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {/* ── FLASH BANNER ── */}
      <div
        className="w-full py-2 text-center text-xs font-medium text-white tracking-wide"
        style={{ background: "var(--pink)" }}
      >
        FLASH SALE: Up to 60% OFF Popular AI Models &bull; Limited Time Only &bull; Ends in 03:39:09
      </div>

      <Navbar fixed={false} />

      {/* ── HEADER ── */}
      <section className="pt-8 pb-6 text-center max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            AI Models Catalog
          </h1>
          <p
            className="text-base mb-8 max-w-xl mx-auto"
            style={{ color: "var(--color-text-dim)" }}
          >
            Explore today&apos;s top AI models across providers in one place.
            Each call is intelligently routed to the lowest-cost stable option,
            so you get better prices without extra work.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5"
              style={{ color: "var(--color-text-muted)" }}
              strokeWidth={2}
            />
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: "var(--color-search-bg)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              onMouseEnter={(e) => {
                if (document.activeElement !== e.currentTarget) {
                  e.currentTarget.style.boxShadow = "0 2px 12px var(--pink-lo)";
                }
              }}
              onMouseLeave={(e) => {
                if (document.activeElement !== e.currentTarget) {
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--pink)";
                e.currentTarget.style.boxShadow = "0 0 0 3px var(--pink-lo)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex gap-8">
          {/* ── LEFT SIDEBAR ── */}
          <motion.aside
            className="hidden lg:block w-56 shrink-0"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="sticky top-24 space-y-4">
              {/* Model Type */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: "var(--color-surface-hi)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 1px 4px var(--color-card-shadow)",
                }}
              >
                <button
                  onClick={() => setTypeOpen((v) => !v)}
                  className="flex items-center justify-between w-full px-4 py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" style={{ color: "var(--color-text-dim)" }} />
                    <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                      Model Type
                    </span>
                  </div>
                  {typeOpen ? (
                    <ChevronUp className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                  ) : (
                    <ChevronDown className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                  )}
                </button>
                {typeOpen && (
                  <div className="px-4 pb-3 space-y-1">
                    {MODEL_TYPES.map((type) => {
                      const isActive = activeType === type;
                      return (
                        <button
                          key={type}
                          onClick={() => setActiveType(type)}
                          className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer"
                          style={{
                            background: isActive ? "var(--color-surface)" : "transparent",
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                              style={{
                                background: isActive ? "#1a1a2e" : "transparent",
                                border: isActive ? "none" : "1.5px solid var(--color-text-muted)",
                                borderRadius: "4px",
                              }}
                            >
                              {isActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />}
                            </div>
                            <span
                              style={{
                                color: "var(--color-text)",
                                fontWeight: isActive ? 600 : 400,
                              }}
                            >
                              {type}
                            </span>
                          </div>
                          <span
                            className="text-xs px-2 py-0.5 rounded-md"
                            style={{
                              background: "var(--color-surface)",
                              color: "var(--color-text-dim)",
                            }}
                          >
                            {typeCounts[type] ?? 0}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Provider */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: "var(--color-surface-hi)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 1px 4px var(--color-card-shadow)",
                }}
              >
                <button
                  onClick={() => setProviderOpen((v) => !v)}
                  className="flex items-center justify-between w-full px-4 py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" style={{ color: "var(--color-text-dim)" }} />
                    <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                      Provider
                    </span>
                  </div>
                  {providerOpen ? (
                    <ChevronUp className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                  ) : (
                    <ChevronDown className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                  )}
                </button>
                {providerOpen && (
                  <div className="px-4 pb-3 space-y-1">
                    {PROVIDERS.map((provider) => {
                      const isActive = activeProvider === provider;
                      return (
                        <button
                          key={provider}
                          onClick={() => setActiveProvider(provider)}
                          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer"
                          style={{
                            background: isActive ? "var(--color-surface)" : "transparent",
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                            style={{
                              background: isActive ? "var(--color-text)" : "transparent",
                              border: isActive ? "none" : "1.5px solid var(--color-text-muted)",
                              borderRadius: "4px",
                            }}
                          >
                            {isActive && <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />}
                          </div>
                          <span
                            style={{
                              color: "var(--color-text)",
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            {provider}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.aside>

          {/* ── RIGHT CONTENT ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
              <p
                className="text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                Showing <span style={{ color: "var(--color-text)" }} className="font-medium">{resultCount}</span> results
              </p>

              <div className="flex items-center gap-2">
                <span
                  className="text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Sort:
                </span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-sm cursor-pointer outline-none"
                    style={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl h-64 animate-pulse"
                    style={{ background: "var(--color-surface-hi)" }}
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-lg font-medium mb-2">No models found</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((model, i) => (
                  <ModelCard key={model.name} model={model} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>

      </section>

      {/* ── BOTTOM CTA ── */}
      <section
        className="py-14 text-center"
        style={{
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <h2
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ color: "var(--color-text)" }}
        >
          Ready to Save Up to 60% on AI Models?
        </h2>
        <p
          className="text-sm mb-6 max-w-lg mx-auto"
          style={{ color: "var(--color-text-muted)" }}
        >
          Join thousands of developers already saving with optimized GPU pooling.
        </p>
        <div className="flex justify-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: "var(--pink-lo)",
              color: "var(--pink)",
              border: "1px solid var(--border-pink)",
            }}
          >
            View Flash Sales
          </a>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white transition-all duration-200"
            style={{ background: "var(--pink)" }}
          >
            Get Deal Alerts
          </a>
        </div>
        <p
          className="text-xs mt-5"
          style={{ color: "var(--color-text-muted)" }}
        >
          Same API • Better prices • Proven 30% average savings
        </p>
      </section>
    </div>
  );
}

function ModelCard({ model, index }: { model: Model; index: number }) {
  const badge = BADGE_STYLES[model.badge] || BADGE_STYLES["PREMIUM"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 + index * 0.04 }}
      className="model-card overflow-hidden transition-shadow duration-200"
      style={{
        background: "var(--color-surface-hi)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 2px 16px var(--color-card-shadow)",
      }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {model.name}
          </h3>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0"
            style={{
              background: badge.bg,
              color: badge.text,
              border: `1px solid ${badge.border}`,
            }}
          >
            {model.badge}
          </span>
        </div>

        <p
          className="text-xs mb-3"
          style={{ color: "var(--color-text-dim)" }}
        >
          {model.provider}
        </p>

        <p
          className="text-sm mb-4 leading-relaxed"
          style={{ color: "var(--color-text)", opacity: 0.75 }}
        >
          {model.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {model.tags.map((tag) => (
            <span
              key={tag}
              className="model-tag text-[11px] px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "var(--color-text)",
                opacity: 0.7,
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="price-box p-3 space-y-2"
          style={{ background: "var(--color-surface)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--color-text-dim)" }}
            >
              Input
            </span>
            <div className="flex items-center gap-2">
              {model.input.original && (
                <span
                  className="text-xs line-through"
                  style={{ color: "var(--color-text-dim)", opacity: 0.6 }}
                >
                  {model.input.original}
                </span>
              )}
              <span
                className="text-sm font-bold"
                style={{ color: "var(--color-text)" }}
              >
                {model.input.price}
              </span>
            </div>
          </div>
          {(model.output.price || model.output.original) && (
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-text-dim)" }}
              >
                Output
              </span>
              <div className="flex items-center gap-2">
                {model.output.original && (
                  <span
                    className="text-xs line-through"
                    style={{ color: "var(--color-text-dim)", opacity: 0.6 }}
                  >
                    {model.output.original}
                  </span>
                )}
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {model.output.price}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
