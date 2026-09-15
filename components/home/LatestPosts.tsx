import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { Container } from "@/components/site/Container";
import type { PostMeta } from "@/lib/blog";

export function LatestPosts({ posts }: { posts: PostMeta[] }) {
  const [lead, ...rest] = posts;
  if (!lead) return null;
  return (
    <section className="border-t border-line py-20 lg:py-28">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-ink md:text-[42px] md:leading-[1.08]">
            Latest from the blog
          </h2>
          <Link href="/blog" className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink">
            All articles
            <ArrowRight size={15} strokeWidth={1.75} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BlogCard post={lead} />
          </div>
          <div className="flex flex-col gap-8 lg:col-span-5">
            {rest.slice(0, 3).map((p) => (
              <BlogCard key={p.slug} post={p} layout="row" />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
