"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, Copy, Search, X } from "lucide-react";
import { useCatalog } from "@/components/catalog/CatalogProvider";
import { RatePair } from "@/components/catalog/Price";
import { ProviderLogo, providerName } from "@/components/catalog/ProviderLogo";
import { buttonClass } from "@/components/site/Button";
import { DiscountBadge } from "@/components/site/DiscountBadge";
import type { CatalogModel, ModelKind } from "@/lib/catalog";
import { providersIn } from "@/lib/catalog-select";
import { usd } from "@/lib/format";
import { CONSOLE_MODELS_URL } from "@/lib/site";
import { RateDetails } from "./RateDetails";

type Sort = "provider" | "discount" | "price" | "name";
const KINDS: { value: ModelKind | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "text", label: "Text" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
];
const SORTS: { value: Sort; label: string }[] = [
  { value: "provider", label: "By provider" },
  { value: "discount", label: "Biggest discount" },
  { value: "price", label: "Lowest price" },
  { value: "name", label: "Name" },
];

type Filters = { q: string; provider: string; kind: ModelKind | "all"; sort: Sort };
const DEFAULTS: Filters = { q: "", provider: "all", kind: "all", sort: "provider" };
const URL_EVENT = "tm-filters-change";

function parseFilters(search: string): Filters {
  const sp = new URLSearchParams(search);
  const kind = sp.get("kind");
  const sort = sp.get("sort");
  return {
    q: sp.get("q") ?? "",
    provider: sp.get("provider") ?? "all",
    kind: (KINDS.some((k) => k.value === kind) ? kind : "all") as ModelKind | "all",
    sort: (SORTS.some((s) => s.value === sort) ? sort : "provider") as Sort,
  };
}

function subscribeUrl(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(URL_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(URL_EVENT, onChange);
  };
}

/**
 * Filters live in the query string so links like /models?provider=openai
 * work. The export is static, so the server renders defaults and the client
 * reads the real URL after hydration.
 */
function useFilters(): [Filters, (patch: Partial<Filters>) => void] {
  const search = useSyncExternalStore(subscribeUrl, () => window.location.search, () => "");
  const filters = useMemo(() => parseFilters(search), [search]);
  const update = (patch: Partial<Filters>) => {
    const next = { ...parseFilters(window.location.search), ...patch };
    const sp = new URLSearchParams();
    if (next.q) sp.set("q", next.q);
    if (next.provider !== DEFAULTS.provider) sp.set("provider", next.provider);
    if (next.kind !== DEFAULTS.kind) sp.set("kind", next.kind);
    if (next.sort !== DEFAULTS.sort) sp.set("sort", next.sort);
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    window.dispatchEvent(new Event(URL_EVENT));
  };
  return [filters, update];
}

