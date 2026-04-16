// src/app/api/equipos/[id]/editar/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isAdmin, isResponsable } from "@/lib/rbac";
import { isTaekwondoDisciplina, normalizeTaekwondoCinta } from "@/lib/taekwondo";

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
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    if (!isAdmin(scope) && !isResponsable(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    if (isResponsable(scope) && !scope.institucionId) {
      return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
    }

    const { id } = await params;
    const equipoId = Number(id);
    if (!Number.isInteger(equipoId)) {
      return NextResponse.json({ error: "equipo id inválido" }, { status: 400 });
    }

    const body = await req.json();
    const { nombreEquipo, participantes: participantesRaw, categoriaId, cintaTaekwondo } = body ?? {};

    if (!nombreEquipo || !String(nombreEquipo).trim()) {
      return NextResponse.json({ error: "nombreEquipo is required" }, { status: 400 });
    }

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
              tipo: true,
              disciplinaBaseId: true,
              disciplinaBase: { select: { nombre: true } },
              rama: true,
              deletedAt: true,
              minIntegrantes: true,
              maxIntegrantes: true,
            },
          },
          inscripciones: { select: { participanteId: true, id: true } },
        },
      });

      if (!equipo) throw { status: 404, message: "Equipo no encontrado" };

      if (isResponsable(scope) && Number(scope.institucionId) !== Number(equipo.institucionId)) {
        throw { status: 403, message: "No tienes permisos para editar equipos de otra institución" };
      }

      if (equipo.disciplina?.deletedAt) {
        throw { status: 409, message: "La disciplina de este equipo está inactiva" };
      }

      const esSoloApoyo =
        String(equipo.disciplina?.tipo ?? "").toUpperCase() === "COORDINACION_DEPORTIVA" ||
        String(equipo.disciplina?.disciplinaBase?.nombre ?? "").trim().toUpperCase() === "ADMINISTRATIVA";
      if (esSoloApoyo) {
        throw {
          status: 409,
          message: "Esta disciplina solo permite inscripción de personal de apoyo",
        };
      }

      const esTaekwondo = isTaekwondoDisciplina({
        disciplinaBaseId: equipo.disciplina?.disciplinaBaseId,
        disciplinaBaseNombre: equipo.disciplina?.disciplinaBase?.nombre,
      });
      const cintaTaekwondoNormalizada = normalizeTaekwondoCinta(cintaTaekwondo);
      if (esTaekwondo && !cintaTaekwondoNormalizada) {
        throw { status: 400, message: "cintaTaekwondo is required for Taekwondo" };
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

      const duplicateName = await tx.equipo.findFirst({
        where: {
          id: { not: equipoId },
          disciplinaId: Number(equipo.disciplinaId),
          institucionId: Number(equipo.institucionId),
          nombreEquipo: { equals: String(nombreEquipo).trim(), mode: "insensitive" },
          inscripciones: {
            some: {
              categoriaId: Number(categoriaId),
            },
          },
        },
        select: { id: true },
      });
      if (duplicateName) {
        throw { status: 409, message: "Ya existe otro equipo con ese nombre en esta disciplina y categoría" };
      }

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
        const foundIds = new Set(participantesValidos.map((p: any) => p.id));
        const missing = newParticipantIds.filter((id) => !foundIds.has(id));
        throw { status: 404, message: `Participante(s) ${missing.join(", ")} no encontrado(s)` };
      }

      const badInst = participantesValidos.filter(
        (p: any) => Number(p.institucionId) !== Number(equipo.institucionId)
      );
      if (badInst.length > 0) {
        throw {
          status: 409,
          message: `Algunos participantes no pertenecen a la institución ${equipo.institucionId}`,
        };
      }

      const esAtletismo = String(equipo.disciplina.nombre ?? "").trim().toUpperCase() === "ATLETISMO";
      // const validarEdad = String(equipo.disciplina.tipo) !== "ACADEMICA";
      if (equipo.disciplina.rama === "MIXTO" && esAtletismo) {
        const hombres = participantesValidos.filter((p: any) => p.genero === "MASCULINO").length;
        const mujeres = participantesValidos.filter((p: any) => p.genero === "FEMENINO").length;

        if (hombres !== 2 || mujeres !== 2) {
          throw {
            status: 409,
            message: "Atletismo mixto en equipo requiere exactamente 2 hombres y 2 mujeres",
          };
        }
      }

      for (const p of participantesValidos) {
        /*
        if (validarEdad) {
          const edad = calcularEdadEnFecha(new Date(p.fechaNacimiento), EVENT_START);
          if (edad >= 20) {
            throw { status: 409, message: `${p.nombres} tiene ${edad} anos (>=20)` };
          }
        }
        */

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

        const inscripcionesMismaDisciplina = await tx.inscripcion.findMany({
          where: {
            participanteId: p.id,
            disciplinaId: Number(equipo.disciplinaId),
            NOT: { equipoId },
          },
          select: { categoriaId: true },
        });

        const categoriasInscritas = new Set<number>(
          inscripcionesMismaDisciplina.map((inscripcion: any) => Number(inscripcion.categoriaId))
        );

        if (categoriasInscritas.size >= 2) {
          throw { status: 409, message: `Alumno ${p.nombres} ya esta inscrito en 2 categorias` };
        }

        const inscripcionesActuales = await tx.inscripcion.findMany({
          where: { participanteId: p.id },
          select: { disciplina: { select: { id: true, disciplinaBaseId: true, nombre: true } } },
        });

        const disciplinasSet = new Set<string | number>(
          inscripcionesActuales.map((i: any) => i.disciplina.disciplinaBaseId ?? i.disciplina.id)
        );
        disciplinasSet.add(equipo.disciplina.disciplinaBaseId ?? equipo.disciplina.id);
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
        currentInscripciones.map((i: any) => i.participanteId)
      );

      // Determinar qué eliminar y qué crear
      const toDelete = currentInscripciones
        .filter((i: any) => !newParticipantIds.includes(i.participanteId))
        .map((i: any) => i.id);

      const toCreate = newParticipantIds
        .filter((pid) => !currentParticipantIds.has(pid))
        .map((pid) => ({
          participanteId: pid,
          equipoId,
          disciplinaId: equipo.disciplinaId,
          categoriaId: Number(categoriaId),
          cintaTaekwondo: esTaekwondo ? cintaTaekwondoNormalizada : null,
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

      if (esTaekwondo) {
        await tx.inscripcion.updateMany({
          where: { equipoId },
          data: { cintaTaekwondo: cintaTaekwondoNormalizada },
        });
      }

      await tx.equipo.update({
        where: { id: equipoId },
        data: { nombreEquipo: String(nombreEquipo).trim() },
      });

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
