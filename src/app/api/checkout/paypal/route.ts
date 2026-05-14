import { NextResponse } from "next/server";
import { z } from "zod";
import { createPaypalOrder } from "@/lib/payments/paypal";
import { TIERS, ANNUAL_PRICES, LIFETIME_PRICES } from "@/lib/pro/tiers";

const BodySchema = z.object({
  tier: z.enum(["pro", "studio"]),
  billing: z.enum(["monthly", "yearly", "lifetime"]),
  customerEmail: z.string().email().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const { tier, billing, customerEmail } = parsed.data;

    const tierDef = TIERS.find((t) => t.id === tier);
    if (!tierDef) return NextResponse.json({ error: `Unknown tier: ${tier}` }, { status: 400 });

    const amountUsd = billing === "monthly" ? tierDef.priceUsd
      : billing === "yearly" ? ANNUAL_PRICES[tier]
      : LIFETIME_PRICES[tier];
    if (!amountUsd) return NextResponse.json({ error: "Pricing not available" }, { status: 400 });

    const order = await createPaypalOrder({
      amountUsd,
      description: `Playstore Wizard ${tierDef.name} (${billing})`,
      tier,
      billing,
      customerEmail,
    });

    return NextResponse.json({ orderId: order.id, approveUrl: order.approveUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[checkout/paypal]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
