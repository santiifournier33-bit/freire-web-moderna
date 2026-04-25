/**
 * Google Ads conversion tracking helpers — client-side.
 *
 * Fires gtag('event', 'conversion', { send_to: 'AW-XXX/LABEL' }) to register
 * a conversion in Google Ads. Each conversion type has its own label.
 *
 * Env vars (NEXT_PUBLIC_*) are exposed to the browser so the gtag call works
 * client-side. The AW-ID is shared across conversions; only the label changes.
 */

const CONVERSION_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;

const LABELS = {
  tasacion: process.env.NEXT_PUBLIC_GADS_LABEL_TASACION,
  contacto: process.env.NEXT_PUBLIC_GADS_LABEL_CONTACTO,
  whatsapp: process.env.NEXT_PUBLIC_GADS_LABEL_WHATSAPP,
  guia: process.env.NEXT_PUBLIC_GADS_LABEL_GUIA,
} as const;

const VALUES = {
  tasacion: 5000,
  contacto: 3000,
  whatsapp: 3000,
  guia: 1000,
} as const;

export type ConversionType = keyof typeof LABELS;

export function fireGoogleAdsConversion(type: ConversionType, opts?: { transactionId?: string }) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  if (!CONVERSION_ID) return;
  const label = LABELS[type];
  if (!label) return;

  window.gtag("event", "conversion", {
    send_to: `${CONVERSION_ID}/${label}`,
    value: VALUES[type],
    currency: "ARS",
    transaction_id: opts?.transactionId ?? "",
  });
}

/**
 * Reads the gclid (Google Click ID) from the URL on landing and persists it
 * to a cookie for 90 days. The cookie is read by the lead API on submit and
 * sent to Google Ads as part of enhanced conversions.
 */
export function captureGclid() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const gclid = params.get("gclid");
  if (!gclid) return;
  const maxAge = 60 * 60 * 24 * 90; // 90 days
  document.cookie = `_gcl_aw=${encodeURIComponent(gclid)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function readGclidCookie(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/(?:^|;\s*)_gcl_aw=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}
