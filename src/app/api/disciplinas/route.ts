// app/api/disciplinas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // traer disciplinas básicas
  const disciplinas = await prisma.disciplina.findMany({
    orderBy: { nombre: "asc" },
    select: {
      id: true,
      nombre: true,
      minIntegrantes: true,
      maxIntegrantes: true,
    },
  });

  // Para cada disciplina calculamos:
  // - totalEquipos: count(equipo where disciplinaId = ...)
  // - totalParticipantes: count(inscripcion where equipo.disciplinaId = ...)
  const withCounts = await Promise.all(
    disciplinas.map(async (d) => {
      const totalEquipos = await prisma.equipo.count({
        where: { disciplinaId: d.id },
      });

      // contar inscripciones relacionadas con equipos de esta disciplina
      const totalParticipantes = await prisma.inscripcion.count({
        where: {
          equipo: { disciplinaId: d.id },
        },
      });

      return {
        id: d.id,
        nombre: d.nombre,
        minIntegrantes: d.minIntegrantes,
        maxIntegrantes: d.maxIntegrantes,
        totalEquipos,
        totalParticipantes,
      };
    })
  );

  return NextResponse.json(withCounts);
}