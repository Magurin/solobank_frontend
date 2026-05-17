import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { BreadcrumbsJsonLd } from "@/components/seo/Breadcrumbs";
import { BlogContent } from "@/components/blog/BlogContent";
import {
  getAllPosts,
  getPost,
  getAdjacentPosts,
  formatPostDate,
  extractFaqs,
} from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { BLOG_ENABLED } from "@/lib/flags";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  if (!BLOG_ENABLED) return [];
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
      images: post.ogImage ? [post.ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.ogImage ? [post.ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: RouteParams): Promise<React.ReactElement> {
  if (!BLOG_ENABLED) notFound();
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);
  const faqs = extractFaqs(post);
  const url = `${SITE_URL}/blog/${post.slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "en",
    keywords: post.keywords.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
    },
    image: post.ogImage ? [`${SITE_URL}${post.ogImage}`] : undefined,
  };

  const faqLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a.replace(/\*\*/g, "").replace(/`/g, ""),
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <BreadcrumbsJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <article className="max-w-3xl mx-auto px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Back to blog
        </Link>

        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 text-xs text-dim mb-4">
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
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{post.title}</h1>
          <p className="mt-5 text-muted text-lg leading-relaxed">{post.description}</p>
        </header>

        <BlogContent blocks={post.blocks} />

        <div className="mt-16 pt-8 border-t border-border grid sm:grid-cols-2 gap-4">
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="bg-surface border border-border rounded-xl p-4 hover:border-border-hover transition-colors group"
            >
              <span className="text-xs text-dim flex items-center gap-1.5">
                <ArrowLeft size={12} /> Previous
              </span>
              <span className="block mt-1.5 text-sm font-semibold text-foreground group-hover:text-solana-green transition-colors">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="bg-surface border border-border rounded-xl p-4 hover:border-border-hover transition-colors group text-right"
            >
              <span className="text-xs text-dim flex items-center gap-1.5 justify-end">
                Next <ArrowRight size={12} />
              </span>
              <span className="block mt-1.5 text-sm font-semibold text-foreground group-hover:text-solana-green transition-colors">
                {next.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </div>

        <div className="mt-10 bg-surface border border-border rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-foreground mb-2">
            Give your AI agent a bank account on Solana
          </h3>
          <p className="text-muted text-sm mb-4">
            Five accounts, MCP server out of the box, sub-second USDC payments.
          </p>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-sm text-solana-green hover:underline"
          >
            Read the docs <ArrowRight size={14} />
          </Link>
        </div>
      </article>
    </div>
  );
}
