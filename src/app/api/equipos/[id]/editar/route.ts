// src/app/api/equipos/[id]/editar/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function calcularEdadEnFecha(fechaNacimiento: Date, referencia: Date) {
  let edad = referencia.getFullYear() - fechaNacimiento.getFullYear();
  const m = referencia.getMonth() - fechaNacimiento.getMonth();
  if (m < 0 || (m === 0 && referencia.getDate() < fechaNacimiento.getDate())) edad--;
  return edad;
}

const EVENT_START = process.env.EVENT_START_DATE
  ? new Date(process.env.EVENT_START_DATE)
  : new Date();

/**
 * PUT /api/equipos/:id/editar
 * Actualiza los miembros del equipo con validaciones de mín/máx integrantes
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const equipoId = Number(id);
    if (!Number.isInteger(equipoId)) {
      return NextResponse.json({ error: "equipo id inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { participantes: participantesRaw, categoriaId } = body ?? {};

    if (!Array.isArray(participantesRaw)) {
      return NextResponse.json({ error: "participantes array is required" }, { status: 400 });
    }

    if (!categoriaId) {
      return NextResponse.json({ error: "categoriaId is required" }, { status: 400 });
    }

    const participantIdsRaw: number[] = participantesRaw.map((p: any) => Number(p.participanteId));
    const uniqueParticipantIds = Array.from(new Set(participantIdsRaw));
    if (uniqueParticipantIds.length !== participantIdsRaw.length) {
      return NextResponse.json({ error: "IDs de participantes duplicados en el payload" }, { status: 400 });
    }

    const created = await prisma.$transaction(async (tx: any) => {
      // Obtener equipo y disciplina
      const equipo = await tx.equipo.findUnique({
        where: { id: equipoId },
        include: {
          disciplina: {
            select: {
              id: true,
              nombre: true,
              rama: true,
              minIntegrantes: true,
              maxIntegrantes: true,
            },
          },
          inscripciones: { select: { participanteId: true, id: true } },
        },
      });

      if (!equipo) throw { status: 404, message: "Equipo no encontrado" };

      // Deduplicar participantesIds
      const newParticipantIds = uniqueParticipantIds;

      // Validar límites
      const minIntegrantes = equipo.disciplina.minIntegrantes ?? 0;
      const maxIntegrantes = equipo.disciplina.maxIntegrantes ?? Infinity;

      if (newParticipantIds.length < minIntegrantes) {
        throw {
          status: 409,
          message: `El equipo debe tener al menos ${minIntegrantes} integrante(s)`,
        };
      }

      if (newParticipantIds.length > maxIntegrantes) {
        throw {
          status: 409,
          message: `El equipo no puede exceder ${maxIntegrantes} integrante(s)`,
        };
      }

      // Validaciones de participantes equivalentes al flujo de alta de equipo
      const participantesValidos = await tx.participante.findMany({
        where: { id: { in: newParticipantIds } },
        select: {
          id: true,
          nombres: true,
          institucionId: true,
          fechaNacimiento: true,
          genero: true,
        },
      });

      if (participantesValidos.length !== newParticipantIds.length) {
        const foundIds = new Set(participantesValidos.map((p) => p.id));
        const missing = newParticipantIds.filter((id) => !foundIds.has(id));
        throw { status: 404, message: `Participante(s) ${missing.join(", ")} no encontrado(s)` };
      }

      const badInst = participantesValidos.filter(
        (p) => Number(p.institucionId) !== Number(equipo.institucionId)
      );
      if (badInst.length > 0) {
        throw {
          status: 409,
          message: `Algunos participantes no pertenecen a la institución ${equipo.institucionId}`,
        };
      }

      for (const p of participantesValidos) {
        const edad = calcularEdadEnFecha(new Date(p.fechaNacimiento), EVENT_START);
        if (edad >= 20) {
          throw { status: 409, message: `${p.nombres} tiene ${edad} anos (>=20)` };
        }

        if (equipo.disciplina.rama !== "MIXTO" && equipo.disciplina.rama !== "UNICA") {
          if (equipo.disciplina.rama === "VARONIL" && p.genero !== "MASCULINO") {
            throw { status: 409, message: "Uno o mas participantes no cumple la rama VARONIL" };
          }
          if (equipo.disciplina.rama === "FEMENIL" && p.genero !== "FEMENINO") {
            throw { status: 409, message: "Uno o mas participantes no cumple la rama FEMENIL" };
          }
        }

        const alreadyInDisciplineOtherTeam = await tx.inscripcion.findFirst({
          where: {
            participanteId: p.id,
            disciplinaId: Number(equipo.disciplinaId),
            categoriaId: Number(categoriaId),
            NOT: { equipoId },
          },
        });
        if (alreadyInDisciplineOtherTeam) {
          throw {
            status: 409,
            message: `${p.nombres} ya esta inscrito en esta disciplina y categoria`,
          };
        }

        const inscripcionesActuales = await tx.inscripcion.findMany({
          where: { participanteId: p.id },
          select: { disciplina: { select: { nombre: true } } },
        });

        const disciplinasSet = new Set<string>(
          inscripcionesActuales.map((i) => i.disciplina.nombre)
        );
        disciplinasSet.add(equipo.disciplina.nombre);
        if (disciplinasSet.size > 2) {
          throw {
            status: 409,
            message: `${p.nombres} excede el maximo de 2 disciplinas distintas`,
          };
        }
      }

      // Obtener inscripciones actuales
      const currentInscripciones = equipo.inscripciones;
      const currentParticipantIds = new Set(
        currentInscripciones.map((i) => i.participanteId)
      );

      // Determinar qué eliminar y qué crear
      const toDelete = currentInscripciones
        .filter((i) => !newParticipantIds.includes(i.participanteId))
        .map((i) => i.id);

      const toCreate = newParticipantIds
        .filter((pid) => !currentParticipantIds.has(pid))
        .map((pid) => ({
          participanteId: pid,
          equipoId,
          disciplinaId: equipo.disciplinaId,
          categoriaId: Number(categoriaId),
          fechaRegistro: new Date(),
        }));

      // Ejecutar cambios
      if (toDelete.length > 0) {
        await tx.inscripcion.deleteMany({
          where: { id: { in: toDelete } },
        });
      }

      if (toCreate.length > 0) {
        await tx.inscripcion.createMany({ data: toCreate });
      }

      return {
        message: "Equipo actualizado",
        deleted: toDelete.length,
        created: toCreate.length,
        total: newParticipantIds.length,
      };
    });

    return NextResponse.json(created);
  } catch (err: any) {
    console.error("PUT /api/equipos/:id/editar error:", err);
    if (err?.status) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
