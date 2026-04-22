import { NextResponse } from "next/server";
import { createBrevoContact, BREVO_LISTS } from "@/lib/brevo";
import { sendCAPIEvent } from "@/lib/meta-capi";

/**
 * POST /api/brevo-contact
 *
 * Server-side endpoint for client components to sync contacts to Brevo.
 * Called in parallel with Tokko (non-blocking from the user's perspective).
 *
 * Body:
 *   - source: "tasacion" → Lista 3 (Leads Tasación Web)
 *   - source: "contacto" + motivo: "vender"    → Lista 5 (Dueño Venta)
 *   - source: "contacto" + motivo: "alquilar"  → Lista 7 (Dueño Alquila)
 *   - source: "contacto" + motivo: "comprar"   → Lista 8 (Comprador)
 *   - source: "contacto" + motivo: "inquilino" → Lista 9 (Inquilino)
 */

// Motivo de consulta → Brevo list ID mapping
const MOTIVO_TO_LIST: Record<string, number> = {
  vender:    BREVO_LISTS.CONTACTO_VENDE,
  alquilar:  BREVO_LISTS.CONTACTO_ALQUILA,
  comprar:   BREVO_LISTS.CONTACTO_COMPRA,
  inquilino: BREVO_LISTS.CONTACTO_INQUILINO,
};

export async function POST(req: Request) {
  try {
    const { name, email, phone, source, motivo } = await req.json();
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] ?? undefined;
    const userAgent = req.headers.get("user-agent") ?? undefined;

    if (!email || !name || !source) {
      return NextResponse.json(
        { error: "Faltan campos requeridos (name, email, source)" },
        { status: 400 }
      );
    }

    // Determine target list
    let listId: number;
    let attributes: Record<string, string> = { SOURCE: source };

    if (source === "tasacion") {
      listId = BREVO_LISTS.TASACION;
    } else if (source === "contacto") {
      if (!motivo || !MOTIVO_TO_LIST[motivo]) {
        return NextResponse.json(
          { error: `Motivo no válido: ${motivo}. Opciones: vender, alquilar, comprar, inquilino` },
          { status: 400 }
        );
      }
      listId = MOTIVO_TO_LIST[motivo];
      attributes.MOTIVO_CONSULTA = motivo;
    } else {
      return NextResponse.json(
        { error: `Source no válida: ${source}` },
        { status: 400 }
      );
    }

    const success = await createBrevoContact({
      email,
      name,
      phone,
      listIds: [listId],
      attributes,
    });

    if (!success) {
      console.error(`[Brevo API Route] Failed to sync contact: ${email} (list ${listId})`);
      return NextResponse.json(
        { error: "Error al sincronizar con Brevo" },
        { status: 500 }
      );
    }

    // Fire CAPI Lead event (non-blocking)
    const sourceUrl = source === "tasacion"
      ? "https://www.freirepropiedades.com/tasar-propiedad"
      : "https://www.freirepropiedades.com/contacto";
    sendCAPIEvent({
      eventName: "Lead",
      sourceUrl,
      email,
      phone,
      name,
      clientIpAddress: clientIp,
      clientUserAgent: userAgent,
    }).catch((err) => console.error("[CAPI] Non-blocking error:", err));

    console.log(`[Brevo API Route] Synced: ${email} → List ${listId} (${source}/${motivo ?? "—"})`);
    return NextResponse.json(
      { message: `Contacto sincronizado — lista ${listId}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Brevo API Route] Internal error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

