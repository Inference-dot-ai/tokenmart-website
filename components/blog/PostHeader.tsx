import type { PostMeta } from "@/lib/blog";
import { getAuthor } from "@/lib/authors";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostHeader({ post }: { post: PostMeta }) {
  const author = getAuthor(post.author);

  return (
    <header className="mb-10">
      {post.tags && post.tags.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-1.5 justify-center">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full"
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

      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-display)] tracking-tight leading-[1.1] text-center"
        style={{ color: "var(--color-text)" }}
      >
        {post.title}
      </h1>

      <p
        className="mt-5 text-base md:text-lg leading-relaxed text-center max-w-2xl mx-auto"
        style={{ color: "var(--color-text-dim)" }}
      >
        {post.description}
      </p>

      <div
        className="mt-7 flex items-center justify-center gap-3 text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        <span style={{ color: "var(--color-text-dim)" }}>{author.name}</span>
        <span aria-hidden>·</span>
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingMinutes} min read</span>
      </div>

      {post.coverImage ? (
        <div
          className="mt-10 rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--color-border)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full max-h-[480px] object-cover"
          />
        </div>
      ) : null}
    </header>
  );
}
