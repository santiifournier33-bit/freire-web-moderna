'use client';

import { useEffect } from 'react';
import { captureGclid } from '@/lib/google-ads-conversions';

/**
 * Captures the gclid (Google Click ID) on landing and stores it in a cookie
 * for 90 days. The lead API route reads it on form submit and sends it to
 * Google Ads as part of enhanced conversions.
 */
export default function GclidCapture() {
  useEffect(() => {
    captureGclid();
  }, []);
  return null;
}
