import Link from "next/link";
import type { PostMeta } from "@/lib/blog";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl p-6 transition-all duration-200 h-full"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 1px 2px var(--color-card-shadow)",
      }}
    >
      {post.coverImage ? (
        <div
          className="mb-5 rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--color-border)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-44 object-cover"
          />
        </div>
      ) : null}

      {post.tags && post.tags.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
              style={{
                background: "var(--pink-lo)",
                color: "var(--pink)",
                border: "1px solid var(--border-pink)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <h3
        className="text-xl md:text-2xl font-bold leading-tight tracking-tight transition-colors"
        style={{ color: "var(--color-text)" }}
      >
        <span className="bg-[length:0%_2px] bg-no-repeat bg-bottom transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]"
          style={{ backgroundImage: "linear-gradient(var(--pink), var(--pink))" }}
        >
          {post.title}
        </span>
      </h3>

      <p
        className="mt-3 text-sm leading-relaxed line-clamp-3"
        style={{ color: "var(--color-text-dim)" }}
      >
        {post.description}
      </p>

      <div
        className="mt-5 flex items-center gap-2 text-xs"
        style={{ color: "var(--color-text-muted)" }}
      >
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingMinutes} min read</span>
      </div>
    </Link>
  );
}
