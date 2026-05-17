import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";
import { getAllGlossary } from "@/lib/glossary";
import { BLOG_ENABLED } from "@/lib/flags";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/mpp", priority: 0.9, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "weekly" },
    { path: "/docs", priority: 0.9, changeFrequency: "weekly" },
    ...(BLOG_ENABLED ? [{ path: "/blog", priority: 0.8, changeFrequency: "weekly" as const }] : []),
    { path: "/glossary", priority: 0.7, changeFrequency: "monthly" },
    { path: "/demos", priority: 0.8, changeFrequency: "weekly" },
    { path: "/stats", priority: 0.7, changeFrequency: "daily" },
    { path: "/security", priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  const staticEntries = routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const postEntries = BLOG_ENABLED
    ? getAllPosts().map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date((post.updated ?? post.date) + "T00:00:00Z"),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }))
    : [];

  const glossaryEntries = getAllGlossary().map((entry) => ({
    url: `${SITE_URL}/glossary/${entry.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries, ...glossaryEntries];
}
