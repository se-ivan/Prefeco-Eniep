// app/api/equipos/[id]/participantes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const equipoId = Number(id);
  if (!Number.isInteger(equipoId)) return NextResponse.json({ error: "invalid equipo id" }, { status: 400 });

  // Traemos inscripciones y el participante relacionado
  const inscripciones = await prisma.inscripcion.findMany({
    where: { equipoId },
    include: {
      participante: {
        select: { id: true, nombres: true, apellidoPaterno: true, apellidoMaterno: true, matricula: true },
      },
    },
  });

  // Convertir a un formato simple
  const participantes = inscripciones.map((i) => ({
    participanteId: i.participante.id,
    nombreCompleto: `${i.participante.apellidoPaterno} ${i.participante.apellidoMaterno} ${i.participante.nombres}`,
    matricula: i.participante.matricula,
    esTitular: i.esTitular,
  }));

  return NextResponse.json(participantes);
}