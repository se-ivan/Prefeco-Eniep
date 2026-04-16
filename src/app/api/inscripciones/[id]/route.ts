// src/app/api/inscripciones/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isAdmin, isResponsable } from "@/lib/rbac";
import { isTaekwondoDisciplina, normalizeTaekwondoCinta } from "@/lib/taekwondo";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    if (!isAdmin(scope) && !isResponsable(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const insId = Number(id);
    if (!Number.isInteger(insId)) {
      return NextResponse.json({ error: "inscripcion id inválido" }, { status: 400 });
    }

    const body = await req.json();
    const cintaTaekwondo = normalizeTaekwondoCinta(body?.cintaTaekwondo);

    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id: insId },
      include: {
        participante: { select: { institucionId: true } },
        disciplina: {
          select: {
            disciplinaBaseId: true,
            disciplinaBase: { select: { nombre: true } },
          },
        },
      },
    });

    if (!inscripcion) {
      return NextResponse.json({ error: "Inscripción no encontrada" }, { status: 404 });
    }

    if (isResponsable(scope)) {
      if (!scope.institucionId || inscripcion.participante.institucionId !== scope.institucionId) {
        return NextResponse.json({ error: "No autorizado para editar esta inscripción" }, { status: 403 });
      }
    }

    const esTaekwondo = isTaekwondoDisciplina({
      disciplinaBaseId: inscripcion.disciplina.disciplinaBaseId,
      disciplinaBaseNombre: inscripcion.disciplina.disciplinaBase?.nombre,
    });
    if (!esTaekwondo) {
      return NextResponse.json({ error: "Solo aplica para inscripciones de Taekwondo" }, { status: 400 });
    }
    if (!cintaTaekwondo) {
      return NextResponse.json({ error: "cintaTaekwondo es requerida" }, { status: 400 });
    }

    const updated = await prisma.inscripcion.update({
      where: { id: insId },
      data: { cintaTaekwondo },
      select: { id: true, cintaTaekwondo: true },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PATCH /api/inscripciones/:id error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

/**
 * DELETE /api/inscripciones/:id
 * Borra una inscripción por id
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    if (!isAdmin(scope) && !isResponsable(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

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