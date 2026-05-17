"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Layers, Settings, BookOpen, ExternalLink, Play, Zap, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/context";
import { BLOG_ENABLED } from "@/lib/flags";

export function Navbar(): React.ReactElement {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { label: "Live Demos", href: "/demos", icon: Play },
    { label: "MPP", href: "/mpp", icon: Zap },
    { label: t.nav.docs, href: "/docs", icon: BookOpen },
    ...(BLOG_ENABLED ? [{ label: "Blog", href: "/blog", icon: FileText }] : []),
    { label: t.nav.github, href: "https://github.com/solobank-ai", external: true, icon: ExternalLink },
  ];

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[1001] transition-all duration-300",
          isScrolled || isMenuOpen
            ? "bg-background/90 backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
            <span className="text-lg font-bold tracking-tight gradient-text">
              Solobank
            </span>
          </Link>

          {/* Desktop nav — centered */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTA - removed */}

          {/* Mobile menu button — pushed to the right edge */}
          <button
            className="md:hidden ml-auto text-muted hover:text-foreground transition-colors p-2 -mr-2"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-16 z-[1000] bg-background/95 backdrop-blur-xl border-b border-border transition-all duration-300 origin-top",
          isMenuOpen
            ? "opacity-100 pointer-events-auto scale-y-100"
            : "opacity-0 pointer-events-none scale-y-95"
        )}
      >
        <div className="flex flex-col items-center py-8 px-6">
          <nav className="flex flex-col gap-1 w-full max-w-xs">
            {navLinks.map((link, i) => {
              const Icon = link.icon;
              const inner = (
                <div
                  className={cn(
                    "group flex items-center justify-center gap-3 py-3.5 border-l-2 border-transparent hover:border-solana-green transition-all duration-200",
                    isMenuOpen && "animate-[fadeInUp_0.3s_ease_forwards]"
                  )}
                  style={{ animationDelay: `${i * 60 + 80}ms`, opacity: isMenuOpen ? undefined : 0 }}
                >
                  {Icon && (
                    <Icon size={18} className="text-solana-green transition-colors" />
                  )}
                  <span className="text-lg font-medium text-muted group-hover:text-foreground transition-colors">
                    {link.label}
                  </span>
                </div>
              );

              return link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {inner}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {inner}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 w-full max-w-xs">
            <Link href="/docs" onClick={() => setIsMenuOpen(false)}>
              <Button variant="primary" size="lg" className="w-full">
                {t.nav.getStarted} <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 z-[999] bg-black/50"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
