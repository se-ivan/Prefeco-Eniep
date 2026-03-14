// app/api/disciplinas/[id]/equipos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum)) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const disciplina = await prisma.disciplina.findFirst({
    where: { id: idNum, deletedAt: null },
    select: { id: true },
  });
  if (!disciplina) return NextResponse.json({ error: "Disciplina no encontrada" }, { status: 404 });

  const equipos = await prisma.equipo.findMany({
    where: { disciplinaId: idNum },
    select: { id: true, nombreEquipo: true, folioRegistro: true },
  });

  return NextResponse.json(equipos);
}