/* eslint-disable @next/next/no-img-element */

export function BlogCover({
  coverImage,
  title,
  className = "",
  priority = false,
}: {
  coverImage?: string;
  title: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[var(--radius-card)] bg-surface-2 ring-1 ring-line ${className}`}>
      {coverImage ? (
        <img
          src={coverImage}
          alt={title}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 90% at 20% 10%, var(--accent-soft), transparent 60%)" }}
        />
      )}
    </div>
  );
}
