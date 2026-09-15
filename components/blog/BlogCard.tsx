import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { BlogCover } from "./BlogCover";
import { CatPills } from "./CatPills";

export function formatPostDate(iso: string, month: "short" | "long" = "short"): string {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month, day: "numeric" });
}

export function BlogCard({
  post,
  showExcerpt = true,
  layout = "stack",
}: {
  post: PostMeta;
  showExcerpt?: boolean;
  layout?: "stack" | "row";
}) {
  if (layout === "row") {
    return (
      <Link href={`/blog/${post.slug}`} className="group grid grid-cols-[112px_1fr] items-start gap-4 sm:grid-cols-[160px_1fr]">
        <BlogCover coverImage={post.coverImage} title={post.title} className="aspect-[4/3]" />
        <div className="min-w-0">
          <h3 className="line-clamp-3 text-[15px] font-medium leading-snug text-ink transition-colors group-hover:text-accent sm:text-base">
            {post.title}
          </h3>
          <p className="tnum mt-2 text-xs text-faint">
            {formatPostDate(post.publishedAt)}, {post.readingMinutes} min read
          </p>
        </div>
      </Link>
    );
  }
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col">
      <BlogCover
        coverImage={post.coverImage}
        title={post.title}
        className="aspect-[16/10] transition-shadow duration-300 group-hover:shadow-lift"
      />
      <div className="mt-4 flex flex-col gap-2.5">
        <CatPills cats={post.tags ?? []} />
        <h3 className="text-balance text-lg font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        {showExcerpt ? <p className="line-clamp-2 text-[15px] leading-relaxed text-muted">{post.description}</p> : null}
        <p className="tnum text-xs text-faint">
          {formatPostDate(post.publishedAt)}, {post.readingMinutes} min read
        </p>
      </div>
    </Link>
  );
}
