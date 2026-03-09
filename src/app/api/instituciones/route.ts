import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserScope, isAdmin, isResponsable } from "@/lib/rbac";

// GET  /api/instituciones  → lista todas las instituciones
export async function GET(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    if (isResponsable(scope) && scope.institucionId) {
      const institucion = await prisma.institucion.findUnique({
        where: { id: scope.institucionId },
      });
      return NextResponse.json(institucion ? [institucion] : []);
    }

    const instituciones = await prisma.institucion.findMany({
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(instituciones);
  } catch (error) {
    console.error("Error al obtener instituciones:", error);
    return NextResponse.json(
      { error: "Error al obtener instituciones" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!isAdmin(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { cct, nombre, estado, zonaEscolar, urlLogo } = body;

    if (!cct || !nombre || !estado || !zonaEscolar) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (cct, nombre, estado, zona_escolar)" },
        { status: 400 }
      );
    }

    const existe = await prisma.institucion.findUnique({ where: { cct } });
    if (existe) {
      return NextResponse.json(
        { error: "Ya existe una institución con esa CCT" },
        { status: 409 }
      );
    }

    const institucion = await prisma.institucion.create({
      data: {
        cct,
        nombre,
        estado,
        zonaEscolar,
        urlLogo: urlLogo || null,
      },
    });

    return NextResponse.json(institucion, { status: 201 });
  } catch (error) {
    console.error("Error al crear institución:", error);
    return NextResponse.json(
      { error: "Error al crear institución" },
      { status: 500 }
    );
  }
}
