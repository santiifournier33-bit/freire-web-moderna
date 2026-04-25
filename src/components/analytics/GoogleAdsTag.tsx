'use client';

import Script from 'next/script';

/**
 * Google Ads gtag config — registers the conversion tracking pixel.
 * Coexists with GoogleAnalytics.tsx (both share window.dataLayer).
 * Configure NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID in .env.local (e.g. AW-18090729711).
 */
export default function GoogleAdsTag() {
  const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;
  if (!conversionId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${conversionId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${conversionId}');`}
      </Script>
    </>
  );
}
