import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { BlogCover } from "./BlogCover";
import { CatPills } from "./CatPills";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogCard({ post, showExcerpt = true }: { post: PostMeta; showExcerpt?: boolean }) {
  return (
    <Link className="blog-card" href={`/blog/${post.slug}`}>
      <BlogCover coverImage={post.coverImage} slug={post.slug} title={post.title} />
      <div className="blog-card-body">
        <CatPills cats={post.tags ?? []} />
        <h3 className="blog-card-title">{post.title}</h3>
        {showExcerpt ? <p className="blog-card-excerpt">{post.description}</p> : null}
        <div className="blog-card-meta">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="blog-dot">·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
      </div>
    </Link>
  );
}
