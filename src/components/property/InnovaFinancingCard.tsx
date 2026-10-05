"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Script from "next/script";
import { buildInnovaCardUrl, INNOVA_LOADER_URL } from "@/lib/innova";

// El embed de Innova trae 8px de padding transparente (px-2 py-2) y su sombra queda
// recortada en el borde del iframe, lo que se ve como un rectángulo celeste. Se difumina
// solo esa franja de 8px; el card empieza a 8px del borde y no se toca.
const EMBED_EDGE_PX = 8;
const EDGE_FADE = (direction: "to right" | "to bottom") =>
  `linear-gradient(${direction}, transparent 0, #000 ${EMBED_EDGE_PX}px, #000 calc(100% - ${EMBED_EDGE_PX}px), transparent 100%)`;
const EDGE_MASK = `${EDGE_FADE("to right")}, ${EDGE_FADE("to bottom")}`;

const IFRAME_MIN_HEIGHT = 360;
// Si el loader de Innova no carga (bloqueador, red), se muestra el card igual pasado este tiempo.
const LOADER_FALLBACK_MS = 6000;

const IFRAME_STYLE: CSSProperties = {
  // Valores de la guía de integración de Innova.
  border: 0,
  minHeight: IFRAME_MIN_HEIGHT,
  maxWidth: 300,
  // Presentación del lado nuestro: difumina la franja transparente del iframe.
  maskImage: EDGE_MASK,
  WebkitMaskImage: EDGE_MASK,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};

/**
 * Card de financiación de Innova Hipotecaria.
 * El iframe respeta los atributos de la guía de integración de Innova; no se debe
 * modificar su contenido, colores, textos ni funcionalidad sin autorización escrita.
 * El script oficial solo ajusta la altura del iframe vía postMessage.
 *
 * El iframe se monta recién cuando el loader ya está escuchando: si el embed avisa su
 * altura antes de que exista el listener, el mensaje se pierde y el card queda cortado
 * a 360px (le faltan ~27px abajo).
 *
 * El panel es de nuestro lado y usa los mismos tokens que las demás cajas del sidebar.
 * Padding vertical = (ancho del panel - 300px) / 2, entre 16px y 48px (el % de padding
 * es sobre el ancho): deja el card con el mismo aire arriba/abajo que a los costados, ya que
 * el card de Innova no pasa de 284px y el ancho del panel varía (+8px propios del iframe).
 * En tablet en vertical el panel se acota a 340px y centra, para que el card no flote en
 * un panel de ~720px.
 */
export default function InnovaFinancingCard({ priceUsd }: { priceUsd: number }) {
  const [loaderReady, setLoaderReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaderReady(true), LOADER_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-surface-container-lowest shadow-ambient border border-primary/5 rounded-2xl px-4 py-[clamp(1rem,calc((100%_-_300px)/2),3rem)] md:py-5 lg:py-[clamp(1rem,calc((100%_-_300px)/2),3rem)] flex justify-center md:max-w-[340px] md:mx-auto lg:max-w-none">
      {loaderReady ? (
        <iframe
          data-innova-embed="card"
          src={buildInnovaCardUrl(priceUsd)}
          width="100%"
          style={IFRAME_STYLE}
          loading="lazy"
          title="Innova Hipotecaria - Financiación estimada"
        />
      ) : (
        <div aria-hidden="true" style={{ width: "100%", maxWidth: 300, minHeight: IFRAME_MIN_HEIGHT }} />
      )}
      <Script
        src={INNOVA_LOADER_URL}
        strategy="afterInteractive"
        onReady={() => setLoaderReady(true)}
        onError={() => setLoaderReady(true)}
      />
    </div>
  );
}
