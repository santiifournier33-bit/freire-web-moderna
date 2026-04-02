"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, X, SlidersHorizontal, ChevronDown, Check, ArrowRight, Video, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BedIcon, BathroomsIcon, TotalSurfaceIcon, CubiertaSurfaceIcon } from "@/components/ui/PropertyIcons";
import { StreetViewIcon } from "@/components/ui/StreetViewIcon";

type SortOption = "recent" | "price_asc" | "price_desc" | "size_desc";
type AgeFilter = "" | "a-estrenar" | "0-5" | "5-10" | "10-20" | "20-50" | "50+";

function FilterAccordion({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="py-4 border-b border-primary/10 last:border-0 relative">
      <button type="button" className="w-full flex items-center justify-between text-left mb-3 group outline-none" onClick={() => setIsOpen(!isOpen)}>
        <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">{title}</span>
        <ChevronDown size={16} className={`text-primary/40 group-hover:text-secondary transition-all ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
        {children}
      </div>
    </div>
  );
}

function FilterListItem({ label, count, active, onClick }: { label: string, count?: number, active: boolean, onClick: () => void }) {
  return (
    <button 
      type="button"
      onClick={onClick} 
      className={`w-full flex items-center justify-between py-1.5 text-sm transition-colors group outline-none ${active ? 'font-bold text-secondary' : 'text-on-surface-variant hover:text-secondary hover:underline underline-offset-4 decoration-primary/20'}`}
    >
      <span className="truncate pr-2">{label}</span>
      {count !== undefined && <span className="text-[10px] text-primary/50 group-hover:text-secondary/70 shrink-0">({count})</span>}
    </button>
  );
}

function Chip({ label, onRemove }: { label: string, onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 bg-[#4c5a69] text-white px-3 py-1.5 rounded-full shadow-sm animate-in zoom-in-95">
      <span className="text-[12px] font-semibold tracking-wide">{label}</span>
      <button onClick={onRemove} className="text-white/70 hover:text-white transition-colors p-0.5 rounded-full bg-white/10 hover:bg-white/20">
        <X size={12} strokeWidth={3} />
      </button>
    </div>
  );
}

export default function PropiedadesList({ initialProperties }: { initialProperties: any[] }) {
  const searchParams = useSearchParams();
  
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("keyword") || "");
  const [location, setLocation] = useState(searchParams.get("ubicacion") || "");
  const [operationType, setOperationType] = useState(searchParams.get("operacion") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("tipo") || "");
  
  const [currency, setCurrency] = useState<"USD" | "ARS" | "">("");
  
  // Applied states
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [areaFrom, setAreaFrom] = useState("");
  const [areaTo, setAreaTo] = useState("");
  
  // Temporary states for inputs before "Aplicar"
  const [tempPriceFrom, setTempPriceFrom] = useState("");
  const [tempPriceTo, setTempPriceTo] = useState("");
  const [tempAreaFrom, setTempAreaFrom] = useState("");
  const [tempAreaTo, setTempAreaTo] = useState("");
  
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  
  const [age, setAge] = useState<AgeFilter>("");
  
  const [hasParking, setHasParking] = useState(false);
  const [isCommercial, setIsCommercial] = useState(false);

  const [sortBy, setSortBy] = useState<SortOption>("recent");
  
  // Pagination & Search Key
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filterKeyStr = `${searchTerm}-${location}-${operationType}-${propertyType}-${currency}-${priceFrom}-${priceTo}-${areaFrom}-${areaTo}-${bedrooms}-${bathrooms}-${age}-${hasParking}-${isCommercial}-${sortBy}`;

  // Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, location, operationType, propertyType, currency, priceFrom, priceTo, areaFrom, areaTo, bedrooms, bathrooms, age, hasParking, isCommercial, sortBy]);

  const listTopRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (listTopRef.current) {
      const topOffset = listTopRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const propertiesWithHelpers = useMemo(() => {
    return initialProperties.map(prop => {
      const matchOp = prop.operations?.[0];
      const priceVal = matchOp?.prices?.[0]?.price || 0;
      const curr = matchOp?.prices?.[0]?.currency || "USD";
      const totalArea = prop.surface || prop.total_surface || 0;
      const roofedArea = prop.roofed_surface || 0;
      const beds = prop.suite_amount || prop.room_amount || 0;
      const baths = prop.bathroom_amount || 0;
      
      const pAge = prop.age || 0;
      const isNew = pAge === 0 || prop.tags?.some((t:any)=>t.name.toLowerCase().includes('estrenar'));

      const propertyVideos = prop.videos || [];
      const hasTour = propertyVideos.some((v: any) => v.title?.toLowerCase().includes('360') || v.url?.toLowerCase().includes('360') || v.url?.includes('kuula') || v.url?.includes('matterport'));
      const hasVideo = propertyVideos.some((v: any) => v.provider === 'youtube' || v.provider === 'vimeo' || v.url?.includes('youtube') || v.url?.includes('vimeo'));

      const dateCreated = new Date(prop.created_at || 0).getTime();

      return {
        ...prop,
        matchOp,
        priceVal,
        curr,
        totalArea,
        roofedArea,
        beds,
        baths,
        pAge,
        isNew,
        hasTour,
        hasVideo,
        dateCreated
      };
    });
  }, [initialProperties]);

  // Faceted counts over ALL data
  const locCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    propertiesWithHelpers.forEach(p => {
      const loc = p.location?.name;
      if (loc) counts[loc] = (counts[loc] || 0) + 1;
    });
    return Object.entries(counts).sort((a,b) => b[1] - a[1]);
  }, [propertiesWithHelpers]);

  const opCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    propertiesWithHelpers.forEach(p => {
      p.operations?.forEach((op:any) => {
        const type = op.operation_type;
        counts[type] = (counts[type] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a,b) => b[1] - a[1]);
  }, [propertiesWithHelpers]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    propertiesWithHelpers.forEach(p => {
      const type = p.type?.name;
      if (type) counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).sort((a,b) => b[1] - a[1]);
  }, [propertiesWithHelpers]);

  const ageCounts = useMemo(() => {
    const counts: Record<AgeFilter, number> = {
      "": 0,
      "a-estrenar": 0,
      "0-5": 0,
      "5-10": 0,
      "10-20": 0,
      "20-50": 0,
      "50+": 0
    };
    propertiesWithHelpers.forEach(p => {
      if (p.isNew) counts["a-estrenar"]++;
      else if (p.pAge <= 5) counts["0-5"]++;
      else if (p.pAge <= 10) counts["5-10"]++;
      else if (p.pAge <= 20) counts["10-20"]++;
      else if (p.pAge <= 50) counts["20-50"]++;
      else counts["50+"]++;
    });
    return counts;
  }, [propertiesWithHelpers]);

  const extraCounts = useMemo(() => {
    let parking = 0;
    let commercial = 0;
    propertiesWithHelpers.forEach(p => {
      if (p.parking_lot_amount > 0 || p.tags?.some((t:any)=>t.name.toLowerCase().includes('cochera'))) parking++;
      if (p.type?.name?.toLowerCase() === 'local' || p.type?.name?.toLowerCase() === 'comercial') commercial++;
    });
    return { parking, commercial };
  }, [propertiesWithHelpers]);

  const filteredProperties = useMemo(() => {
    return propertiesWithHelpers.filter(prop => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchTitle = prop.publication_title?.toLowerCase().includes(searchLower);
        const matchDesc = prop.description?.toLowerCase().includes(searchLower);
        const matchLoc = prop.location?.name?.toLowerCase().includes(searchLower);
        if (!matchTitle && !matchDesc && !matchLoc) return false;
      }
      if (location && prop.location?.name !== location) return false;
      if (operationType) {
        const hasOp = prop.operations?.some((op: any) => op.operation_type.toLowerCase() === operationType.toLowerCase());
        if (!hasOp) return false;
      }
      if (propertyType && prop.type?.name?.toLowerCase() !== propertyType.toLowerCase()) return false;
      if (currency && prop.curr !== currency) return false;
      if (priceFrom && prop.priceVal < Number(priceFrom)) return false;
      if (priceTo && prop.priceVal > Number(priceTo)) return false;
      if (areaFrom && prop.totalArea < Number(areaFrom)) return false;
      if (areaTo && prop.totalArea > Number(areaTo)) return false;
      if (bedrooms !== null) {
        if (bedrooms === 4 && prop.beds < 4) return false;
        if (bedrooms < 4 && prop.beds !== bedrooms) return false;
      }
      if (bathrooms !== null) {
        if (bathrooms === 3 && prop.baths < 3) return false;
        if (bathrooms < 3 && prop.baths !== bathrooms) return false;
      }
      if (age) {
        if (age === "a-estrenar" && !prop.isNew) return false;
        if (age === "0-5" && (prop.isNew || prop.pAge > 5)) return false;
        if (age === "5-10" && (prop.pAge < 5 || prop.pAge > 10)) return false;
        if (age === "10-20" && (prop.pAge < 10 || prop.pAge > 20)) return false;
        if (age === "20-50" && (prop.pAge < 20 || prop.pAge > 50)) return false;
        if (age === "50+" && prop.pAge <= 50) return false;
      }
      if (hasParking && !prop.parking_lot_amount && !prop.tags?.some((t:any) => t.name.toLowerCase().includes('cochera'))) return false;
      if (isCommercial && prop.type?.name?.toLowerCase() !== 'local' && prop.type?.name?.toLowerCase() !== 'comercial') return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "recent") return b.dateCreated - a.dateCreated;
      if (sortBy === "price_asc") return a.priceVal - b.priceVal;
      if (sortBy === "price_desc") return b.priceVal - a.priceVal;
      if (sortBy === "size_desc") return b.totalArea - a.totalArea;
      return 0;
    });
  }, [propertiesWithHelpers, searchTerm, location, operationType, propertyType, currency, priceFrom, priceTo, areaFrom, areaTo, bedrooms, bathrooms, age, hasParking, isCommercial, sortBy]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(start, start + itemsPerPage);
  }, [filteredProperties, currentPage]);

  const activeFiltersCount = [searchTerm, location, operationType, propertyType, priceFrom, priceTo, areaFrom, areaTo, bedrooms !== null, bathrooms !== null, age, hasParking, isCommercial].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setOperationType("");
    setPropertyType("");
    setPriceFrom(""); setTempPriceFrom("");
    setPriceTo(""); setTempPriceTo("");
    setAreaFrom(""); setTempAreaFrom("");
    setAreaTo(""); setTempAreaTo("");
    setBedrooms(null);
    setBathrooms(null);
    setAge("");
    setCurrency("");
    setHasParking(false);
    setIsCommercial(false);
  };

  const getAgeLabel = (val: AgeFilter) => {
    switch (val) {
      case "a-estrenar": return "A estrenar";
      case "0-5": return "Hasta 5 años";
      case "5-10": return "Entre 5 y 10 años";
      case "10-20": return "Entre 10 y 20 años";
      case "20-50": return "Entre 20 y 50 años";
      case "50+": return "Más de 50 años";
      default: return "";
    }
  };

  return (
    <div id="propiedades-seccion-filtros" className="flex flex-col lg:flex-row gap-8 items-start relative max-w-[1400px] mx-auto pb-12">
      
      {/* Mobile Filters Toggle */}
      <button 
        className="lg:hidden w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold tracking-widest uppercase text-[12px] rounded-lg sticky top-2 z-30 shadow-2xl border border-white/10 active:scale-95 transition-all"
        onClick={() => {
          const newState = !showFiltersMobile;
          setShowFiltersMobile(newState);
          
          if (newState) {
            // Scroll suave a la parte superior de la sección de filtros
            setTimeout(() => {
              const element = document.getElementById('propiedades-seccion-filtros');
              if (element) {
                const offset = 100; // Desplazamiento para no quedar tapado por el navbar
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth"
                });
              }
            }, 100); // Pequeño delay para dejar que el DOM renderice el aside
          }
        }}
      >
        <SlidersHorizontal size={18} />
        {showFiltersMobile ? "Ocultar Filtros" : `Filtros Avanzados ${activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}`}
      </button>

      {/* --- LEFT SIDEBAR (FILTERS) --- */}
      <aside className={`w-full lg:w-1/4 xl:w-[320px] shrink-0 bg-white border border-primary/10 rounded-[1.5rem] p-6 lg:p-6 z-20 transition-all duration-300 shadow-sm ${showFiltersMobile ? 'block mt-4' : 'hidden lg:block'}`}>
        
        {/* Applied Filters Chips Header */}
        <div className="flex flex-col mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-primary">Filtros aplicados</h2>
          </div>
          {activeFiltersCount > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {location && <Chip label={`Ubicación: ${location}`} onRemove={() => setLocation("")} />}
              {operationType && <Chip label={`Operación: ${operationType}`} onRemove={() => setOperationType("")} />}
              {propertyType && <Chip label={`Tipo: ${propertyType}`} onRemove={() => setPropertyType("")} />}
              {(priceFrom || priceTo) && <Chip label={`Precio: ${priceFrom && priceTo ? `${currency} ${priceFrom} a ${priceTo}` : priceFrom ? `Min ${currency} ${priceFrom}` : `Max ${currency} ${priceTo}`}`} onRemove={() => { setPriceFrom(""); setPriceTo(""); setTempPriceFrom(""); setTempPriceTo(""); }} />}
              {(areaFrom || areaTo) && <Chip label={`Sup: ${areaFrom && areaTo ? `${areaFrom} a ${areaTo} m²` : areaFrom ? `Min ${areaFrom} m²` : `Max ${areaTo} m²`}`} onRemove={() => { setAreaFrom(""); setAreaTo(""); setTempAreaFrom(""); setTempAreaTo(""); }} />}
              {bedrooms !== null && <Chip label={`Dorm: ${bedrooms === 4 ? '4+' : bedrooms}`} onRemove={() => setBedrooms(null)} />}
              {bathrooms !== null && <Chip label={`Baños: ${bathrooms === 3 ? '3+' : bathrooms}`} onRemove={() => setBathrooms(null)} />}
              {age && <Chip label={`Antigüedad: ${getAgeLabel(age)}`} onRemove={() => setAge("")} />}
              {hasParking && <Chip label="Opción: Con cochera" onRemove={() => setHasParking(false)} />}
              {isCommercial && <Chip label="Opción: Comercial" onRemove={() => setIsCommercial(false)} />}
            </div>
          )}
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="text-[12px] text-primary/50 text-left hover:text-secondary mt-3 font-semibold transition-colors w-fit">
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Filters Structure */}
        <div className="pt-2">
          
          <div className="py-4 border-b border-primary/10">
             <label className="text-sm font-bold text-primary/80 mb-3 block">Palabras clave</label>
             <div className="relative">
               <input 
                 type="text" 
                 className="w-full bg-surface border border-primary/10 rounded-full py-2.5 px-4 text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all placeholder:text-primary/30"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
             </div>
          </div>

          <FilterAccordion title="Ubicación">
             <div className="space-y-1">
               {locCounts.slice(0, 10).map(([loc, cnt]) => (
                 <FilterListItem key={loc} label={loc} count={cnt} active={location === loc} onClick={() => setLocation(location === loc ? "" : loc)} />
               ))}
               {locCounts.length > 10 && <FilterListItem label="Ver más ubicaciones..." active={false} onClick={() => {}} />}
             </div>
          </FilterAccordion>

          <FilterAccordion title="Tipo de operación">
             <div className="space-y-1">
               {opCounts.map(([op, cnt]) => (
                 <FilterListItem key={op} label={op} count={cnt} active={operationType === op} onClick={() => setOperationType(operationType === op ? "" : op)} />
               ))}
             </div>
          </FilterAccordion>

          <FilterAccordion title="Tipo de propiedad">
             <div className="space-y-1">
               {typeCounts.map(([type, cnt]) => (
                 <FilterListItem key={type} label={type} count={cnt} active={propertyType === type} onClick={() => setPropertyType(propertyType === type ? "" : type)} />
               ))}
             </div>
          </FilterAccordion>

          <FilterAccordion title="Precio">
             <div className="flex gap-2 mb-3">
                <select 
                  className="bg-transparent border border-primary/20 rounded-full py-2 px-3 text-sm text-primary font-medium focus:border-secondary outline-none appearance-none cursor-pointer"
                  value={currency} onChange={(e) => setCurrency(e.target.value as "USD"|"ARS")}
                >
                  <option value="USD">USD</option>
                  <option value="ARS">ARS</option>
                </select>
                <div className="flex items-center gap-2 flex-1">
                  <input type="number" placeholder="Desde" className="w-full bg-transparent border border-primary/20 rounded-full py-2 px-3 text-sm focus:border-secondary outline-none text-center transition-colors" value={tempPriceFrom} onChange={(e) => setTempPriceFrom(e.target.value)} />
                  <input type="number" placeholder="Hasta" className="w-full bg-transparent border border-primary/20 rounded-full py-2 px-3 text-sm focus:border-secondary outline-none text-center transition-colors" value={tempPriceTo} onChange={(e) => setTempPriceTo(e.target.value)} />
                </div>
             </div>
             <button 
               onClick={() => { setPriceFrom(tempPriceFrom); setPriceTo(tempPriceTo); }} 
               className="w-full bg-surface border border-primary/5 py-2.5 rounded-full text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
             >
               Aplicar
             </button>
          </FilterAccordion>

          <FilterAccordion title="Superficie total">
             <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 space-y-1">
                  <span className="text-xs text-primary/60">Area desde</span>
                  <input type="number" className="w-full bg-transparent border border-primary/20 rounded-full py-2 px-3 text-sm focus:border-secondary outline-none text-center transition-colors" value={tempAreaFrom} onChange={(e) => setTempAreaFrom(e.target.value)} />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-xs text-primary/60">Area hasta</span>
                  <input type="number" className="w-full bg-transparent border border-primary/20 rounded-full py-2 px-3 text-sm focus:border-secondary outline-none text-center transition-colors" value={tempAreaTo} onChange={(e) => setTempAreaTo(e.target.value)} />
                </div>
             </div>
             <button 
               onClick={() => { setAreaFrom(tempAreaFrom); setAreaTo(tempAreaTo); }} 
               className="w-full bg-surface border border-primary/5 py-2.5 rounded-full text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
             >
               Aplicar
             </button>
          </FilterAccordion>

          <FilterAccordion title="Dormitorios">
             <div className="flex gap-1.5">
               {[0, 1, 2, 3, 4].map(num => (
                 <button key={num} onClick={() => setBedrooms(bedrooms === num ? null : num)} className={`flex-1 py-1.5 text-sm font-semibold rounded outline-none transition-colors border ${bedrooms === num ? 'bg-secondary border-secondary text-white shadow-sm' : 'bg-surface border-primary/10 hover:bg-surface-dim text-primary/70'}`}>
                   {num === 4 ? '4+' : num}
                 </button>
               ))}
             </div>
          </FilterAccordion>

          <FilterAccordion title="Baños">
             <div className="flex gap-1.5 w-3/4">
               {[0, 1, 2, 3].map(num => (
                 <button key={num} onClick={() => setBathrooms(bathrooms === num ? null : num)} className={`flex-1 py-1.5 text-sm font-semibold rounded outline-none transition-colors border ${bathrooms === num ? 'bg-secondary border-secondary text-white shadow-sm' : 'bg-surface border-primary/10 hover:bg-surface-dim text-primary/70'}`}>
                   {num === 3 ? '3+' : num}
                 </button>
               ))}
             </div>
          </FilterAccordion>

          <FilterAccordion title="Antigüedad">
             <div className="space-y-1">
               <FilterListItem label="A estrenar" count={ageCounts["a-estrenar"]} active={age === "a-estrenar"} onClick={() => setAge(age === "a-estrenar" ? "" : "a-estrenar")} />
               <FilterListItem label="Hasta 5 años" count={ageCounts["0-5"]} active={age === "0-5"} onClick={() => setAge(age === "0-5" ? "" : "0-5")} />
               <FilterListItem label="Entre 5 y 10 años" count={ageCounts["5-10"]} active={age === "5-10"} onClick={() => setAge(age === "5-10" ? "" : "5-10")} />
               <FilterListItem label="Entre 10 y 20 años" count={ageCounts["10-20"]} active={age === "10-20"} onClick={() => setAge(age === "10-20" ? "" : "10-20")} />
               <FilterListItem label="Entre 20 y 50 años" count={ageCounts["20-50"]} active={age === "20-50"} onClick={() => setAge(age === "20-50" ? "" : "20-50")} />
               <FilterListItem label="Más de 50 años" count={ageCounts["50+"]} active={age === "50+"} onClick={() => setAge(age === "50+" ? "" : "50+")} />
             </div>
          </FilterAccordion>

          <FilterAccordion title="Otros">
             <div className="space-y-1">
               <FilterListItem label="Con cochera" count={extraCounts.parking} active={hasParking} onClick={() => setHasParking(!hasParking)} />
               <FilterListItem label="Uso comercial" count={extraCounts.commercial} active={isCommercial} onClick={() => setIsCommercial(!isCommercial)} />
             </div>
          </FilterAccordion>

        </div>
      </aside>

      {/* --- RIGHT COLUMN (RESULTS & MAIN CONTENT) --- */}
      <div className="flex-1 w-full flex flex-col gap-6">
        
        {/* Results Header & Sorting */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-primary/10">
          <p className="font-sans text-primary/60">
            Mostrando <span className="font-bold text-primary">{filteredProperties.length}</span> propiedades
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-sm font-bold text-primary/70 uppercase tracking-wider shrink-0">Ordenar por:</label>
            <select 
              className="bg-transparent border border-primary/10 rounded-full py-2 px-4 text-sm text-primary font-semibold focus:border-secondary outline-none w-full sm:w-48 cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="recent">Más recientes</option>
              <option value="price_asc">Menor Precio</option>
              <option value="price_desc">Mayor Precio</option>
              <option value="size_desc">Mayor Tamaño</option>
            </select>
          </div>
        </div>

        {/* Properties List (Horizontal Cards) */}
        <div ref={listTopRef} key={filterKeyStr} className="flex flex-col gap-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPage + filterKeyStr}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-8 w-full"
            >
              {paginatedProperties.length > 0 ? (
                paginatedProperties.map((prop) => {
                  const mainImage = prop.photos?.length > 0 ? prop.photos[0].image : "/placeholder-home.jpg";
                  const operation = prop.matchOp?.operation_type || "Consulta";
                  const priceDisplay = prop.matchOp?.prices?.[0] ? `${prop.curr} ${prop.priceVal.toLocaleString('de-DE')}` : "Consulte precio";
                  const expensas = prop.expenses > 0 ? `Expensas: $ ${prop.expenses.toLocaleString('de-DE')}` : null;
                  
                  return (
                    <div key={prop.id} className="group flex flex-col md:flex-row bg-white rounded-[1.5rem] shadow-ambient overflow-hidden border border-primary/5 hover:border-secondary/30 transition-all duration-300 hover:shadow-2xl">
                      
                      {/* Left Side: Image */}
                      <div className="relative w-full md:w-[40%] xl:w-[35%] h-[250px] md:h-auto shrink-0 overflow-hidden bg-surface-container">
                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                          <span className="text-[10px] uppercase tracking-widest font-bold bg-primary text-white px-3 py-1.5 rounded-full shadow-sm">
                            {operation}
                          </span>
                          {prop.isNew && (
                            <span className="text-[10px] uppercase tracking-widest font-bold bg-secondary text-white px-3 py-1.5 rounded-full shadow-sm">
                              A estrenar
                            </span>
                          )}
                        </div>
                        
                        <Link href={`/propiedades/${prop.id}`} className="absolute inset-0">
                          {mainImage !== "/placeholder-home.jpg" ? (
                            <Image 
                              src={mainImage} 
                              alt={prop.publication_title} 
                              fill
                              sizes="(max-width: 768px) 100vw, 400px"
                              className="object-cover transition-transform duration-1000 ease-standard group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-primary/10 font-bold uppercase tracking-[0.2em] text-xs">
                              Sin imagen
                            </div>
                          )}
                        </Link>

                        {/* Bottom Left Media Indicators */}
                        {(prop.hasVideo || prop.hasTour) && (
                          <div className="absolute bottom-4 left-4 z-10 flex gap-2">
                            {prop.hasVideo && (
                              <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white" title="Video de Propiedad">
                                <Video size={13} fill="currentColor" />
                              </div>
                            )}
                            {prop.hasTour && (
                              <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white" title="Recorrido 360">
                                <StreetViewIcon size={14} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right Side: Information */}
                      <div className="flex-1 flex flex-col justify-between p-6 md:p-8">
                        <div>
                          <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 mb-6">
                            <div className="flex-1">
                              <Link href={`/propiedades/${prop.id}`} className="block group-hover:text-secondary transition-colors">
                                <h3 className="text-xl md:text-2xl font-bold text-primary tracking-tight leading-tight line-clamp-2 mb-2">
                                  {prop.publication_title}
                                </h3>
                              </Link>
                              <div className="flex items-center gap-2 text-primary/60">
                                <MapPin size={16} className="text-secondary shrink-0" />
                                <span className="text-sm font-medium truncate">{prop.location?.name || prop.location?.short_location || "Consultar ubicación"}</span>
                              </div>
                            </div>
                            
                            <div className="md:text-right shrink-0 bg-surface-container-low md:bg-transparent p-4 md:p-0 rounded-lg w-full md:w-auto mt-2 md:mt-0">
                              <p className="text-3xl font-bold text-secondary tracking-tighter leading-none mb-1">{priceDisplay}</p>
                              {expensas && (
                                <p className="text-xs text-primary/50 font-semibold">{expensas}</p>
                              )}
                            </div>
                          </div>

                          <p className="text-on-surface-variant font-sans text-sm line-clamp-3 mb-6">
                            {prop.description ? prop.description.replace(/<[^>]*>?/gm, '') : 'Una propiedad excepcional con características destacadas. Excelente oportunidad en el mercado actual.'}
                          </p>
                        </div>

                        {/* Specs & Actions */}
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-6 border-t border-primary/10">
                          <div className="flex items-center gap-4 md:gap-7 w-full lg:flex-1">
                            {prop.beds > 0 && (
                              <div className="flex items-center gap-1.5" title="Dormitorios">
                                <BedIcon className="w-5 h-5 text-primary/40" />
                                <span className="font-bold text-primary text-sm whitespace-nowrap">{prop.beds}</span>
                              </div>
                            )}
                            {prop.baths > 0 && (
                              <div className="flex items-center gap-1.5" title="Baños">
                                <BathroomsIcon className="w-5 h-5 text-primary/40" />
                                <span className="font-bold text-primary text-sm whitespace-nowrap">{prop.baths}</span>
                              </div>
                            )}
                            {prop.roofedArea > 0 && (
                              <div className="flex items-center gap-1.5" title="Sup. Cubierta">
                                <CubiertaSurfaceIcon className="w-5 h-5 text-primary/40" />
                                <span className="font-bold text-primary text-sm whitespace-nowrap">{Math.floor(prop.roofedArea)} m²</span>
                              </div>
                            )}
                            {prop.totalArea > 0 && (
                              <div className={`flex items-center gap-1.5 ${(prop.beds > 0 || prop.baths > 0 || prop.roofedArea > 0) ? 'border-l border-primary/10 pl-4 md:pl-7' : ''}`} title="Superficie Total">
                                <TotalSurfaceIcon className="w-5 h-5 text-primary/40" />
                                <span className="font-bold text-primary text-sm whitespace-nowrap">{Math.floor(prop.totalArea)} m²</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-none border-primary/5">
                            <Link 
                              href={`/propiedades/${prop.id}#seccion-contacto`}
                              className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#25D366] hover:bg-[#1DA851] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 shrink-0"
                              title="Consultar por WhatsApp"
                            >
                              <img src="/whatsapp-blanco.png" alt="WhatsApp" className="w-[20px] h-[20px] object-contain text-white" />
                            </Link>
                            <Link 
                              href={`/propiedades/${prop.id}`}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-white py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-colors hover:shadow-lg whitespace-nowrap"
                            >
                              Más detalles
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[1.5rem] border border-primary/10 border-dashed">
                  <Search size={48} className="text-secondary/30 mb-6" />
                  <h3 className="text-2xl font-bold text-primary mb-3">Sin resultados</h3>
                  <p className="text-on-surface-variant max-w-md">
                    No encontramos propiedades que coincidan con estos filtros exactos. Intenta limpiar algunos filtros o cambiar tu búsqueda.
                  </p>
                  <button onClick={clearFilters} className="mt-8 text-sm font-bold uppercase tracking-widest text-secondary underline underline-offset-4 decoration-2">
                    Limpiar todos los filtros
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 py-8 border-t border-primary/5">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-primary/10 text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-primary cursor-pointer disabled:cursor-default"
              >
                <ChevronLeft size={18} />
              </motion.button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all cursor-pointer ${
                        currentPage === page
                          ? "bg-secondary text-white shadow-lg scale-110"
                          : "border border-primary/10 text-primary hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </motion.button>
                  );
                } else if (
                  (page === currentPage - 2 && page > 1) ||
                  (page === currentPage + 2 && page < totalPages)
                ) {
                  return <span key={page} className="text-primary/30 px-1 font-bold">...</span>;
                }
                return null;
              })}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-primary/10 text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-primary cursor-pointer disabled:cursor-default"
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
