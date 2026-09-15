/* eslint-disable @next/next/no-img-element */
import { getProvider, providerLogo } from "@/lib/providers";

const SIZES = { sm: "size-7 rounded-md p-1", md: "size-9 rounded-lg p-1.5", lg: "size-11 rounded-xl p-2" } as const;

/** Brand marks ship as dark glyphs, so they always sit on a light tile. */
export function ProviderLogo({ provider, size = "md" }: { provider: string; size?: keyof typeof SIZES }) {
  const p = getProvider(provider);
  if (!p) {
    return <span className={`grid shrink-0 place-items-center bg-surface-2 text-xs font-semibold text-muted ${SIZES[size]}`}>AI</span>;
  }
  return (
    <span className={`grid shrink-0 place-items-center bg-logo-tile ring-1 ring-black/5 ${SIZES[size]}`}>
      <img src={providerLogo(p)} alt="" width={40} height={40} loading="lazy" className="size-full object-contain" />
    </span>
  );
}

export function providerName(key: string): string {
  return getProvider(key)?.name ?? "Other";
}
