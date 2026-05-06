import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export type FaqItem = { q: string; a: string };

export type PostFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags?: string[];
  coverImage?: string;
  ogImage?: string;
  draft?: boolean;
  canonical?: string;
  faq?: FaqItem[];
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingMinutes: number;
  wordCount: number;
};

export type PostContent = PostMeta & {
  body: string;
};

async function readMdxFiles(): Promise<string[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    return files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  } catch {
    return [];
  }
}

function slugFromFilename(file: string): string {
  return file.replace(/\.mdx?$/, "");
}

function toMeta(file: string, raw: string): PostContent | null {
  const { data, content } = matter(raw);
  const fm = data as Partial<PostFrontmatter>;
  if (!fm.title || !fm.description || !fm.publishedAt || !fm.author) {
    return null;
  }
  if (fm.draft && process.env.NODE_ENV === "production") {
    return null;
  }
  const stats = readingTime(content);
  return {
    slug: slugFromFilename(file),
    title: fm.title,
    description: fm.description,
    publishedAt: String(fm.publishedAt),
    updatedAt: fm.updatedAt ? String(fm.updatedAt) : undefined,
    author: fm.author,
    tags: fm.tags ?? [],
    coverImage: fm.coverImage,
    ogImage: fm.ogImage,
    draft: fm.draft ?? false,
    canonical: fm.canonical,
    faq: fm.faq,
    readingMinutes: Math.max(1, Math.ceil(stats.minutes)),
    wordCount: stats.words,
    body: content,
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const files = await readMdxFiles();
  return files.map(slugFromFilename);
}

export async function listPosts(): Promise<PostMeta[]> {
  const files = await readMdxFiles();
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf8");
      return toMeta(file, raw);
    }),
  );
  return posts
    .filter((p): p is PostContent => p !== null)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .map((post) => {
      const meta: PostMeta = {
        slug: post.slug,
        title: post.title,
        description: post.description,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
        author: post.author,
        tags: post.tags,
        coverImage: post.coverImage,
        ogImage: post.ogImage,
        draft: post.draft,
        canonical: post.canonical,
        faq: post.faq,
        readingMinutes: post.readingMinutes,
        wordCount: post.wordCount,
      };
      return meta;
    });
}

export async function getPost(slug: string): Promise<PostContent | null> {
  const safe = slug.replace(/[^a-z0-9-]/gi, "");
  if (!safe) return null;
  for (const ext of [".mdx", ".md"]) {
    const file = `${safe}${ext}`;
    try {
      const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf8");
      return toMeta(file, raw);
    } catch {
      // try next extension
    }
  }
  return null;
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://thetokenmart.ai";
