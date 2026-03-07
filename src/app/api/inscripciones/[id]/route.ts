// src/app/api/inscripciones/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/inscripciones/:id
 * Borra una inscripción por id
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const insId = Number(id);
    if (!Number.isInteger(insId)) {
      return NextResponse.json({ error: "inscripcion id inválido" }, { status: 400 });
    }

    const deleted = await prisma.inscripcion.delete({ where: { id: insId } });
    return NextResponse.json({ message: "Inscripción eliminada", inscripcion: { id: deleted.id } });
  } catch (err: any) {
    console.error("DELETE /api/inscripciones/:id error:", err);
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Inscripción no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}