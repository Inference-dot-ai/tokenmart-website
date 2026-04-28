"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, ChevronUp, LayoutGrid, Tag, Check } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { ModelCard } from "@/components/ui/model-card";
// import { SaleCountdown } from "@/components/ui/sale-countdown";
import type { Model, Category } from "@/lib/google-sheets";
import { extractPriceUSD } from "@/lib/price";
import { getSessionOfferDeadline } from "@/lib/utils";
import { getPlaceholderImage } from "@/lib/placeholder-assets";

const MODEL_TYPE_OPTIONS: { label: string; category: Category | null }[] = [
  { label: "All Models", category: null },
  { label: "Text Generation", category: "LLM" },
  { label: "Image Generation", category: "Image" },
  { label: "Video Generation", category: "Video" },
  { label: "Audio Generation", category: "Audio" },
];

const SORT_OPTIONS = ["Trending", "Price: Low to High", "Price: High to Low", "Name A–Z"];

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("All Models");
  const [activeProvider, setActiveProvider] = useState("All Providers");
  const [sort, setSort] = useState("Trending");
  const [providerOpen, setProviderOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(true);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { "All Models": models.length };
    MODEL_TYPE_OPTIONS.slice(1).forEach(({ label, category }) => {
      counts[label] = models.filter((m) => m.category === category).length;
    });
    return counts;
  }, [models]);

  const providers = useMemo(() => {
    const set = new Set<string>();
    models.forEach((m) => {
      if (m.provider) set.add(m.provider);
    });
    return ["All Providers", ...Array.from(set).sort()];
  }, [models]);

  useEffect(() => {
    fetch("/models.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Model[]) =>
        setModels(
          data.map((m) =>
            m.assetUrl
              ? m
              : { ...m, assetUrl: getPlaceholderImage(`${m.provider}|${m.name}`), assetType: "image" }
          )
        )
      )
      .catch((err) => {
        console.error("Failed to fetch models", err);
        setFetchError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = models;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q)
      );
    }

    const activeCategory = MODEL_TYPE_OPTIONS.find(
      (o) => o.label === activeType
    )?.category;
    if (activeCategory) {
      result = result.filter((m) => m.category === activeCategory);
    }

    if (activeProvider !== "All Providers") {
      result = result.filter((m) => m.provider === activeProvider);
    }

    if (sort === "Name A–Z") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "Price: Low to High" || sort === "Price: High to Low") {
      const dir = sort === "Price: Low to High" ? 1 : -1;
      result = [...result].sort((a, b) => {
        const pa = extractPriceUSD(a.price);
        const pb = extractPriceUSD(b.price);
        if (pa === null && pb === null) return 0;
        if (pa === null) return 1;
        if (pb === null) return -1;
        return (pa - pb) * dir;
      });
    }
    // sort === "Trending" → preserve sheet order

    return result;
  }, [models, query, activeType, activeProvider, sort]);

  const resultCount = filtered.length;

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      {/* ── FLASH BANNER + NAV ── */}
      <div className="sticky top-0 z-50">
        <FlashBanner />

        <Navbar fixed={false} />
      </div>

      {/* <SaleCountdown compact /> */}

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
            Get better prices without extra work.
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
          <aside className="hidden lg:block w-56 shrink-0 self-start sticky top-24">
            <div className="space-y-4">
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
                    {MODEL_TYPE_OPTIONS.map(({ label }) => {
                      const isActive = activeType === label;
                      return (
                        <button
                          key={label}
                          onClick={() => setActiveType(label)}
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
                              {label}
                            </span>
                          </div>
                          <span
                            className="text-xs px-2 py-0.5 rounded-md"
                            style={{
                              background: "var(--color-surface)",
                              color: "var(--color-text-dim)",
                            }}
                          >
                            {typeCounts[label] ?? 0}
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
                    {providers.map((provider) => {
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
          </aside>

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
            ) : fetchError ? (
              <div className="py-20 text-center">
                <p className="text-lg font-medium mb-2">Couldn&apos;t load models</p>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Please refresh the page or try again in a moment.
                </p>
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
                  <ModelCard
                    key={`${model.category}|${model.provider}|${model.name}`}
                    model={model}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </section>

      {/* ── BOTTOM CTA ── */}
      <Footer />
    </div>
  );
}


function FlashBanner() {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const end = getSessionOfferDeadline();
      setSecondsLeft(
        Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000)),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const days = secondsLeft == null ? "--" : pad(Math.floor(secondsLeft / 86400));
  const hours =
    secondsLeft == null ? "--" : pad(Math.floor((secondsLeft % 86400) / 3600));
  const minutes =
    secondsLeft == null ? "--" : pad(Math.floor((secondsLeft % 3600) / 60));
  const seconds = secondsLeft == null ? "--" : pad(secondsLeft % 60);

  return (
    <div
      className="w-full py-2.5 px-4 flex items-center justify-center gap-3 text-sm"
      style={{ background: "var(--pink)", color: "#ffffff" }}
    >
      <span className="text-base shrink-0" aria-hidden>
        🎁
      </span>
      <span
        className="font-semibold tracking-wide whitespace-nowrap"
        style={{ color: "#ffffff" }}
      >
        Offer ends in
      </span>
      <span
        suppressHydrationWarning
        className="font-[family-name:var(--font-mono)] font-bold tabular-nums tracking-wide flex items-center gap-1.5 whitespace-nowrap"
      >
        <Unit value={days} label="d" />
        <Sep />
        <Unit value={hours} label="h" />
        <Sep />
        <Unit value={minutes} label="m" />
        <Sep />
        <Unit value={seconds} label="s" highlight />
      </span>
      <span
        className="hidden sm:inline"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        ·
      </span>
      <span
        className="hidden sm:inline font-semibold tracking-wide whitespace-nowrap"
        style={{ color: "#ffffff" }}
      >
        Top up $100 → Get $125 Credits
      </span>
      <span
        className="hidden sm:inline"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        ·
      </span>
      <span
        className="hidden sm:inline font-semibold tracking-wide whitespace-nowrap"
        style={{ color: "#ffffff" }}
      >
        Save up to 65%
      </span>
    </div>
  );
}

function Unit({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <span
      className="inline-flex items-baseline gap-0.5"
      style={highlight ? { textShadow: "0 0 12px rgba(255,255,255,0.45)" } : undefined}
    >
      <span>{value}</span>
      <span
        className="text-[10px] font-semibold"
        style={{ color: "rgba(255,255,255,0.75)" }}
      >
        {label}
      </span>
    </span>
  );
}

function Sep() {
  return (
    <span style={{ color: "rgba(255,255,255,0.55)" }} aria-hidden>
      :
    </span>
  );
}
