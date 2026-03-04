// app/api/equipos-with-inscripciones/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      disciplinaId,
      nombreEquipo,
      folioRegistro,
      institucionId,
      participantes,
    } = body ?? {};

    // ===== VALIDACIONES BÁSICAS =====
    if (!disciplinaId || !nombreEquipo || !institucionId) {
      return NextResponse.json(
        { error: "disciplinaId, nombreEquipo e institucionId son obligatorios" },
        { status: 400 }
      );
    }

    if (!Array.isArray(participantes) || participantes.length === 0) {
      return NextResponse.json(
        { error: "El arreglo de participantes es obligatorio" },
        { status: 400 }
      );
    }

    const res = await prisma.$transaction(async (tx) => {
      // ===== VALIDAR DISCIPLINA =====
      const disciplina = await tx.disciplina.findUnique({
        where: { id: Number(disciplinaId) },
      });

      if (!disciplina) {
        throw { status: 404, message: "Disciplina no encontrada" };
      }

      // ===== VALIDAR INSTITUCIÓN =====
      const institucion = await tx.institucion.findUnique({
        where: { id: Number(institucionId) },
      });

      if (!institucion) {
        throw { status: 404, message: "Institución no encontrada" };
      }

      // ===== VALIDAR MIN / MAX INTEGRANTES =====
      if (participantes.length < disciplina.minIntegrantes) {
        throw {
          status: 409,
          message: `Se necesita al menos ${disciplina.minIntegrantes} integrantes para la disciplina.`,
        };
      }
      if (participantes.length > disciplina.maxIntegrantes) {
        throw {
          status: 409,
          message: `Se excede el máximo de integrantes de la disciplina (${disciplina.maxIntegrantes}).`,
        };
      }

      // ===== VALIDAR PARTICIPANTES: IDs únicos en payload =====
      const participantIds = Array.from(
        new Set(participantes.map((p: any) => Number(p.participanteId)))
      );

      if (participantIds.length !== participantes.length) {
        throw {
          status: 400,
          message: "IDs de participantes duplicados en el payload",
        };
      }

      // ===== VALIDAR CADA PARTICIPANTE =====
      for (const pid of participantIds) {
        // existe el participante
        const participante = await tx.participante.findUnique({
          where: { id: pid },
          select: { id: true, institucionId: true },
        });

        if (!participante) {
          throw { status: 404, message: `Participante ${pid} no encontrado` };
        }

        // pertenece a la misma institución que el equipo
        if (Number(participante.institucionId) !== Number(institucionId)) {
          throw {
            status: 409,
            message: `Participante ${pid} no pertenece a la institución seleccionada`,
          };
        }

        // evitar doble inscripción en la misma disciplina (ahora explícito por disciplinaId)
        const already = await tx.inscripcion.findFirst({
          where: {
            participanteId: pid,
            disciplinaId: Number(disciplinaId),
          },
        });

        if (already) {
          throw {
            status: 409,
            message: `Participante ${pid} ya inscrito en esta disciplina`,
          };
        }

        // ===== validar máximo de 2 disciplinas distintas por participante =====
        // traemos las inscripciones actuales del participante y recolectamos disciplinaId únicos
        const inscripcionesActuales = await tx.inscripcion.findMany({
          where: { participanteId: pid },
          select: { disciplinaId: true },
        });

        const disciplinasSet = new Set<number>();
        for (const ins of inscripcionesActuales) {
          if (typeof ins.disciplinaId === "number") {
            disciplinasSet.add(ins.disciplinaId);
          }
        }
        // añadimos la disciplina nueva
        disciplinasSet.add(Number(disciplinaId));

        if (disciplinasSet.size > 2) {
          throw {
            status: 409,
            message: `Participante ${pid} excede el máximo de 2 disciplinas distintas`,
          };
        }
      }

      // ===== CREAR EQUIPO (YA CON institucionId) =====
      const equipo = await tx.equipo.create({
        data: {
          disciplinaId: Number(disciplinaId),
          institucionId: Number(institucionId),
          nombreEquipo: String(nombreEquipo),
          folioRegistro: folioRegistro ? String(folioRegistro) : "",
        },
      });

      // ===== CREAR INSCRIPCIONES (AHORA INCLUYENDO disciplinaId) =====
      const now = new Date();
      const inscripcionesData = participantes.map((p: any) => ({
        participanteId: Number(p.participanteId),
        equipoId: equipo.id,
        disciplinaId: Number(disciplinaId), // <-- aquí lo agregamos
        fechaRegistro: now,
        esTitular: Boolean(p.esTitular ?? false),
      }));

      await tx.inscripcion.createMany({
        data: inscripcionesData,
      });

      return {
        equipo,
        totalParticipantes: inscripcionesData.length,
      };
    });

    return NextResponse.json(res, { status: 201 });
  } catch (err: any) {
    console.error(err);

    if (err?.status) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}