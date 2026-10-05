"use client";

import Script from "next/script";
import { buildInnovaCardUrl, INNOVA_LOADER_URL } from "@/lib/innova";

/**
 * Card de financiación de Innova Hipotecaria.
 * El iframe respeta los atributos de la guía de integración de Innova; no se debe
 * modificar su contenido, colores, textos ni funcionalidad sin autorización escrita.
 * El script oficial solo ajusta la altura del iframe vía postMessage.
 */
export default function InnovaFinancingCard({ priceUsd }: { priceUsd: number }) {
  return (
    <div className="flex justify-center">
      <iframe
        data-innova-embed="card"
        src={buildInnovaCardUrl(priceUsd)}
        width="100%"
        style={{ border: 0, minHeight: 360, maxWidth: 300 }}
        loading="lazy"
        title="Innova Hipotecaria - Financiación estimada"
      />
      <Script src={INNOVA_LOADER_URL} strategy="lazyOnload" />
    </div>
  );
}
