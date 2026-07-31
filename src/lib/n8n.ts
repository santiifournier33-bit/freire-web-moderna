/**
 * n8n — Lead webhook dispatch.
 *
 * Notifies the n8n automation (WhatsApp welcome message to the lead +
 * internal alert to the team) whenever a Contacto or Tasación form is sent.
 *
 * IMPORTANT: Server-side only. Never import this in "use client" components —
 * the webhook URL and its token must not reach the browser bundle, or anyone
 * could replay the webhook and burn paid WhatsApp messages.
 */

const N8N_LEAD_WEBHOOK_URL =
  process.env.N8N_LEAD_WEBHOOK_URL ||
  "https://n8n-free-oracle.duckdns.org/webhook/lead-web";
const N8N_LEAD_WEBHOOK_TOKEN = process.env.N8N_LEAD_WEBHOOK_TOKEN || "";

/** Per-attempt timeout. Kept short so all attempts fit in the function's lifetime. */
const REQUEST_TIMEOUT_MS = 5_000;
/** Initial call + 2 retries. */
const MAX_ATTEMPTS = 3;
/** Exponential backoff between attempts: 1s, then 2s. */
const BACKOFF_BASE_MS = 1_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Field names are fixed — n8n reads them verbatim. */
export type N8nLeadPayload =
  | {
      formulario: "contacto";
      name: string;
      email: string;
      phone?: string;
      motivo?: string;
      message?: string;
    }
  | {
      formulario: "tasacion";
      name: string;
      email: string;
      phone?: string;
      locality?: string;
      address?: string;
      floor?: string;
      apartment?: string;
      operationType?: string;
      propertyType?: string;
      comments?: string;
    };

/**
 * Posts a lead to the n8n webhook, retrying transient failures with
 * exponential backoff. Fire-and-forget: the response body is ignored and this
 * never throws, so a webhook outage cannot affect the Tokko / Brevo / Meta CAPI
 * flow that runs alongside it.
 *
 * Retries on network errors, timeouts, 5xx and 429. A 4xx other than 429 is
 * permanent (bad token, malformed payload) — retrying it would only burn
 * attempts, so it fails fast.
 *
 * Runs inside `after()`, so the backoff costs the submitter nothing.
 *
 * Known tradeoff: if n8n processed a request but its response was lost, a retry
 * can deliver the WhatsApp welcome twice. Accepted — no idempotency key.
 */
export async function sendLeadToN8n(payload: N8nLeadPayload): Promise<boolean> {
  if (!N8N_LEAD_WEBHOOK_TOKEN) {
    console.error("[n8n] N8N_LEAD_WEBHOOK_TOKEN no configurada — webhook omitido");
    return false;
  }

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(N8N_LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: N8N_LEAD_WEBHOOK_TOKEN,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (res.ok) {
        console.log(
          `[n8n] Lead enviado — formulario=${payload.formulario} (intento ${attempt})`
        );
        return true;
      }

      const isRetryable = res.status >= 500 || res.status === 429;
      if (!isRetryable) {
        console.error(
          `[n8n] Webhook error permanente (${res.status}) — formulario=${payload.formulario}, sin reintento`
        );
        return false;
      }

      console.error(
        `[n8n] Webhook error (${res.status}) — formulario=${payload.formulario}, intento ${attempt}/${MAX_ATTEMPTS}`
      );
    } catch (error) {
      console.error(
        `[n8n] Webhook exception — formulario=${payload.formulario}, intento ${attempt}/${MAX_ATTEMPTS}:`,
        error
      );
    }

    if (attempt < MAX_ATTEMPTS) {
      await sleep(BACKOFF_BASE_MS * 2 ** (attempt - 1));
    }
  }

  console.error(
    `[n8n] Lead NO enviado tras ${MAX_ATTEMPTS} intentos — formulario=${payload.formulario}`
  );
  return false;
}
