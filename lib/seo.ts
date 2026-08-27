import type { Metadata } from "next";
import { SITE_URL, type FaqItem, type PostContent } from "@/lib/blog";
import { getAuthor } from "@/lib/authors";

const PUBLISHER_LOGO = "/tokenmart-logo.jpeg";
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export const SITE_NAME = "TokenMart";

export const SITE_DESCRIPTION =
  "Same GPT, Claude, Gemini and 40+ models at up to 65% below retail. Real savings from GPU-level optimization — not routing tricks.";

export const RSS_URL = `${SITE_URL}/rss.xml`;

/**
 * Feed discovery. Lives here rather than on the root layout because Next.js
 * replaces whole nested metadata objects — a page setting `alternates` for its
 * canonical would otherwise drop the layout's feed link.
 */
const FEED_ALTERNATES = {
  types: { "application/rss+xml": RSS_URL },
} as const;

function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

/**
 * Per-page canonical + Open Graph.
 *
 * Every route must call this (or set `alternates` itself). The root layout
 * deliberately declares no canonical: Next.js merges metadata by replacing
 * whole nested objects, so a canonical on the layout is inherited verbatim by
 * every page that doesn't override it — which is how /models, /signup and
 * /terms-and-services all ended up declaring the homepage as their canonical
 * and dropping out of the index. With no layout canonical, a route that
 * forgets to set one self-canonicalizes, which is the safe default.
 */
export function buildPageMetadata({
  path,
  title,
  description = SITE_DESCRIPTION,
  absoluteTitle = false,
}: {
  path: string;
  /** Bare page name — the root layout appends " · TokenMart". */
  title: string;
  description?: string;
  /** Opt out of the layout's title template (the homepage is just "TokenMart"). */
  absoluteTitle?: boolean;
}): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const ogTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, ...FEED_ALTERNATES },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      title: ogTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}

/** Routes that must never reach the index (empty, internal or demo-only). */
export const NOINDEX: Metadata = {
  robots: { index: false, follow: false },
};

export function postUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

export function buildPostMetadata(post: PostContent): Metadata {
  const url = post.canonical || postUrl(post.slug);
  const ogImage = post.ogImage || post.coverImage;
  const articleSection = post.tags?.[0];
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url, ...FEED_ALTERNATES },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      siteName: "TokenMart",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [getAuthor(post.author).name],
      section: articleSection,
      tags: post.tags,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: OG_WIDTH,
              height: OG_HEIGHT,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ogImage ? [{ url: ogImage, alt: post.title }] : undefined,
    },
  };
}

export function buildArticleJsonLd(post: PostContent): Record<string, unknown> {
  const author = getAuthor(post.author);
  const url = post.canonical || postUrl(post.slug);
  const image = post.ogImage || post.coverImage;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: author.name,
      url: author.url,
    },
    publisher: {
      "@type": "Organization",
      name: "TokenMart",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(PUBLISHER_LOGO),
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: image ? [absoluteUrl(image)] : undefined,
    articleSection: post.tags?.[0],
    keywords: post.tags?.join(", "),
    wordCount: post.wordCount,
    inLanguage: "en",
  };
}

export function buildFaqJsonLd(faq: FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TokenMart",
    url: SITE_URL,
    inLanguage: "en",
  };
}

export type BreadcrumbItem = { name: string; url: string };

export function buildBreadcrumbJsonLd(
  items: BreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildBlogIndexJsonLd(
  posts: { slug: string; title: string; description: string; publishedAt: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "TokenMart Blog",
    url: `${SITE_URL}/blog`,
    inLanguage: "en",
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.publishedAt,
      url: postUrl(p.slug),
    })),
  };
}
