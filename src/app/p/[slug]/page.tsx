import { getPropertyById, getProperties } from "@/lib/tokkobroker";
import PropertyDetailClient from "./PropertyDetailClient";
import RelatedProperties from "@/components/property/RelatedProperties";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

const BASE_URL = "https://www.freirepropiedades.com";

// ─── Extract ID from slug (e.g., "7909570-prop" -> "7909570") ───────────────
function getIdFromSlug(slug: string): string {
  return slug.replace("-prop", "");
}

// ─── Option A: Dynamic Metadata per property ───────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const id = getIdFromSlug(slug);
  const property = await getPropertyById(id);

  if (!property) {
    return {
      title: "Propiedad no encontrada",
      description: "Esta propiedad no está disponible o fue reservada.",
    };
  }

  const operation = property.operations?.[0];
  const price = operation?.prices?.[0]
    ? `${operation.prices[0].currency} ${operation.prices[0].price.toLocaleString("de-DE")}`
    : null;
  const location = property.location?.name || property.address || "Pilar, Buenos Aires";
  const type = property.type?.name || "Propiedad";
  const opType = operation?.operation_type || "Venta";

  // ─── SEO-optimized title & description ─────────────────────────────
  const title = `${type} en ${opType} en ${location}`;

  // Build rich description with beds, surface, amenities
  const beds = property.suite_amount > 0 ? `${property.suite_amount} dormitorios` : null;
  const surface = property.surface || property.total_surface;
  const surfaceStr = surface ? `${Math.floor(surface)}m²` : null;
  const specs = [beds, surfaceStr].filter(Boolean).join(", ");
  const specsBlock = specs ? ` ${specs}.` : "";
  const priceBlock = price ? ` ${price}.` : "";
  const cleanDesc = (property.description || "").replace(/<[^>]*>/gm, "").replace(/\s+/g, " ").trim();
  const descTruncated = cleanDesc.slice(0, 100);

  const description = `${title}.${specsBlock}${priceBlock} ${descTruncated}... — Freire Propiedades.`;

  const mainImage = property.photos?.[0]?.original || `${BASE_URL}/logo-freire-azul.png`;
  const canonicalUrl = `${BASE_URL}/p/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title,
      description,
      locale: "es_AR",
      siteName: "Freire Propiedades",
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 800,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [mainImage],
    },
  };
}

// ─── Option A: RealEstateListing JSON-LD schema ────────────────────────────
function PropertySchema({ property, slug }: { property: any; slug: string }) {
  const operation = property.operations?.[0];
  const price = operation?.prices?.[0]?.price;
  const currency = operation?.prices?.[0]?.currency || "USD";
  const opType = operation?.operation_type?.toLowerCase();
  const mainImage = property.photos?.[0]?.original;

  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.publication_title,
    description: (property.description || "").replace(/<[^>]*>/gm, "").replace(/\s+/g, " ").trim(),
    url: `${BASE_URL}/p/${slug}`,
    ...(mainImage && { image: mainImage }),
    ...(property.created_at && { datePosted: new Date(property.created_at).toISOString() }),
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: currency,
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "RealEstateAgent",
          name: "FREIRE Negocios Inmobiliarios",
          url: BASE_URL,
        },
      },
    }),
    ...(property.surface && { floorSize: { "@type": "QuantitativeValue", value: property.surface, unitCode: "MTK" } }),
    ...(property.suite_amount > 0 && { numberOfRooms: property.suite_amount }),
    ...(property.bathroom_amount > 0 && { numberOfBathroomsTotal: property.bathroom_amount }),
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address || "",
      addressLocality: property.location?.name || "Pilar",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    ...(property.geo_lat && property.geo_long && {
      geo: { "@type": "GeoCoordinates", latitude: property.geo_lat, longitude: property.geo_long },
    }),
    ...(opType && {
      additionalType: opType.includes("venta")
        ? "https://schema.org/ForSale"
        : "https://schema.org/ForRent",
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── BreadcrumbList JSON-LD ──────────────────────────────────────────────────
function BreadcrumbSchema({ property, slug }: { property: any; slug: string }) {
  const type = property.type?.name || "Propiedad";
  const opType = property.operations?.[0]?.operation_type || "Venta";
  const location = property.location?.name || "Pilar";
  const breadcrumbName = `${type} en ${opType} en ${location}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Propiedades", item: `${BASE_URL}/propiedades` },
      { "@type": "ListItem", position: 3, name: breadcrumbName },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Page Component ─────────────────────────────────────────────────────────
export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = getIdFromSlug(slug);
  const property = await getPropertyById(id);

  if (!property) {
    return (
      <div className="flex flex-col min-h-screen pt-40 pb-32 bg-surface items-center justify-center text-center px-6">
        <span className="label-editorial text-secondary mb-4 block uppercase tracking-[0.2em]">Error de Referencia</span>
        <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight mb-8">Propiedad <br /> <span className="italic font-normal">no encontrada</span></h1>
        <p className="text-on-surface-variant max-w-md mb-12 font-sans leading-relaxed">
          Es posible que la propiedad haya sido reservada o la referencia sea incorrecta.
        </p>
        <Link href="/propiedades" className="btn-secondary !bg-primary !text-white px-10 py-5 text-sm uppercase tracking-widest font-bold shadow-ambient">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const propertyType = property.type?.name || "Propiedad";
  const opType = property.operations?.[0]?.operation_type || "Venta";
  const locationName = property.location?.name || "Pilar";

  // Fetch related properties (same location or type)
  const allProperties = await getProperties(200);
  const related = allProperties
    .filter((p: any) => p.id !== property.id)
    .filter((p: any) => {
      const sameLocation = p.location?.name === property.location?.name;
      const sameType = p.type?.name === property.type?.name;
      const sameOp = p.operations?.[0]?.operation_type === property.operations?.[0]?.operation_type;
      return sameLocation || (sameType && sameOp);
    })
    .slice(0, 8); // Fetch 8, component will pick 4

  return (
    <div className="flex flex-col min-h-screen pt-32 md:pt-40 pb-32 bg-surface">
      <PropertySchema property={property} slug={slug} />
      <BreadcrumbSchema property={property} slug={slug} />
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Breadcrumbs — SEO + navigation */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs font-semibold text-primary/40">
            <li>
              <Link href="/" className="hover:text-secondary transition-colors">Inicio</Link>
            </li>
            <li aria-hidden="true">
              <ChevronLeft size={12} className="rotate-180" strokeWidth={2} />
            </li>
            <li>
              <Link href="/propiedades" className="hover:text-secondary transition-colors">Propiedades</Link>
            </li>
            <li aria-hidden="true">
              <ChevronLeft size={12} className="rotate-180" strokeWidth={2} />
            </li>
            <li className="text-primary/60 truncate max-w-[200px] md:max-w-none">
              {propertyType} en {opType} en {locationName}
            </li>
          </ol>
        </nav>
        
        <PropertyDetailClient property={property} />

        {/* Related Properties — SEO internal linking */}
        <RelatedProperties properties={related} currentId={property.id} />

      </div>
    </div>
  );
}
