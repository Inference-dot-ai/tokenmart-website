/** "$21.25", "$0.425", "$0.0298". Prices are USD and never negative. */
export function usd(n: number): string {
  if (!Number.isFinite(n)) return "-";
  if (n === 0) return "$0";
  if (n >= 100) return `$${n.toFixed(0)}`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  if (n >= 0.1) return `$${trimTo(n.toFixed(3), 2)}`;
  return `$${trimTo(n.toPrecision(3), 2)}`;
}

/** Drop trailing zeros but keep at least `min` decimals. */
function trimTo(s: string, min: number): string {
  if (!s.includes(".")) return s;
  const [int, dec] = s.split(".");
  let d = dec.replace(/0+$/, "");
  while (d.length < min) d += "0";
  return `${int}.${d}`;
}

/** 272000 -> "272K", 1000000 -> "1M". */
export function tokensShort(n: number): string {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

export function money(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
