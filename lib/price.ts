/**
 * Extract the first dollar amount from a free-text price string.
 * Returns null if no parseable amount is found.
 *
 * Examples:
 *   "$2.118"          -> 2.118
 *   "$0.036/img"      -> 0.036
 *   "$0.118/2 tracks" -> 0.118
 *   "Early access"    -> null
 *   ""                -> null
 */
export function extractPriceUSD(price: string): number | null {
  const match = price.match(/\$([\d.]+)/);
  if (!match) return null;
  const n = parseFloat(match[1]);
  return Number.isFinite(n) ? n : null;
}
