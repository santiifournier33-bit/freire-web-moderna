"use client";
import { FileText, Clipboard, Camera, Activity, Handshake } from "lucide-react";
import { motion } from "framer-motion";

export default function ProcessSteps() {
  const steps = [
    {
      title: "Pre-tasación",
      description: "Entendé tus posibilidades reales. Accedé a indicadores clave del mercado inmobiliario actual.",
      icon: <FileText size={20} strokeWidth={1.5} />,
    },
    {
      title: "Tasación",
      description: "Conocé las alternativas y la mejor estrategia comercial para posicionar tu propiedad.",
      icon: <Clipboard size={20} strokeWidth={1.5} />,
    },
    {
      title: "Alcance total",
      description: "Logramos difusión absoluta con fotografía profesional, videos inmersivos y tours virtuales 360°.",
      icon: <Camera size={20} strokeWidth={1.5} />,
    },
    {
      title: "Seguimiento",
      description: "Recibirás un monitoreo métrico y humano de forma mensual sobre tu caso y sus analíticas.",
      icon: <Activity size={20} strokeWidth={1.5} />,
    },
    {
      title: "Apoyo",
      description: "Sentite respaldado jurídicamente y acompañado en todo momento, hasta el momento de escriturar.",
      icon: <Handshake size={20} strokeWidth={1.5} />,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-surface overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-primary/10 pb-12"
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

        {/* Minimalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
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
                {step.icon}
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
      </div>
    </section>
  );
}
