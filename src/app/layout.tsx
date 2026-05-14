import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TopNav } from "@/components/nav/top-nav";
import { Footer } from "@/components/nav/footer";
import { AuroraBackground } from "@/components/bg/aurora-background";
import { AdSenseScript } from "@/components/adsense/google-adsense";
import { JsonLd } from "@/components/seo/json-ld";
import { buildOrganizationLd, buildSoftwareAppLd } from "@/lib/seo/metadata";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/utils";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

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
  authors: [{ name: "3000Studios" }],
  creator: "3000Studios",
  publisher: "3000Studios",
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
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  other: {
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
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

        {/* Animated background — fixed, z-0 */}
        <AuroraBackground />

        {/* Content layer */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <TopNav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>

        {/* AdSense library (no-op when unconfigured) */}
        <AdSenseScript />
      </body>
    </html>
  );
}
