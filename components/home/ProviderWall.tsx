/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { useCatalog } from "@/components/catalog/CatalogProvider";
import { Container } from "@/components/site/Container";
import { providersIn } from "@/lib/catalog-select";
import { getProvider, providerLogo } from "@/lib/providers";

/** Logos only. Scrolls as a marquee only when the row does not fit. */
export function ProviderWall() {
  const { catalog } = useCatalog();
  const providers = providersIn(catalog)
    .map((k) => getProvider(k))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const wrapRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLUListElement>(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const row = rowRef.current;
    if (!wrap || !row) return;
    const measure = () => setOverflow(row.scrollWidth > wrap.clientWidth + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [providers.length]);

  if (providers.length === 0) return null;

  const item = (p: (typeof providers)[number], dup = false) => (
    <li key={`${p.key}${dup ? "-dup" : ""}`} aria-hidden={dup || undefined} className="flex shrink-0 items-center gap-3 px-5">
      <span className="grid size-10 place-items-center rounded-xl bg-logo-tile p-2 ring-1 ring-black/5">
        <img src={providerLogo(p)} alt={dup ? "" : p.name} width={40} height={40} className="size-full object-contain" />
      </span>
    </li>
  );

  return (
    <section aria-label="Model providers" className="border-y border-line bg-surface/60">
      <Container>
        <div
          ref={wrapRef}
          data-marquee={overflow ? "on" : "off"}
          className="relative overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]"
        >
          <div className={`marquee-track flex w-max ${overflow ? "" : "mx-auto"}`}>
            <ul ref={rowRef} className="flex">
              {providers.map((p) => item(p))}
            </ul>
            {overflow ? <ul className="flex">{providers.map((p) => item(p, true))}</ul> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
