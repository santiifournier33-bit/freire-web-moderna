"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "¿Cuáles son los primeros pasos para vender con nosotros?",
      answer: "1. Completas el formulario.\n2. Nos ponemos en contacto con vos.\n3. Realizamos la pretasación y evaluamos juntos tus posibilidades en la reunión.",
    },
    {
      question: "¿Trabajan con exclusividad o puedo trabajar con otra inmobiliaria a la vez?",
      answer: "Trabajamos con exclusividad por 120 días, lo que nos permite enfocarnos al 100% en la venta de tu propiedad. Con esta modalidad, invertimos más en publicidad y marketing personalizado, asegurando que tus intereses sean nuestra prioridad y aprovechando nuestra experiencia y red de contactos para lograr la venta.",
    },
    {
      question: "¿Cuáles son los costos adicionales a considerar al comprar o vender una propiedad?",
      answer: "Al comprar o vender una propiedad, es importante tener en cuenta los costos más allá del precio de compra. Estos incluyen los honorarios de la inmobiliaria, el impuesto de sellos, los gastos de escrituración, los honorarios de la escribanía, el estudio de títulos, y varios impuestos. Te proporcionaremos una proforma de gastos detallada para que puedas planificar y entender mejor estos costos.",
    },
    {
      question: "¿Cuáles son sus honorarios y qué servicios están incluidos?",
      answer: "Nuestros honorarios se calculan como un porcentaje de la venta e incluyen una amplia variedad de servicios, desde el asesoramiento y la valoración de la propiedad, hasta la promoción de la propiedad y la gestión de las visitas, la negociación con los compradores y la coordinación de los aspectos legales y documentales de la venta.",
    },
    {
      question: "¿Cuánto tiempo suelen estar en el mercado las propiedades antes de venderse?",
      answer: "Las propiedades que están correctamente valoradas y bien presentadas suelen recibir reservas dentro de los primeros 4 meses. Nuestro objetivo es trabajar contigo para asegurarnos de que tu propiedad se venda en un tiempo óptimo y al mejor precio posible.",
    },
    {
      question: "¿Cómo me aseguro de vender y comprar sin quedarme en la calle?",
      answer: "Podemos condicionar tu venta a tu reubicación y solo vendes en simultáneo con tu compra sin riesgo y sin penalidades en caso que no se concrete ninguna operación.",
    },
    {
      question: "¿Qué documentación necesito para vender?",
      answer: "Título del inmueble, DNI del titular, impuestos municipales y provinciales, planos (si los hubiere) y autorización de venta firmada por todos los propietarios.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-16 bg-surface-container-low">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-6 md:mb-10 text-center">
          <span className="label-editorial mb-4 block">Asesoramiento Directo</span>
          <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-[-0.03em]">
            Preguntas <br />
            <span className="text-secondary italic font-normal">Frecuentes</span>
          </h2>
        </div>
        
        <div className="space-y-1 bg-surface-dim shadow-ambient">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-surface-container-lowest overflow-hidden transition-all duration-500"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 py-4 md:px-8 md:py-7 text-left flex items-center justify-between transition-colors duration-500 hover:bg-surface-container"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-sm font-bold normal-case tracking-normal md:uppercase md:tracking-widest text-primary pr-8 leading-relaxed">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 text-primary">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 stroke-[1.5]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 stroke-[1.5]" />
                  )}
                </div>
              </button>
              
              <div
                className={`transition-all duration-700 ease-standard overflow-hidden ${
                  openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 pb-6 pt-2 md:px-8 md:pb-10 md:pt-4">
                  <p className="text-base text-on-surface-variant leading-relaxed font-sans whitespace-pre-line border-t border-primary/5 pt-8">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
