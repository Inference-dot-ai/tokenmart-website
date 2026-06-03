function pretty(tag: string): string {
  return tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function CatPills({ cats }: { cats: string[] }) {
  if (!cats || cats.length === 0) return null;
  return (
    <div className="blog-pills">
      {cats.slice(0, 3).map((c) => (
        <span className="blog-pill" key={c}>
          {pretty(c)}
        </span>
      ))}
    </div>
  );
}
