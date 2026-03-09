// src/app/api/inscripciones/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isResponsable } from "@/lib/rbac";

/**
 * DELETE /api/inscripciones/:id
 * Borra una inscripción por id
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id } = await params;
    const insId = Number(id);
    if (!Number.isInteger(insId)) {
      return NextResponse.json({ error: "inscripcion id inválido" }, { status: 400 });
    }

    if (isResponsable(scope)) {
      if (!scope.institucionId) {
        return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
      }

      const ins = await prisma.inscripcion.findUnique({
        where: { id: insId },
        include: { participante: { select: { institucionId: true } } },
      });

      if (!ins) {
        return NextResponse.json({ error: "Inscripción no encontrada" }, { status: 404 });
      }

      if (ins.participante.institucionId !== scope.institucionId) {
        return NextResponse.json({ error: "No autorizado para eliminar esta inscripción" }, { status: 403 });
      }
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