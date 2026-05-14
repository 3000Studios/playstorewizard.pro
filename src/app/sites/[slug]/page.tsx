import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SitePreview } from "@/components/sites/site-preview";
import { getSite } from "@/lib/sites/store";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) return { title: "Site not found" };
  return {
    title: site.seoTitle,
    description: site.seoDescription,
    robots: site.status === "published" ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function HostedSitePage({ params }: PageProps) {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site || site.status !== "published") notFound();
  return <SitePreview site={site} framed={false} />;
}
