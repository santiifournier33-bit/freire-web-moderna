"use client";

import Image from "next/image";
import { Play, Eye, Maximize, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function PropertyShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const items = [
    {
      title: "Tour 360°",
      copy: "Revisar la propiedad sin límites. Optimiza tiempo y atrae interesados reales directamente.",
      href: "https://kuula.co/share/collection/7FgPs",
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      Icon: Eye,
      badge: "VER TOUR",
    },
    {
      title: "Video Inmersivo",
      copy: "Conexión emocional instantánea aumentando su visibilidad y acelerando la captación.",
      href: "https://www.youtube.com/watch?v=PuqHzGWjUXk",
      image: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      Icon: Play,
      badge: "VER VIDEO",
    },
    {
      title: "Fotografía Pro",
      copy: "La primera impresión perfecta. Clave fundamental para el interés inicial del comprador.",
      href: null,
      image: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/vLeAYUiyvUMIhRMyjWtd/media/6800f7978ceb991b16c4ceae.jpeg",
      Icon: null,
      badge: null,
    },
    {
      title: "Plano Comercial",
      copy: "Visualización clara de distribución para proyectar la vida real en el nuevo espacio.",
      href: null,
      image: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/vLeAYUiyvUMIhRMyjWtd/media/6800f7e351be4a1040119071.jpeg",
      Icon: null,
      badge: null,
    },
  ];

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.children[0]?.getBoundingClientRect().width || 0;
    const gap = 16;
    container.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
    setActiveSlide(index);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.children[0]?.getBoundingClientRect().width || 0;
    const gap = 16;
    const index = Math.round(container.scrollLeft / (cardWidth + gap));
    setActiveSlide(index);
  };

  return (
    <section className="py-12 md:py-20 lg:py-28 bg-surface-container-low overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-8 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-b border-primary/10 pb-8 md:pb-12">
          <div className="max-w-2xl">
            <span className="label-editorial mb-4 block underline decoration-secondary decoration-2 underline-offset-8">Excelencia Visual</span>
            <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-[-0.03em] leading-[1.05]">
              Así se proyectará <br />
              <span className="text-secondary italic font-normal">tu propiedad</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-on-surface-variant max-w-md font-sans leading-relaxed border-l-2 border-primary/20 pl-6 py-2">
            Utilizamos tecnología de vanguardia y un ojo arquitectónico para que cada rincón cuente una historia de valor y exclusividad.
          </p>
        </div>

        {/* Desktop: Original 4-col grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, index) => (
            <div key={index} className="group relative bg-surface-lowest h-full border border-primary/5 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:border-transparent flex flex-col">
              
              {/* Image Container with Hover Overlay */}
              <div className="relative h-[220px] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-[1.15]"
                />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors duration-500 mix-blend-multiply"></div>
                
                {item.href && item.Icon && (
                  <Link href={item.href} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 scale-95 group-hover:scale-100">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                      <item.Icon className="w-6 h-6 text-white ml-0.5" />
                    </div>
                  </Link>
                )}
                {!item.href && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 scale-95 group-hover:scale-100">
                    <Maximize className="w-8 h-8 text-white/70" />
                  </div>
                )}
              </div>
              
              {/* Text Area */}
              <div className="p-8 flex-1 flex flex-col justify-start bg-white relative">
                 {/* Top subtle line */}
                 <div className="absolute top-0 left-0 w-0 h-[2px] bg-secondary group-hover:w-full transition-all duration-700 ease-out"></div>
                 
                 <h3 className="text-xs font-bold text-primary mb-3 uppercase tracking-widest leading-relaxed">
                   {item.title}
                 </h3>
                 <p className="text-on-surface-variant font-sans text-sm leading-relaxed">
                   {item.copy}
                 </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Horizontal scroll-snap carousel */}
        <div className="md:hidden overflow-hidden">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-4 scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {items.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-[80vw] snap-center bg-surface-lowest border border-primary/5 flex flex-col overflow-hidden">
                
                {/* Image with always-visible badge on mobile */}
                <div className="relative h-[180px] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="80vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
                  
                  {/* Mobile: Badge always visible */}
                  {item.href && item.Icon && item.badge && (
                    <Link 
                      href={item.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-full shadow-lg"
                    >
                      <item.Icon className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{item.badge}</span>
                    </Link>
                  )}
                </div>
                
                {/* Text Area — compact */}
                <div className="p-5 flex-1 flex flex-col justify-start bg-white">
                   <h3 className="text-xs font-bold text-primary mb-2 uppercase tracking-widest leading-relaxed">
                     {item.title}
                   </h3>
                   <p className="text-on-surface-variant font-sans text-sm leading-relaxed">
                     {item.copy}
                   </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots + arrows */}
          <div className="flex items-center justify-center gap-4 mt-3 px-6">
            <button 
              onClick={() => scrollToSlide(Math.max(0, activeSlide - 1))}
              className="w-8 h-8 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeSlide ? 'bg-secondary w-5' : 'bg-primary/20'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={() => scrollToSlide(Math.min(items.length - 1, activeSlide + 1))}
              className="w-8 h-8 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
