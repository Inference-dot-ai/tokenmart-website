export function DiscountBadge({ pct, size = "sm" }: { pct: number; size?: "sm" | "lg" }) {
  if (pct <= 0) return null;
  const cls =
    size === "lg"
      ? "h-7 px-2.5 text-sm"
      : "h-6 px-2 text-xs";
  return (
    <span
      className={`tnum inline-flex items-center rounded-full bg-accent font-semibold text-accent-ink ${cls}`}
      aria-label={`${pct} percent off list price`}
    >
      -{pct}%
    </span>
  );
}
