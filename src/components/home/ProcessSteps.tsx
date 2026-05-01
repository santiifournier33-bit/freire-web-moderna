"use client";
import { FileText, Clipboard, Camera, Activity, Handshake, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export default function ProcessSteps() {
  const [scrollActiveIndex, setScrollActiveIndex] = useState<number>(-1);
  const [isMobile, setIsMobile] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const steps = [
    {
      title: "Pre-tasación",
      description: "Entendé tus posibilidades reales. Accedé a indicadores clave del mercado inmobiliario actual.",
      icon: FileText,
      num: "01",
    },
    {
      title: "Tasación",
      description: "Conocé las alternativas y la mejor estrategia comercial para posicionar tu propiedad.",
      icon: Clipboard,
      num: "02",
    },
    {
      title: "Alcance total",
      description: "Logramos difusión absoluta con fotografía profesional, videos inmersivos y tours virtuales 360°.",
      icon: Camera,
      num: "03",
    },
    {
      title: "Seguimiento",
      description: "Recibirás un monitoreo métrico y humano de forma mensual sobre tu caso y sus analíticas.",
      icon: Activity,
      num: "04",
    },
    {
      title: "Apoyo",
      description: "Sentite respaldado jurídicamente y acompañado en todo momento, hasta el momento de escriturar.",
      icon: Handshake,
      num: "05",
    },
  ];

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
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
        { threshold: 0.5, rootMargin: "-5% 0px -35% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isMobile]);

  return (
    <section className="py-12 md:py-20 lg:py-28 bg-surface overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-8 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-b border-primary/10 pb-8 md:pb-12"
        >
          <div className="max-w-2xl">
            <span className="label-editorial mb-4 block underline decoration-secondary decoration-2 underline-offset-8">Metodología Garantizada</span>
            <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-[-0.03em] leading-[1.05]">
              El Camino <br />
              <span className="text-secondary italic font-normal">Hacia el Cierre</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-on-surface-variant max-w-md font-sans leading-relaxed border-l-2 border-primary/20 pl-6 py-2">
            Diseñamos cada paso para que la venta no sea un proceso, sino una experiencia de precisión y certezas.
          </p>
        </motion.div>

        {/* Desktop: Original 5-col grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index}
              className="group flex flex-col bg-surface-lowest border border-primary/5 p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/20 relative overflow-hidden h-full rounded-sm"
            >
              {/* Number Watermark Background */}
              <div className="absolute top-2 right-4 text-[80px] font-serif font-bold italic text-primary/5 group-hover:text-secondary/10 transition-colors duration-700 pointer-events-none select-none">
                {index + 1}
              </div>

              {/* Icon Box */}
              <div className="w-14 h-14 bg-surface-container flex items-center justify-center text-primary group-hover:text-white group-hover:bg-primary transition-all duration-500 rounded-md mb-8 z-10">
                <step.icon size={20} strokeWidth={1.5} />
              </div>
              
              {/* Typography */}
              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-primary mb-3 uppercase tracking-wider leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed font-sans group-hover:text-primary transition-colors duration-500">
                  {step.description}
                </p>
              </div>
              
              {/* Subtle top indicator line */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent group-hover:bg-secondary transition-colors duration-500"></div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Scroll-triggered accordion (WhyChooseUs style) */}
        <div className="md:hidden flex flex-col border-t border-primary/20">
          {steps.map((step, index) => {
            const isActive = index <= scrollActiveIndex;
            
            return (
              <div
                key={index}
                ref={(el) => { itemRefs.current[index] = el; }}
                className={`relative border-b border-primary/20 overflow-hidden cursor-pointer transition-colors duration-500 ${
                  isActive ? 'bg-surface-lowest' : 'bg-surface'
                }`}
                onClick={() => {
                  setScrollActiveIndex((prev) => prev === index ? index - 1 : index);
                }}
              >
                <div className="flex flex-col py-5 px-4">
                  
                  {/* Number + Title row — always visible */}
                  <div className="flex items-center gap-5">
                    <span className={`text-2xl font-bold font-serif transition-colors duration-500 ${isActive ? 'text-secondary italic' : 'text-primary/10'}`}>
                      {step.num}
                    </span>
                    <h3 className={`text-base font-bold uppercase tracking-wider transition-all duration-500 flex-1 ${isActive ? 'text-primary' : 'text-primary/40'}`}>
                      {step.title}
                    </h3>
                    <div className={`w-8 h-8 shrink-0 flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-primary text-white' : 'bg-surface-container text-primary/30'}`}>
                      <step.icon size={16} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Description — expands on scroll/click */}
                  <div 
                    className={`grid transition-all duration-700 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm font-sans text-on-surface-variant leading-relaxed pl-[calc(1.25rem+1.5rem)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Active sweep bar */}
                <div className={`absolute bottom-0 left-0 h-[2px] bg-secondary transition-all duration-700 ease-out ${isActive ? 'w-full' : 'w-0'}`} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
