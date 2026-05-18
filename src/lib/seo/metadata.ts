import type { Metadata } from "next";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "../utils";

interface PageMetaInput {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function pageMetadata(input: PageMetaInput): Metadata {
  const url = `${SITE_URL}${input.path ?? ""}`;
  const ogImage = input.ogImage ?? `${SITE_URL}/og-default.png`;
  return {
    title: `${input.title} · ${SITE_NAME}`,
    description: input.description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: input.title }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [ogImage],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

// JSON-LD builders
export function buildOrganizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    logo: `${SITE_URL}/icons/icon-512.png`,
    founder: {
      "@type": "Person",
      name: "Mr. J. Swain",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "3000 Studios",
      url: "https://github.com/3000Studios",
    },
    copyrightHolder: {
      "@type": "Person",
      name: "Mr. J. Swain",
    },
    copyrightYear: new Date().getFullYear(),
  };
}

export function buildSoftwareAppLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    operatingSystem: "Web",
    applicationCategory: "DeveloperApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: SITE_TAGLINE,
    url: SITE_URL,
    author: {
      "@type": "Person",
      name: "Mr. J. Swain",
    },
    publisher: {
      "@type": "Organization",
      name: "3000 Studios",
    },
    copyrightHolder: {
      "@type": "Person",
      name: "Mr. J. Swain",
    },
    copyrightYear: new Date().getFullYear(),
  };
}

export function buildArticleLd(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: input.author
      ? { "@type": "Person", name: input.author, url: `${SITE_URL}/about` }
      : { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icons/icon-512.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}${input.path}` },
  };
}

export function buildBreadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function buildFaqLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
