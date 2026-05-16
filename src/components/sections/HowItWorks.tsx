"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  HowItWorks — interactive progress track                            */
/*                                                                     */
/*  Three steps along a horizontal track. Clicking a marker swaps in   */
/*  the matching panel below (title + description + sample command).   */
/*  Terminal output uses the same syntax-highlight palette as the      */
/*  hero Terminal: wallet addresses purple, values green, labels dim.  */
/* ------------------------------------------------------------------ */

interface Step {
  n: number;
  duration: string;
  title: string;
  description: string;
  lines: string[]; // first line is the `$ command`
}

const STEPS: Step[] = [
  {
    n: 1,
    duration: "30s",
    title: "Install",
    description:
      "One command. Wallet, MCP server, and safeguards — all set up and guided.",
    lines: [
      "$ npx -y @solobank/cli@latest init",
      "Wallet created: 7xKp...3mNq",
      "MCP server configured",
      "Safeguards: $100/tx · $500/day",
    ],
  },
  {
    n: 2,
    duration: "1 min",
    title: "Fund",
    description:
      "Send USDC to your wallet address. Gas and routing are handled automatically.",
    lines: [
      "$ solobank balance",
      "SOL:   0.05 SOL",
      "USDC:  $148.91 USDC",
      "",
      "$ solobank send 10 9pFr...2kLx",
      "✓ Sent 10.00 USDC → 9pFr...2kLx",
      "  TX: 4vGh...8mKp  confirmed (420ms)",
    ],
  },
  {
    n: 3,
    duration: "∞",
    title: "Let it work",
    description:
      'Restart your AI platform and ask: "What\'s my solobank balance?" — your agent is live.',
    lines: [
      "$ agent.ask('what can you do with my money?')",
      "→ I can send, earn, borrow, swap.",
      "→ Current yield: 6.8% APY",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Syntax highlighting — mirrors components/ui/Terminal.tsx           */
/* ------------------------------------------------------------------ */

const walletRegex = /\b([A-Za-z0-9]{2,}\.{3}[A-Za-z0-9]{2,})\b/g;

const isCommand = (l: string) => l.startsWith("$");
const isConfirmed = (l: string) => l.startsWith("✓");

function colorizeWallets(text: string): ReactNode {
  const parts = text.split(walletRegex);
  if (parts.length <= 1) return text;
  return parts.map((p, j) =>
    walletRegex.test(p) ? (
      <span key={j} className="text-solana-purple">{p}</span>
    ) : (
      <span key={j}>{p}</span>
    ),
  );
}

function renderLine(line: string): ReactNode {
  if (line === "") return " ";

  // Label: value (only for plain output lines)
  const hasColon = !isCommand(line) && !isConfirmed(line) && line.includes(":");
  if (hasColon) {
    const colonIdx = line.indexOf(":");
    const label = line.slice(0, colonIdx + 1);
    const value = line.slice(colonIdx + 1);
    const valueParts = value.split(walletRegex);
    return (
      <>
        <span className="text-muted">{label}</span>
        {valueParts.map((part, j) =>
          walletRegex.test(part) ? (
            <span key={j} className="text-solana-purple">{part}</span>
          ) : (
            <span key={j} className="text-solana-green">{part}</span>
          ),
        )}
      </>
    );
  }

  return colorizeWallets(line);
}

/* ------------------------------------------------------------------ */

export function HowItWorks(): React.ReactElement {
  const [active, setActive] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const s = STEPS[active] ?? STEPS[0]!;

  /* Scroll-progress: outer wrapper is ~3 viewports tall, inner panel is
     sticky-centered. As the user scrolls past each third of the wrapper,
     the active step advances. Reverses on scroll up. */
  useEffect(() => {
    let ticking = false;

    const compute = () => {
      ticking = false;
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      // Map [0..1) → segment index; nudge thresholds so the first segment
      // engages slightly after entry and the last fully holds.
      const raw = Math.floor(progress * STEPS.length);
      const idx = Math.min(STEPS.length - 1, Math.max(0, raw));
      setActive(idx);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Marker click → scroll to the middle of that segment.
     On mobile (no scroll-jack, total<=0) just swap the active step. */
  const scrollToStep = (i: number) => {
    const el = wrapperRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    if (total <= 0) {
      setActive(i);
      return;
    }
    const segCenter = (i + 0.5) / STEPS.length;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: el.offsetTop + segCenter * total,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="how-it-works"
      ref={wrapperRef}
      className="relative bg-background md:h-[300vh]"
    >
      <div className="md:sticky md:top-0 md:h-screen flex flex-col md:justify-center max-w-4xl mx-auto px-6 py-16 md:py-0">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            How it works
          </h2>
          <p className="mt-3 text-muted text-lg">
            Up and running in under two minutes.
          </p>
        </div>

        {/* track */}
        <div className="relative mb-10">
          <div className="absolute top-[10px] left-0 right-0 h-px bg-border" />
          <div
            className="absolute top-[10px] left-0 h-px bg-solana-green transition-all duration-500"
            style={{ width: `${(active / (STEPS.length - 1)) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {STEPS.map((step, i) => {
              const isActive = i <= active;
              return (
                <button
                  key={step.n}
                  type="button"
                  onClick={() => scrollToStep(i)}
                  className="flex flex-col items-center gap-3 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-solana-green/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                  aria-label={`Step ${step.n}: ${step.title}`}
                  aria-current={i === active ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full border-2 transition-colors",
                      isActive
                        ? "bg-solana-green border-solana-green"
                        : "bg-background border-border group-hover:border-muted",
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs tracking-widest uppercase transition-colors",
                      i === active
                        ? "text-foreground"
                        : "text-dim group-hover:text-muted",
                    )}
                  >
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* active panel */}
        <div className="bg-surface/60 border border-border rounded-xl p-6 md:p-8">
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-4xl font-bold text-solana-green tabular-nums">
              {String(s.n).padStart(2, "0")}
            </span>
            <h3 className="text-2xl font-semibold">{s.title}</h3>
          </div>
          <p className="text-muted mb-5 leading-relaxed">{s.description}</p>

          {/* Fixed min-height so the section doesn't jump when switching steps. */}
          <div className="font-mono text-[13px] bg-[#0D0D0F] border border-border rounded-lg p-5 leading-relaxed min-h-[210px]">
            {s.lines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "whitespace-pre-wrap break-words",
                  isCommand(line) && "text-foreground",
                  isConfirmed(line) && "text-solana-green",
                  !isCommand(line) &&
                    !isConfirmed(line) &&
                    line !== "" &&
                    "text-muted",
                )}
              >
                {renderLine(line)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
