import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface RelatedProperty {
  id: number;
  publication_title: string;
  type?: { name: string };
  location?: { name: string; short_location: string };
  address?: string;
  operations?: Array<{
    operation_type: string;
    prices: Array<{ currency: string; price: number }>;
  }>;
  photos?: Array<{ image: string; original: string }>;
  suite_amount?: number;
  bathroom_amount?: number;
  surface?: number;
  total_surface?: number;
}

export default function RelatedProperties({
  properties,
  currentId,
}: {
  properties: RelatedProperty[];
  currentId: number;
}) {
  // Filter out current property and limit to 4
  const related = properties
    .filter((p) => p.id !== currentId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="pt-16 mt-16 border-t border-primary/10">
      {/* Section Header — editorial style matching ProcessSteps/WhyChooseUs */}
      <div className="mb-8 md:mb-12">
        <span className="label-editorial mb-3 block underline decoration-secondary decoration-2 underline-offset-8">
          Otras Opciones
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-[-0.03em] leading-tight">
          Propiedades{" "}
          <span className="text-secondary italic font-normal">similares</span>
        </h2>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {related.map((prop) => {
          const mainImage =
            prop.photos?.[0]?.image || prop.photos?.[0]?.original || null;
          const op = prop.operations?.[0];
          const opType = op?.operation_type || "Venta";
          const price = op?.prices?.[0]
            ? `${op.prices[0].currency} ${op.prices[0].price.toLocaleString("de-DE")}`
            : "Consulte";
          const location =
            prop.location?.name ||
            prop.location?.short_location ||
            prop.address ||
            "";
          const propertyType = prop.type?.name || "Propiedad";
          const surface = prop.surface || prop.total_surface;
          const beds = prop.suite_amount || 0;
          const baths = prop.bathroom_amount || 0;

          return (
            <Link
              key={prop.id}
              href={`/p/${prop.id}-prop`}
              className="group flex flex-col bg-white rounded-xl overflow-hidden border border-primary/5 hover:border-secondary/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-[180px] w-full overflow-hidden bg-surface-container">
                {/* Operation badge */}
                <span className="absolute top-3 left-3 z-10 text-[9px] uppercase tracking-widest font-bold bg-primary text-white px-2.5 py-1 rounded-full shadow-sm">
                  {opType}
                </span>

                {mainImage ? (
                  <Image
                    src={mainImage}
                    alt={`${propertyType} en ${opType} en ${location}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/10 font-bold uppercase tracking-[0.2em] text-[10px]">
                    Sin imagen
                  </div>
                )}
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/0 transition-colors duration-500" />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col p-5">
                {/* Price */}
                <p className="text-lg font-bold text-secondary tracking-tight mb-2">
                  {price}
                </p>

                {/* Title */}
                <h3 className="text-sm font-bold text-primary leading-snug line-clamp-2 mb-2 group-hover:text-secondary transition-colors duration-300">
                  {prop.publication_title}
                </h3>

                {/* Location */}
                {location && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <MapPin
                      size={12}
                      className="text-secondary shrink-0"
                    />
                    <span className="text-xs text-primary/50 font-medium truncate">
                      {location}
                    </span>
                  </div>
                )}

                {/* Specs row */}
                <div className="mt-auto flex items-center gap-3 pt-3 border-t border-primary/5 text-[11px] font-semibold text-primary/50">
                  {beds > 0 && <span>{beds} dorm.</span>}
                  {baths > 0 && <span>{baths} baño{baths > 1 ? "s" : ""}</span>}
                  {surface && surface > 0 && (
                    <span>{Math.floor(surface)} m²</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
