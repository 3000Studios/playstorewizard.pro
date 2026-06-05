import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/nav/top-nav";
import { Footer } from "@/components/nav/footer";
import { AuroraBackground } from "@/components/bg/aurora-background";
import { AmbientAudio } from "@/components/audio/ambient-audio";
import { SupportChat } from "@/components/support/support-chat";
import { AdSenseScript } from "@/components/adsense/google-adsense";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { JsonLd } from "@/components/seo/json-ld";
import { buildOrganizationLd, buildSoftwareAppLd } from "@/lib/seo/metadata";
import { subdomainFromHost } from "@/lib/sites/host";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/utils";
import { AuthProvider } from "@/components/auth/auth-provider";

const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5800977493749262";

// Self-hosted via next/font — eliminates render-blocking external font CSS,
// auto-preloads, and prevents layout shift. Free, no per-request cost.
const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

const fontSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "A guided publishing studio for Google Play. Compliance, listings, asset auto-resize, AI descriptions, one-click submit. Free to start.",
  keywords: [
    "google play",
    "play store",
    "android publishing",
    "google play console",
    "android app submission",
    "aab",
    "data safety form",
    "iarc",
    "android compliance",
    "play store wizard",
  ],
  authors: [{ name: "Mr. J. Swain" }, { name: "3000 Studios" }],
  creator: "Mr. J. Swain (3000 Studios)",
  publisher: "3000 Studios",
  formatDetection: { email: false, telephone: false, address: false },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: [`${SITE_URL}/og-default.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/icons/icon.svg",
  },
  other: {
    "copyright": `© ${new Date().getFullYear()} Mr. J. Swain · 3000 Studios. All rights reserved.`,
    "rights-owner": "Mr. J. Swain (3000 Studios)",
    "designer": "Mr. J. Swain",
    "owner": "3000 Studios",
    ...(ADSENSE_CLIENT_ID && ADSENSE_CLIENT_ID !== "ca-pub-0000000000000000"
      ? { "google-adsense-account": ADSENSE_CLIENT_ID }
      : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#07070b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get("host");
  const isHostedUserSite = Boolean(subdomainFromHost(host));

  const fontVars = `${fontDisplay.variable} ${fontSerif.variable} ${fontMono.variable}`;

  return (
    <html lang="en" className={`dark ${fontVars}`}>
      <head>
        {/* Google Consent Mode v2 — deny non-essential storage by default so
            AdSense sets no ad cookies before the user chooses (see ConsentBanner). */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});try{var c=localStorage.getItem('psw-consent');if(c==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}}catch(e){}`}
        </Script>
        <JsonLd data={[buildOrganizationLd(), buildSoftwareAppLd()]} />
      </head>
      <body className="bg-bg-0 text-text antialiased min-h-screen flex flex-col">
        {/* Skip link for keyboard users */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-brand-indigo focus:text-white"
        >
          Skip to main content
        </a>

        <AuthProvider>
          {isHostedUserSite ? (
            <main id="main" className="min-h-screen">
              {children}
            </main>
          ) : (
            <>
              <AuroraBackground />
              <div className="relative z-10 flex flex-col min-h-screen">
                <TopNav />
                <main id="main" className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <AmbientAudio />
              <SupportChat />
              <AdSenseScript />
              <ConsentBanner />
            </>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
