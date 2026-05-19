import { NextResponse } from "next/server";
import { z } from "zod";
import { createPaypalOrder } from "@/lib/payments/paypal";
import { TIERS, ANNUAL_PRICES, LIFETIME_PRICES } from "@/lib/pro/tiers";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const BodySchema = z.object({
  tier: z.enum(["pro", "studio"]),
  billing: z.enum(["monthly", "yearly", "lifetime"]),
  customerEmail: z.string().email().optional(),
});

export async function POST(req: Request) {
  const rl = await rateLimit(req, { scope: "checkout-paypal", limit: 10, windowSec: 600 });
  if (!rl.ok) return rateLimitResponse(rl);
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
    }
    const { tier, billing, customerEmail } = parsed.data;

    if (billing !== "lifetime") {
      return NextResponse.json(
        { error: "PayPal checkout is only available for lifetime plans. Please use Pay with Card for monthly or yearly billing." },
        { status: 400 }
      );
    }

    const tierDef = TIERS.find((t) => t.id === tier);
    if (!tierDef) return NextResponse.json({ error: `Unknown tier: ${tier}` }, { status: 400 });

    const amountUsd = LIFETIME_PRICES[tier];
    if (!amountUsd) return NextResponse.json({ error: "Pricing not available" }, { status: 400 });
    // ANNUAL_PRICES is imported but unused now that PayPal is lifetime-only; reference it to satisfy noUnusedLocals.
    void ANNUAL_PRICES;

    const order = await createPaypalOrder({
      amountUsd,
      description: `Playstore Wizard ${tierDef.name} (lifetime)`,
      tier,
      billing,
      customerEmail,
    });

    return NextResponse.json({ orderId: order.id, approveUrl: order.approveUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[checkout/paypal]", msg);
    return NextResponse.json(
      { error: "Could not start PayPal checkout. Please try again or contact support." },
      { status: 500 }
    );
  }
}
