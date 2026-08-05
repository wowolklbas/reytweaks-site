import { NextResponse } from "next/server";
import { ADMIN_PASSWORD } from "@/lib/config";
import { listOrders } from "@/lib/store";

function authorized(req: Request): boolean {
  return req.headers.get("x-admin-pass") === ADMIN_PASSWORD;
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const orders = await listOrders();
  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      method: o.method,
      amount: o.amount,
      usd: o.usd,
      status: o.status,
      key: o.key ?? null,
      createdAt: o.createdAt,
    })),
  });
}
