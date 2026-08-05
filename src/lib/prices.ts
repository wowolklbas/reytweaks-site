// Crypto → USD rates, cached. Public CoinGecko endpoint (free tier).

export interface Rates {
  btc: number;
  ltc: number;
  usdt_trc20: number;
  updatedAt: number;
}

const FALLBACK: Rates = { btc: 97000, ltc: 88, usdt_trc20: 1, updatedAt: 0 };
const CACHE_TTL = 60_000;

let cache: Rates | null = null;
let cacheAt = 0;

export async function getRates(): Promise<Rates> {
  const now = Date.now();
  if (cache && now - cacheAt < CACHE_TTL) return cache;

  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,litecoin,tether&vs_currencies=usd",
      { next: { revalidate: 60 }, cache: "no-store" }
    );
    if (r.ok) {
      const j = (await r.json()) as {
        bitcoin: { usd: number };
        litecoin: { usd: number };
        tether: { usd: number };
      };
      cache = {
        btc: j.bitcoin.usd,
        ltc: j.litecoin.usd,
        usdt_trc20: j.tether.usd || 1,
        updatedAt: now,
      };
      cacheAt = now;
      return cache;
    }
  } catch {
    /* fall through */
  }
  return FALLBACK;
}

export function usdToCrypto(usd: number, rate: number, decimals: number): number {
  if (!rate || rate <= 0) return 0;
  return Math.floor((usd / rate) * 10 ** decimals) / 10 ** decimals;
}
