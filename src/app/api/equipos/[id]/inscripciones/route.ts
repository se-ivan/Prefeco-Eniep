// app/api/equipos/[id]/inscripciones/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const equipoId = Number(id);
  if (!Number.isInteger(equipoId)) return NextResponse.json({ error: "Invalid equipo id" }, { status: 400 });

  try {
    const body = await req.json();
      const { participantes: participantesRaw, categoriaId } = body ?? {};
    
      if (!Array.isArray(participantesRaw) || participantesRaw.length === 0) {
      return NextResponse.json({ error: "participants array is required" }, { status: 400 });
    }
    
      if (!categoriaId) {
        return NextResponse.json({ error: "categoriaId is required" }, { status: 400 });
      }

    // transaction: create many inscripciones only if all checks pass
    const created = await prisma.$transaction(async (tx: any) => {
      const equipo = await tx.equipo.findUnique({
        where: { id: equipoId },
        include: { disciplina: true },
      });
      if (!equipo) throw { status: 404, message: "Equipo no encontrado" };
      if (equipo.disciplina?.deletedAt) {
        throw { status: 409, message: "La disciplina de este equipo está inactiva" };
      }

      const categoria = await tx.categoria.findFirst({
        where: {
          id: Number(categoriaId),
          disciplinaId: Number(equipo.disciplinaId),
          deletedAt: null,
        },
        select: { id: true },
      });
      if (!categoria) {
        throw { status: 404, message: "Categoría no encontrada o inactiva" };
      }

      // count current inscripciones
      const existingCount = await tx.inscripcion.count({ where: { equipoId } });

      // dedupe participanteIds in payload
      const participantIds: number[] = Array.from(
        new Set(participantesRaw.map((p: any) => Number(p.participanteId)))
      );

      if (participantIds.length !== participantesRaw.length) {
        throw { status: 400, message: "El payload contiene participantes duplicados" };
      }

      // quick capacity check
        const maxIntegrantes = equipo.disciplina.maxIntegrantes ?? Infinity;
        if (existingCount + participantIds.length > maxIntegrantes) {
        throw { status: 409, message: "Capacidad del equipo excedida" };
      }

      // validate each participante
      for (const pid of participantIds) {
        const participante = await tx.participante.findUnique({
          where: { id: pid },
          select: { id: true, nombres: true },
        });
        if (!participante) throw { status: 404, message: "Participante no encontrado" };

        // check if already in same discipline and category
        const already = await tx.inscripcion.findFirst({
          where: {
            participanteId: pid,
            equipo: { disciplinaId: equipo.disciplinaId },
            categoriaId: Number(categoriaId),
          },
        });
        if (already) throw { status: 409, message: `${participante.nombres} ya esta inscrito en esta disciplina y categoria` };

        // check max disciplines limit using disciplinaBaseId
        const inscripcionesActuales = await tx.inscripcion.findMany({
          where: { participanteId: pid },
          select: { disciplina: { select: { id: true, disciplinaBaseId: true, nombre: true } } },
        });

        const disciplinasSet = new Set<string | number>(
          inscripcionesActuales.map((i: any) => i.disciplina.disciplinaBaseId ?? i.disciplina.id)
        );
        disciplinasSet.add(equipo.disciplina.disciplinaBaseId ?? equipo.disciplina.id);
        if (disciplinasSet.size > 2) {
          throw { status: 409, message: `${participante.nombres} excede el maximo de 2 disciplinas distintas` };
        }
      }

      // all validations passed -> create inscripciones
      const now = new Date();
      const data = participantIds.map((participanteId: number) => ({
        participanteId,
        equipoId: equipoId,
        disciplinaId: equipo.disciplinaId,
        categoriaId: Number(categoriaId),
        fechaRegistro: now,
      }));

      // createMany is faster; createMany returns count only
      await tx.inscripcion.createMany({ data });

      for (const pid of participantIds) {
        const p = await tx.participante.findUnique({ where: { id: pid } });
        if (p) {
          await tx.bitacora.create({
            data: {
              accion: "PARTICIPANTE_DISCIPLINA",
              descripcion: `Participante inscrito: ${p.nombres} a la disciplina ${equipo.disciplina.nombre}`,
              institucionId: p.institucionId,
            },
          });
        }
      }

      return { createdCount: data.length };
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error(err);
    if (err?.status) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}