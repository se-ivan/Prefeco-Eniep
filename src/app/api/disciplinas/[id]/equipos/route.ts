// app/api/disciplinas/[id]/equipos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum)) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const equipos = await prisma.equipo.findMany({
    where: { disciplinaId: idNum },
    select: { id: true, nombreEquipo: true, folioRegistro: true },
  });

  return NextResponse.json(equipos);
}