# Solobank CLI & MCP Skill Overview

The Solobank skill gives AI agents a self-custodied bank account on Solana. It covers wallet setup, balances, payments, swaps, lending, borrowing, and MPP (Machine Payments Protocol) `402`-paid HTTP calls — via CLI or MCP.

## Key Capabilities

The skill handles wallet creation, balance checks, USDC/SOL transfers, Jupiter swaps, Kamino/marginfi lending and borrowing, autonomous pay-per-request API calls via x402, MCP server installation, and safeguard configuration (per-tx and per-day spending limits, emergency lock).

## Primary Entry Point

Agents should begin with `solobank init` to create a non-custodial Solana keypair at `~/.config/solobank/id.json`, register the MCP server, and apply default safeguards (`$100/tx`, `$500/day`). After init, run `solobank balance` to confirm the wallet is ready.

## Authentication Method

There are no passwords or accounts on a Solobank server — the wallet *is* the identity. The local keypair signs every transaction. Optional AES-256-GCM encryption is available via `solobank init --password <password>`. To connect an existing AI host (Claude Desktop, Cursor, Windsurf, Zed), run `solobank mcp install`.

## Available Commands

Core tools: `init`, `address`, `balance`, `send`, `pay`, `swap-quote`, `swap`, `lend-rates`, `lend`, `borrow`, `withdraw`, `repay`, `rebalance`, `mcp install`, `mcp uninstall`, `mcp status`, `mcp config`, `config get`, `config set`, `lock`, `unlock`.

### Signatures

- `solobank init [--force] [--password <password>]`
- `solobank address`
- `solobank balance`
- `solobank send <amount> <to> [--asset SOL|USDC]`
- `solobank pay <url> [--method GET|POST|...] [--data <json>] [--max-price <usd>]`
- `solobank swap-quote <amount> <from> <to> [--slippage-bps <bps>]`
- `solobank swap <amount> <from> <to> [--slippage-bps <bps>]`
- `solobank lend-rates <asset> [--protocol auto|kamino|marginfi]`
- `solobank lend <amount> <asset> [--protocol auto|kamino|marginfi]`
- `solobank borrow <amount> <asset> [--protocol ...] [--market <addr>] [--bank <addr>] [--reserve <addr>]`
- `solobank withdraw <amount> <asset> [--protocol ...] [--all]`
- `solobank repay <amount> <asset> [--protocol ...] [--all]`
- `solobank rebalance <amount> <asset> [--target-protocol ...] [--min-apy-delta <value>]`
- `solobank config get [key]` / `solobank config set <key> <value>`
- `solobank lock` / `solobank unlock`

## Important Constraints

Every command needs a Solana RPC connection. **Spending commands** — `send`, `pay`, `swap`, `lend`, `borrow`, `repay`, `rebalance` — move real funds and must have explicit human approval before the agent runs them. Do not assume consent from prior context.

Hard limits enforced by the local safeguard layer (not the prompt):

- `maxAmountPerTx` — per-transaction USD cap (default `$100`).
- `maxDailySend` — rolling 24h USD cap (default `$500`).
- `lock` — emergency kill switch that blocks every spending command until `unlock`.

A prompt-injected agent still cannot exceed these limits — they live in the wallet's policy layer.

## Installation

```bash
npm install -g @solobank/cli
# or run without installing:
npx -y @solobank/cli@latest init
```

After install:

```bash
solobank init
solobank mcp install   # wires up Claude Desktop, Cursor, Windsurf, Zed
solobank balance
```

The MCP server is also published as `@solobank/mcp` and is configured automatically by `mcp install`. For manual setup, see `solobank mcp config`.

## Resources

- Site: https://solobank.ai
- Docs: https://solobank.ai/docs
- GitHub: https://github.com/solobank-ai
- npm: https://www.npmjs.com/package/@solobank/cli
