import Link from "next/link";
import { XCircle } from "lucide-react";
import { Card, Eyebrow } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = {
  ...pageMetadata({
    title: "Checkout cancelled",
    description: "Your checkout was cancelled — nothing was charged.",
    path: "/checkout/cancel",
  }),
  robots: { index: false, follow: false },
};

export default function CancelPage() {
  return (
    <section className="container max-w-2xl py-24">
      <Reveal>
        <Card className="p-10 text-center">
          <div className="h-16 w-16 rounded-full bg-bg-3 grid place-items-center mx-auto mb-6 border border-border-strong">
            <XCircle className="h-8 w-8 text-text-muted" />
          </div>
          <Eyebrow className="justify-center">Checkout cancelled</Eyebrow>
          <h1 className="mt-3 font-display font-bold text-4xl tracking-tight">No charge made.</h1>
          <p className="mt-5 text-text-muted leading-relaxed max-w-md mx-auto">
            You can keep using the Free tier as long as you like — it includes the full wizard and
            all the compliance checks for one app. Come back any time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/pricing"><Button variant="outline" size="lg">Back to pricing</Button></Link>
            <Link href="/wizard"><Button variant="aurora" size="lg">Use the Free tier</Button></Link>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
