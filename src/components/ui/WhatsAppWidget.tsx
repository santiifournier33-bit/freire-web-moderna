"use client";

import Image from "next/image";
import { fireGoogleAdsConversion } from "@/lib/google-ads-conversions";

export default function WhatsAppWidget() {
  const phoneNumber = "5491151454915";
  const message = "Hola. Vi su pagina y me gustaria saber más información sobre sus servicios inmobiliarios";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => fireGoogleAdsConversion("whatsapp")}
      className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-[#25D366] hover:bg-[#1DA851] rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group cursor-pointer"
      title="Contactar por WhatsApp"
      aria-label="Contactar por WhatsApp"
    >
      <div className="relative w-8 h-8">
        <Image
          src="/whatsapp-blanco.png"
          alt="WhatsApp Logo"
          fill
          className="object-contain"
        />
      </div>

      {/* Opcional: Un pequeño efecto de ripple que se anima */}
      <span className="absolute inset-0 rounded-full border border-[#25D366] animate-ping opacity-20 duration-1000"></span>
    </a>
  );
}
