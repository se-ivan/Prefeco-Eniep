// src/app/api/equipos/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isAdmin, isResponsable } from "@/lib/rbac";

/**
 * DELETE /api/equipos/:id
 * Borra todas las inscripciones del equipo y luego el equipo (transactional)
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    if (!isAdmin(scope) && !isResponsable(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const equipoId = Number(id);
    if (!Number.isInteger(equipoId)) {
      return NextResponse.json({ error: "equipo id inválido" }, { status: 400 });
    }

    if (isResponsable(scope)) {
      if (!scope.institucionId) {
        return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
      }

      const equipo = await prisma.equipo.findUnique({ where: { id: equipoId }, select: { institucionId: true } });
      if (!equipo) {
        return NextResponse.json({ error: "Equipo no encontrado" }, { status: 404 });
      }

      if (equipo.institucionId !== scope.institucionId) {
        return NextResponse.json({ error: "No autorizado para eliminar este equipo" }, { status: 403 });
      }
    }

    // transacción: borrar inscripciones (si existen) y el equipo
    const res = await prisma.$transaction(async (tx: any) => {
      // opcional: obtener conteo o comprobación antes de borrar
      await tx.inscripcion.deleteMany({ where: { equipoId } });
      const deleted = await tx.equipo.delete({ where: { id: equipoId } });
      return deleted;
    });

    return NextResponse.json({ message: "Equipo eliminado", equipo: res });
  } catch (err: any) {
    console.error("DELETE /api/equipos/:id error:", err);
    if (err?.code === "P2025") {
      // Prisma: record not found for deletion
      return NextResponse.json({ error: "Equipo no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}