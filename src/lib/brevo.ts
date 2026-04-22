/**
 * Brevo (ex-Sendinblue) API Integration
 * 
 * Centralized utility for creating contacts and sending transactional emails.
 * Uses Brevo REST API v3 — no SDK required.
 * 
 * IMPORTANT: Server-side only. Never import this in "use client" components.
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const BREVO_API_URL = "https://api.brevo.com/v3";

// ── List IDs (configured in Brevo dashboard) ──
export const BREVO_LISTS = {
  // Warm leads — web forms
  TASACION:          3, // Leads Tasación Web
  GUIA_VENDEDORES:   4, // Leads - Guía Vendedores

  // Contacto General — segmentado por motivo de consulta
  CONTACTO_VENDE:    5, // Dueño Venta - Contacto Web
  CONTACTO_ALQUILA:  7, // Dueño Alquila - Contacto Web
  CONTACTO_COMPRA:   8, // Comprador - Contacto Web
  CONTACTO_INQUILINO:9, // Inquilino - Contacto Web

  // Cold base
  HISTORICOS:        6, // Base Fría - Contactos Histórico
} as const;

/**
 * Creates or updates a contact in one or more Brevo lists.
 * Uses `updateEnabled: true` so existing contacts get updated instead of erroring.
 */
export async function createBrevoContact(params: {
  email: string;
  name: string;
  phone?: string;
  listIds: number[];
  attributes?: Record<string, string>;
}) {
  try {
    const nameParts = params.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const res = await fetch(`${BREVO_API_URL}/contacts`, {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: params.email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
          SMS: params.phone || "",
          ...params.attributes,
        },
        listIds: params.listIds,
        updateEnabled: true,
      }),
    });

    // 201 = created, 204 = updated existing contact
    if (!res.ok && res.status !== 204) {
      const errorBody = await res.text();
      console.error(`[Brevo] Contact error (${res.status}):`, errorBody);
      return false;
    }

    console.log(`[Brevo] Contact synced: ${params.email} → Lists: [${params.listIds}]`);
    return true;
  } catch (error) {
    console.error("[Brevo] Contact exception:", error);
    return false;
  }
}

/**
 * Sends a transactional email via Brevo SMTP API.
 * Used for immediate emails like the Seller's Guide delivery.
 */
export async function sendBrevoEmail(params: {
  to: { email: string; name: string };
  subject: string;
  htmlContent: string;
  sender?: { name: string; email: string };
}) {
  try {
    const res = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: params.sender || {
          name: "Freire Propiedades",
          email: "contacto@freirepropiedades.com",
        },
        to: [params.to],
        subject: params.subject,
        htmlContent: params.htmlContent,
        replyTo: { email: "contacto@freirepropiedades.com" },
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`[Brevo] Email error (${res.status}):`, errorBody);
      return false;
    }

    console.log(`[Brevo] Email sent to: ${params.to.email} — Subject: "${params.subject}"`);
    return true;
  } catch (error) {
    console.error("[Brevo] Email exception:", error);
    return false;
  }
}
