"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Lightbulb, Laptop, Handshake, ArrowRight } from "lucide-react";

export default function WhyChooseUs() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [scrollActiveIndex, setScrollActiveIndex] = useState<number>(-1);
  const [isMobile, setIsMobile] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const reasons = [
    {
      icon: Check,
      title: "Lo hacemos simple",
      description: "Siempre vas a saber cuáles son los pasos a seguir.",
      num: "01"
    },
    {
      icon: Lightbulb,
      title: "Te ayudamos a decidir",
      description: "Te brindamos información de fuentes confiables y nuestra experiencia a disposición.",
      num: "02"
    },
    {
      icon: Laptop,
      title: "Aplicamos tecnología",
      description: "Potenciamos el alcance ahorrándote tiempo.",
      num: "03"
    },
    {
      icon: Handshake,
      title: "Formamos equipo",
      description: "Somos tu aliado desde la tasación hasta el día de la firma.",
      num: "04"
    },
  ];

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mobile: Intersection Observer for scroll-triggered reveal
  useEffect(() => {
    if (!isMobile) return;

    const observers: IntersectionObserver[] = [];
    
    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setScrollActiveIndex((prev) => Math.max(prev, index));
          }
        },
        { threshold: 0.5, rootMargin: "-10% 0px -30% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isMobile]);

  const getActiveIndex = (index: number) => {
    if (isMobile) return index <= scrollActiveIndex;
    return hoveredIndex === index;
  };

  return (
    <section className="py-12 md:py-24 bg-surface-container overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header Setup */}
        <div className="mb-8 md:mb-16 lg:mb-24 flex flex-col md:flex-row justify-between items-end gap-6 md:gap-10">
          <div>
            <span className="label-editorial text-secondary mb-4 block underline underline-offset-8 decoration-primary/10">Nuestra Identidad</span>
            <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-[-0.03em]">
              ¿Por qué <br className="hidden md:block"/>
              <span className="text-secondary italic font-normal">confiar</span> en nosotros?
            </h2>
          </div>
          <p className="text-on-surface-variant font-sans max-w-sm text-sm border-l-2 border-primary/10 pl-4 py-2">
            La excelencia inmobiliaria no es una promesa, es nuestra metodología de trabajo diaria.
          </p>
        </div>
        
        {/* Hover/Scroll Accordion Container */}
        <div className="flex flex-col border-t border-primary/20">
          {reasons.map((reason, index) => {
            const isActive = getActiveIndex(index);
            
            return (
              <div
                key={index}
                ref={(el) => { itemRefs.current[index] = el; }}
                className={`group relative border-b border-primary/20 overflow-hidden cursor-pointer transition-colors duration-500 ${
                  isActive ? 'bg-surface-lowest' : 'bg-surface-container'
                }`}
                onMouseEnter={() => { if (!isMobile) setHoveredIndex(index); }}
                onClick={() => {
                  if (isMobile) {
                    setScrollActiveIndex((prev) => prev === index ? index - 1 : index);
                  } else {
                    setHoveredIndex(index);
                  }
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center py-5 md:py-8 lg:py-10 px-4 md:px-8">
                  
                  {/* Number & Title */}
                  <div className="flex-1 flex items-center gap-6 md:gap-8 lg:gap-16">
                    <span className={`text-3xl md:text-4xl lg:text-6xl font-bold font-serif transition-colors duration-500 ${isActive ? 'text-secondary italic' : 'text-primary/10'}`}>
                      {reason.num}
                    </span>
                    <h3 className={`text-lg md:text-2xl lg:text-4xl font-bold uppercase tracking-tighter transition-all duration-500 ${isActive ? 'text-primary' : 'text-primary/40'}`}>
                      {reason.title}
                    </h3>
                  </div>

                  {/* Description Expansion */}
                  <div 
                    className={`grid transition-all duration-700 ease-in-out lg:flex-1 lg:max-w-xl ${isActive ? 'grid-rows-[1fr] opacity-100 mt-4 lg:mt-0 lg:ml-8' : 'grid-rows-[0fr] opacity-0 lg:opacity-0 lg:ml-0'}`}
                  >
                     <div className="overflow-hidden">
                       <div className="flex gap-4 md:gap-6 items-start">
                         <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-primary flex items-center justify-center text-white scale-90 md:scale-100">
                           <reason.icon size={20} strokeWidth={1.5} />
                         </div>
                         <p className="text-sm md:text-base font-sans text-on-surface-variant leading-relaxed">
                           {reason.description}
                         </p>
                       </div>
                     </div>
                  </div>

                  {/* Arrow Indicator — visible on all sizes when active */}
                  <div className={`hidden lg:flex shrink-0 items-center justify-center w-12 h-12 ml-6`}>
                    <ArrowRight 
                       className={`transition-all duration-500 ${isActive ? 'text-secondary -rotate-45 scale-125' : 'text-primary/20 rotate-0'}`} 
                       strokeWidth={1.5} 
                    />
                  </div>

                </div>
                
                {/* Active Background Sweep */}
                <div className={`absolute bottom-0 left-0 h-1 bg-secondary transition-all duration-700 ease-out ${isActive ? 'w-full' : 'w-0'}`} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
