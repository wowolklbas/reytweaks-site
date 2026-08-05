// On-chain payment verification against public block explorers.
// Server-side only — nothing here is exposed to the client.

import type { Method } from "./config";

export interface PaymentCheck {
  received: number; // total confirmed received on this address, in coin units
  ok: boolean; // explorer reachable
}

const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

interface BtcUtxo {
  value?: number;
  status?: { confirmed?: boolean };
}

interface LtcAddress {
  balance?: number;
}

interface Trc20Transfer {
  to?: string;
  blockNumber?: number;
  value?: string;
}

interface Trc20Response {
  data?: Trc20Transfer[];
}

async function getJson(url: string, timeoutMs = 12_000): Promise<unknown> {
  try {
    const r = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

/** Total confirmed balance received (not net) for a BTC address via Blockstream Esplora. */
async function checkBtc(address: string): Promise<PaymentCheck> {
  const j = await getJson(`https://blockstream.info/api/address/${address}/utxo`);
  if (!Array.isArray(j)) return { received: 0, ok: false };
  const sats = (j as BtcUtxo[])
    .filter((u) => u.status?.confirmed)
    .reduce((sum: number, u) => sum + (u.value || 0), 0);
  return { received: sats / 1e8, ok: true };
}

/** Confirmed balance for an LTC address via BlockCypher (unspent outputs). */
async function checkLtc(address: string): Promise<PaymentCheck> {
  const j = await getJson(`https://api.blockcypher.com/v1/ltc/main/addrs/${address}`);
  if (typeof j !== "object" || j === null || typeof (j as LtcAddress).balance !== "number") {
    return { received: 0, ok: false };
  }
  return { received: (j as LtcAddress).balance! / 1e8, ok: true };
}

/** USDT-TRC20 inbound transfers via TronGrid. */
async function checkUsdtTrc20(address: string): Promise<PaymentCheck> {
  const j = await getJson(
    `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20?only_to=true&limit=50&contract_address=${USDT_CONTRACT}`
  );
  const data = (j as Trc20Response).data;
  if (!Array.isArray(data)) return { received: 0, ok: false };
  const sum = data
    .filter((t) => t.to?.toLowerCase() === address.toLowerCase() && Number(t.blockNumber) > 0)
    .reduce((acc: number, t) => acc + (Number(t.value) || 0) / 1e6, 0);
  return { received: sum, ok: true };
}

export async function checkPayment(method: Method, address: string): Promise<PaymentCheck> {
  switch (method) {
    case "btc":
      return checkBtc(address);
    case "ltc":
      return checkLtc(address);
    case "usdt_trc20":
      return checkUsdtTrc20(address);
  }
}
