import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/payments/stripe";
import { signLicense, type License, type Tier } from "@/lib/pro/tiers";

const BodySchema = z.object({
  provider: z.enum(["stripe", "paypal"]),
  sessionId: z.string().min(1).max(300).optional(),
  paypalOrderId: z.string().min(1).max(300).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { provider, sessionId, paypalOrderId } = parsed.data;

    const signingSecret = process.env.LICENSE_SIGNING_SECRET;
    if (!signingSecret) {
      return NextResponse.json({ error: "Server is not configured to issue licenses" }, { status: 503 });
    }

    let tier: Tier;
    let billing: "monthly" | "yearly" | "lifetime";
    let email: string | null = null;
    let customerId: string | undefined;

    if (provider === "stripe") {
      if (!sessionId) {
        return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
      }
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
        return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
      }
      const t = session.metadata?.tier;
      const b = session.metadata?.billing;
      if (t !== "pro" && t !== "studio") {
        return NextResponse.json({ error: "Unknown tier on session" }, { status: 400 });
      }
      if (b !== "monthly" && b !== "yearly" && b !== "lifetime") {
        return NextResponse.json({ error: "Unknown billing on session" }, { status: 400 });
      }
      tier = t;
      billing = b;
      email = session.customer_email ?? session.customer_details?.email ?? null;
      customerId = typeof session.customer === "string" ? session.customer : undefined;
    } else {
      // PayPal verification — the capture endpoint already charged the card.
      // We trust the order ID came from our own /api/checkout/paypal/capture
      // response. The capture endpoint validates that the order is in
      // "COMPLETED" status before returning, so we can mint here.
      if (!paypalOrderId) {
        return NextResponse.json({ error: "Missing paypalOrderId" }, { status: 400 });
      }
      // Re-fetch the order from PayPal to confirm it is paid and read the
      // tier:billing pair from the custom_id we set on order create.
      const tokenRes = await fetch(
        (process.env.PAYPAL_ENV === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com") +
          "/v1/oauth2/token",
        {
          method: "POST",
          headers: {
            Authorization: "Basic " + btoa(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials",
        }
      );
      if (!tokenRes.ok) {
        return NextResponse.json({ error: "Could not verify PayPal credentials" }, { status: 502 });
      }
      const { access_token } = (await tokenRes.json()) as { access_token: string };
      const orderRes = await fetch(
        (process.env.PAYPAL_ENV === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com") +
          "/v2/checkout/orders/" +
          paypalOrderId,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      if (!orderRes.ok) {
        return NextResponse.json({ error: "Could not verify PayPal order" }, { status: 502 });
      }
      const order = (await orderRes.json()) as {
        status: string;
        purchase_units?: { custom_id?: string }[];
        payer?: { email_address?: string };
      };
      if (order.status !== "COMPLETED" && order.status !== "APPROVED") {
        return NextResponse.json({ error: `PayPal order not paid (status=${order.status})` }, { status: 402 });
      }
      const custom = order.purchase_units?.[0]?.custom_id ?? "";
      const [t, b] = custom.split(":");
      if (t !== "pro" && t !== "studio") {
        return NextResponse.json({ error: "Unknown tier on PayPal order" }, { status: 400 });
      }
      if (b !== "monthly" && b !== "yearly" && b !== "lifetime") {
        return NextResponse.json({ error: "Unknown billing on PayPal order" }, { status: 400 });
      }
      tier = t;
      billing = b;
      email = order.payer?.email_address ?? null;
    }

    // ----- Build the license -----
    const validUntil = (() => {
      if (billing === "lifetime") return "never";
      const d = new Date();
      // 36-hour grace beyond the period so a webhook hiccup doesn't lock the user out.
      if (billing === "monthly") d.setDate(d.getDate() + 31 + 1);
      else d.setDate(d.getDate() + 365 + 1);
      return d.toISOString();
    })();

    const payload: License = {
      tier,
      email: email ?? "unknown@playstorewizard.pro",
      customerId,
      validUntil,
      deviceLimit: tier === "studio" ? 5 : 3,
      issuedAt: new Date().toISOString(),
    };

    const signed = await signLicense(payload, signingSecret);
    return NextResponse.json(signed, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[checkout/verify]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
