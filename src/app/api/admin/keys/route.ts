import { NextResponse } from "next/server";
import { ADMIN_ENABLED, ADMIN_PASSWORD } from "@/lib/config";
import { addKeys, listKeys } from "@/lib/store";

function authorized(req: Request): boolean {
  return req.headers.get("x-admin-pass") === ADMIN_PASSWORD;
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const keys = await listKeys();
  return NextResponse.json({
    keys: keys.map((k) => ({ key: k.key, used: k.used, orderId: k.orderId })),
  });
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!ADMIN_ENABLED) {
    return NextResponse.json(
      { error: "Admin is locked — set ADMIN_PASSWORD in the environment first." },
      { status: 403 }
    );
  }
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const keys = String(body?.keys || "").split(/\r?\n/);
  await addKeys(keys);
  const all = await listKeys();
  return NextResponse.json({ total: all.length, available: all.filter((k) => !k.used).length });
}
