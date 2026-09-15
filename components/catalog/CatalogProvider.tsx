"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import type { Catalog } from "@/lib/catalog";

type Status = "snapshot" | "live" | "stale";

const CatalogContext = createContext<{ catalog: Catalog; status: Status } | null>(null);

function looksLikeCatalog(v: unknown): v is Catalog {
  const c = v as Catalog | null;
  return !!c && Array.isArray(c.models) && c.models.length > 0 && typeof c.stats?.modelCount === "number";
}

/**
 * Renders with the build snapshot, then swaps in /api/catalog (the Pages
 * Function that caches drr400000's public catalog for an hour). If the refresh
 * fails the snapshot stays on screen; nothing blanks out.
 */
export function CatalogProvider({ initial, children }: { initial: Catalog; children: ReactNode }) {
  const [catalog, setCatalog] = useState(initial);
  const [status, setStatus] = useState<Status>("snapshot");

  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/catalog", { signal: ac.signal, headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: unknown) => {
        if (looksLikeCatalog(data)) {
          setCatalog(data);
          setStatus("live");
        } else {
          setStatus("stale");
        }
      })
      .catch(() => {
        if (!ac.signal.aborted) setStatus("stale");
      });
    return () => ac.abort();
  }, []);

  return (
    <CatalogContext.Provider value={{ catalog, status }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used inside <CatalogProvider>");
  return ctx;
}

/** For shared components that also render outside a catalog page. */
export function useOptionalCatalog() {
  return useContext(CatalogContext);
}
