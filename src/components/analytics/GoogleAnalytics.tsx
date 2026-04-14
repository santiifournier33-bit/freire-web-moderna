'use client';

import Script from 'next/script';

/**
 * Google Analytics 4 — Tracking de tráfico, comportamiento y conversiones.
 * Configurar NEXT_PUBLIC_GA4_MEASUREMENT_ID en .env.local
 */
export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');`}
      </Script>
    </>
  );
}
