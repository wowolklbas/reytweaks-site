import { NextResponse } from "next/server";
import { ORDER_TTL_MS } from "@/lib/config";
import { getOrder, pendingOrdersByMethod, reserveKey, updateOrder } from "@/lib/store";
import { checkPayment } from "@/lib/verify";
import { rateLimited, clientIp } from "@/lib/rate";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ip = clientIp(_req);
  if (rateLimited(`poll:${ip}`, 120, 60_000)) {
    return NextResponse.json({ error: "Slow down." }, { status: 429 });
  }

  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.status === "paid") {
    return NextResponse.json({
      status: "paid",
      key: order.key,
      outOfStock: order.key ? false : true,
    });
  }

  if (Date.now() - order.createdAt > ORDER_TTL_MS) {
    await updateOrder(id, { status: "expired" });
    return NextResponse.json({ status: "expired" });
  }

  // Verify against the chain. Pending orders on the same address are settled
  // oldest-first so one deposit can't accidentally cover two orders.
  const check = await checkPayment(order.method, order.address);
  if (!check.ok) {
    return NextResponse.json({ status: order.status, confirmed: null });
  }

  const pending = (await pendingOrdersByMethod(order.method)).filter(
    (o) => o.address === order.address
  );
  let covered = 0;
  for (const o of pending) {
    covered += o.amount;
    if (check.received < covered) break;
    const key = await reserveKey(o.id);
    await updateOrder(o.id, { status: "paid", key: key ?? undefined });
    if (o.id === order.id) {
      return NextResponse.json({
        status: "paid",
        key,
        outOfStock: key ? false : true,
      });
    }
  }

  return NextResponse.json({ status: "pending", confirmed: check.received });
}
