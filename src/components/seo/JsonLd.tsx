type JsonLdProps = {
  name: string;
  description: string;
  url: string;
};

/**
 * Schema.org SoftwareApplication for rich results eligibility (with other signals).
 */
export function JsonLd({ name, description, url }: JsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
