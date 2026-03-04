// app/api/equipos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { disciplinaId, nombreEquipo, folioRegistro, institucionId } = body ?? {};

    if (!disciplinaId || !nombreEquipo) {
      return NextResponse.json({ error: "disciplinaId y nombreEquipo son requeridos" }, { status: 400 });
    }

    // validar disciplina
    const disciplina = await prisma.disciplina.findUnique({ where: { id: Number(disciplinaId) } });
    if (!disciplina) return NextResponse.json({ error: "Disciplina no encontrada" }, { status: 404 });

    // si se pasó institucionId, validar existencia
    if (institucionId != null) {
      const institucion = await prisma.institucion.findUnique({ where: { id: Number(institucionId) } });
      if (!institucion) return NextResponse.json({ error: "Institución no encontrada" }, { status: 404 });
    }

    const data: any = {
      disciplinaId: Number(disciplinaId),
      nombreEquipo: String(nombreEquipo),
      folioRegistro: folioRegistro ?? "",
      // no poner institucionId aquí si es undefined
    };
    if (institucionId != null) data.institucionId = Number(institucionId);

    const equipo = await prisma.equipo.create({ data });

    return NextResponse.json(equipo, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}