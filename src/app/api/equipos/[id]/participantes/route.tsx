// app/api/equipos/[id]/participantes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const equipoId = Number(id);
  if (!Number.isInteger(equipoId)) return NextResponse.json({ error: "invalid equipo id" }, { status: 400 });

  // Traemos inscripciones y el alumno relacionado
  const inscripciones = await prisma.inscripcion.findMany({
    where: { equipoId },
    include: {
      alumno: {
        select: { id: true, nombres: true, apellidoPaterno: true, apellidoMaterno: true, matricula: true },
      },
    },
  });

  // Convertir a un formato simple
  const participantes = inscripciones.map((i) => ({
    participanteId: i.alumno.id,
    nombreCompleto: `${i.alumno.apellidoPaterno} ${i.alumno.apellidoMaterno} ${i.alumno.nombres}`,
    matricula: i.alumno.matricula,
    esTitular: i.esTitular,
  }));

  return NextResponse.json(participantes);
}