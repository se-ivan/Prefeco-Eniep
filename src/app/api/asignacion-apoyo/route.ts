// app/api/asignacion-apoyo/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isResponsable } from "@/lib/rbac";

export async function POST(req: Request) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    if (isResponsable(scope)) {
      return NextResponse.json({ error: "No tienes permiso para asignar" }, { status: 403 });
    }

    const body = await req.json();
    const { personalId, disciplinaId, categoriaId, rol } = body ?? {};

    if (!personalId) return NextResponse.json({ error: "personalId requerido" }, { status: 400 });
    if (!disciplinaId) return NextResponse.json({ error: "disciplinaId requerido" }, { status: 400 });
    if (!categoriaId) return NextResponse.json({ error: "categoriaId requerido" }, { status: 400 });

    // validar existencia de personal
    const personal = await prisma.personalApoyo.findUnique({ where: { id: Number(personalId) } });
    if (!personal) return NextResponse.json({ error: "personal no encontrado" }, { status: 404 });
    if (personal.estatus !== 'ACTIVO') {
      return NextResponse.json({ error: "El personal de apoyo no está activo" }, { status: 409 });
    }

    const disciplina = await prisma.disciplina.findFirst({
      where: { id: Number(disciplinaId), deletedAt: null },
      select: { id: true },
    });
    if (!disciplina) {
      return NextResponse.json({ error: "disciplina no encontrada" }, { status: 404 });
    }

    const categoria = await prisma.categoria.findFirst({
      where: {
        id: Number(categoriaId),
        disciplinaId: Number(disciplinaId),
        deletedAt: null,
      },
      select: { id: true },
    });
    if (!categoria) {
      return NextResponse.json({ error: "categoria no corresponde a la disciplina o no existe" }, { status: 404 });
    }

    if (isResponsable(scope)) {
      if (!scope.institucionId) {
        return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
      }
      if (personal.institucionId !== scope.institucionId) {
        return NextResponse.json({ error: "No autorizado para asignar personal de otra institución" }, { status: 403 });
      }
    }

    const asignacionExistente = await prisma.asignacionApoyo.findFirst({
      where: {
        personalId: Number(personalId),
        disciplinaId: Number(disciplinaId),
        categoriaId: Number(categoriaId),
      },
      select: { id: true },
    });
    if (asignacionExistente) {
      return NextResponse.json(
        { error: "El personal de apoyo ya está asignado a esta disciplina y categoría" },
        { status: 409 }
      );
    }

    const data: any = {
      personalId: Number(personalId),
      disciplinaId: Number(disciplinaId),
      categoriaId: Number(categoriaId),
    };
    if (rol != null) data.rol = String(rol);

    const asig = await prisma.asignacionApoyo.create({ data });

    return NextResponse.json(asig, { status: 201 });
  } catch (err) {
    console.error("POST /api/asignacion-apoyo error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}