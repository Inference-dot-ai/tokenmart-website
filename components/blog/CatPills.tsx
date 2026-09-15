function pretty(tag: string): string {
  return tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function CatPills({ cats, max = 2 }: { cats: string[]; max?: number }) {
  if (!cats || cats.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {cats.slice(0, max).map((c) => (
        <span key={c} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted">
          {pretty(c)}
        </span>
      ))}
    </div>
  );
}
