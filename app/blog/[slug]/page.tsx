import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { PostHeader } from "@/components/blog/PostHeader";
import { Prose } from "@/components/blog/Prose";
import { blogMdxComponents } from "@/components/blog/mdx-components";
import Link from "next/link";
import { getAllSlugs, getPost, SITE_URL } from "@/lib/blog";
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <header className="flex justify-center pt-4">
        <Navbar fixed={false} />
      </header>

      <main className="flex-1 w-full pt-10 pb-24">
        <article className="w-full max-w-3xl mx-auto px-6 md:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 text-xs font-medium tracking-wider uppercase"
            style={{ color: "var(--color-text-muted)" }}
          >
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link
                  href="/"
                  className="hover:underline"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href="/blog"
                  className="hover:underline"
                  style={{ color: "var(--color-text-dim)" }}
                >
                  Blog
                </Link>
              </li>
            </ol>
          </nav>
          <PostHeader post={post} />
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
                    <dt
                      className="font-semibold mb-1.5"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.q}
                    </dt>
                    <dd
                      className="leading-relaxed"
                      style={{ color: "var(--color-text-dim)" }}
                    >
                      {item.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </article>
      </main>

      <Footer />
    </div>
  );
}
