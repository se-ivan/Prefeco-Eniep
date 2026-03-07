// src/app/api/asignacion-apoyo/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/asignacion-apoyo/:id
 * Borra una asignación de apoyo por id
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const asignId = Number(id);
    if (!Number.isInteger(asignId)) {
      return NextResponse.json({ error: "asignacion id inválido" }, { status: 400 });
    }

    const deleted = await prisma.asignacionApoyo.delete({ where: { id: asignId } });
    return NextResponse.json({ message: "Asignación eliminada", id: deleted.id });
  } catch (err: any) {
    console.error("DELETE /api/asignacion-apoyo/:id error:", err);
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Asignación no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}