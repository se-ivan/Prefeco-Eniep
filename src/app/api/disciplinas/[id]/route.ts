// src/app/api/disciplinas/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Devuelve detalle de una disciplina, incluyendo sus categorías.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const did = Number(id);
    if (!Number.isInteger(did)) return NextResponse.json({ error: "id inválido" }, { status: 400 });

    const d = await prisma.disciplina.findUnique({
      where: { id: did },
      include: {
        categorias: { orderBy: { nombre: "asc" } },
      },
    });

    if (!d) return NextResponse.json({ error: "Disciplina no encontrada" }, { status: 404 });

    return NextResponse.json(d);
  } catch (err) {
    console.error("GET /api/disciplinas/:id error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}