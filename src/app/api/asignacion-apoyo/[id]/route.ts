// src/app/api/asignacion-apoyo/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isResponsable } from "@/lib/rbac";

/**
 * DELETE /api/asignacion-apoyo/:id
 * Borra una asignación de apoyo por id
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id } = await params;
    const asignId = Number(id);
    if (!Number.isInteger(asignId)) {
      return NextResponse.json({ error: "asignacion id inválido" }, { status: 400 });
    }

    if (isResponsable(scope)) {
      if (!scope.institucionId) {
        return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
      }

      const asig = await prisma.asignacionApoyo.findUnique({
        where: { id: asignId },
        include: { personal: { select: { institucionId: true } } },
      });

      if (!asig) {
        return NextResponse.json({ error: "Asignación no encontrada" }, { status: 404 });
      }

      if (asig.personal.institucionId !== scope.institucionId) {
        return NextResponse.json({ error: "No autorizado para eliminar esta asignación" }, { status: 403 });
      }
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