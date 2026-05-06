import type { Metadata } from "next";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { PostCard } from "@/components/blog/PostCard";
import { listPosts, SITE_URL } from "@/lib/blog";
import {
  buildBlogIndexJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog · TokenMart",
  description:
    "Pricing, infrastructure and product notes from the TokenMart team. Same GPT, Claude, Gemini and 40+ models — at up to 65% below retail.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Blog · TokenMart",
    description:
      "Pricing, infrastructure and product notes from the TokenMart team.",
    siteName: "TokenMart",
  },
};

export default async function BlogIndex() {
  const posts = await listPosts();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Blog", url: `${SITE_URL}/blog` },
  ]);
  const blogJsonLd = buildBlogIndexJsonLd(posts);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <header className="flex justify-center pt-4">
        <Navbar fixed={false} />
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 md:px-10 pt-12 pb-24">
        <div className="text-center mb-14">
          <p
            className="text-[11px] font-bold tracking-[0.25em] uppercase mb-4"
            style={{ color: "var(--pink)" }}
          >
            The TokenMart Blog
          </p>
          <h1
            className="text-4xl md:text-6xl font-[family-name:var(--font-display)] tracking-tight leading-[1.05]"
            style={{ color: "var(--color-text)" }}
          >
            Notes on pricing, infrastructure
            <br className="hidden md:block" /> and the cost of inference.
          </h1>
          <p
            className="mt-5 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--color-text-dim)" }}
          >
            Why the same model can cost 3× more depending on who you buy it
            from — and what we do about it.
          </p>
        </div>

        {posts.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{
              background: "var(--color-surface)",
              border: "1px dashed var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            No posts published yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
