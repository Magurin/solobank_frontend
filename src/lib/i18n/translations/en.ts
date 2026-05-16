export const en = {
  // Navbar
  nav: {
    accounts: "Features",
    howItWorks: "How it works",
    docs: "Docs",
    github: "GitHub",
    install: "Install",
    getStarted: "Get started",
  },

  // Hero
  hero: {
    badge: "Built on Solana",
    headline1: "A bank account",
    headline2: "for AI agents.",
    subline: "Earn, borrow, invest, swap, pay — autonomously.",
    cta: "Get started",
    installCmd: "npx -y @solobank/cli@latest init",
  },

  // Accounts
  accounts: {
    title1: "Earn, borrow, invest, swap, pay —",
    title2: "one agent",
    subtitle: "Everything your agent needs to manage money — autonomously and non-custodially.",
    checking: {
      title: "CHECKING",
      description: "Send and receive USDC. Gas fees handled automatically via SPL Token transfers.",
    },
    savings: {
      title: "SAVINGS",
      description: "Earn 4–8% APY automatically. Deposits routed to the best yield protocol via Kamino / marginfi.",
    },
    credit: {
      title: "CREDIT",
      description: "Borrow against your savings without selling. Repay on your schedule.",
    },
    invest: {
      title: "INVEST",
      description: "Buy, sell, and earn yield. Swap and hold via Jupiter best route.",
    },
    swap: {
      title: "SWAP",
      description: "Swap between stablecoins and crypto at the best available rate via Jupiter.",
    },
  },

  // How it works
  howItWorks: {
    title: "How it works",
    subtitle: "Up and running in under two minutes.",
    step1: {
      title: "Install",
      duration: "30s",
      description: "One command. Wallet, MCP server, and safeguards — all set up and guided.",
    },
    step2: {
      title: "Fund",
      duration: "1 min",
      description: "Send USDC to your wallet address. Gas and routing are handled automatically.",
    },
    step3: {
      title: "Let it work",
      duration: "∞",
      description: 'Restart your AI platform and ask: "What\'s my solobank balance?" — your agent is live.',
    },
  },

  // Comparison / Features
  comparison: {
    title: "Everything an agent needs",
    subtitle: "Full-stack DeFi, one SDK. No wrappers, no glue code.",
    sendReceive: {
      title: "Send & Receive",
      description: "Transfer SOL and USDC to any Solana address. Gas fees handled automatically — your agent never gets stuck.",
    },
    earnApy: {
      title: "Earn 4–8% APY",
      description: "Deposits auto-routed to the best yield venue across Kamino and marginfi. Rebalances when rates shift.",
    },
    mcpTools: {
      title: "15 MCP Tools",
      description: "Plug into Claude, Cursor, or any MCP-compatible AI platform. One JSON config — your agent has a bank account.",
    },
    borrowOnDemand: "Borrow on demand",
    borrowDesc: "Credit against savings — no selling required.",
    jupiterSwaps: "Jupiter swaps",
    jupiterDesc: "Any SPL token, best route, always.",
    autoRebalance: "Auto rebalance",
    autoRebalanceDesc: "Moves funds to higher-APY venues.",
    mppProtocol: "MPP protocol",
    mppDesc: "Pay-per-use APIs via 402 negotiation.",
    agentSafeguards: "Agent safeguards",
    safeguardsDesc: "Per-tx and daily spending limits.",
    defiProtocols: "DeFi protocols",
    defiDesc: "Kamino + marginfi + Jupiter built in.",
    browserClient: "Browser client",
    browserDesc: "Run in-browser with @solobank/sdk.",
  },

  // Install section
  install: {
    title1: "Give your agent",
    title2: "a financial life.",
    subtitle: "Open source. Non-custodial. Built on Solana.",
    liveDemos: "Live Demos",
  },

  // Footer
  footer: {
    product: "Product",
    gateway: "Gateway",
    resources: "Resources",
    legal: "Legal",
    services: "Services",
    stats: "Stats",
    terms: "Terms",
    privacy: "Privacy",
    security: "Security",
    copyright: "© 2026 Solobank. Open source. Non-custodial.",
    builtOn: "Built on Solana",
  },

  // Terminal lines
  terminal: [
    "$ solobank init",
    "Wallet created: 7xKp...3mNq",
    "MCP server configured",
    "Safeguards: $100/tx · $500/day",
    "",
    "$ solobank balance",
    "SOL:   0.05 SOL",
    "USDC:  $148.91 USDC",
    "",
    "$ solobank send 10 9pFr...2kLx",
    "✓ Sent 10.00 USDC → 9pFr...2kLx",
    "  TX: 4vGh...8mKp  confirmed (420ms)",
    "",
    "$ solobank lend 80 USDC",
    "✓ Deposited 80.00 USDC to Kamino",
    "  APY: 4.21%",
  ],
};

// Deep readonly with string values (not literal types)
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly string[]
      ? string[]
      : DeepStringify<T[K]>;
};

export type Translations = DeepStringify<typeof en>;
