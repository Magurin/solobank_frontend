import type { Metadata } from "next";
import Link from "next/link";
import { ServiceIcon } from "@/components/ui/service-icons";
import { BreadcrumbsJsonLd } from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Services — Pay-Per-Request APIs for AI Agents",
  description:
    "Pay-per-request APIs for AI agents. No keys, no accounts — agents pay with USDC on Solana via x402. Search, scrape, summarize and more.",
  keywords: [
    "pay-per-request API",
    "x402 APIs",
    "USDC payments",
    "AI agent APIs",
    "Solana API gateway",
    "MPP services",
    "no API key",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Solobank Services — Pay-Per-Request APIs for AI Agents",
    description:
      "Pay-per-request APIs for AI agents. No keys, no accounts — agents pay with USDC on Solana.",
    url: "/services",
    type: "website",
  },
};

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "https://mpp.solobank.ink";

interface Endpoint {
  method: string;
  path: string;
  description: string;
  price: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  categories: string[];
  chain: string;
  currency: string;
  endpoints: Endpoint[];
}

interface ServicesResponse {
  network: string;
  currency: string;
  totalServices: number;
  totalEndpoints: number;
  services: Service[];
}

const CATEGORY_COLORS: Record<string, string> = {
  ai: "bg-solana-purple/20 text-solana-purple",
  llm: "bg-solana-purple/20 text-solana-purple",
  search: "bg-solana-cyan/20 text-solana-cyan",
  web: "bg-blue/20 text-blue",
  data: "bg-solana-green/20 text-solana-green",
  image: "bg-pink/20 text-pink",
  audio: "bg-light-purple/20 text-light-purple",
  media: "bg-pink/20 text-pink",
  finance: "bg-lime/20 text-lime",
  crypto: "bg-solana-green/20 text-solana-green",
  "market-data": "bg-lime/20 text-lime",
  communication: "bg-blue/20 text-blue",
  email: "bg-blue/20 text-blue",
  translation: "bg-solana-cyan/20 text-solana-cyan",
  nlp: "bg-solana-cyan/20 text-solana-cyan",
  compute: "bg-orange/20 text-orange",
  code: "bg-orange/20 text-orange",
  maps: "bg-solana-green/20 text-solana-green",
  weather: "bg-solana-cyan/20 text-solana-cyan",
  documents: "bg-dim/20 text-dim",
  rendering: "bg-dim/20 text-dim",
  sales: "bg-lime/20 text-lime",
  network: "bg-dim/20 text-dim",
  news: "bg-solana-cyan/20 text-solana-cyan",
  travel: "bg-solana-cyan/20 text-solana-cyan",
};

async function getServices(): Promise<ServicesResponse> {
  try {
    const res = await fetch(`${GATEWAY_URL}/services`, {
      next: { revalidate: 60 },
    });
    return res.json();
  } catch {
    return { network: "solana-devnet", currency: "USDC", totalServices: 0, totalEndpoints: 0, services: [] };
  }
}

export default async function ServicesPage() {
  const data = await getServices();

  return (
    <main className="min-h-screen pt-28 pb-20">
      <BreadcrumbsJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Services</h1>
          <p className="text-muted text-lg mb-6">
            Pay-per-request APIs. No keys, no accounts — agents pay with USDC on Solana.
          </p>
          <div className="flex gap-4 text-sm">
            <span className="px-3 py-1 rounded-full bg-surface border border-border text-foreground">
              {data.totalServices} services
            </span>
            <span className="px-3 py-1 rounded-full bg-surface border border-border text-foreground">
              {data.totalEndpoints} endpoints
            </span>
            <span className="px-3 py-1 rounded-full bg-solana-green/10 border border-solana-green/20 text-solana-green">
              Solana devnet
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {data.services.map((service) => (
            <div
              key={service.id}
              className="border border-border rounded-xl bg-surface/40 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-white/80">
                    <ServiceIcon serviceId={service.id} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{service.name}</h2>
                    <p className="text-muted text-sm mt-0.5">{service.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {service.categories.map((cat) => (
                    <span
                      key={cat}
                      className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[cat] ?? "bg-dim/20 text-dim"}`}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col className="w-[45%]" />
                  <col className="w-[40%]" />
                  <col className="w-[15%]" />
                </colgroup>
                <thead>
                  <tr className="text-dim text-xs uppercase tracking-wider">
                    <th className="text-left px-6 py-2 font-medium">Endpoint</th>
                    <th className="text-left px-6 py-2 font-medium">Description</th>
                    <th className="text-right px-6 py-2 font-medium">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {service.endpoints.map((ep) => (
                    <tr key={ep.path} className="border-t border-border/50 hover:bg-surface/60 transition-colors">
                      <td className="px-6 py-3">
                        <code className="text-solana-green text-xs font-mono break-all">
                          POST /{service.id}{ep.path}
                        </code>
                      </td>
                      <td className="px-6 py-3 text-muted">{ep.description}</td>
                      <td className="px-6 py-3 text-right font-mono text-foreground">
                        ${ep.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted text-sm mb-4">
            All payments settle fast on Solana. No API keys required.
          </p>
          <Link href="/docs" className="text-solana-green hover:underline text-sm">
            Read the docs →
          </Link>
        </div>
      </div>
    </main>
  );
}
