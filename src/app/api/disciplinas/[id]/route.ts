// src/app/api/disciplinas/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from '@/lib/rateLimit';

/**
 * GET /api/disciplinas/:id
 * Devuelve detalle de una disciplina, incluyendo sus categorías.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    
      if (!rateLimit(ip, 140, 60 * 1000)) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes. Intenta más tarde." },
          { status: 429 }
        );
      }
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