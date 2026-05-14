/**
 * PayPal REST client — minimal, Edge-runtime compatible (uses fetch only).
 *
 * Required env vars (Cloudflare encrypted secrets):
 *   PAYPAL_CLIENT_ID
 *   PAYPAL_CLIENT_SECRET
 *   PAYPAL_ENV               — "live" or "sandbox" (default "live")
 */

const LIVE_BASE = "https://api-m.paypal.com";
const SANDBOX_BASE = "https://api-m.sandbox.paypal.com";

function paypalBase(): string {
  return process.env.PAYPAL_ENV === "sandbox" ? SANDBOX_BASE : LIVE_BASE;
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET).");
  }
  // btoa is available in Edge/browser/Node 16+; Buffer is NOT available in Edge runtime.
  const auth = btoa(`${clientId}:${clientSecret}`);
  const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal OAuth failed: ${res.status} ${text}`);
  }
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export interface PaypalOrderInput {
  amountUsd: number;
  description: string;
  tier: string;
  billing: string;
  customerEmail?: string;
}

export async function createPaypalOrder(input: PaypalOrderInput): Promise<{ id: string; approveUrl: string }> {
  const token = await getAccessToken();
  const res = await fetch(`${paypalBase()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: input.amountUsd.toFixed(2) },
          description: input.description,
          custom_id: `${input.tier}:${input.billing}`,
        },
      ],
      application_context: {
        brand_name: "Playstore Wizard",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://playstorewizard.pro"}/checkout/success?provider=paypal`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://playstorewizard.pro"}/pricing?canceled=1`,
      },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal create order failed: ${res.status} ${text}`);
  }
  const json = (await res.json()) as {
    id: string;
    links: { href: string; rel: string }[];
  };
  const approveLink = json.links.find((l) => l.rel === "approve")?.href;
  if (!approveLink) {
    throw new Error("PayPal did not return an approve URL");
  }
  return { id: json.id, approveUrl: approveLink };
}

export async function capturePaypalOrder(orderId: string): Promise<{ status: string; payerEmail?: string }> {
  const token = await getAccessToken();
  const res = await fetch(`${paypalBase()}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal capture failed: ${res.status} ${text}`);
  }
  const json = (await res.json()) as {
    status: string;
    payer?: { email_address?: string };
  };
  return { status: json.status, payerEmail: json.payer?.email_address };
}
