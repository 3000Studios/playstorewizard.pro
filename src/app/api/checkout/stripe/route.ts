import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe, STRIPE_PRICE_IDS } from "@/lib/payments/stripe";
import { TIERS, ANNUAL_PRICES, LIFETIME_PRICES } from "@/lib/pro/tiers";
import { SITE_URL } from "@/lib/utils";

export const runtime = "nodejs";

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

    const stripe = getStripe();
    const preconfiguredPrice = STRIPE_PRICE_IDS[tier]?.[billing];
    const tierDef = TIERS.find((t) => t.id === tier);
    if (!tierDef) {
      return NextResponse.json({ error: `Unknown tier: ${tier}` }, { status: 400 });
    }

    const isSubscription = billing !== "lifetime";
    const amountUsd = (() => {
      if (billing === "monthly") return tierDef.priceUsd;
      if (billing === "yearly") return ANNUAL_PRICES[tier];
      return LIFETIME_PRICES[tier];
    })();
    if (!amountUsd) {
      return NextResponse.json({ error: "Pricing not available for this combo" }, { status: 400 });
    }

    const amountCents = Math.round(amountUsd * 100);
    const productName = `Playstore Wizard ${tierDef.name} — ${billing}`;

    const lineItem = preconfiguredPrice
      ? { price: preconfiguredPrice, quantity: 1 }
      : {
          price_data: {
            currency: "usd",
            product_data: { name: productName, description: tierDef.description },
            unit_amount: amountCents,
            ...(isSubscription
              ? { recurring: { interval: (billing === "monthly" ? "month" : "year") as "month" | "year" } }
              : {}),
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [lineItem],
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/pricing?canceled=1`,
      customer_email: customerEmail,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: { tier, billing },
      ...(isSubscription
        ? { subscription_data: { metadata: { tier, billing } } }
        : { payment_intent_data: { metadata: { tier, billing } } }),
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a checkout URL" }, { status: 500 });
    }
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[checkout/stripe]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
