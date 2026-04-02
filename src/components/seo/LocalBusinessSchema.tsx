// JSON-LD Schema: LocalBusiness (Option C)
// Tells Google exactly who Freire is, where they are, and their services.
// This powers the Knowledge Panel and Local Pack results.

export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://www.freirepropiedades.com/#business",
    name: "FREIRE Negocios Inmobiliarios",
    alternateName: "Freire Propiedades",
    description:
      "Inmobiliaria con certificación CRS internacional especializada en compra, venta, alquiler y tasaciones de propiedades en Pilar y Zona Norte del Gran Buenos Aires.",
    url: "https://www.freirepropiedades.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.freirepropiedades.com/logo-freire-azul.png",
      width: 240,
      height: 100,
    },
    image: "https://www.freirepropiedades.com/logo-freire-azul.png",
    telephone: "+541151454915",
    email: "info@freirepropiedades.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Las Amapolas 475",
      addressLocality: "Pilar",
      addressRegion: "Buenos Aires",
      postalCode: "B1629",
      addressCountry: "AR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -34.4584,
      longitude: -58.9122,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Pilar" },
      { "@type": "City", name: "Del Viso" },
      { "@type": "City", name: "Manuel Alberti" },
      { "@type": "City", name: "Zona Norte" },
    ],
    knowsAbout: [
      "Compraventa de propiedades",
      "Alquiler de inmuebles",
      "Tasaciones inmobiliarias",
      "Asesoramiento inmobiliario",
    ],
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", credentialCategory: "CRS - Certified Residential Specialist" },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "CMCPSI" },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "REALTOR" },
    ],
    sameAs: [
      "https://www.google.com/maps/place/?q=place_id:0xf515a6304e387f87",
    ],
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
