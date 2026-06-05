import { NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe";
import { getEnv, getSiteEventsKv } from "@/lib/cloudflare";
import { signLicense, type License, type Tier } from "@/lib/pro/tiers";
import type Stripe from "stripe";

/**
 * Stripe webhook handler.
 * Endpoint: https://playstorewizard.pro/api/webhooks/stripe
 *
 * Register in Stripe Dashboard → Developers → Webhooks.
 * Events: checkout.session.completed, customer.subscription.{created,updated,deleted},
 *         invoice.payment_{succeeded,failed}
 */

async function mintAndStoreLicense(
  email: string,
  tier: Tier,
  billing: "monthly" | "yearly" | "lifetime",
  customerId?: string,
  idempotencyKey?: string
): Promise<void> {
  const signingSecret = getEnv("LICENSE_SIGNING_SECRET");
  if (!signingSecret) return;
  const validUntil = (() => {
    if (billing === "lifetime") return "never";
    const d = new Date();
    if (billing === "monthly") d.setDate(d.getDate() + 32);
    else d.setDate(d.getDate() + 366);
    return d.toISOString();
  })();
  const payload: License = {
    tier, email, customerId, validUntil,
    deviceLimit: tier === "studio" ? 5 : 3,
    issuedAt: new Date().toISOString(),
  };
  try {
    const signed = await signLicense(payload, signingSecret);
    const kv = getSiteEventsKv();
    await kv.put(`license:email:${email.toLowerCase()}`, JSON.stringify(signed), { expirationTtl: 60 * 60 * 24 * 400 });
    if (customerId) await kv.put(`license:customer:${customerId}`, JSON.stringify(signed), { expirationTtl: 60 * 60 * 24 * 400 });
    if (idempotencyKey) await kv.put(`mint:stripe:${idempotencyKey}`, JSON.stringify(signed), { expirationTtl: 60 * 60 * 24 * 400 });
  } catch (e) {
    console.error("[stripe webhook] mint failed:", e instanceof Error ? e.message : e);
  }
}

function parseTierBilling(
  meta: Record<string, string>
): { tier: Tier; billing: "monthly" | "yearly" | "lifetime" } | null {
  const t = meta?.tier;
  const b = meta?.billing;
  if (t !== "pro" && t !== "studio") return null;
  if (b !== "monthly" && b !== "yearly" && b !== "lifetime") return null;
  return { tier: t, billing: b };
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = getEnv("STRIPE_WEBHOOK_SECRET");
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, secret);
  } catch (e) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${e instanceof Error ? e.message : "bad sig"}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email ?? session.customer_details?.email;
        const customerId = typeof session.customer === "string" ? session.customer : undefined;
        const parsed = parseTierBilling((session.metadata ?? {}) as Record<string, string>);
        if (email && parsed) {
          await mintAndStoreLicense(email, parsed.tier, parsed.billing, customerId, session.id);
          console.log(`[stripe] checkout.session.completed tier=${parsed.tier}`);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const parsed = parseTierBilling((sub.metadata ?? {}) as Record<string, string>);
        if (sub.status === "active" && parsed) {
          try {
            const cust = await stripe.customers.retrieve(sub.customer as string);
            const email = (cust as Stripe.Customer).email;
            if (email) await mintAndStoreLicense(email, parsed.tier, parsed.billing, sub.customer as string);
          } catch { /* non-fatal */ }
          console.log(`[stripe] subscription ${event.type} status=${sub.status}`);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        try {
          const cust = await stripe.customers.retrieve(sub.customer as string);
          const email = (cust as Stripe.Customer).email;
          const kv = getSiteEventsKv();
          if (email) await kv.delete(`license:email:${email.toLowerCase()}`);
          if (sub.customer) await kv.delete(`license:customer:${sub.customer as string}`);
        } catch { /* non-fatal */ }
        console.log("[stripe] subscription cancelled — license removed from KV");
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = typeof (invoice as { subscription?: string | Stripe.Subscription }).subscription === "string"
          ? (invoice as { subscription?: string }).subscription
          : ((invoice as { subscription?: Stripe.Subscription }).subscription as Stripe.Subscription | undefined)?.id;
        if (subId) {
          try {
            const sub = await stripe.subscriptions.retrieve(subId);
            const parsed = parseTierBilling((sub.metadata ?? {}) as Record<string, string>);
            if (parsed && sub.status === "active") {
              const cust = await stripe.customers.retrieve(sub.customer as string);
              const email = (cust as Stripe.Customer).email;
              if (email) await mintAndStoreLicense(email, parsed.tier, parsed.billing, sub.customer as string);
            }
          } catch { /* non-fatal */ }
        }
        console.log("[stripe] invoice.payment_succeeded — license renewed");
        break;
      }
      case "invoice.payment_failed":
        console.log("[stripe] invoice.payment_failed — user retains access until period ends");
        break;
      default:
        break;
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[stripe webhook handler]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
