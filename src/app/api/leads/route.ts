import { NextResponse } from "next/server";
import { Resend } from "resend";
import dns from "dns/promises";
import GuiaVendedoresEmail from "@/components/emails/GuiaVendedoresEmail";
import validator from "validator";

const resend = new Resend(process.env.RESEND_API_KEY);
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

    // 4. Send Email via Resend
    try {
      const { data, error } = await resend.emails.send({
        from: "Freire Propiedades <contacto@freirepropiedades.com>", 
        to: [email],
        replyTo: "contacto@freirepropiedades.com",
        subject: "🏡 Aquí tienes tu Guía del Vendedor",
        react: GuiaVendedoresEmail({ name }),
      });

      if (error) {
        throw new Error(error.name + ": " + error.message);
      }
    } catch (emailError: any) {
      console.error("Error al enviar email:", emailError);
      return NextResponse.json(
        { error: `Resend Error: ${emailError.message}` },
        { status: 500 }
      );
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
