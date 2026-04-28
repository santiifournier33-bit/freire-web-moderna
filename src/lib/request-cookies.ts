/**
 * Server-side helpers for reading specific cookies off a Next.js Request.
 *
 * We only need a few targeted reads (Meta `_fbp`/`_fbc`, Google `_gcl_aw`,
 * UTM cookie) so a tiny parser keeps the surface area minimal — no need to
 * pull a full cookie library or use `next/headers` (which couples to runtime).
 */

function parseCookieHeader(header: string | null): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const name = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (!name) continue;
    try {
      out[name] = decodeURIComponent(value);
    } catch {
      out[name] = value;
    }
  }
  return out;
}

export function getCookie(req: Request, name: string): string | undefined {
  const cookies = parseCookieHeader(req.headers.get("cookie"));
  return cookies[name];
}

export function getCookies(req: Request): Record<string, string> {
  return parseCookieHeader(req.headers.get("cookie"));
}
