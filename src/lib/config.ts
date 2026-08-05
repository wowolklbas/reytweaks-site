// Server-only configuration. Nothing here is ever imported by client components.

export const PRICE_USD = 10; // one Pro license

export type Method = "btc" | "ltc" | "usdt_trc20";

export interface MethodMeta {
  id: Method;
  label: string;
  fullName: string;
  network: string;
  decimals: number;
  coinGeckoId: string;
  color: string;
  ticker: string;
}

export const METHODS: Record<Method, MethodMeta> = {
  btc: {
    id: "btc",
    label: "Bitcoin",
    fullName: "Bitcoin",
    network: "Bitcoin",
    decimals: 8,
    coinGeckoId: "bitcoin",
    color: "#f7931a",
    ticker: "BTC",
  },
  ltc: {
    id: "ltc",
    label: "Litecoin",
    fullName: "Litecoin",
    network: "Litecoin",
    decimals: 8,
    coinGeckoId: "litecoin",
    color: "#8b9bb4",
    ticker: "LTC",
  },
  usdt_trc20: {
    id: "usdt_trc20",
    label: "USDT (TRC-20)",
    fullName: "USDT",
    network: "Tron (TRC-20)",
    decimals: 6,
    coinGeckoId: "tether",
    color: "#26a17b",
    ticker: "USDT",
  },
};

export const ORDER_TTL_MS = 30 * 60 * 1000; // 30 minutes to pay

function env(name: string): string {
  return process.env[name]?.trim() || "";
}

// Wallet addresses — set in .env.local / Vercel env vars.
export const WALLETS: Partial<Record<Method, string>> = {
  btc: env("SHOP_BTC_ADDR") || "bc1qplaceholder",
  ltc: env("SHOP_LTC_ADDR") || "LLDrebngQKMVvwsV5Lk1Z99SDFcXF8XdbF",
  usdt_trc20: env("SHOP_USDT_TRC20_ADDR") || "TPlaceholderAddress",
};

// Methods whose wallet is actually configured (placeholder = not ready).
export function configuredMethods(): Method[] {
  return Object.values(METHODS)
    .map((m) => m.id)
    .filter((id) => {
      const w = WALLETS[id];
      return !!w && !w.toLowerCase().includes("placeholder");
    });
}

export function rateLimitBuckets(): Map<string, number[]> {
  return (globalThis as any).__rl_buckets ??= new Map();
}

export const ADMIN_PASSWORD = env("ADMIN_PASSWORD") || "rey-admin-change-me";
export const ADMIN_ENABLED = ADMIN_PASSWORD !== "rey-admin-change-me";
