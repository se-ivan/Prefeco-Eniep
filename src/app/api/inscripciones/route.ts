// app/api/inscripciones/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isResponsable } from "@/lib/rbac";

function calcularEdadEnFecha(fechaNacimiento: Date, referencia: Date) {
  let edad = referencia.getFullYear() - fechaNacimiento.getFullYear();
  const m = referencia.getMonth() - fechaNacimiento.getMonth();
  if (m < 0 || (m === 0 && referencia.getDate() < fechaNacimiento.getDate())) edad--;
  return edad;
}

const EVENT_START = process.env.EVENT_START_DATE ? new Date(process.env.EVENT_START_DATE) : new Date();

export async function POST(req: Request) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const body = await req.json();

    const {
      disciplinaId,
      modalidad,
      nombreEquipo,
      institucionId: bodyInstitucionId,
      categoriaId,
      personalIds,
      participantes,
    } = body ?? {};

    if (isResponsable(scope) && !scope.institucionId) {
      return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
    }

    const institucionId = isResponsable(scope) ? scope.institucionId : bodyInstitucionId;

    if (!disciplinaId) return NextResponse.json({ error: "disciplinaId requerido" }, { status: 400 });
    if (!categoriaId) return NextResponse.json({ error: "categoriaId requerido" }, { status: 400 });
    if (!modalidad || (modalidad !== "EQUIPO" && modalidad !== "INDIVIDUAL")) {
      return NextResponse.json({ error: "modalidad inválida (EQUIPO|INDIVIDUAL)" }, { status: 400 });
    }
    if (!Array.isArray(participantes) || participantes.length === 0) {
      return NextResponse.json({ error: "lista de participantes requerida" }, { status: 400 });
    }
    if (!Array.isArray(personalIds)) {
      return NextResponse.json({ error: "personalIds debe ser un array (incluir al menos [])" }, { status: 400 });
    }

    const participantIdsRaw: number[] = participantes.map((p: any) => Number(p.participanteId));
    const uniqueParticipantIds = Array.from(new Set(participantIdsRaw));
    if (uniqueParticipantIds.length !== participantIdsRaw.length) {
      return NextResponse.json({ error: "IDs de participantes duplicados en el payload" }, { status: 400 });
    }

    const res = await prisma.$transaction(async (tx: any) => {
      const disciplina = await tx.disciplina.findUnique({
        where: { id: Number(disciplinaId) },
        include: { categorias: true },
      });
      if (!disciplina) throw { status: 404, message: "Disciplina no encontrada" };

      // minPersonalApoyo not present in schema => default 0. // CHANGED
      const minPersonal = 0;
      if ((personalIds?.length ?? 0) < minPersonal) {
        throw { status: 409, message: `Se requieren al menos ${minPersonal} personal(es) de apoyo` };
      }

      // verify personals if provided
      if (personalIds && personalIds.length > 0) {
        const personals = await tx.personalApoyo.findMany({
          where: { id: { in: personalIds.map(Number) } },
          select: { id: true },
        });
        if (personals.length !== personalIds.length) {
          throw { status: 404, message: "Alguno(s) de los personalIds no existe(n)" };
        }
      }

      const modalidadReal = disciplina.modalidad as "EQUIPO" | "INDIVIDUAL";

      if (modalidadReal === "EQUIPO") {
        if (!nombreEquipo || !String(nombreEquipo).trim()) {
          throw { status: 400, message: "Nombre del equipo es obligatorio para modalidad EQUIPO" };
        }
        if (!institucionId) {
          throw { status: 400, message: "institucionId es obligatorio para modalidad EQUIPO" };
        }

        const minI = disciplina.minIntegrantes ?? 0;
        const maxI = disciplina.maxIntegrantes ?? Infinity;
        const total = uniqueParticipantIds.length;
        if (total < minI) throw { status: 409, message: `Faltan participantes: mínimo ${minI}` };
        if (total > maxI) throw { status: 409, message: `Excede el máximo de integrantes (${maxI})` };

        // validate participants exist & belong to same institucion
        const fetchedParts = await tx.participante.findMany({
          where: { id: { in: uniqueParticipantIds } },
          select: { id: true, nombres: true, institucionId: true, fechaNacimiento: true, genero: true },
        });
        if (fetchedParts.length !== uniqueParticipantIds.length) {
          const foundIds = new Set(fetchedParts.map(p => p.id));
          const missing = uniqueParticipantIds.filter((id) => !foundIds.has(id));
          throw { status: 404, message: `Participante(s) ${missing.join(", ")} no encontrado(s)` };
        }

        const badInst = fetchedParts.filter(p => Number(p.institucionId) !== Number(institucionId));
        if (badInst.length > 0) {
          throw { status: 409, message: `Algunos participantes no pertenecen a la institución ${institucionId}` };
        }

        for (const p of fetchedParts) {
          const edad = calcularEdadEnFecha(new Date(p.fechaNacimiento), EVENT_START);
          if (edad >= 20) throw { status: 409, message: `${p.nombres} tiene ${edad} anos (>=20)` };

          if (disciplina.rama !== "MIXTO" && disciplina.rama !== "UNICA") {
            if (disciplina.rama === "VARONIL" && p.genero !== "MASCULINO") {
              throw { status: 409, message: `Uno o mas participantes no cumple la rama VARONIL` };
            }
            if (disciplina.rama === "FEMENIL" && p.genero !== "FEMENINO") {
              throw { status: 409, message: `Uno o mas participantes no cumple la rama FEMENIL` };
            }
          }

          const already = await tx.inscripcion.findFirst({
            where: {
              participanteId: p.id,
              disciplinaId: Number(disciplinaId),
              categoriaId: Number(categoriaId),
            },
          });
          if (already) throw { status: 409, message: `${p.nombres} ya esta inscrito en esta disciplina y categoria` };

          const inscripcionesActuales = await tx.inscripcion.findMany({
            where: { participanteId: p.id },
            select: { disciplina: { select: { nombre: true } } },
          });
          const disciplinasSet = new Set<string>(inscripcionesActuales.map(i => i.disciplina.nombre));
          disciplinasSet.add(disciplina.nombre);
          if (disciplinasSet.size > 2) {
            throw { status: 409, message: `${p.nombres} excede el maximo de 2 disciplinas distintas` };
          }
        }

        const equipo = await tx.equipo.create({
          data: {
            disciplinaId: Number(disciplinaId),
            institucionId: Number(institucionId),
            nombreEquipo: String(nombreEquipo),
            folioRegistro: "",
          },
        });

        const now = new Date();
        const insData = participantes.map(p => ({
          participanteId: Number(p.participanteId),
          equipoId: equipo.id,
          disciplinaId: Number(disciplinaId),
          categoriaId: Number(categoriaId),
          fechaRegistro: new Date(),
        }));

        await tx.inscripcion.createMany({ data: insData });

        if (personalIds && personalIds.length > 0) {
          for (const pid of personalIds) {
            await tx.asignacionApoyo.create({
              data: {
                personalId: Number(pid),
                disciplinaId: Number(disciplinaId),
                categoriaId: Number(categoriaId),
                // rol left undefined unless provided in request payload; no equipoId (not in schema). // CHANGED
              },
            });
          }
        }

        return { message: "Equipo e inscripciones creadas", equipoId: equipo.id, created: insData.length };
      }

      // INDIVIDUAL
      if (modalidadReal === "INDIVIDUAL") {
        if (!institucionId) throw { status: 400, message: "institucionId es obligatorio para modalidad INDIVIDUAL" };

        const maxPorEsc = disciplina.maxParticipantesPorEscuela ?? 1;
        const existentesPorInst = await tx.inscripcion.count({
          where: {
            disciplinaId: Number(disciplinaId),
            participante: { institucionId: Number(institucionId) },
          },
        });

        const fetchedParts = await tx.participante.findMany({
          where: { id: { in: uniqueParticipantIds } },
          select: { id: true, nombres: true, institucionId: true, fechaNacimiento: true, genero: true },
        });
        if (fetchedParts.length !== uniqueParticipantIds.length) {
          const foundIds = new Set(fetchedParts.map(p => p.id));
          const missing = uniqueParticipantIds.filter((id) => !foundIds.has(id));
          throw { status: 404, message: `Participante(s) ${missing.join(", ")} no encontrado(s)` };
        }

        let nuevosPorInst = 0;
        for (const p of fetchedParts) {
          // Verificar si ya existe alguna inscripción en esta disciplina (cualquier categoría)
          const yaInscritoEnDisciplina = await tx.inscripcion.findFirst({
            where: {
              participanteId: p.id,
              disciplinaId: Number(disciplinaId),
            },
          });

          // Solo contar como nuevo si no tiene inscripción previa en esta disciplina Y es de esta institución
          if (!yaInscritoEnDisciplina && Number(p.institucionId) === Number(institucionId)) {
            nuevosPorInst++;
          }

          const edad = calcularEdadEnFecha(new Date(p.fechaNacimiento), EVENT_START);
          if (edad >= 20) throw { status: 409, message: `${p.nombres} tiene ${edad} anos (>=20)` };

          if (disciplina.rama !== "MIXTO" && disciplina.rama !== "UNICA") {
            if (disciplina.rama === "VARONIL" && p.genero !== "MASCULINO") {
              throw { status: 409, message: `${p.nombres} no cumple la rama VARONIL` };
            }
            if (disciplina.rama === "FEMENIL" && p.genero !== "FEMENINO") {
              throw { status: 409, message: `${p.nombres} no cumple la rama FEMENIL` };
            }
          }

          const already = await tx.inscripcion.findFirst({
            where: {
              participanteId: p.id,
              disciplinaId: Number(disciplinaId),
              categoriaId: Number(categoriaId),
            },
          });
          if (already) throw { status: 409, message: `${p.nombres} ya esta inscrito en esta disciplina y categoria` };

          const inscripcionesActuales = await tx.inscripcion.findMany({
            where: { participanteId: p.id },
            select: { disciplina: { select: { nombre: true } } },
          });
          const disciplinasSet = new Set<string>(inscripcionesActuales.map(i => i.disciplina.nombre));
          disciplinasSet.add(disciplina.nombre);
          if (disciplinasSet.size > 2) {
            throw { status: 409, message: `${p.nombres} excede el maximo de 2 disciplinas distintas` };
          }
        }

        if (existentesPorInst + nuevosPorInst > maxPorEsc) {
          throw { status: 409, message: `La institución excede el máximo por escuela (${maxPorEsc}) para esta disciplina` };
        }

        const now = new Date();
        const insData = fetchedParts.map(p => ({
          participanteId: p.id,
          disciplinaId: Number(disciplinaId),
          categoriaId: Number(categoriaId),
          fechaRegistro: new Date(),
        }));

        await tx.inscripcion.createMany({ data: insData });

        if (personalIds && personalIds.length > 0) {
          for (const pid of personalIds) {
            await tx.asignacionApoyo.create({
              data: {
                personalId: Number(pid),
                disciplinaId: Number(disciplinaId),
                categoriaId: Number(categoriaId),
              },
            });
          }
        }

        return { message: "Inscripciones individuales creadas", created: insData.length };
      }

      throw { status: 400, message: "modalidad no soportada" };
    });

    return NextResponse.json(res, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/inscripciones error:", err);
    if (err?.status) {
      const response = { error: err.message };
      console.log("Devolviendo error response al frontend:", JSON.stringify(response), "status:", err.status);
      return NextResponse.json(response, { status: err.status });
    }
    console.log("Devolviendo error genérico (500):", { error: "Error interno del servidor" });
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}