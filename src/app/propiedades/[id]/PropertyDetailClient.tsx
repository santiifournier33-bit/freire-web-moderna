"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, CheckCircle, Share2, X, Play, Grid, Building, Layers, Video, FileImage } from "lucide-react";
import { 
  BedIcon, 
  BathroomsIcon, 
  TotalSurfaceIcon, 
  CubiertaSurfaceIcon, 
  ParkingIcon, 
  AgeIcon, 
  RoomsIcon, 
  ToiletIcon, 
  PropertyFacingIcon, 
  OrientationIcon, 
  BrightnessIcon 
} from "@/components/ui/PropertyIcons";
import { StreetViewIcon } from "@/components/ui/StreetViewIcon";
import { createWebContact } from "@/lib/tokkobroker";
import dynamic from "next/dynamic";
import "intl-tel-input/styles";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const IntlTelInput = dynamic(() => import("intl-tel-input/reactWithUtils"), {
  ssr: false,
});

export default function PropertyDetailClient({ property }: { property: any }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: `Hola, quiero recibir más información sobre esta propiedad.` });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentGalleryImage, setCurrentGalleryImage] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isWAPreloading, setIsWAPreloading] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'width=600,height=400');
  };

  const shareToX = () => {
    const text = encodeURIComponent(`${property.publication_title} - Freire Propiedades`);
    window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${text}`, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`¡Mirá esta propiedad! ${property.publication_title} ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Extract photos
  const images = property.photos?.length > 0 
    ? property.photos.map((p: any) => p.original)
    : ["/placeholder-home.jpg"];

  // Extract operations
  const operation = property.operations?.map((op: any) => op.operation_type).join(" / ") || "Consulta";
  const mainOp = property.operations?.[0] || {};
  const price = mainOp.prices?.[0] ? `${mainOp.prices[0].currency} ${mainOp.prices[0].price.toLocaleString('de-DE')}` : "Consulte";
  
  const amenities = property.tags?.map((tag: any) => tag.name) || [];

  // Agent (Agent > Producer > Center) Phone & Data calculation
  const getAgentData = () => {
    const mainAgent = property.agent;
    const fallbackProducer = property.producer;
    const centerNumber = "5491151454915";

    // 1. Priority: AGENT
    if (mainAgent) {
      const phone = (mainAgent.cellphone || mainAgent.phone || "").replace(/\D/g, '');
      if (phone) return { phone, name: mainAgent.name, id: mainAgent.id };
    }

    // 2. Priority: PRODUCER
    if (fallbackProducer) {
      const phone = (fallbackProducer.cellphone || fallbackProducer.phone || "").replace(/\D/g, '');
      if (phone) return { phone, name: fallbackProducer.name, id: fallbackProducer.id };
    }

    // 3. Final Fallback: Center
    return { phone: centerNumber, name: "Freire Propiedades", id: undefined };
  };

  const agentData = getAgentData();
  const agentPhone = agentData.phone;
  const agentFirstName = agentData.name.split(' ')[0];
  const agentId = agentData.id;

  // Validation
  const canSubmit = formData.name.trim().length > 3 && isPhoneValid;

  // Categorize Videos and Tours
  const propertyVideos = property.videos || [];
  const virtualTour = propertyVideos.find((v: any) => v.title?.toLowerCase().includes('360') || v.url?.toLowerCase().includes('360') || v.url?.includes('kuula') || v.url?.includes('matterport'));
  const normalVideo = propertyVideos.find((v: any) => v.provider === 'youtube' || v.provider === 'vimeo' || v.url?.includes('youtube') || v.url?.includes('vimeo'));

  // Data helpers
  const propertyType = property.type?.name || "Propiedad";
  const propertyLocation = property.location?.name || property.address || "Consultar Ubicación";
  
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;
    
    setStatus("loading");
    
    const success = await createWebContact({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      text: formData.message,
      agentId: agentId,
      tags: ["web", "propiedad", property.reference_code || "sin-ref"],
      properties: [property.id],
    });

    if (success) {
      setStatus("success");
      setFormData(prev => ({ ...prev, message: "" }));
    } else {
      setStatus("error");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.publication_title,
          url: isMounted ? window.location.href : "",
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      alert("La función de compartir no está disponible en su navegador.");
    }
  };

  const handleWhatsAppClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!canSubmit || status === "loading" || isWAPreloading) return;

    setIsWAPreloading(true);
    
    // Log interest in Tokko
    await createWebContact({
      name: formData.name,
      email: formData.email || "consultawhatsapp@freire.com",
      phone: formData.phone,
      agentId: agentId,
      text: `INTERÉS VÍA WHATSAPP: El cliente inició contacto desde la web para la propiedad "${property.publication_title}" (Ref: ${property.reference_code || "sin-ref"}). URL: ${window.location.href}`,
      tags: ["interes-whatsapp", "web", property.reference_code || "sin-ref"],
      properties: [property.id],
    });

    // Create WhatsApp URL
    const greeting = agentFirstName ? `¡Hola ${agentFirstName}!` : "¡Hola!";
    const msg = encodeURIComponent(`${greeting} Quisiera obtener más información sobre la propiedad "${property.publication_title}" que vi en su web. ${window.location.href}`);
    const finalWaLink = `https://wa.me/${agentPhone}?text=${msg}`;
    
    setIsWAPreloading(false);
    window.open(finalWaLink, '_blank');
  };

  const openGalleryModal = (index: number = 0) => {
    setCurrentGalleryImage(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeGalleryModal = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextModalImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentGalleryImage((prev) => (prev + 1) % images.length);
  };

  const prevModalImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentGalleryImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="flex flex-col gap-12 pt-0 pb-32">
        
        {/* Superior Gallery: Mosaico Asimétrico Airbnb Style */}
        <div className="relative w-full" id="seccion-fotos">
          <div className={`grid gap-2 md:gap-3 rounded-2xl overflow-hidden shadow-ambient h-[40vh] sm:h-[50vh] md:h-[65vh] ${images.length >= 5 ? 'grid-cols-4 grid-rows-2' : 'grid-cols-1'}`}>
            
            {images.length >= 5 ? (
              <>
                {/* Img 1 (Hero) */}
                <div 
                  className="relative col-span-2 row-span-2 cursor-pointer group"
                  onClick={() => openGalleryModal(0)}
                >
                  <Image src={images[0]} alt="Principal" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" sizes="(max-width: 768px) 100vw, 50vw" priority />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
                  
                  {/* Píldora de Navegación Multimedia */}
                  <div className="absolute bottom-4 left-4 z-20 flex bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-primary/5 p-1 gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => openGalleryModal(0)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-dim transition-colors group/pill hover:scale-105 transform duration-300">
                      <FileImage className="w-4 h-4 text-primary group-hover/pill:text-on-surface-variant transition-colors" />
                      <span className="text-[10px] font-bold text-primary group-hover/pill:text-on-surface-variant uppercase tracking-widest transition-colors hidden sm:block">Fotos</span>
                    </button>
                    {normalVideo && (
                      <button onClick={() => { document.getElementById('seccion-video')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-dim transition-colors group/pill hover:scale-105 transform duration-300">
                        <Video className="w-4 h-4 text-primary group-hover/pill:text-on-surface-variant transition-colors" />
                        <span className="text-[10px] font-bold text-primary group-hover/pill:text-on-surface-variant uppercase tracking-widest transition-colors hidden sm:block">Video</span>
                      </button>
                    )}
                    {property.geo_lat && property.geo_long && (
                      <button onClick={() => { document.getElementById('seccion-mapa')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-dim transition-colors group/pill hover:scale-105 transform duration-300">
                        <MapPin className="w-4 h-4 text-primary group-hover/pill:text-on-surface-variant transition-colors" />
                        <span className="text-[10px] font-bold text-primary group-hover/pill:text-on-surface-variant uppercase tracking-widest transition-colors hidden sm:block">Mapa</span>
                      </button>
                    )}
                    {virtualTour && (
                      <button onClick={() => { document.getElementById('seccion-tour')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-dim transition-colors group/pill hover:scale-105 transform duration-300">
                        <StreetViewIcon size={14} className="text-primary group-hover/pill:text-on-surface-variant transition-colors" />
                        <span className="text-[10px] font-bold text-primary group-hover/pill:text-on-surface-variant uppercase tracking-widest transition-colors hidden sm:block">Recorrido 360</span>
                      </button>
                    )}
                  </div>
                </div>
                {/* Img 2 */}
                <div 
                  className="relative col-span-1 row-span-1 cursor-pointer group"
                  onClick={() => openGalleryModal(1)}
                >
                  <Image src={images[1]} alt="Foto 1" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" sizes="25vw" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
                </div>
                {/* Img 3 */}
                <div 
                  className="relative col-span-1 row-span-1 cursor-pointer group"
                  onClick={() => openGalleryModal(2)}
                >
                   <Image src={images[2]} alt="Foto 2" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" sizes="25vw" />
                   <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
                </div>
                {/* Img 4 */}
                <div 
                  className="relative col-span-1 row-span-1 cursor-pointer group"
                  onClick={() => openGalleryModal(3)}
                >
                   <Image src={images[3]} alt="Foto 3" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" sizes="25vw" />
                   <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
                </div>
                {/* Img 5 */}
                <div 
                  className="relative col-span-1 row-span-1 cursor-pointer group"
                  onClick={() => openGalleryModal(4)}
                >
                   <Image src={images[4]} alt="Foto 4" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" sizes="25vw" />
                   <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors duration-500"></div>
                   <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <Grid className="w-8 h-8 text-white drop-shadow-lg mb-2" />
                     <span className="text-white text-xs font-bold uppercase tracking-widest drop-shadow-md">Ver Galería</span>
                   </div>
                </div>
              </>
            ) : (
              <div 
                className="relative w-full h-full cursor-pointer group col-span-1"
                onClick={() => openGalleryModal(0)}
              >
                <Image src={images[0]} alt="Principal" fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" priority sizes="100vw" />
                <div className="absolute inset-0 bg-primary/20 hover:bg-transparent transition-colors duration-500"></div>
                
                {/* Píldora de Navegación Multimedia */}
                <div className="absolute bottom-4 left-4 z-20 flex bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-primary/5 p-1 gap-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => openGalleryModal(0)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-dim transition-colors group/pill hover:scale-105 transform duration-300">
                      <FileImage className="w-4 h-4 text-primary group-hover/pill:text-on-surface-variant transition-colors" />
                      <span className="text-[10px] font-bold text-primary group-hover/pill:text-on-surface-variant uppercase tracking-widest transition-colors hidden sm:block">Fotos</span>
                    </button>
                    {normalVideo && (
                      <button onClick={() => { document.getElementById('seccion-video')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-dim transition-colors group/pill hover:scale-105 transform duration-300">
                        <Video className="w-4 h-4 text-primary group-hover/pill:text-on-surface-variant transition-colors" />
                        <span className="text-[10px] font-bold text-primary group-hover/pill:text-on-surface-variant uppercase tracking-widest transition-colors hidden sm:block">Video</span>
                      </button>
                    )}
                    {property.geo_lat && property.geo_long && (
                      <button onClick={() => { document.getElementById('seccion-mapa')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-dim transition-colors group/pill hover:scale-105 transform duration-300">
                        <MapPin className="w-4 h-4 text-primary group-hover/pill:text-on-surface-variant transition-colors" />
                        <span className="text-[10px] font-bold text-primary group-hover/pill:text-on-surface-variant uppercase tracking-widest transition-colors hidden sm:block">Mapa</span>
                      </button>
                    )}
                    {virtualTour && (
                      <button onClick={() => { document.getElementById('seccion-tour')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-dim transition-colors group/pill hover:scale-105 transform duration-300">
                        <StreetViewIcon size={14} className="text-primary group-hover/pill:text-on-surface-variant transition-colors" />
                        <span className="text-[10px] font-bold text-primary group-hover/pill:text-on-surface-variant uppercase tracking-widest transition-colors hidden sm:block">Recorrido 360</span>
                      </button>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative">
          
          {/* Main Left Content */}
          <div className="lg:col-span-8 lg:col-start-1 space-y-14">
            
            {/* Cabecera */}
            <header className="space-y-4">
              {/* Reference Title Format: "Departamento PH en Venta en Palermo..." */}
              <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold text-primary tracking-[-0.03em] leading-[1.1]">
                {propertyType} en {operation === "Venta" ? "Venta" : "Alquiler"} en {property.location?.name || property.location?.short_location || "Zona Norte"}
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant/80 font-sans font-medium tracking-tight">
                {property.address || propertyLocation}
              </p>
              
              {/* Mobile Price Card */}
              <div className="lg:hidden mt-6 bg-surface-container-lowest p-6 rounded-xl border border-primary/10 shadow-sm flex justify-between items-center">
                <div>
                   <p className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-1">Precio de {operation}</p>
                   <h3 className="text-2xl font-bold text-primary">{price}</h3>
                </div>
                <button onClick={handleShare} className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Description Area */}
            <section className="space-y-6 pt-4">
              <h3 className="label-editorial text-primary uppercase tracking-[0.2em] opacity-80 border-b border-primary/10 pb-4">Memoria Descriptiva</h3>
              <div 
                className="text-on-surface-variant font-sans text-base leading-relaxed whitespace-pre-line space-y-5 prose prose-slate max-w-none prose-p:mb-5 prose-br:mb-2 prose-h3:text-primary list-disc"
                dangerouslySetInnerHTML={{ __html: property.description || "No hay descripción disponible." }}
              />
            </section>

            {/* Ficha Técnica: 3x3 Grid (Tokko Exact Matches) */}
            <section className="space-y-6 pt-8 border-t border-primary/10">
               <h3 className="label-editorial text-primary uppercase tracking-[0.2em] border-b border-primary/10 pb-4">Detalles del Inmueble</h3>
               
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4">
                 
                 {/* Property Values extracted realistically */}
                 {(property.surface || property.total_surface) && (
                   <div className="space-y-1">
                     <span className="text-[11px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2 mb-1"><TotalSurfaceIcon size={14} className="text-secondary"/> Sup. Total</span>
                     <p className="text-base font-bold text-primary">{property.surface || property.total_surface} m²</p>
                   </div>
                 )}
                 {property.reference_code && (
                   <div className="space-y-1">
                     <span className="text-[11px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2 mb-1"><Layers size={14} className="text-secondary opacity-50"/> Código</span>
                     <p className="text-base font-bold text-primary">{property.reference_code}</p>
                   </div>
                 )}
                 {propertyType && (
                   <div className="space-y-1">
                     <span className="text-[11px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2 mb-1"><Building size={14} className="text-secondary opacity-50"/> Tipo</span>
                     <p className="text-base font-bold text-primary">{propertyType}</p>
                   </div>
                 )}
                 
                 {property.room_amount > 0 && (
                   <div className="space-y-1">
                     <span className="text-[11px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2 mb-1"><RoomsIcon size={14} className="text-secondary"/> Ambientes</span>
                     <p className="text-base font-bold text-primary">{property.room_amount}</p>
                   </div>
                 )}
                 {property.suite_amount > 0 && (
                   <div className="space-y-1">
                     <span className="text-[11px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2 mb-1"><BedIcon size={14} className="text-secondary"/> Dormitorios</span>
                     <p className="text-base font-bold text-primary">{property.suite_amount}</p>
                   </div>
                 )}
                 {property.bathroom_amount > 0 && (
                   <div className="space-y-1">
                     <span className="text-[11px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2 mb-1"><BathroomsIcon size={14} className="text-secondary"/> Baños</span>
                     <p className="text-base font-bold text-primary">{property.bathroom_amount}</p>
                   </div>
                 )}

                 {property.roofed_surface > 0 && (
                   <div className="space-y-1">
                     <span className="text-[11px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2 mb-1"><CubiertaSurfaceIcon size={14} className="text-secondary"/> Sup. Cubierta</span>
                     <p className="text-base font-bold text-primary">{property.roofed_surface} m²</p>
                   </div>
                 )}
                 {property.age > 0 && (
                   <div className="space-y-1">
                     <span className="text-[11px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2 mb-1"><AgeIcon size={14} className="text-secondary"/> Antigüedad</span>
                     <p className="text-base font-bold text-primary">{property.age} Años</p>
                   </div>
                 )}
                 {property.parking_lot_amount > 0 && (
                   <div className="space-y-1">
                     <span className="text-[11px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2 mb-1"><ParkingIcon size={14} className="text-secondary"/> Cocheras</span>
                     <p className="text-base font-bold text-primary">{property.parking_lot_amount}</p>
                   </div>
                 )}

                 {/* Extra Technical Details from Reference Images */}
                 {property.toilet_amount > 0 && (
                   <div className="space-y-1">
                     <span className="text-[11px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2 mb-1"><ToiletIcon size={14} className="text-secondary"/> Toilette</span>
                     <p className="text-base font-bold text-primary">{property.toilet_amount}</p>
                   </div>
                 )}
                 {property.disposition && (
                   <div className="space-y-1">
                     <span className="text-[11px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2 mb-1"><PropertyFacingIcon size={14} className="text-secondary"/> Disposición</span>
                     <p className="text-base font-bold text-primary capitalize">{property.disposition}</p>
                   </div>
                 )}
                 {property.orientation && (
                   <div className="space-y-1">
                     <span className="text-[11px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2 mb-1"><OrientationIcon size={14} className="text-secondary"/> Orientación</span>
                     <p className="text-base font-bold text-primary uppercase">{property.orientation}</p>
                   </div>
                 )}
                 {property.tags?.some((t:any) => t.name.toLowerCase().includes('luminos')) && (
                   <div className="space-y-1">
                     <span className="text-[11px] uppercase tracking-widest font-bold text-primary/40 flex items-center gap-2 mb-1"><BrightnessIcon size={14} className="text-secondary"/> Luminosidad</span>
                     <p className="text-base font-bold text-primary">Muy luminoso</p>
                   </div>
                 )}
               </div>
            </section>

            {/* Checklist de Aminities */}
            {amenities.length > 0 && (
              <section className="space-y-6 pt-8 border-t border-primary/10">
                <h3 className="label-editorial text-primary uppercase tracking-[0.2em] opacity-80">Comodidades Extras</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                  {amenities.map((amenity: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></div>
                      <span className="text-sm font-medium text-on-surface-variant">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recorrido Virtual Section */}
            {virtualTour && (
               <section id="seccion-tour" className="space-y-6 pt-8 border-t border-primary/10">
                 <h3 className="label-editorial text-primary uppercase tracking-[0.2em] border-b border-primary/10 pb-4">Recorrido Virtual 360</h3>
                 <div className="w-full aspect-video rounded-2xl overflow-hidden bg-primary shadow-ambient border border-primary/10 relative">
                   <iframe 
                      src={virtualTour.player_url || virtualTour.url} 
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                   ></iframe>
                 </div>
               </section>
            )}

            {/* Video Youtube/Vimeo Section */}
            {normalVideo && (
               <section id="seccion-video" className="space-y-6 pt-8 border-t border-primary/10">
                 <h3 className="label-editorial text-primary uppercase tracking-[0.2em] border-b border-primary/10 pb-4">Video Oficial</h3>
                 <div className="w-full aspect-video rounded-2xl overflow-hidden bg-primary shadow-ambient border border-primary/10 relative">
                   <iframe 
                      src={normalVideo.player_url || normalVideo.url} 
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                   ></iframe>
                 </div>
               </section>
            )}

            {/* Mapa: Embed con geo_lat y geo_long si existen */}
            {property.geo_lat && property.geo_long && (
              <section id="seccion-mapa" className="space-y-6 pt-8 border-t border-primary/10">
                <h3 className="label-editorial text-primary uppercase tracking-[0.2em] border-b border-primary/10 pb-4">Ubicación Geo-Referenciada</h3>
                <div className="w-full h-96 rounded-2xl overflow-hidden bg-surface-container shadow-ambient border border-primary/10 pb-0">
                  <iframe
                    loading="lazy"
                    width="100%"
                    height="100%"
                    frameBorder="0" 
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY || "AIzaSyATEmX91sxHv63eOIoWLwSO27wZAHmXbdA"}&q=${property.geo_lat},${property.geo_long}`} 
                    allowFullScreen>
                  </iframe>
                </div>
                <div className="flex items-start gap-4 bg-surface-container-lowest p-6 rounded-xl border border-primary/5 mt-4">
                   <MapPin className="text-secondary shrink-0 mt-0.5" size={20} />
                   <p className="text-base text-primary font-bold">{property.address || propertyLocation}</p>
                </div>
              </section>
            )}

          </div>

          {/* Right Sidebar: Non-sticky conversion form */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="space-y-8">
              
              {/* Desktop Price Block */}
              <div className="hidden lg:block bg-surface-container-lowest shadow-ambient border border-primary/5 p-8 rounded-2xl relative overflow-visible">
                
                {/* Share button: absolutely positioned top-right inside card */}
                <div className="absolute top-6 right-6 flex flex-col items-end gap-3 z-10">
                  <button
                    onClick={() => setIsShareOpen(!isShareOpen)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 shrink-0 ${
                      isShareOpen ? 'bg-primary/15 text-primary/50' : 'bg-primary text-white hover:bg-primary/80'
                    }`}
                    title="Compartir"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Expanded share pill - drops below the button */}
                  <div className={`flex items-center gap-1 bg-white border border-primary/10 shadow-lg rounded-full px-3 py-2 transition-all duration-300 origin-top-right ${
                    isShareOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'
                  }`}>
                    {/* Copy link */}
                    <button
                      onClick={handleCopyLink}
                      title={copySuccess ? 'Copiado!' : 'Copiar enlace'}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary/60 hover:bg-surface-dim hover:text-primary transition-all duration-200 hover:scale-110"
                    >
                      {copySuccess ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      )}
                    </button>

                    <div className="w-px h-4 bg-primary/10" />

                    {/* Facebook */}
                    <button
                      onClick={shareToFacebook}
                      title="Compartir en Facebook"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary/50 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 hover:scale-110"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </button>

                    {/* X (Twitter) */}
                    <button
                      onClick={shareToX}
                      title="Compartir en X"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary/50 hover:bg-gray-100 hover:text-black transition-all duration-200 hover:scale-110"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={shareToWhatsApp}
                      title="Compartir en WhatsApp"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary/50 hover:bg-green-50 hover:text-green-600 transition-all duration-200 hover:scale-110"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Price content — full width, button sits above via absolute */}
                <div className="pr-12">
                  <p className="text-[11px] uppercase tracking-widest font-bold text-primary/40 mb-3">Valor de Inversión</p>
                  <h2 className="text-3xl font-bold text-primary tracking-tight whitespace-nowrap">{price}</h2>
                  {property.expenses > 0 && (
                    <p className="text-xs text-primary/40 font-semibold mt-2">Expensas: $ {property.expenses.toLocaleString('de-DE')}</p>
                  )}
                </div>

              </div>

              {/* Consultation Form Block */}
              <div id="seccion-contacto" className="bg-surface-container-lowest shadow-ambient border border-primary/10 p-8 rounded-2xl scroll-mt-32">
                 <div className="border-b border-primary/10 pb-6 mb-8 group">
                   <span className="label-editorial text-secondary mb-2 block uppercase tracking-[0.1em]">Contacto Oficial</span>
                   <h3 className="text-xl font-bold text-primary tracking-tight">Dejanos tu consulta</h3>
                 </div>

                 <form onSubmit={handleContactSubmit} className="space-y-6">
                    <input type="hidden" name="property_id" value={property.id} />
                    
                    <div className="space-y-4">
                      {/* (a) Nombre completo */}
                      <div className="group">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-2 block">Nombre completo *</label>
                        <input 
                          type="text" 
                          placeholder="Tu nombre" 
                          className="w-full p-4 bg-surface-container-low focus:bg-white border-b-2 border-primary/10 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/30 text-sm font-semibold rounded-t-lg"
                          value={formData.name}
                          onChange={(e) => setFormData(p => ({...p, name: e.target.value}))}
                          required
                          disabled={status === "loading" || status === "success"}
                        />
                      </div>

                      {/* (b) Teléfono / WhatsApp */}
                      <div className="group">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-2 block">Teléfono / WhatsApp *</label>
                        <IntlTelInput
                          initialValue={formData.phone}
                          onChangeNumber={(number) => {
                            setFormData((prev) => ({ ...prev, phone: number }));
                            const parsed = parsePhoneNumberFromString(number);
                            setIsPhoneValid(parsed ? parsed.isValid() : false);
                          }}
                          initOptions={{
                            initialCountry: "ar",
                            nationalMode: false,
                            autoPlaceholder: "polite",
                            dropdownContainer: typeof document !== "undefined" ? document.body : null,
                          }}
                          inputProps={{
                            name: "phone",
                            className: `w-full p-4 bg-surface-container-low transition-all placeholder:text-primary/30 text-sm font-semibold rounded-t-lg focus:outline-none focus:bg-white border-b-2 ${
                              formData.phone && !isPhoneValid ? "border-red-500/50" : "border-primary/10 focus:border-secondary"
                            }`,
                            placeholder: "+54 9 11 ...",
                            required: true,
                          }}
                        />
                        {formData.phone && !isPhoneValid && (
                          <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 block">Número inválido o incompleto</span>
                        )}
                      </div>

                      {/* (c) Email */}
                      <div className="group">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-2 block">Email (Opcional)</label>
                        <input 
                          type="email" 
                          placeholder="tu@email.com" 
                          className="w-full p-4 bg-surface-container-low focus:bg-white border-b-2 border-primary/10 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/30 text-sm font-semibold rounded-t-lg"
                          value={formData.email}
                          onChange={(e) => setFormData(p => ({...p, email: e.target.value}))}
                          disabled={status === "loading" || status === "success"}
                        />
                      </div>

                      {/* Mensaje */}
                      <div className="group">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-primary/40 mb-2 block">Tu consulta</label>
                        <textarea 
                          rows={3} 
                          className="w-full p-4 bg-surface-container-low focus:bg-white border-b-2 border-primary/10 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/30 text-sm font-semibold resize-none rounded-t-lg"
                          placeholder="Escribe tu mensaje aquí..."
                          value={formData.message}
                          onChange={(e) => setFormData(p => ({...p, message: e.target.value}))}
                          required
                          disabled={status === "loading" || status === "success"}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      {status === "success" ? (
                        <div className="bg-secondary/10 text-secondary p-5 rounded-lg text-center font-bold text-[11px] uppercase tracking-widest border border-secondary/20">
                          Consulta enviada con éxito
                        </div>
                      ) : (
                        <>
                          <button 
                            type="submit" 
                            className={`w-full py-5 shadow-ambient uppercase tracking-widest font-bold text-[10px] rounded-lg transition-all ${
                              canSubmit && status !== "loading" 
                              ? "bg-primary text-white hover:bg-primary/90" 
                              : "bg-primary/20 text-primary/30 cursor-not-allowed grayscale"
                            }`}
                            disabled={!canSubmit || status === "loading"}
                          >
                            {status === "loading" ? "Procesando..." : "Enviar Consulta por Email"}
                          </button>

                          <button 
                            type="button"
                            onClick={handleWhatsAppClick}
                            className={`w-full flex justify-center items-center gap-3 py-5 bg-[#25D366] text-white transition-all transform shadow-md rounded-lg font-bold text-[11px] uppercase tracking-widest border border-[#25D366]/20 ${
                              canSubmit && !isWAPreloading
                              ? "hover:bg-[#1DA851] hover:-translate-y-1 hover:shadow-lg"
                              : "opacity-40 grayscale cursor-not-allowed"
                            }`}
                            disabled={!canSubmit || isWAPreloading}
                          >
                            <img src="/whatsapp-blanco.png" alt="WhatsApp" className="w-[18px] h-[18px] object-contain flex-shrink-0" />
                            {isWAPreloading ? "Registrando..." : "Contactar por WhatsApp"}
                          </button>
                        </>
                      )}
                    </div>
                 </form>

                 {status === "error" && (
                   <p className="text-[10px] mt-4 text-red-500 uppercase tracking-widest font-bold text-center">Falla de sistema. Reintente.</p>
                 )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Modal Full Screen Galería */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col pt-0 pb-0">
          
          {/* Header Controls */}
          <div className="flex items-center justify-between p-6 px-8 absolute top-0 left-0 right-0 z-[110] bg-gradient-to-b from-black/80 to-transparent">
             <div className="text-white bg-white/10 px-4 py-2 rounded-md font-bold text-xs uppercase tracking-widest tabular-nums backdrop-blur">
               {currentGalleryImage + 1} / {images.length}
             </div>
             <button 
               onClick={closeGalleryModal}
               className="text-white/60 hover:text-white bg-white/5 hover:bg-white/20 p-3 rounded-full transition-colors backdrop-blur"
             >
               <X size={24} />
             </button>
          </div>

          {/* Central Image Renderer Container */}
          <div 
             className="flex-1 w-full h-full relative flex items-center justify-center p-4 sm:p-10 cursor-pointer"
             onClick={nextModalImage} // Click anywhere on image area to advance
          >
             {/* The gigantic image that fits gracefully in bounds */}
             <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center">
                <Image
                   src={images[currentGalleryImage]}
                   alt={`Imagen ${currentGalleryImage + 1}`}
                   fill
                   className="object-contain"
                   quality={100}
                   sizes="100vw"
                   priority
                />
             </div>
          </div>

          {/* Navigation Overlay (invisible buttons mostly for left/right arrows over image layer) */}
          <button 
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 rounded-full bg-black/30 hover:bg-black/60 transition-all z-[110]"
            onClick={prevModalImage}
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 rounded-full bg-black/30 hover:bg-black/60 transition-all z-[110]"
            onClick={nextModalImage}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  );
}
