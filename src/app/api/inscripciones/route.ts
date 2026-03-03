// app/api/inscripciones/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { participanteId, equipoId, esTitular } = body ?? {};
    if (!participanteId || !equipoId) {
      return NextResponse.json({ error: "participanteId and equipoId required" }, { status: 400 });
    }

    // transaction to ensure checks and create atomically
    const result = await prisma.$transaction(async (tx) => {
      const participante = await tx.participante.findUnique({ where: { id: Number(participanteId) } });
      if (!participante) throw { status: 404, message: "Participante no encontrado" };

      const equipo = await tx.equipo.findUnique({
        where: { id: Number(equipoId) },
        include: { disciplina: true },
      });
      if (!equipo) throw { status: 404, message: "Equipo no encontrado" };

      // check if participant already inscrito in same discipline
      const already = await tx.inscripcion.findFirst({
        where: {
          participanteId: Number(participanteId),
          disciplinaId: equipo.disciplinaId,
        },
      });
      if (already) throw { status: 409, message: "Participante ya inscrito en esta disciplina" };

      // team capacity check
      const count = await tx.inscripcion.count({ where: { equipoId: equipo.id } });
      if (count + 1 > equipo.disciplina.maxIntegrantes) {
        throw { status: 409, message: "Equipo ya alcanzó su máximo de integrantes" };
      }

      const created = await tx.inscripcion.create({
        data: {
          participanteId: Number(participanteId),
          equipoId: Number(equipoId),
          disciplinaId: equipo.disciplinaId,
          fechaRegistro: new Date(),
          esTitular: Boolean(esTitular ?? false),
        },
      });

      return created;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error(err);
    if (err?.status) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}