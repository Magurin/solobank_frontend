import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { BreadcrumbsJsonLd } from "@/components/seo/Breadcrumbs";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import { BLOG_ENABLED } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Blog — Bank Accounts, Wallets and Payments for AI Agents",
  description:
    "Deep dives on giving AI agents their own bank accounts, wallets, and payment rails — architectures, tradeoffs, and how-tos for builders of autonomous systems.",
  keywords: [
    "AI agent banking blog",
    "bank account for AI agents",
    "agentic finance",
    "autonomous agent payments",
    "Solana AI agents",
    "Machine Payments Protocol",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Solobank Blog — Banking and Payments for AI Agents",
    description:
      "Deep dives on giving AI agents their own bank accounts, wallets, and payment rails.",
    url: "/blog",
    type: "website",
  },
  twitter: {
    title: "Solobank Blog — Banking and Payments for AI Agents",
    description:
      "Deep dives on giving AI agents their own bank accounts, wallets, and payment rails.",
  },
};

export default function BlogIndexPage(): React.ReactElement {
  if (!BLOG_ENABLED) notFound();
  const posts = getAllPosts();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <BreadcrumbsJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />

      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>

        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Blog</h1>
          <p className="mt-4 text-muted text-lg max-w-2xl">
            Deep dives on giving AI agents their own bank accounts, wallets, and
            payment rails — architectures, tradeoffs, and how-tos for builders of
            autonomous systems.
          </p>
        </header>

        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block bg-surface border border-border rounded-2xl p-6 hover:border-border-hover transition-colors group"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-dim mb-3">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                  <span className="text-dim">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} />
                    {post.readingMinutes} min read
                  </span>
                  {post.tags.length > 0 && (
                    <>
                      <span className="text-dim">·</span>
                      <span className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-solana-green/10 text-solana-green text-[10px] tracking-wide"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    </>
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight group-hover:text-solana-green transition-colors">
                  {post.title}
                </h2>
                <p className="mt-3 text-muted text-[15px] leading-relaxed">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-solana-green">
                  Read article <ArrowRight size={14} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
