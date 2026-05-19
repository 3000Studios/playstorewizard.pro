import { NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe";
import { getEnv } from "@/lib/cloudflare";
import type Stripe from "stripe";

/**
 * Stripe webhook handler.
 *
 * Set the endpoint URL in your Stripe Dashboard → Developers → Webhooks:
 *   https://playstorewizard.pro/api/webhooks/stripe
 *
 * Select events:
 *   - checkout.session.completed
 *   - customer.subscription.created
 *   - customer.subscription.updated
 *   - customer.subscription.deleted
 *   - invoice.payment_succeeded
 *   - invoice.payment_failed
 *
 * The signing secret goes into STRIPE_WEBHOOK_SECRET (Cloudflare encrypted secret).
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = getEnv("STRIPE_WEBHOOK_SECRET");
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, secret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Bad signature";
    return NextResponse.json({ error: `Webhook signature verification failed: ${msg}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Record the successful checkout. In a real DB-backed setup you'd:
        //   - look up the customer by email
        //   - mark their account as paid / tier=pro|studio / lifetime=true
        //   - send a welcome email
        // For now, log it so the deploy can be verified end-to-end.
        console.log(
          `[stripe] checkout.session.completed: ${session.id} email=${session.customer_email} tier=${session.metadata?.tier}`
        );
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[stripe] subscription ${event.type}: ${sub.id} status=${sub.status}`);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[stripe] subscription cancelled: ${sub.id}`);
        break;
      }
      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[stripe] ${event.type}: invoice=${invoice.id}`);
        break;
      }
      default:
        // Unhandled event types are not an error — Stripe sends many event kinds.
        break;
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[stripe webhook handler]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
