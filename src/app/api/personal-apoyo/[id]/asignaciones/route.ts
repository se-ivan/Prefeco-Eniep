import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isResponsable } from "@/lib/rbac";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id } = await params;
    const personalId = Number(id);

    if (!Number.isInteger(personalId)) {
      return NextResponse.json({ error: "ID de personal inválido" }, { status: 400 });
    }

    const personal = await prisma.personalApoyo.findUnique({
      where: { id: personalId },
      select: { institucionId: true },
    });

    if (!personal) {
      return NextResponse.json({ error: "Personal de apoyo no encontrado" }, { status: 404 });
    }

    if (isResponsable(scope)) {
      if (!scope.institucionId) {
        return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
      }
      if (personal.institucionId !== scope.institucionId) {
        return NextResponse.json({ error: "No autorizado" }, { status: 403 });
      }
    }

    const asignaciones = await prisma.asignacionApoyo.findMany({
      where: { personalId },
      select: {
        disciplina: {
          select: {
            id: true,
            nombre: true,
            rama: true,
            modalidad: true,
          },
        },
        categoria: {
          select: {
            id: true,
            nombre: true,
            disciplinaId: true,
          },
        },
      },
    });

    const disciplinasMap = new Map<
      number,
      {
        id: number;
        nombre: string;
        rama: "VARONIL" | "FEMENIL" | "UNICA" | "MIXTO";
        modalidad: "EQUIPO" | "INDIVIDUAL";
        categorias: { id: number; nombre: string; disciplinaId: number }[];
      }
    >();

    for (const asignacion of asignaciones) {
      if (!asignacion.disciplina) continue;
      const disciplinaId = asignacion.disciplina.id;

      if (!disciplinasMap.has(disciplinaId)) {
        disciplinasMap.set(disciplinaId, {
          id: disciplinaId,
          nombre: asignacion.disciplina.nombre,
          rama: asignacion.disciplina.rama,
          modalidad: asignacion.disciplina.modalidad,
          categorias: [],
        });
      }

      const disciplina = disciplinasMap.get(disciplinaId)!;
      if (
        asignacion.categoria &&
        !disciplina.categorias.some((c) => c.id === asignacion.categoria?.id)
      ) {
        disciplina.categorias.push({
          id: asignacion.categoria.id,
          nombre: asignacion.categoria.nombre,
          disciplinaId: asignacion.categoria.disciplinaId,
        });
      }
    }

    return NextResponse.json({ disciplinas: Array.from(disciplinasMap.values()) });
  } catch (error) {
    console.error("Error al obtener asignaciones de personal de apoyo:", error);
    return NextResponse.json({ error: "Error al obtener asignaciones" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id } = await params;
    const personalId = Number(id);

    if (!Number.isInteger(personalId)) {
      return NextResponse.json({ error: "ID de personal inválido" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { disciplinaId, categoriaId } = body ?? {};

    if (!disciplinaId || !categoriaId) {
      return NextResponse.json({ error: "Faltan disciplinaId o categoriaId" }, { status: 400 });
    }

    const personal = await prisma.personalApoyo.findUnique({ where: { id: personalId }, select: { institucionId: true } });
    if (!personal) return NextResponse.json({ error: "Personal de apoyo no encontrado" }, { status: 404 });

    if (isResponsable(scope)) {
      if (!scope.institucionId) return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
      if (personal.institucionId !== scope.institucionId) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const deleted = await prisma.asignacionApoyo.deleteMany({
      where: { personalId, disciplinaId: Number(disciplinaId), categoriaId: Number(categoriaId) },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Asignación no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar asignación:", error);
    return NextResponse.json({ error: "Error al eliminar asignación" }, { status: 500 });
  }
}
