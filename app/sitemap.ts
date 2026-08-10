import type { MetadataRoute } from "next";
import { listPosts, SITE_URL } from "@/lib/blog";

export const dynamic = "force-static";

// `changeFrequency` and `priority` are omitted deliberately — Google ignores
// both, so they were pure noise.
//
// `lastModified` is only set where a real content date exists. It used to be
// `new Date()` for every static entry, which bumped the timestamp on every
// deploy whether or not the page changed; Google discards lastmod once it
// looks auto-generated, which cost us the signal on the blog posts too.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPosts();

  const postDate = (post: (typeof posts)[number]) =>
    new Date(post.updatedAt ?? post.publishedAt);

  const newestPost = posts.reduce<Date | undefined>((latest, post) => {
    const date = postDate(post);
    return !latest || date > latest ? date : latest;
  }, undefined);

  // /models is excluded: app/models/page.tsx calls notFound(), so the route
  // renders an empty document served with HTTP 200. Listing it told Google to
  // crawl a soft 404 daily at priority 0.9.
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/signup` },
    { url: `${SITE_URL}/blog`, lastModified: newestPost },
    { url: `${SITE_URL}/terms-and-services` },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: postDate(post),
  }));

  return [...staticEntries, ...postEntries];
}
