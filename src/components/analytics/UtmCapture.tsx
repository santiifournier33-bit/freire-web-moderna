"use client";

import { useEffect } from "react";
import { captureUTMs } from "@/lib/utm";

/**
 * Captures UTM parameters (utm_source, utm_medium, utm_campaign, utm_content,
 * utm_term, fbclid) on landing and persists them to a cookie for 90 days.
 *
 * Forms read the cookie via getUTMs() on submit so attribution travels along
 * to Brevo, Tokko, and Meta CAPI even when the lead converts in a later visit.
 */
export default function UtmCapture() {
  useEffect(() => {
    captureUTMs();
  }, []);
  return null;
}
