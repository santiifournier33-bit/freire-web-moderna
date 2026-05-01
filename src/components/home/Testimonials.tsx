"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "María González",
    location: "Pilar",
    image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    quote: "Stella y su equipo me ayudaron a vender mi casa en tiempo récord. Su profesionalismo y dedicación son excepcionales. Altamente recomendados.",
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    location: "Escobar",
    image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    quote: "Excelente atención al cliente. Me asesoraron en todo el proceso de compra y siempre estuvieron disponibles para responder mis dudas.",
  },
  {
    id: 3,
    name: "Ana Rodríguez",
    location: "San Isidro",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    quote: "La mejor decisión fue elegir Freire Propiedades. Su conocimiento del mercado local y su honestidad me dieron total confianza.",
  },
  {
    id: 4,
    name: "Roberto Fernández",
    location: "Tigre",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    quote: "Un servicio impecable de principio a fin. La transparencia y el compromiso del equipo hicieron que todo el proceso fuera muy fluido.",
  },
  {
    id: 5,
    name: "Laura Martínez",
    location: "Nordelta",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    quote: "Nos guiaron con paciencia y profesionalismo. Encontramos nuestra casa ideal gracias a su asesoramiento experto en la zona.",
  },
  {
    id: 6,
    name: "Diego Ramírez",
    location: "Pilar del Este",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    quote: "Su certificación CRS realmente se nota. Manejan cada operación con un nivel de profesionalismo superior. Muy agradecido.",
  },
  {
    id: 7,
    name: "Valentina López",
    location: "San Fernando",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    quote: "Vendimos nuestra propiedad al mejor precio del mercado. Su estrategia de marketing fue clave para atraer compradores calificados.",
  },
  {
    id: 8,
    name: "Martín Suárez",
    location: "Escobar",
    image: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    quote: "Recomiendo a Freire Propiedades sin dudarlo. Su equipo nos acompañó en cada paso, haciéndonos sentir seguros durante toda la transacción.",
  },
  {
    id: 9,
    name: "Camila Herrera",
    location: "Pilar",
    image: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    quote: "Increíble experiencia. Profesionales en cada detalle, desde la tasación inicial hasta la firma final. Sin duda los mejores de la zona.",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="p-5 md:p-8 rounded-2xl bg-surface-container-lowest shadow-sm border border-primary/5 max-w-[calc(100vw-3rem)] md:max-w-xs w-full transition-all duration-500 hover:shadow-ambient hover:-translate-y-1">
      <p className="text-sm text-primary/80 leading-relaxed font-sans mb-6">
        &quot;{testimonial.quote}&quot;
      </p>
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-xs font-bold text-primary tracking-tight leading-snug">
            {testimonial.name}
          </div>
          <div className="text-[11px] text-on-surface-variant leading-snug">
            {testimonial.location}
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialsColumn({
  testimonials: items,
  duration = 25,
  className = "",
}: {
  testimonials: typeof testimonials;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex flex-col gap-5 pb-5 animate-scroll-up"
        style={{
          animationDuration: `${duration}s`,
        }}
      >
        {/* Duplicate items for seamless loop */}
        {[...items, ...items].map((testimonial, i) => (
          <TestimonialCard key={`${testimonial.id}-${i}`} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-12 md:py-16 bg-surface overflow-hidden relative">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="mb-6 md:mb-10 text-center">
          <span className="label-editorial mb-4 block">Experiencias Reales</span>
          <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-[-0.03em]">
            La voz de nuestros <br />
            <span className="text-secondary italic font-normal">clientes</span>
          </h2>
        </div>

        <div className="flex justify-center gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[680px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={20} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={26} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={22} />
        </div>
      </div>
    </section>
  );
}
