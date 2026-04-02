"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Gift } from "lucide-react";
import { motion } from "framer-motion";

export default function LeadMagnetPromo() {
  const benefits = [
    "Documentación requerida para la venta",
    "Errores al fijar precio",
    "Estrategias de negociación",
    "¿Qué es el Home Staging? Tips y consejos",
    "Factores controlables (y no) para la venta",
    "Cómo fijar el valor de publicación correcto, y mucho más.",
  ];

  return (
    /* Wrapper: overflow-visible so the mockup can poke out above */
    <div className="relative w-full" style={{ zIndex: 1 }}>
      {/* Full-width blue gradient strip */}
      <section
        className="w-full relative overflow-visible"
        style={{
          background: "linear-gradient(135deg, #071828 0%, #0f3060 50%, #071828 100%)",
          paddingTop: "3.5rem",
          paddingBottom: "3.5rem",
        }}
      >
        {/* Subtle glow orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-blue-400/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 max-w-7xl">
          {/* Grid: text left, mockup right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 items-center">

            {/* ---- TEXT SIDE ---- */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7 }}
              className="flex flex-col"
            >
              {/* Title + badge */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                  Guía del Vendedor
                </h2>
                <span className="inline-flex items-center gap-1.5 bg-[#2196f3] text-white text-[11px] md:text-[13px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full shadow-lg">
                  <Gift size={13} />
                  GRATUITO
                </span>
              </div>

              <p
                className="font-sans text-sm md:text-base font-medium leading-relaxed max-w-xl mb-8"
                style={{ color: '#ffffff' }}
              >
                Te compartimos tips y recomendaciones para tener en cuenta a la hora de vender una propiedad.
                Todo lo que necesitás saber para vender tu casa con éxito.
              </p>

              {/* Benefits — two columns */}
              <div className="mb-8">
                <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">Incluye:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="text-[#2196f3] flex-shrink-0 mt-px" size={14} />
                      <span className="text-white/85 text-sm leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div>
                <Link
                  href="/guia-vendedores"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary px-12 py-5 text-[12px] md:text-[13px] font-bold uppercase tracking-[0.15em] shadow-2xl transition-all duration-300 hover:bg-[#2196f3] hover:text-white hover:-translate-y-0.5 hover:shadow-blue-500/30"
                >
                  Obtener mi guía gratuita
                </Link>
              </div>
            </motion.div>

            {/* ---- MOCKUP — overflows top of strip ---- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative flex items-end justify-center lg:justify-end pointer-events-none mt-[-40px] lg:mt-[-80px]"
            >
              <div
                className="relative transition-all duration-700 hover:scale-105 hover:-rotate-1"
                style={{
                  filter: "drop-shadow(0px 30px 60px rgba(0,0,0,0.55))",
                }}
              >
                <Image
                  src="/guia-mockup.png"
                  alt="Guía para vendedores – Freire Propiedades"
                  width={300}
                  height={390}
                  className="object-contain"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