export function ModelExplorer() {
  const { catalog, status } = useCatalog();
  const [{ q, provider, kind, sort }, setFilters] = useFilters();
  const setQ = (v: string) => setFilters({ q: v });
  const setProvider = (v: string) => setFilters({ provider: v });
  const setKind = (v: ModelKind | "all") => setFilters({ kind: v });
  const setSort = (v: Sort) => setFilters({ sort: v });

  const providers = providersIn(catalog);

  // Deep links like ?provider=bytedance land with the chip off-screen on
  // narrow viewports; bring the active chip into view.
  const chipsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = chipsRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
    el?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [provider]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = catalog.models.filter(
      (m) =>
        (provider === "all" || m.provider === provider) &&
        (kind === "all" || m.kind === kind) &&
        (!needle ||
          m.name.toLowerCase().includes(needle) ||
          m.id.toLowerCase().includes(needle) ||
          providerName(m.provider).toLowerCase().includes(needle)),
    );
    const kindRank: Record<ModelKind, number> = { text: 0, image: 1, video: 2 };
    if (sort === "discount") {
      list.sort((a, b) => b.discountPct - a.discountPct || (b.headline?.list ?? 0) - (a.headline?.list ?? 0));
    } else if (sort === "price") {
      list.sort(
        (a, b) =>
          kindRank[a.kind] - kindRank[b.kind] ||
          (a.headline?.price ?? Infinity) - (b.headline?.price ?? Infinity),
      );
    } else if (sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    }
    return list;
  }, [catalog.models, q, provider, kind, sort]);

  const groups = useMemo(() => {
    if (sort !== "provider") return [{ key: "all", models: filtered }];
    const out: { key: string; models: CatalogModel[] }[] = [];
    for (const m of filtered) {
      const g = out.find((x) => x.key === m.provider);
      if (g) g.models.push(m);
      else out.push({ key: m.provider, models: [m] });
    }
    return out;
  }, [filtered, sort]);

  const kindCount = (k: ModelKind | "all") =>
    catalog.models.filter((m) => (provider === "all" || m.provider === provider) && (k === "all" || m.kind === k)).length;

  const clear = () => setFilters(DEFAULTS);

  if (catalog.models.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-10 text-center">
        <p className="font-medium text-ink">Pricing is temporarily unavailable.</p>
        <p className="mt-2 text-muted">The console always shows current rates.</p>
        <a href={CONSOLE_MODELS_URL} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "md", "mt-6")}>
          Open the console
        </a>
      </div>
    );
  }

  return (
    <div>
      <div
        className="sticky z-30 -mx-4 border-b border-line bg-[var(--header-bg)] px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        style={{ top: "calc(4rem + env(safe-area-inset-top, 0px))" }}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative lg:w-80">
            <label htmlFor="model-search" className="sr-only">
              Search models
            </label>
            <Search size={16} strokeWidth={1.75} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
            <input
              id="model-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Claude, gpt-5.5, video..."
              className="h-10 w-full rounded-full border border-line-strong bg-surface pl-10 pr-4 text-[15px] text-ink placeholder:text-faint focus:border-accent focus:outline-none"
            />
          </div>

          <div role="tablist" aria-label="Model type" className="flex gap-1 rounded-full bg-surface-2 p-1">
            {KINDS.map((k) => (
              <button
                key={k.value}
                role="tab"
                aria-selected={kind === k.value}
                onClick={() => setKind(k.value)}
                className={`tnum rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  kind === k.value ? "bg-surface text-ink shadow-card" : "text-muted hover:text-ink"
                }`}
              >
                {k.label} <span className="text-faint">{kindCount(k.value)}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 lg:ml-auto">
            <label htmlFor="model-sort" className="text-sm text-muted">
              Sort
            </label>
            <div className="relative">
              <select
                id="model-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-10 appearance-none rounded-full border border-line-strong bg-surface pl-4 pr-9 text-sm text-ink focus:border-accent focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} strokeWidth={1.75} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-faint" />
            </div>
          </div>
        </div>

        <div ref={chipsRef} className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Provider">
          <button
            onClick={() => setProvider("all")}
            aria-pressed={provider === "all"}
            className={`h-8 shrink-0 rounded-full border px-3.5 text-sm transition-colors ${
              provider === "all" ? "border-ink bg-ink text-bg" : "border-line text-muted hover:text-ink"
            }`}
          >
            All providers
          </button>
          {providers.map((p) => (
            <button
              key={p}
              onClick={() => setProvider(provider === p ? "all" : p)}
              aria-pressed={provider === p}
              className={`flex h-8 shrink-0 items-center gap-1.5 rounded-full border pl-1 pr-3 text-sm transition-colors ${
                provider === p ? "border-ink bg-ink text-bg" : "border-line text-muted hover:text-ink"
              }`}
            >
              <ProviderLogo provider={p} size="sm" />
              {providerName(p)}
            </button>
          ))}
        </div>
      </div>

      <p className="tnum mt-6 text-sm text-muted" aria-live="polite">
        {filtered.length} of {catalog.models.length} models
        {status === "live" ? ", prices refreshed from the live catalog" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-line-strong p-12 text-center">
          <p className="font-medium text-ink">No models match these filters.</p>
          <p className="mt-2 text-sm text-muted">Try another name or clear the filters to see the full catalog.</p>
          <button onClick={clear} className={buttonClass("secondary", "sm", "mt-5")}>
            <X size={14} strokeWidth={1.75} />
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-10">
          {groups.map((g) => (
            <section key={g.key} aria-label={g.key === "all" ? "Models" : providerName(g.key)}>
              {g.key !== "all" ? <GroupHeader provider={g.key} models={g.models} /> : null}
              <div className="hidden grid-cols-[minmax(0,1fr)_repeat(3,8.5rem)_2.5rem] gap-4 px-5 pb-2 text-xs text-faint lg:grid">
                <span>Model</span>
                {g.models.some((m) => m.price?.tokens && !m.price.units) ? (
                  <>
                    <span>Input / 1M</span>
                    <span>Output / 1M</span>
                  </>
                ) : (
                  <span className="col-span-2">Price</span>
                )}
                <span>Discount</span>
                <span />
              </div>
              <ul className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
                {g.models.map((m) => (
                  <ModelRow key={m.id} model={m} showProvider={g.key === "all"} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function GroupHeader({ provider, models }: { provider: string; models: CatalogModel[] }) {
  const max = models.reduce((n, m) => Math.max(n, m.discountPct), 0);
  return (
    <div className="mb-3 flex items-center gap-3">
      <ProviderLogo provider={provider} />
      <h2 className="text-lg font-semibold text-ink">{providerName(provider)}</h2>
      <span className="tnum text-sm text-faint">{models.length}</span>
      {max > 0 ? <span className="tnum ml-auto text-sm font-medium text-accent">Up to {max}% off</span> : null}
    </div>
  );
}

function ModelRow({ model: m, showProvider }: { model: CatalogModel; showProvider: boolean }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = m.price?.tokens;
  const lt = m.list?.tokens;
  const tokenPriced = !!t && !m.price?.units && !(m.kind === "image" && t.output === 0);
  const panelId = `rates-${m.id.replace(/[^a-z0-9]/gi, "-")}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(m.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // clipboard blocked
    }
  };

  return (
    <li>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-5 py-4 lg:grid-cols-[minmax(0,1fr)_repeat(3,8.5rem)_2.5rem]">
        <div className="flex min-w-0 items-center gap-3">
          {showProvider ? <ProviderLogo provider={m.provider} size="sm" /> : null}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium text-ink">{m.name}</span>
              {m.kind !== "text" ? (
                <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] capitalize text-muted">{m.kind}</span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={copy}
              className="group mt-0.5 inline-flex max-w-full items-center gap-1.5 font-mono text-xs text-faint hover:text-ink"
              aria-label={`Copy model id ${m.id}`}
            >
              <span className="truncate">{m.id}</span>
              {copied ? (
                <Check size={12} strokeWidth={2} className="shrink-0 text-accent" />
              ) : (
                <Copy size={12} strokeWidth={1.75} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile summary */}
        <div className="flex items-center gap-2 lg:hidden">
          <DiscountBadge pct={m.discountPct} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? `Hide ${m.name} rates` : `Show ${m.name} rates`}
            className="grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
          >
            <ChevronDown size={17} strokeWidth={1.75} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
        <div className="col-span-2 lg:hidden">
          {m.headline ? (
            <p className="tnum text-sm">
              <RatePair price={m.headline.price} list={m.discountPct > 0 ? m.headline.list : undefined} />{" "}
              <span className="text-muted">{m.headline.unit}</span>
            </p>
          ) : (
            <p className="text-sm text-muted">Price on request</p>
          )}
        </div>

        {/* Desktop columns */}
        {tokenPriced ? (
          <>
            <div className="hidden text-[15px] lg:block">
              <RatePair price={t!.input} list={lt?.input} />
            </div>
            <div className="hidden text-[15px] lg:block">
              <RatePair price={t!.output} list={lt?.output} />
            </div>
          </>
        ) : (
          <div className="col-span-2 hidden text-[15px] lg:block">
            {m.headline ? (
              <span className="tnum">
                <RatePair price={m.headline.price} list={m.discountPct > 0 ? m.headline.list : undefined} />{" "}
                <span className="text-sm text-muted">{m.headline.unit}</span>
              </span>
            ) : (
              <span className="text-muted">Price on request</span>
            )}
          </div>
        )}
        <div className="hidden lg:block">
          {m.discountPct > 0 ? <DiscountBadge pct={m.discountPct} /> : <span className="text-sm text-faint">List price</span>}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? `Hide ${m.name} rates` : `Show ${m.name} rates`}
          className="hidden size-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-ink lg:grid"
        >
          <ChevronDown size={17} strokeWidth={1.75} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            key="rates"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-line bg-bg/60 px-5 py-5">
              <RateDetails model={m} />
              {m.discountPct > 0 && m.headline ? (
                <p className="tnum mt-5 text-sm text-muted">
                  You save {usd(m.headline.list - m.headline.price)} {m.headline.unit} compared with provider list price.
                </p>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
