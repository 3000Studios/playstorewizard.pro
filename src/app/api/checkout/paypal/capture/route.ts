import { NextResponse } from "next/server";
import { z } from "zod";
import { capturePaypalOrder } from "@/lib/payments/paypal";

export const runtime = "nodejs";

const BodySchema = z.object({ orderId: z.string().min(1).max(200) });

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const result = await capturePaypalOrder(parsed.data.orderId);
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[checkout/paypal/capture]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
