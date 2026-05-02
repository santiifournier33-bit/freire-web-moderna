"use client";
import Image from "next/image";
import { Clock, Users, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

export default function TrustedPartner() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchActiveRef = useRef(false);

  const cards = [
    {
      id: "crs",
      logo: true,
      icon: null,
      title: "Comunidad CRS",
      description: (
        <>
          Otorgada por <span className="font-bold text-primary">NAR</span> (Asociación de Corredores de Estados Unidos), certificándonos como especialistas de alto rendimiento.
        </>
      ),
      label: "Certificación",
    },
    {
      id: "experience",
      logo: false,
      icon: Clock,
      title: "Diez años de dedicación",
      description: "Presencia constante en la comunidad, transformando la venta de propiedades en una gestión puramente técnica y transparente.",
      label: "Experiencia",
    },
    {
      id: "security",
      logo: false,
      icon: Users,
      title: "Seguridad Operativa",
      description: (
        <>
          Colaboración directa con gestores, abogados y escribanos matriculados para asegurar la <span className="font-bold text-primary">seguridad jurídica</span> de tu operación.
        </>
      ),
      label: "Respaldo Absoluto",
    },
  ];

  const scrollToSlide = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.children[0]?.getBoundingClientRect().width || 0;
    const gap = 16;
    container.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
    setActiveSlide(index);
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.children[0]?.getBoundingClientRect().width || 0;
    const gap = 16;
    const index = Math.round(container.scrollLeft / (cardWidth + gap));
    setActiveSlide(index);
  };

  // Auto-scroll every 4.5s — pauses on touch, resumes 3s after release
  useEffect(() => {
    const startAutoScroll = () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      autoScrollRef.current = setInterval(() => {
        if (touchActiveRef.current) return;
        setActiveSlide((prev) => {
          const next = prev >= cards.length - 1 ? 0 : prev + 1;
          if (scrollRef.current) {
            const container = scrollRef.current;
            const cardWidth = container.children[0]?.getBoundingClientRect().width || 0;
            const gap = 16;
            container.scrollTo({ left: next * (cardWidth + gap), behavior: "smooth" });
          }
          return next;
        });
      }, 4500);
    };

    startAutoScroll();

    const container = scrollRef.current;
    if (!container) return;

    let resumeTimeout: ReturnType<typeof setTimeout>;

    const onTouchStart = () => {
      touchActiveRef.current = true;
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      clearTimeout(resumeTimeout);
    };

    const onTouchEnd = () => {
      resumeTimeout = setTimeout(() => {
        touchActiveRef.current = false;
        startAutoScroll();
      }, 3000);
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      clearTimeout(resumeTimeout);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [cards.length]);

  return (
    <section className="py-12 md:py-20 lg:py-28 bg-surface-lowest overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-8 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-b border-primary/10 pb-8 md:pb-12"
        >
          <div className="max-w-2xl">
            <span className="label-editorial mb-4 block underline decoration-secondary decoration-2 underline-offset-8">Respaldo Institucional</span>
            <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-[-0.03em] leading-[1.05]">
              Tu Socio en el <br />
              <span className="text-secondary italic font-normal">Mercado Real</span>
            </h2>
          </div>
          <p className="text-base md:text-lg text-on-surface-variant max-w-md font-sans leading-relaxed border-l-2 border-primary/20 pl-6 py-2">
            Trayectoria avalada por certificaciones internacionales y un equipo multidisciplinar que garantiza seguridad jurídica.
          </p>
        </motion.div>
        
        {/* Desktop: Grid 3-col (unchanged) */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => (
            <motion.div 
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className="group flex flex-col justify-between bg-surface-container-low p-8 lg:p-10 h-full border border-primary/5 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:bg-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-secondary/10 transition-colors duration-700"></div>
              
              <div className="mb-6 lg:mb-8 relative z-10">
                {card.logo ? (
                  <div className="flex-shrink-0 bg-white p-4 shadow-sm w-fit group-hover:shadow-md transition-shadow grayscale group-hover:grayscale-0">
                    <Image src="/crs-logo.png" alt="CRS Certification" width={70} height={24} className="h-8 w-auto object-contain" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-surface-container flex items-center justify-center text-primary group-hover:text-secondary group-hover:bg-primary/5 transition-all duration-500">
                    {card.icon && <card.icon className="w-6 h-6 stroke-[1.5]" />}
                  </div>
                )}
              </div>
              
              <div className="relative z-10">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 uppercase tracking-widest leading-snug">{card.title}</h3>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-sans">{card.description}</p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">{card.label}</span>
                 <ArrowRight className="w-4 h-4 text-primary" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Horizontal scroll snap with peek + auto-scroll */}
        <div className="md:hidden overflow-hidden">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pl-6 pr-[20vw] pb-4 scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {cards.map((card, index) => (
              <motion.div 
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex-shrink-0 w-[75vw] snap-start group flex flex-col justify-between bg-surface-container-low p-6 border border-primary/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px]"></div>
                
                <div className="mb-5 relative z-10">
                  {card.logo ? (
                    <div className="flex-shrink-0 bg-white p-3 shadow-sm w-fit">
                      <Image src="/crs-logo.png" alt="CRS Certification" width={60} height={20} className="h-7 w-auto object-contain" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-surface-container flex items-center justify-center text-primary">
                      {card.icon && <card.icon className="w-5 h-5 stroke-[1.5]" />}
                    </div>
                  )}
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-base font-bold text-primary mb-2 uppercase tracking-widest leading-snug">{card.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed font-sans">{card.description}</p>
                </div>
                
                {/* Always visible on mobile (no hover needed) */}
                <div className="mt-5 pt-4 border-t border-primary/10 flex items-center justify-between">
                   <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">{card.label}</span>
                   <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation dots + arrows (same pattern as PropertyShowcase) */}
          <div className="flex items-center justify-center gap-4 mt-3 px-6">
            <button 
              onClick={() => scrollToSlide(Math.max(0, activeSlide - 1))}
              className="w-8 h-8 flex items-center justify-center text-primary/40 hover:text-primary transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1.5">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeSlide ? 'bg-secondary w-5' : 'bg-primary/20 w-2'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={() => scrollToSlide(Math.min(cards.length - 1, activeSlide + 1))}
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
