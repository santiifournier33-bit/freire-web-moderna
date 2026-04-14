import { NextResponse } from "next/server";
import { createBrevoContact, BREVO_LISTS } from "@/lib/brevo";

/**
 * POST /api/brevo-contact
 * 
 * Server-side endpoint for client components to sync contacts to Brevo.
 * Called in parallel with Tokko (non-blocking from the user's perspective).
 * 
 * Body: { name, email, phone?, source: "tasacion" | "contacto" }
 */

const SOURCE_TO_LIST: Record<string, number> = {
  tasacion: BREVO_LISTS.TASACION,
  contacto: BREVO_LISTS.CONTACTO,
};

export async function POST(req: Request) {
  try {
    const { name, email, phone, source } = await req.json();

    if (!email || !name || !source) {
      return NextResponse.json(
        { error: "Faltan campos requeridos (name, email, source)" },
        { status: 400 }
      );
    }

    const listId = SOURCE_TO_LIST[source];
    if (!listId) {
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
      attributes: { SOURCE: source },
    });

    if (!success) {
      console.error(`[Brevo API Route] Failed to sync contact: ${email}`);
      return NextResponse.json(
        { error: "Error al sincronizar con Brevo" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: `Contacto sincronizado a lista: ${source}` },
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
