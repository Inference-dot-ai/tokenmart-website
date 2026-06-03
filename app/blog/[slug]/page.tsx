import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Link from "next/link";

import { TMHeader } from "@/components/tm/Header";
import { DealTicker } from "@/components/tm/DealTicker";
import { TMFooter } from "@/components/tm/Footer";
import { FinalCTA } from "@/components/tm/FinalCTA";
import { BlogCover } from "@/components/tm/blog/BlogCover";
import { CatPills } from "@/components/tm/blog/CatPills";
import { BlogCard } from "@/components/tm/blog/BlogCard";
import { coverFor } from "@/components/tm/blog/cover";
import { Prose } from "@/components/blog/Prose";
import { blogMdxComponents } from "@/components/blog/mdx-components";
import { getAllSlugs, getPost, listPosts, SITE_URL } from "@/lib/blog";
import { getAuthor } from "@/lib/authors";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildPostMetadata,
} from "@/lib/seo";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

type RouteParams = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return buildPostMetadata(post);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: RouteParams;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.body,
    components: blogMdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: { className: ["anchor"], ariaHidden: "true" },
            },
          ],
        ],
      },
    },
  });

  const articleJsonLd = buildArticleJsonLd(post);
  const faqJsonLd = post.faq && post.faq.length > 0 ? buildFaqJsonLd(post.faq) : null;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
  ]);

  const author = getAuthor(post.author);
  const markColor = coverFor(post.slug).c2;
  const related = (await listPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="tm-root bg-grid">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <TMHeader activeBlog />
      <DealTicker />

      <main>
        <article className="blog-article">
          <div className="blog-article-in">
            <Link className="blog-back" href="/blog">
              ← All articles
            </Link>

            <CatPills cats={post.tags ?? []} />
            <h1 className="blog-article-title">{post.title}</h1>

            <div className="blog-article-meta">
              <span className="blog-by-mark" style={{ background: markColor }}>
                {author.name.charAt(0)}
              </span>
              <span>By {author.name}</span>
              <span className="blog-dot">·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span className="blog-dot">·</span>
              <span>{post.readingMinutes} min read</span>
            </div>

            <BlogCover
              coverImage={post.coverImage}
              slug={post.slug}
              title={post.title}
              className="hero"
            />

            <Prose>{content}</Prose>

            {post.faq && post.faq.length > 0 ? (
              <section
                className="mt-16 rounded-2xl p-7"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <h2
                  className="text-2xl font-[family-name:var(--font-display)] mb-5"
                  style={{ color: "var(--color-text)" }}
                >
                  FAQ
                </h2>
                <dl className="flex flex-col gap-5">
                  {post.faq.map((item) => (
                    <div key={item.q}>
                      <dt className="font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>
                        {item.q}
                      </dt>
                      <dd className="leading-relaxed" style={{ color: "var(--color-text-dim)" }}>
                        {item.a}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>
        </article>

        {related.length > 0 ? (
          <section className="blog-related">
            <div className="blog-related-head">
              <h2 className="blog-related-h">More from the warehouse</h2>
            </div>
            <div className="blog-grid">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} showExcerpt={false} />
              ))}
            </div>
          </section>
        ) : null}

        <FinalCTA />
      </main>

      <TMFooter />
    </div>
  );
}
