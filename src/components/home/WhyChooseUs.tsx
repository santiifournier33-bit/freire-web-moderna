"use client";

import { useState } from "react";
import { Check, Lightbulb, Laptop, Handshake, ArrowRight } from "lucide-react";

export default function WhyChooseUs() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

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

  return (
    <section className="py-24 bg-surface-container overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header Setup */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
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
        
        {/* Hover Accordion Container */}
        <div className="flex flex-col border-t border-primary/20">
          {reasons.map((reason, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={index}
                className="group relative border-b border-primary/20 overflow-hidden cursor-pointer bg-surface-container transition-colors duration-500 hover:bg-surface-lowest"
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => setHoveredIndex(index)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center py-8 lg:py-10 px-4 md:px-8">
                  
                  {/* Number & Title */}
                  <div className="flex-1 flex items-center gap-8 md:gap-16">
                    <span className={`text-4xl md:text-6xl font-bold font-serif transition-colors duration-500 ${isHovered ? 'text-secondary italic' : 'text-primary/10'}`}>
                      {reason.num}
                    </span>
                    <h3 className={`text-2xl md:text-4xl font-bold uppercase tracking-tighter transition-all duration-500 ${isHovered ? 'text-primary' : 'text-primary/40'}`}>
                      {reason.title}
                    </h3>
                  </div>

                  {/* Description Expansion */}
                  <div 
                    className={`grid transition-all duration-700 ease-in-out lg:flex-1 lg:max-w-xl ${isHovered ? 'grid-rows-[1fr] opacity-100 mt-6 lg:mt-0 lg:ml-8' : 'grid-rows-[0fr] opacity-0 lg:opacity-0 lg:ml-0'}`}
                  >
                     <div className="overflow-hidden">
                       <div className="flex gap-6 items-start">
                         <div className="w-12 h-12 shrink-0 bg-primary flex items-center justify-center text-white scale-90 md:scale-100">
                           <reason.icon size={20} strokeWidth={1.5} />
                         </div>
                         <p className="text-base font-sans text-on-surface-variant leading-relaxed">
                           {reason.description}
                         </p>
                       </div>
                     </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="hidden lg:flex shrink-0 items-center justify-center w-12 h-12 ml-6">
                    <ArrowRight 
                       className={`transition-all duration-500 ${isHovered ? 'text-secondary -rotate-45 scale-125' : 'text-primary/20 rotate-0'}`} 
                       strokeWidth={1.5} 
                    />
                  </div>

                </div>
                
                {/* Active Background Sweep */}
                <div className={`absolute bottom-0 left-0 h-1 bg-secondary transition-all duration-700 ease-out ${isHovered ? 'w-full' : 'w-0'}`} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
