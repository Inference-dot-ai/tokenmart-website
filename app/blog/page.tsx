import type { Metadata } from "next";
import Link from "next/link";
import { BlogCard, formatPostDate } from "@/components/blog/BlogCard";
import { BlogCover } from "@/components/blog/BlogCover";
import { CatPills } from "@/components/blog/CatPills";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Container } from "@/components/site/Container";
import { PageShell } from "@/components/site/PageShell";
import { listPosts, SITE_URL } from "@/lib/blog";
import { buildBlogIndexJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog · TokenMart",
  description: `Pricing, infrastructure and product notes from the TokenMart team. ${SITE_TAGLINE}`,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Blog · TokenMart",
    description: "Pricing, infrastructure and product notes from the TokenMart team.",
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
  const [lead, ...rest] = posts;

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />

      <Container className="pb-20 pt-12 lg:pt-16">
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-[-0.035em] text-ink md:text-5xl">
          Notes on model pricing and the cost of inference
        </h1>
        <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-muted">
          Why the same model can cost more depending on where you buy it, and how to pay less.
        </p>

        {!lead ? (
          <div className="mt-12 rounded-[var(--radius-card)] border border-dashed border-line-strong p-12 text-center text-muted">
            No posts published yet.
          </div>
        ) : (
          <>
            <Link href={`/blog/${lead.slug}`} className="group mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <BlogCover
                coverImage={lead.coverImage}
                title={lead.title}
                priority
                className="aspect-[16/10] transition-shadow duration-300 group-hover:shadow-lift lg:col-span-7"
              />
              <div className="lg:col-span-5">
                <CatPills cats={lead.tags ?? []} />
                <h2 className="mt-4 text-balance text-2xl font-semibold leading-tight tracking-[-0.02em] text-ink transition-colors group-hover:text-accent md:text-3xl">
                  {lead.title}
                </h2>
                <p className="mt-4 leading-relaxed text-muted">{lead.description}</p>
                <p className="tnum mt-5 text-sm text-faint">
                  {formatPostDate(lead.publishedAt, "long")}, {lead.readingMinutes} min read
                </p>
              </div>
            </Link>
            <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </>
        )}
      </Container>

      <FinalCTA />
    </PageShell>
  );
}
