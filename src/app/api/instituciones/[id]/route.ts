import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserScope, isAdmin } from "@/lib/rbac";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const scope = await getUserScope(req.headers);
    if (!isAdmin(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const idNum = parseInt(id, 10);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { cct, nombre, estado, zonaEscolar, urlLogo } = body;

    if (!cct || !nombre || !estado || !zonaEscolar) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (cct, nombre, estado, zonaEscolar)" },
        { status: 400 }
      );
    }

    const existente = await prisma.institucion.findFirst({
      where: {
        cct,
        NOT: { id: idNum },
      },
      select: { id: true },
    });

    if (existente) {
      return NextResponse.json(
        { error: "Ya existe una institución con esa CCT" },
        { status: 409 }
      );
    }

    const updated = await prisma.institucion.update({
      where: { id: idNum },
      data: {
        cct,
        nombre,
        estado,
        zonaEscolar,
        urlLogo: urlLogo || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Institución no encontrada" }, { status: 404 });
    }

    console.error("Error al actualizar institución:", error);
    return NextResponse.json(
      { error: "Error al actualizar institución" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const scope = await getUserScope(req.headers);
    if (!isAdmin(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const idNum = parseInt(id, 10);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.institucion.delete({ where: { id: idNum } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar institución:", error);
    return NextResponse.json(
      { error: "Error al eliminar institución" },
      { status: 500 }
    );
  }
}
