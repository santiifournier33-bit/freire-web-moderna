/**
 * UTM tracking — captures, persists, and forwards UTM parameters.
 *
 * Stores BOTH first-touch and last-touch attribution in a single JSON cookie
 * for 90 days. Forms read the cookie on submit; getUTMs() returns last-touch
 * (current campaign), getFirstTouchUTMs() returns the original origin.
 *
 * Normalization:
 *   - Values are stored lowercase (prevents `Meta` vs `meta` fragmentation).
 *   - fbclid is preserved as-is (case may matter for Meta).
 *
 * Cookie security:
 *   - `Secure` flag set automatically when running over HTTPS.
 *   - `SameSite=Lax` so the cookie survives cross-site nav from ads.
 *
 * Browser-safe (guarded by typeof window/document checks).
 */

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "fbclid",
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmRecord = Partial<Record<UtmKey, string>>;

interface UtmCookieShape {
  first?: UtmRecord;
  first_at?: number;
  last?: UtmRecord;
  last_at?: number;
  /** Number of times a new UTM-bearing URL was captured. */
  touches?: number;
}

const COOKIE_NAME = "_fp_utms";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days

/** Keys we lowercase. fbclid is opaque — leave it alone. */
const LOWERCASE_KEYS: ReadonlySet<UtmKey> = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
]);

function normalizeValue(key: UtmKey, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return LOWERCASE_KEYS.has(key) ? trimmed.toLowerCase() : trimmed;
}

function readCookieRaw(): UtmCookieShape | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)_fp_utms=([^;]+)/);
  if (!match) return null;
  try {
    const decoded = decodeURIComponent(match[1]);
    const parsed = JSON.parse(decoded) as unknown;
    if (parsed && typeof parsed === "object") return parsed as UtmCookieShape;
    return null;
  } catch {
    return null;
  }
}

function writeCookie(shape: UtmCookieShape) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(shape));
  const isHttps =
    typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isHttps ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secureFlag}`;
}

function readUTMsFromUrl(): UtmRecord {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: UtmRecord = {};
  for (const key of UTM_KEYS) {
    const raw = params.get(key);
    if (!raw) continue;
    const normalized = normalizeValue(key, raw);
    if (normalized) out[key] = normalized;
  }
  return out;
}

/**
 * Reads UTMs from the current URL. If found, updates last-touch (and sets
 * first-touch if it hasn't been recorded yet). Returns the last-touch record
 * after the update.
 */
export function captureUTMs(): UtmRecord {
  if (typeof window === "undefined") return {};
  const fromUrl = readUTMsFromUrl();
  const existing = readCookieRaw();

  // No new UTMs and no cookie → nothing to do
  if (Object.keys(fromUrl).length === 0) {
    return existing?.last ?? {};
  }

  const now = Date.now();
  const next: UtmCookieShape = {
    first: existing?.first ?? fromUrl,
    first_at: existing?.first_at ?? now,
    last: fromUrl,
    last_at: now,
    touches: (existing?.touches ?? 0) + 1,
  };
  writeCookie(next);
  return next.last ?? {};
}

/** Returns last-touch UTMs (most recent campaign). */
export function getUTMs(): UtmRecord {
  const cookie = readCookieRaw();
  if (cookie?.last && Object.keys(cookie.last).length > 0) return cookie.last;
  return readUTMsFromUrl();
}

/** Returns first-touch UTMs (original origin). */
export function getFirstTouchUTMs(): UtmRecord {
  const cookie = readCookieRaw();
  if (cookie?.first && Object.keys(cookie.first).length > 0) return cookie.first;
  return getUTMs();
}

/** Returns metadata: timestamps + touch count. */
export function getAttributionMeta(): {
  first_at?: number;
  last_at?: number;
  touches?: number;
} {
  const cookie = readCookieRaw();
  return {
    first_at: cookie?.first_at,
    last_at: cookie?.last_at,
    touches: cookie?.touches,
  };
}

/** Builds Brevo attribute keys (uppercase) from a UtmRecord. */
export function utmsToBrevoAttributes(record: UtmRecord): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const v = record[key];
    if (v) out[key.toUpperCase()] = v;
  }
  return out;
}

/** Builds a human-readable summary line for Tokko's `text` field, plus tag list. */
export function utmsToTokkoSummary(record: UtmRecord): { text: string; tags: string[] } {
  const parts: string[] = [];
  const tags: string[] = [];
  for (const key of UTM_KEYS) {
    const v = record[key];
    if (!v) continue;
    parts.push(`${key}=${v}`);
    if (key === "utm_source" || key === "utm_campaign") {
      tags.push(`${key.replace("utm_", "")}:${v}`);
    }
  }
  return {
    text: parts.length ? `Atribución: ${parts.join(" | ")}` : "",
    tags,
  };
}

/** Builds the `custom_data` object for Meta CAPI events. */
export function utmsToCAPICustomData(record: UtmRecord): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const v = record[key];
    if (v) out[key] = v;
  }
  return out;
}
