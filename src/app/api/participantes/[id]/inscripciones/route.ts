import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isTaekwondoDisciplina, normalizeTaekwondoCinta } from "@/lib/taekwondo";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const participanteId = Number(id);

    if (isNaN(participanteId)) {
      return NextResponse.json(
        { error: "ID de participante inválido" },
        { status: 400 }
      );
    }

    const participante = await prisma.participante.findUnique({
      where: { id: participanteId },
      select: { institucionId: true },
    });

    if (!participante) {
      return NextResponse.json(
        { error: "Participante no encontrado" },
        { status: 404 }
      );
    }

    // Obtener todas las inscripciones del participante
    const inscripciones = await prisma.inscripcion.findMany({
      where: {
        participanteId,
      },
      select: {
        id: true,
        disciplinaId: true,
        categoriaId: true,
        equipo: {
          select: {
            nombreEquipo: true,
          },
        },
        disciplina: {
          select: {
            id: true,
            nombre: true,
            rama: true,
            modalidad: true,
            disciplinaBaseId: true,
            disciplinaBase: {
              select: {
                nombre: true,
              },
            },
          },
        },
        categoria: {
          select: {
            id: true,
            nombre: true,
            disciplinaId: true,
          },
        },
      },
    });

    const equipoFallbackByInscripcion = new Map<number, string>();

    for (const inscripcion of inscripciones) {
      if (inscripcion.equipo?.nombreEquipo) continue;
      if (inscripcion.disciplina.modalidad !== "EQUIPO") continue;

      const equipoFallback = await prisma.equipo.findFirst({
        where: {
          disciplinaId: inscripcion.disciplinaId,
          institucionId: participante.institucionId,
          inscripciones: {
            some: {
              categoriaId: inscripcion.categoriaId,
            },
          },
        },
        select: {
          nombreEquipo: true,
        },
      });

      if (equipoFallback?.nombreEquipo) {
        equipoFallbackByInscripcion.set(inscripcion.id, equipoFallback.nombreEquipo);
      }
    }

    // Agrupar por disciplina
    const disciplinasMap = new Map<
      number,
      {
        id: number;
        nombre: string;
        rama: string;
        modalidad: string;
        esTaekwondo: boolean;
        cintaTaekwondo: string | null;
        equipos: string[];
        categorias: { id: number; nombre: string; disciplinaId: number }[];
      }
    >();

    for (const inscripcion of inscripciones) {
      const cintaTaekwondo = normalizeTaekwondoCinta((inscripcion as any).cintaTaekwondo);
      const disciplinaId = inscripcion.disciplina.id;

      if (!disciplinasMap.has(disciplinaId)) {
        disciplinasMap.set(disciplinaId, {
          id: disciplinaId,
          nombre: inscripcion.disciplina.nombre,
          rama: inscripcion.disciplina.rama,
          modalidad: inscripcion.disciplina.modalidad,
          esTaekwondo: isTaekwondoDisciplina({
            disciplinaBaseId: inscripcion.disciplina.disciplinaBaseId,
            disciplinaBaseNombre: inscripcion.disciplina.disciplinaBase?.nombre,
          }),
          cintaTaekwondo,
          equipos: [],
          categorias: [],
        });
      }

      const disciplina = disciplinasMap.get(disciplinaId)!;
      if (disciplina.esTaekwondo && !disciplina.cintaTaekwondo && cintaTaekwondo) {
        disciplina.cintaTaekwondo = cintaTaekwondo;
      }
      const teamName =
        inscripcion.equipo?.nombreEquipo ??
        equipoFallbackByInscripcion.get(inscripcion.id);

      if (
        teamName &&
        !disciplina.equipos.includes(teamName)
      ) {
        disciplina.equipos.push(teamName);
      }

      if (
        inscripcion.categoria &&
        !disciplina.categorias.some((c) => c.id === inscripcion.categoria.id)
      ) {
        disciplina.categorias.push({
          id: inscripcion.categoria.id,
          nombre: inscripcion.categoria.nombre,
          disciplinaId: inscripcion.categoria.disciplinaId,
        });
      }
    }

    const disciplinas = Array.from(disciplinasMap.values());

    return NextResponse.json({
      disciplinas,
    });
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
    return NextResponse.json(
      { error: "Error al obtener inscripciones" },
      { status: 500 }
    );
  }
}
