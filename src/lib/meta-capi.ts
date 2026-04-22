/**
 * Meta Conversions API (CAPI) — server-side event sending.
 * Complements the browser pixel to bypass ad blockers and improve match rate.
 * IMPORTANT: Server-side only. Never import in "use client" components.
 */

import crypto from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || "";
const CAPI_URL = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`;

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export interface CAPIEventParams {
  eventName: "Lead" | "Contact" | "CompleteRegistration";
  sourceUrl: string;
  email?: string;
  phone?: string;
  name?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  eventId?: string;
}

export async function sendCAPIEvent(params: CAPIEventParams): Promise<void> {
  if (!PIXEL_ID || !CAPI_TOKEN) {
    console.warn("[CAPI] Missing PIXEL_ID or CAPI_TOKEN — skipping server event");
    return;
  }

  const userData: Record<string, string | string[]> = {};
  if (params.email) userData.em = [sha256(params.email)];
  if (params.phone) {
    // Strip non-digits for hashing
    const clean = params.phone.replace(/\D/g, "");
    userData.ph = [sha256(clean)];
  }
  if (params.name) {
    const parts = params.name.trim().split(/\s+/);
    userData.fn = [sha256(parts[0])];
    if (parts.length > 1) userData.ln = [sha256(parts.slice(1).join(" "))];
  }
  if (params.clientIpAddress) userData.client_ip_address = params.clientIpAddress;
  if (params.clientUserAgent) userData.client_user_agent = params.clientUserAgent;

  const payload = {
    data: [
      {
        event_name: params.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: params.sourceUrl,
        action_source: "website",
        user_data: userData,
        ...(params.eventId ? { event_id: params.eventId } : {}),
      },
    ],
  };

  try {
    const res = await fetch(`${CAPI_URL}?access_token=${CAPI_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[CAPI] Error ${res.status}:`, err);
    } else {
      console.log(`[CAPI] Event sent: ${params.eventName} → ${params.sourceUrl}`);
    }
  } catch (err) {
    console.error("[CAPI] Network error:", err);
  }
}
