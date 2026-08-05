import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { METHODS, ORDER_TTL_MS, PRICE_USD, WALLETS } from "@/lib/config";
import { getRates, usdToCrypto } from "@/lib/prices";
import { createOrder, countAvailableKeys } from "@/lib/store";
import { rateLimited, clientIp } from "@/lib/rate";

export const dynamic = "force-dynamic";

const methodIds = Object.keys(METHODS);

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (rateLimited(`order:${ip}`, 6, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many orders — wait an hour." }, { status: 429 });
  }

  let body: { method?: string; company?: string } | null = null;
  try {
    body = (await req.json()) as { method?: string; company?: string };
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  // Honeypot: real humans never fill this field.
  if (body.company) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const method = body?.method;
  if (typeof method !== "string" || !methodIds.includes(method)) {
    return NextResponse.json({ error: "Unknown payment method." }, { status: 400 });
  }

  const address = WALLETS[method as keyof typeof WALLETS];
  if (!address || address.startsWith("TPlaceholder") || address === "bc1qplaceholder") {
    return NextResponse.json(
      { error: "This payment method isn't configured yet — contact us on Discord." },
      { status: 503 }
    );
  }

  const available = await countAvailableKeys();
  if (available === 0) {
    return NextResponse.json({ error: "Sold out — new stock drops soon." }, { status: 503 });
  }

  const rates = await getRates();
  const meta = METHODS[method as keyof typeof METHODS];
  const amount = usdToCrypto(PRICE_USD, rates[meta.id], meta.decimals);
  if (amount <= 0) {
    return NextResponse.json({ error: "Price feed unavailable — try again shortly." }, { status: 503 });
  }

  const id = crypto.randomUUID().slice(0, 8).toUpperCase();
  const order = {
    id,
    method: method as keyof typeof METHODS,
    address,
    amount,
    usd: PRICE_USD,
    status: "pending" as const,
    createdAt: Date.now(),
  };
  await createOrder(order);

  return NextResponse.json({
    id,
    method,
    address,
    amount,
    usd: PRICE_USD,
    network: meta.network,
    ticker: meta.ticker,
    expiresAt: order.createdAt + ORDER_TTL_MS,
  });
}
