import { NextResponse } from "next/server";
import dns from "dns/promises";
import GuiaVendedoresEmail from "@/components/emails/GuiaVendedoresEmail";
import validator from "validator";
import { render } from "@react-email/render";
import { createWebContact } from "@/lib/tokkobroker";

const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const GOOGLE_SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK || "";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, source } = body;

    // 1. Basic validation
    if (!name || !email || !validator.isEmail(email)) {
      return NextResponse.json(
        { error: "Formato de correo o nombre inválido" },
        { status: 400 }
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

    // 4. Sincronización con Tokko Broker (Solo si no viene de una página que ya lo hizo)
    // El formulario de tasación lo hace desde el frontend para detallar más parámetros.
    if (source !== "Web Tasacion") {
      try {
        await createWebContact({
          name: name,
          email: email,
          phone: "", // No solemos pedir teléfono para guías en un inicio
          text: `Contacto generado a través de campaña/formulario: ${source || "General"}`,
          tags: ["web", "guia-vendedor"],
        });
      } catch (tokkoErr) {
        console.error("Tokko API push error for Guia Vendedores:", tokkoErr);
      }
    }

    // 5. Agregar a Brevo CRM (Lista ID 3 - Leads Tasación Web)
    if (BREVO_API_KEY) {
      try {
        await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": BREVO_API_KEY,
          },
          body: JSON.stringify({
            email: email,
            attributes: {
              NOMBRE: name,
              SOURCE: source || "Web Tasacion"
            },
            listIds: [3],
            updateEnabled: true // Actualiza si ya existe
          }),
        });
      } catch (brevoCrmError) {
        console.error("Warning: Falló la sincronización con Brevo CRM", brevoCrmError);
      }

      // 6. Enviar Email Transaccional (Guía del vendedor) vía Brevo
      try {
        // Renderizamos el componente de React a String HTML
        const htmlContent = await render(GuiaVendedoresEmail({ name }));

        const emailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": BREVO_API_KEY,
          },
          body: JSON.stringify({
            sender: { name: "Freire Propiedades", email: "contacto@freirepropiedades.com" },
            to: [{ email: email, name: name }],
            subject: "🏡 Aquí tienes tu Guía del Vendedor",
            htmlContent: htmlContent
          }),
        });

        if (!emailResponse.ok) {
          const errData = await emailResponse.json();
          throw new Error(`Brevo SMTP Error: ${JSON.stringify(errData)}`);
        }
      } catch (brevoEmailError: any) {
        console.error("Error al enviar email transaccional con Brevo:", brevoEmailError);
        return NextResponse.json(
          { error: `Brevo Error: ${brevoEmailError.message}` },
          { status: 500 }
        );
      }
    } else {
      console.warn("Falta BREVO_API_KEY en las variables de entorno.");
    }

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
