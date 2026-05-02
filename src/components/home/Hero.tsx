"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, MapPin, Home, RefreshCw, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ───────────────────────────────────────────────────────
   MobileSelect: custom dropdown that only opens on TAP,
   not on scroll-through touch. Tracks touch delta — if
   the finger moves > 8px vertically, it was a scroll
   and the menu stays closed.
   ─────────────────────────────────────────────────────── */
function MobileSelect({
  icon: Icon,
  label,
  value,
  options,
  onSelect,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const touchStartY = useRef(0);
  const didMove = useRef(false);
  const handledByTouch = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    didMove.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const delta = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (delta > 8) didMove.current = true;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!didMove.current) {
      handledByTouch.current = true;
      setOpen((prev) => !prev);
      // Reset flag after synthetic click would have fired
      setTimeout(() => { handledByTouch.current = false; }, 300);
    }
  }, []);

  const handleClick = useCallback(() => {
    // Skip if touch already handled this interaction
    if (handledByTouch.current) return;
    setOpen((prev) => !prev);
  }, []);

  // Close on outside tap
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  const selectedLabel = options.find((o) => o.value === value)?.label || options[0]?.label || "";

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg bg-surface-container-low text-left cursor-pointer select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 shrink-0 ${open ? "text-primary" : "text-secondary"} transition-colors`} />
          <div>
            <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-primary/40 block mb-0.5 cursor-pointer">
              {label}
            </label>
            <span className="block w-full bg-transparent text-sm font-semibold text-primary cursor-pointer">
              {selectedLabel}
            </span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-primary/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-primary/10 rounded-lg shadow-xl overflow-hidden z-50">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              className={`px-4 py-3 text-sm font-semibold cursor-pointer transition-colors ${
                opt.value === value
                  ? "bg-primary/5 text-primary"
                  : "text-primary hover:bg-primary/5"
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    ubicacion: "",
    tipoPropiedad: "",
    tipoOperacion: "",
  });

  const [locations, setLocations] = useState<string[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/locations')
      .then((r) => r.json())
      .then((d) => {
        if (d.locations) {
          setLocations(d.locations);
          setFilteredLocations(d.locations);
        }
      })
      .catch((e) => console.error("Error fetching locations:", e));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationChange = (val: string) => {
    setSearchData({ ...searchData, ubicacion: val });
    if (val) {
      setFilteredLocations(locations.filter((l) => l.toLowerCase().includes(val.toLowerCase())));
      setShowLocationDropdown(true);
    } else {
      setFilteredLocations(locations);
      setShowLocationDropdown(true);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.ubicacion) params.set("ubicacion", searchData.ubicacion);
    if (searchData.tipoPropiedad) params.set("tipo", searchData.tipoPropiedad);
    if (searchData.tipoOperacion) params.set("operacion", searchData.tipoOperacion);
    router.push(`/propiedades${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const propertyTypes = [
    { value: "", label: "Todas" },
    { value: "casa", label: "Casa" },
    { value: "departamento", label: "Departamento" },
    { value: "terreno", label: "Terreno / Lote" },
    { value: "comercial", label: "Local Comercial" },
  ];

  const operationTypes = [
    { value: "", label: "Todas" },
    { value: "venta", label: "Venta" },
    { value: "alquiler", label: "Alquiler" },
  ];

  const selectedPropertyLabel =
    propertyTypes.find((p) => p.value === searchData.tipoPropiedad)?.label || "Todas";
  const selectedOperationLabel =
    operationTypes.find((o) => o.value === searchData.tipoOperacion)?.label || "Todas";

  return (
    <section className="relative min-h-[100svh] md:min-h-[110vh] flex flex-col justify-center overflow-visible bg-primary pt-10">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&w=1920&q=80"
          alt="Exterior residencial azulado"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark overlay for contrast, with a subtle blue tint */}
        <div className="absolute inset-0 bg-[#061224]/80"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-[#061224]/95"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 max-w-7xl pt-40 pb-4 md:pt-56 md:pb-32 flex-1 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl flex flex-col items-center text-center"
        >

          <h1 className="font-bold leading-[1.05] tracking-[-0.03em] mb-4 md:mb-8 text-[1.6rem] sm:text-4xl md:text-6xl lg:text-7xl">
            <span className="text-white block">ESPECIALISTAS EN VENTA</span>
            <span className="text-blue-500 brightness-110 drop-shadow-md block">DE PROPIEDADES</span>
          </h1>

          <div className="flex flex-col items-center gap-1 md:gap-2 mb-6 md:mb-12 w-full px-4">
            <p className="text-sm sm:text-sm md:text-lg lg:text-xl font-sans text-white font-medium leading-relaxed drop-shadow-md text-center max-w-[90vw]">
              Asesoramiento Inmobiliario con Certificación Internacional CRS
            </p>
            <p className="text-sm sm:text-sm md:text-lg lg:text-xl font-sans text-white font-medium leading-relaxed drop-shadow-md text-center max-w-[90vw]">
              Elevamos el estándar en zona norte.
            </p>
          </div>

          <div className="flex flex-row gap-3 md:gap-4 mb-8 md:mb-20 justify-center w-full">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-5 py-3 md:px-8 md:py-4 rounded-md text-[10px] md:text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 hover:bg-secondary hover:text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Contáctanos
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/propiedades"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-5 py-3 md:px-8 md:py-4 rounded-md text-[10px] md:text-[11px] font-bold uppercase tracking-[0.12em] border border-white/20 transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5"
            >
              Ver propiedades
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="relative z-20 w-full mt-auto">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl pb-10">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] p-3 md:p-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0">
              
              {/* Ubicación con Autocomplete */}
              <div
                className="flex-1 flex items-center gap-3 px-4 py-3 md:py-2 md:border-r border-primary/10 rounded-lg md:rounded-none bg-surface-container-low md:bg-transparent relative"
                ref={locationRef}
              >
                <MapPin className="w-4 h-4 text-secondary shrink-0" />
                <div className="flex-1 w-full">
                  <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-primary/40 block mb-0.5">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    placeholder="¿Dónde quieres vivir?"
                    value={searchData.ubicacion}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onFocus={() => setShowLocationDropdown(true)}
                    className="w-full bg-transparent text-sm font-semibold text-primary placeholder:text-primary/25 focus:outline-none"
                  />
                  
                  {/* Dropdown Options for Locations */}
                  {showLocationDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-primary/10 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2 max-h-60 overflow-y-auto">
                      {filteredLocations.length > 0 ? (
                        filteredLocations.map((loc, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSearchData({ ...searchData, ubicacion: loc });
                              setShowLocationDropdown(false);
                            }}
                            className="px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/5 cursor-pointer transition-colors"
                          >
                            {loc}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm font-semibold text-primary/40 italic">
                          No se encontraron ubicaciones
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ── MOBILE: Custom touch-aware selects ── */}
              <div className="md:hidden flex flex-col gap-3">
                <MobileSelect
                  icon={Home}
                  label="Tipo de propiedad"
                  value={searchData.tipoPropiedad}
                  options={propertyTypes}
                  onSelect={(v) => setSearchData({ ...searchData, tipoPropiedad: v })}
                />
                <MobileSelect
                  icon={RefreshCw}
                  label="Operación"
                  value={searchData.tipoOperacion}
                  options={operationTypes}
                  onSelect={(v) => setSearchData({ ...searchData, tipoOperacion: v })}
                />
              </div>

              {/* ── DESKTOP: Radix DropdownMenu (unchanged) ── */}
              {/* Tipo de Propiedad Dropdown */}
              <div className="hidden md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex-1 flex items-center justify-between gap-3 px-4 py-2 border-r border-primary/10 bg-transparent text-left outline-none group">
                    <div className="flex items-center gap-3">
                      <Home className="w-4 h-4 text-secondary shrink-0 group-data-[state=open]:text-primary transition-colors" />
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-primary/40 block mb-0.5 cursor-pointer">
                          Tipo de propiedad
                        </label>
                        <span className="block w-full bg-transparent text-sm font-semibold text-primary focus:outline-none cursor-pointer">
                          {selectedPropertyLabel}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-primary/40 group-data-[state=open]:rotate-180 transition-transform" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {propertyTypes.map((type) => (
                      <DropdownMenuItem
                        key={type.value}
                        onClick={() => setSearchData({ ...searchData, tipoPropiedad: type.value })}
                      >
                        {type.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tipo de Operación Dropdown */}
              <div className="hidden md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex-1 flex items-center justify-between gap-3 px-4 py-2 bg-transparent text-left outline-none group">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-4 h-4 text-secondary shrink-0 group-data-[state=open]:text-primary transition-colors" />
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-primary/40 block mb-0.5 cursor-pointer">
                          Operación
                        </label>
                        <span className="block w-full bg-transparent text-sm font-semibold text-primary focus:outline-none cursor-pointer">
                          {selectedOperationLabel}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-primary/40 group-data-[state=open]:rotate-180 transition-transform" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {operationTypes.map((op) => (
                      <DropdownMenuItem
                        key={op.value}
                        onClick={() => setSearchData({ ...searchData, tipoOperacion: op.value })}
                      >
                        {op.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-white px-8 py-3.5 md:py-4 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 hover:shadow-lg md:ml-3 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Buscar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
