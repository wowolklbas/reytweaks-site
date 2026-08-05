import { NextResponse } from "next/server";
import { getRates } from "@/lib/prices";
import { METHODS, configuredMethods } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const rates = await getRates();
  const out: Record<string, { usd: number }> = {};
  for (const m of Object.values(METHODS)) {
    out[m.id] = { usd: rates[m.id] };
  }
  return NextResponse.json(
    { ...out, methods: configuredMethods() },
    {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    }
  );
}
