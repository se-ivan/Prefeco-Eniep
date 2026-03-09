// src/app/api/equipos/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from '@/lib/rateLimit';

/**
 * DELETE /api/equipos/:id
 * Borra todas las inscripciones del equipo y luego el equipo (transactional)
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    
      if (!rateLimit(ip, 40, 60 * 1000)) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes. Intenta más tarde." },
          { status: 429 }
        );
      }
  try {
    const { id } = await params;
    const equipoId = Number(id);
    if (!Number.isInteger(equipoId)) {
      return NextResponse.json({ error: "equipo id inválido" }, { status: 400 });
    }

    // transacción: borrar inscripciones (si existen) y el equipo
    const res = await prisma.$transaction(async (tx) => {
      // opcional: obtener conteo o comprobación antes de borrar
      await tx.inscripcion.deleteMany({ where: { equipoId } });
      const deleted = await tx.equipo.delete({ where: { id: equipoId } });
      return deleted;
    });

    return NextResponse.json({ message: "Equipo eliminado", equipo: res });
  } catch (err: any) {
    console.error("DELETE /api/equipos/:id error:", err);
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Equipo no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}