import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { BlogCard, formatPostDate } from "@/components/blog/BlogCard";
import { BlogCover } from "@/components/blog/BlogCover";
import { CatPills } from "@/components/blog/CatPills";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Container } from "@/components/site/Container";
import { PageShell } from "@/components/site/PageShell";
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
  const related = (await listPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}

      <article className="pb-16 pt-10 lg:pt-14">
        <Container className="max-w-[760px]">
          <Link href="/blog" className="group inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
            <ArrowLeft size={15} strokeWidth={1.75} className="transition-transform group-hover:-translate-x-0.5" />
            All articles
          </Link>

          <div className="mt-8">
            <CatPills cats={post.tags ?? []} max={3} />
          </div>
          <h1 className="mt-4 text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-ink md:text-5xl">
            {post.title}
          </h1>
          <p className="tnum mt-5 text-sm text-muted">
            By {author.name}, <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, "long")}</time>,{" "}
            {post.readingMinutes} min read
          </p>
        </Container>

        <Container className="mt-10 max-w-[1040px]">
          <BlogCover coverImage={post.coverImage} title={post.title} className="aspect-[16/8]" priority />
        </Container>

        <Container className="mt-12 max-w-[760px]">
          <Prose>{content}</Prose>

          {post.faq && post.faq.length > 0 ? (
            <section className="mt-16 border-t border-line pt-10">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Frequently asked questions</h2>
              <dl className="mt-6 space-y-6">
                {post.faq.map((item) => (
                  <div key={item.q}>
                    <dt className="font-medium text-ink">{item.q}</dt>
                    <dd className="mt-1.5 leading-relaxed text-muted">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </Container>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-line py-16 lg:py-20">
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">Keep reading</h2>
            <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} showExcerpt={false} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <FinalCTA />
    </PageShell>
  );
}
