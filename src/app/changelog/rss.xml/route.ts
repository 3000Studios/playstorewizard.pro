import { RELEASES } from "@/lib/content/releases";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const feedUrl = `${SITE_URL}/changelog/rss.xml`;
  const pageUrl = `${SITE_URL}/changelog`;
  const lastBuildDate = new Date(RELEASES[0]?.date ?? Date.now()).toUTCString();

  const items = RELEASES.map((r) => {
    const link = `${pageUrl}#v${r.version}`;
    const pubDate = new Date(r.date).toUTCString();
    const description = r.changes
      .map((c) => `<li><strong>${escapeXml(c.type)}</strong>: ${escapeXml(c.text)}</li>`)
      .join("");
    return `    <item>
      <title>${escapeXml(`v${r.version} — ${SITE_NAME}`)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(`playstorewizard-changelog-${r.version}`)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(`<ul>${description}</ul>`)}</description>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE_NAME} — Changelog`)}</title>
    <link>${escapeXml(pageUrl)}</link>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <description>Releases, policy updates, and fixes for Playstore Wizard.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=600, s-maxage=3600",
    },
  });
}
