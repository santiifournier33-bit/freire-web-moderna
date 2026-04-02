import { getPropertyById } from "@/lib/tokkobroker";
import PropertyDetailClient from "./PropertyDetailClient";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

const BASE_URL = "https://www.freirepropiedades.com";

// ─── Option A: Dynamic Metadata per property ───────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
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

  const title = `${type} en ${opType} en ${location}`;
  const description = price
    ? `${title}. Precio: ${price}. ${(property.description || "").replace(/<[^>]*>/gm, "").slice(0, 120)}...`
    : `${title}. ${(property.description || "").replace(/<[^>]*>/gm, "").slice(0, 150)}...`;

  const mainImage = property.photos?.[0]?.original || `${BASE_URL}/logo-freire-azul.png`;
  const canonicalUrl = `${BASE_URL}/propiedades/${id}`;

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
function PropertySchema({ property, id }: { property: any; id: string }) {
  const operation = property.operations?.[0];
  const price = operation?.prices?.[0]?.price;
  const currency = operation?.prices?.[0]?.currency || "USD";
  const opType = operation?.operation_type?.toLowerCase();
  const mainImage = property.photos?.[0]?.original;

  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.publication_title,
    description: (property.description || "").replace(/<[^>]*>/gm, ""),
    url: `${BASE_URL}/propiedades/${id}`,
    ...(mainImage && { image: mainImage }),
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

// ─── Page Component ─────────────────────────────────────────────────────────
export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  return (
    <div className="flex flex-col min-h-screen pt-32 md:pt-40 pb-32 bg-surface">
      <PropertySchema property={property} id={id} />
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Editorial Back Link */}
        <Link href="/propiedades" className="inline-flex items-center text-primary/40 mb-8 hover:text-secondary transition-all group">
          <ChevronLeft size={20} className="mr-4 group-hover:-translate-x-2 transition-transform duration-500" strokeWidth={1} />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Regresar al Catálogo</span>
        </Link>
        
        <PropertyDetailClient property={property} />

      </div>
    </div>
  );
}

