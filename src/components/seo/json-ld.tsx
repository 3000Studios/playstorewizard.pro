interface JsonLdProps {
  data: object | object[];
}

/**
 * Renders one or more JSON-LD structured data blocks for SEO.
 * Place in page <head> via a Server Component or near the top of the page body.
 */
export function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
