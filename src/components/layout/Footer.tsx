"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { BLOG_ENABLED } from "@/lib/flags";

export function Footer(): React.ReactElement {
  const { t } = useTranslation();

  const footerLinks = {
    [t.footer.product]: [
      { label: "Live Demos", href: "/demos" },
      { label: "MPP", href: "/mpp" },
      { label: t.nav.docs, href: "/docs" },
    ],
    [t.footer.gateway]: [
      { label: t.footer.services, href: "/services" },
      { label: t.footer.stats, href: "/stats" },
    ],
    [t.footer.resources]: [
      ...(BLOG_ENABLED ? [{ label: "Blog", href: "/blog" }] : []),
      { label: "Glossary", href: "/glossary" },
      { label: "GitHub", href: "https://github.com/solobank-ai", external: true },
      { label: "npm", href: "https://www.npmjs.com/package/@solobank/cli", external: true },
    ],
    [t.footer.legal]: [
      { label: t.footer.terms, href: "/terms" },
      { label: t.footer.privacy, href: "/privacy" },
      { label: t.footer.security, href: "/security" },
    ],
  };

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top */}
        <div className="flex items-center gap-3 mb-12">
          <span className="text-lg font-bold gradient-text">Solobank</span>
          <span className="text-dim text-sm">·</span>
          <span className="text-dim text-sm">{t.footer.builtOn}</span>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-sm font-medium text-foreground mb-4">
                {category}
              </p>
              <ul className="space-y-1">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted hover:text-foreground transition-colors inline-flex items-center gap-1 py-1"
                      >
                        {link.label}
                        <ArrowUpRight size={12} className="opacity-50" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted hover:text-foreground transition-colors block py-1"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-dim">{t.footer.copyright}</p>
          <p className="text-xs text-dim">{t.footer.builtOn}</p>
        </div>
      </div>
    </footer>
  );
}
