import { Suspense } from "react";
import { getProperties } from "@/lib/tokkobroker";
import PropiedadesList from "./PropiedadesList";

export default async function PropiedadesPage() {
  const properties = await getProperties();
  
  return (
    <div className="flex flex-col min-h-screen pt-32 pb-32 bg-surface">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1400px]">
        
        <Suspense fallback={<div className="py-20 text-center text-primary/50 text-sm font-bold uppercase tracking-widest animate-pulse">Cargando catálogo...</div>}>
          <PropiedadesList initialProperties={properties} />
        </Suspense>

      </div>
    </div>
  );
}
