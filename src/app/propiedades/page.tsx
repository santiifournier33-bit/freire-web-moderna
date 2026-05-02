import { Suspense } from "react";
import type { Metadata } from "next";
import { getProperties } from "@/lib/tokkobroker";
import PropiedadesList from "./PropiedadesList";

export const metadata: Metadata = {
  title: "Propiedades en Venta y Alquiler en Pilar - Zona Norte | Freire",
  description: "Explorá casas, departamentos y terrenos en venta y alquiler en Pilar, Del Viso, Manuel Alberti y Zona Norte. Encontrá tu próxima propiedad con Freire Propiedades.",
  alternates: {
    canonical: "https://www.freirepropiedades.com/propiedades",
  },
};

export default async function PropiedadesPage() {
  const properties = await getProperties();
  
  return (
    <div className="flex flex-col min-h-screen pt-32 pb-32 bg-surface">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">
        
        {/* SEO Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-primary tracking-[-0.03em] leading-tight mb-3">
            Propiedades en Venta y Alquiler en Pilar{" "}
            <span className="text-secondary italic font-normal">- Zona Norte</span>
          </h1>
          <p className="text-base text-on-surface-variant font-sans max-w-2xl leading-relaxed">
            Explorá nuestro catálogo de casas, departamentos, terrenos y locales disponibles en Pilar, Del Viso, Manuel Alberti y toda la Zona Norte del Gran Buenos Aires.
          </p>
        </div>

        <Suspense fallback={<div className="py-20 text-center text-primary/50 text-sm font-bold uppercase tracking-widest animate-pulse">Cargando catálogo...</div>}>
          <PropiedadesList initialProperties={properties} />
        </Suspense>

      </div>
    </div>
  );
}
