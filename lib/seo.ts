import type { Metadata } from "next";
import { SITE_URL, type FaqItem, type PostContent } from "@/lib/blog";
import { getAuthor } from "@/lib/authors";

const PUBLISHER_LOGO = "/tokenmart-logo.jpeg";
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

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
    alternates: { canonical: url },
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
