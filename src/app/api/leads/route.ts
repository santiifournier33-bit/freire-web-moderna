import { NextResponse } from "next/server";
import dns from "dns/promises";
import validator from "validator";
import { createBrevoContact, sendBrevoEmail, BREVO_LISTS } from "@/lib/brevo";
import { sendCAPIEvent, buildFbcFromClickId } from "@/lib/meta-capi";
import { utmsToBrevoAttributes, utmsToCAPICustomData, type UtmRecord } from "@/lib/utm";
import { getCookie } from "@/lib/request-cookies";

const GOOGLE_SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK || "";
const BASE_URL = "https://www.freirepropiedades.com";

/**
 * Generates the Seller Guide email HTML.
 * Mirrors the design of GuiaVendedoresEmail.tsx but as a raw string
 * to avoid react-dom/server imports (not allowed in App Router API routes).
 */
function buildGuiaVendedoresHtml(name: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background-color:#f7f9fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;margin:0;padding:0;">
  <div style="margin:40px auto;width:600px;max-width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);border:1px solid #eaeaea;">
    
    <!-- Header -->
    <div style="background-color:#0B1D3A;padding:40px 0;text-align:center;">
      <img src="${BASE_URL}/logo-blanco-oficial.png" width="80" alt="Freire Propiedades" style="margin:0 auto;display:block;" />
    </div>
    
    <!-- Content -->
    <div style="padding:40px 40px 20px;">
      <p style="color:#D4AF37;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;margin-top:0;">AQUÍ TIENES TU GUÍA</p>
      <h1 style="color:#0B1D3A;font-size:28px;font-weight:bold;line-height:1.2;margin:0 0 24px;">Vender tu casa, paso a paso</h1>
      <p style="color:#4a5568;font-size:16px;line-height:1.6;margin-bottom:24px;">Hola <strong>${name}</strong>,</p>
      <p style="color:#4a5568;font-size:16px;line-height:1.6;margin-bottom:24px;">Gracias por solicitar nuestra Guía del Vendedor, aquí encontrarás toda la información necesaria para vender tu casa con éxito.</p>
      
      <!-- CTA Button -->
      <div style="text-align:center;margin:32px 0 40px;">
        <a href="${BASE_URL}/guia-vendedores.pdf" style="background-color:#0B1D3A;border-radius:4px;color:#fff;font-size:14px;font-weight:bold;text-decoration:none;text-align:center;display:inline-block;padding:16px 32px;text-transform:uppercase;letter-spacing:1px;">Descargar Guía en PDF</a>
      </div>
      
      <p style="color:#4a5568;font-size:16px;line-height:1.6;margin-bottom:24px;">Si después de leer la guía consideras que tu propiedad necesita una evaluación profesional por parte de nuestro equipo, no dudes en responder directamente a este correo o agendar una tasación desde nuestra plataforma.</p>
      
      <!-- WhatsApp Button -->
      <div style="text-align:center;margin:16px 0 32px;">
        <a href="https://wa.me/5491151454915?text=Hola,%20vi%20la%20gu%C3%ADa%20y%20me%20gustar%C3%ADa%20generar%20una%20tasaci%C3%B3n%20profesional" style="background-color:#25D366;border-radius:4px;color:#fff;font-size:14px;font-weight:bold;text-decoration:none;text-align:center;display:inline-block;padding:16px 32px;text-transform:uppercase;letter-spacing:1px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png" width="20" height="20" alt="WhatsApp" style="display:inline-block;vertical-align:middle;margin-right:8px;" />
          Contactar por WhatsApp
        </a>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background-color:#f8f9fa;padding:32px 40px;border-top:1px solid #eaeaea;">
      <p style="color:#718096;font-size:12px;line-height:1.5;margin:0 0 16px;text-align:center;">
        FREIRE Negocios Inmobiliarios<br />
        Edificio STUDIOS Work&amp;Live, Pilar<br />
        contacto@freirepropiedades.com
      </p>
      <p style="text-align:center;margin:0;">
        <a href="https://www.freirepropiedades.com" style="color:#0B1D3A;font-size:12px;text-decoration:underline;">Visitar Sitio Web</a> &bull;
        <a href="https://www.freirepropiedades.com/contacto" style="color:#0B1D3A;font-size:12px;text-decoration:underline;">Contacto Directo</a>
      </p>
    </div>
    
  </div>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, source, eventId, turnstileToken, utms, pageUrl, gclid } = body as {
      name?: string;
      email?: string;
      source?: string;
      eventId?: string;
      turnstileToken?: string;
      utms?: UtmRecord;
      pageUrl?: string;
      gclid?: string;
    };
    const utmRecord: UtmRecord = utms ?? {};
    const fbp = getCookie(req, "_fbp");
    const fbcCookie = getCookie(req, "_fbc");
    const fbc = fbcCookie ?? (utmRecord.fbclid ? buildFbcFromClickId(utmRecord.fbclid) : undefined);
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] ?? undefined;
    const userAgent = req.headers.get("user-agent") ?? undefined;

    // 1. Basic validation
    if (!name || !email || !validator.isEmail(email)) {
      return NextResponse.json(
        { error: "Formato de correo o nombre inválido" },
        { status: 400 }
      );
    }

    // 1.5 Cloudflare Turnstile verification
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Verificación antibot requerida" },
        { status: 400 }
      );
    }
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      console.error("[Turnstile] TURNSTILE_SECRET_KEY no configurada");
      return NextResponse.json(
        { error: "Configuración antibot ausente" },
        { status: 500 }
      );
    }
    try {
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: turnstileToken,
            ...(clientIp ? { remoteip: clientIp } : {}),
          }),
        }
      );
      const verifyData = (await verifyRes.json()) as {
        success: boolean;
        "error-codes"?: string[];
        hostname?: string;
      };
      if (!verifyData.success) {
        console.warn("[Turnstile] Verification failed:", verifyData["error-codes"]);
        return NextResponse.json(
          { error: "Verificación antibot fallida" },
          { status: 403 }
        );
      }
    } catch (turnstileErr) {
      console.error("[Turnstile] siteverify error:", turnstileErr);
      return NextResponse.json(
        { error: "Error verificando antibot" },
        { status: 502 }
      );
    }

    // 2. Deep Validation using native dns resolving (MX records)
    try {
      const domain = email.split("@")[1];
      const mxRecords = await dns.resolveMx(domain);
      
      if (!mxRecords || mxRecords.length === 0) {
        throw new Error("No MX records");
      }
    } catch (dnsError) {
      console.log("DNS MX Validation failed for domain:", email.split("@")[1]);
      return NextResponse.json(
        { error: "El correo proporcionado no parece estar activo (dominio sin casilla de correos)." },
        { status: 400 }
      );
    }

    // 3. Save to Google Sheets (Webhook Approach)
    if (GOOGLE_SHEET_WEBHOOK) {
      try {
        await fetch(GOOGLE_SHEET_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, source, date: new Date().toISOString() }),
        });
      } catch (err) {
        console.error("Warning: Sheet Webhook failed", err);
      }
    }

    // 4. Create contact in Brevo (List: Guía Vendedores)
    await createBrevoContact({
      email,
      name,
      listIds: [BREVO_LISTS.GUIA_VENDEDORES],
      attributes: {
        SOURCE: "guia-vendedores",
        ...utmsToBrevoAttributes(utmRecord),
        ...(gclid ? { GCLID: gclid } : {}),
      },
    });

    // 5. Send Email via Brevo (replaces Resend)
    try {
      const htmlContent = buildGuiaVendedoresHtml(name);
      
      const emailSent = await sendBrevoEmail({
        to: { email, name },
        subject: "🏡 Aquí tienes tu Guía del Vendedor",
        htmlContent,
      });

      if (!emailSent) {
        throw new Error("Brevo email delivery failed");
      }
    } catch (emailError: any) {
      console.error("Error al enviar email:", emailError);
      return NextResponse.json(
        { error: `Error de envío: ${emailError.message}` },
        { status: 500 }
      );
    }

    // Fire CAPI Lead event (non-blocking)
    await sendCAPIEvent({
      eventName: "Lead",
      sourceUrl: pageUrl || "https://www.freirepropiedades.com/guia-vendedores",
      email,
      name,
      clientIpAddress: clientIp,
      clientUserAgent: userAgent,
      eventId: eventId ?? undefined,
      customData: utmsToCAPICustomData(utmRecord),
      fbp,
      fbc,
    }).catch((err) => console.error("[CAPI] Non-blocking error:", err));

    return NextResponse.json(
      { message: "Lead procesado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal API error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
