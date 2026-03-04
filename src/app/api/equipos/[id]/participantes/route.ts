import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const equipoId = Number(id);

    if (!Number.isInteger(equipoId)) {
      return NextResponse.json({ error: "Invalid equipo id" }, { status: 400 });
    }

    const equipo = await prisma.equipo.findUnique({
      where: { id: equipoId },
      select: {
        id: true,
        inscripciones: {
          orderBy: { id: "asc" },
          select: {
            participanteId: true,
            esTitular: true,
            participante: {
              select: {
                nombres: true,
                apellidoPaterno: true,
                apellidoMaterno: true,
                matricula: true,
              },
            },
          },
        },
      },
    });

    if (!equipo) {
      return NextResponse.json({ error: "Equipo no encontrado" }, { status: 404 });
    }

    const participantes = equipo.inscripciones.map((ins) => ({
      participanteId: ins.participanteId,
      nombreCompleto: `${ins.participante.apellidoPaterno} ${ins.participante.apellidoMaterno} ${ins.participante.nombres}`,
      matricula: ins.participante.matricula,
      esTitular: ins.esTitular,
    }));

    return NextResponse.json(participantes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
