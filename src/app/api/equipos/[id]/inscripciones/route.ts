// app/api/equipos/[id]/inscripciones/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const equipoId = Number(id);
  if (!Number.isInteger(equipoId)) return NextResponse.json({ error: "Invalid equipo id" }, { status: 400 });

  try {
    const body = await req.json();
    const participantesRaw = Array.isArray(body?.participantes) ? body.participantes : null;
    if (!participantesRaw || participantesRaw.length === 0) {
      return NextResponse.json({ error: "participants array is required" }, { status: 400 });
    }

    // transaction: create many inscripciones only if all checks pass
    const created = await prisma.$transaction(async (tx) => {
      const equipo = await tx.equipo.findUnique({
        where: { id: equipoId },
        include: { disciplina: true },
      });
      if (!equipo) throw { status: 404, message: "Equipo no encontrado" };

      // count current inscripciones
      const existingCount = await tx.inscripcion.count({ where: { equipoId } });

      // dedupe participanteIds in payload
      const participantIds: number[] = Array.from(
        new Set(participantesRaw.map((p: any) => Number(p.participanteId)))
      );

      // quick capacity check
      if (existingCount + participantIds.length > equipo.disciplina.maxIntegrantes) {
        throw { status: 409, message: "Capacidad del equipo excedida" };
      }

      // validate each participante
      for (const pid of participantIds) {
        const alumno = await tx.alumno.findUnique({ where: { id: pid } });
        if (!alumno) throw { status: 404, message: `Participante ${pid} no encontrado` };

        // check if already in same discipline
        const already = await tx.inscripcion.findFirst({
          where: {
            alumnoId: pid,
            equipo: { disciplinaId: equipo.disciplinaId },
          },
        });
        if (already) throw { status: 409, message: `Participante ${pid} ya inscrito en la disciplina` };
      }

      // all validations passed -> create inscripciones
      const now = new Date();
      const data = participantesRaw.map((p: any) => ({
        alumnoId: Number(p.participanteId),
        equipoId: equipoId,
        disciplinaId: equipo.disciplinaId,
        fechaRegistro: now,
        esTitular: Boolean(p.esTitular ?? false),
      }));

      // createMany is faster; createMany returns count only
      await tx.inscripcion.createMany({ data });

      return { createdCount: data.length };
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error(err);
    if (err?.status) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}