import type { Metadata } from "next";
import { TMHeader } from "@/components/tm/Header";
import { DealTicker } from "@/components/tm/DealTicker";
import { TMFooter } from "@/components/tm/Footer";
import { FinalCTA } from "@/components/tm/FinalCTA";
import { BlogCard } from "@/components/tm/blog/BlogCard";
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
    <div className="tm-root bg-grid">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <TMHeader activeBlog />
      <DealTicker />

      <main>
        <section className="blog-lead">
          <div className="blog-eyebrow">THE TOKENMART BLOG</div>
          <h1 className="blog-lead-h">
            Notes on pricing, infrastructure and the cost of inference.
          </h1>
          <p className="blog-lead-sub">
            Why the same model can cost 3× more depending on who you buy it from — and what we do
            about it.
          </p>
        </section>

        <section className="blog-list">
          {posts.length === 0 ? (
            <div
              style={{
                maxWidth: 1240,
                margin: "0 auto",
                padding: "40px",
                textAlign: "center",
                background: "var(--panel)",
                border: "1px dashed var(--line2)",
                borderRadius: 18,
                color: "var(--mute)",
              }}
            >
              No posts published yet.
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </section>

        <FinalCTA />
      </main>

      <TMFooter />
    </div>
  );
}
