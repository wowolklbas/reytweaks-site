// Order + key-pool persistence.
//
// Prod (Vercel):  Upstash Redis via env (UPSTASH_REDIS_REST_URL / TOKEN).
// Local/dev:      JSON files under ./data (gitignored) — identical API.

import fs from "node:fs";
import path from "node:path";
import type { Method } from "./config";

export interface Order {
  id: string;
  method: Method;
  address: string;
  amount: number; // crypto amount owed
  usd: number; // USD price at creation
  status: "pending" | "paid" | "expired";
  key?: string;
  createdAt: number;
  email?: string;
}

interface KeyRecord {
  key: string;
  used: boolean;
  orderId?: string;
}

interface StoreShape {
  orders: Record<string, Order>;
  keys: KeyRecord[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "store.json");

function hasRedis(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function redis() {
  return {
    get: async (key: string) => {
      const r = await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/get/${key}`,
        { headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` } }
      );
      const j = (await r.json()) as { result?: string | null };
      return j.result ?? null;
    },
    set: async (key: string, value: string) => {
      await fetch(
        `${process.env.UPSTASH_REDIS_REST_URL}/set/${key}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
          body: value,
        }
      );
    },
  };
}

function loadLocal(): StoreShape {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as StoreShape;
  } catch {
    return { orders: {}, keys: [] };
  }
}

function saveLocal(shape: StoreShape) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(shape, null, 2));
}

async function read(): Promise<StoreShape> {
  if (hasRedis()) {
    const raw = await redis().get("rey:store");
    return raw ? (JSON.parse(raw) as StoreShape) : { orders: {}, keys: [] };
  }
  return loadLocal();
}

async function write(shape: StoreShape) {
  if (hasRedis()) {
    await redis().set("rey:store", JSON.stringify(shape));
    return;
  }
  saveLocal(shape);
}

export async function getOrder(id: string): Promise<Order | null> {
  const s = await read();
  return s.orders[id] ?? null;
}

export async function createOrder(o: Order) {
  const s = await read();
  s.orders[o.id] = o;
  await write(s);
}

export async function updateOrder(id: string, patch: Partial<Order>) {
  const s = await read();
  if (s.orders[id]) {
    s.orders[id] = { ...s.orders[id], ...patch };
    await write(s);
  }
}

export async function listOrders(): Promise<Order[]> {
  const s = await read();
  return Object.values(s.orders).sort((a, b) => b.createdAt - a.createdAt);
}

export async function pendingOrdersByMethod(method: Method): Promise<Order[]> {
  const s = await read();
  return Object.values(s.orders).filter(
    (o) => o.method === method && o.status === "pending"
  ).sort((a, b) => a.createdAt - b.createdAt);
}

export async function countAvailableKeys(): Promise<number> {
  const s = await read();
  return s.keys.filter((k) => !k.used).length;
}

export async function reserveKey(orderId: string): Promise<string | null> {
  const s = await read();
  const k = s.keys.find((x) => !x.used);
  if (!k) return null;
  k.used = true;
  k.orderId = orderId;
  await write(s);
  return k.key;
}

export async function addKeys(keys: string[], orderId?: string) {
  const s = await read();
  const existing = new Set(s.keys.map((k) => k.key.trim()));
  for (const raw of keys) {
    const key = raw.trim();
    if (!key || existing.has(key)) continue;
    existing.add(key);
    s.keys.push({ key, used: false, orderId });
  }
  await write(s);
}

export async function listKeys(): Promise<KeyRecord[]> {
  const s = await read();
  return s.keys;
}
