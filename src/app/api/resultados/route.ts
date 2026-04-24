import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isAdmin } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const resultados = await prisma.resultado.findMany({
      include: {
        institucion: { select: { id: true, nombre: true, cct: true } },
        disciplina: { select: { id: true, nombre: true, rama: true } },
        categoria: { select: { id: true, nombre: true } },
      },
      orderBy: { fechaRegistro: "desc" },
    });

    return NextResponse.json(resultados);
  } catch (error: any) {
    console.error("GET /api/resultados error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!isAdmin(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { disciplinaId, categoriaId, institucionId, lugar } = body ?? {};

    if (!disciplinaId || !categoriaId || !institucionId || !lugar) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    if (![1, 2, 3].includes(Number(lugar))) {
      return NextResponse.json({ error: "Lugar inválido. Debe ser 1, 2 o 3" }, { status: 400 });
    }

    // Upsert to handle unique constraint (disciplinaId, categoriaId, lugar)
    const resultado = await prisma.resultado.upsert({
      where: {
        disciplinaId_categoriaId_lugar: {
          disciplinaId: Number(disciplinaId),
          categoriaId: Number(categoriaId),
          lugar: Number(lugar),
        },
      },
      update: {
        institucionId: Number(institucionId),
      },
      create: {
        disciplinaId: Number(disciplinaId),
        categoriaId: Number(categoriaId),
        institucionId: Number(institucionId),
        lugar: Number(lugar),
      },
      include: {
        institucion: { select: { id: true, nombre: true, cct: true } },
        disciplina: { select: { id: true, nombre: true } },
        categoria: { select: { id: true, nombre: true } },
      },
    });

    return NextResponse.json(resultado, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/resultados error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
