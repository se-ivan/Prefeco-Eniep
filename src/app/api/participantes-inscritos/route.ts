// src/app/api/participantes-inscritos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/participantes-inscritos
 * Query params:
 *  - disciplinaId (opcional)
 *  - categoriaId (opcional)
 *  - institucionId (opcional)  // filtra por institución del participante
 *  - q (opcional) // búsqueda por nombre/matrícula
 *
 * Devuelve array de inscripciones individuales (equipoId == null)
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const disciplinaId = url.searchParams.get("disciplinaId");
    const categoriaId = url.searchParams.get("categoriaId");
    const institucionId = url.searchParams.get("institucionId");
    const q = url.searchParams.get("q")?.trim().toLowerCase();

    const where: any = { equipoId: null }; // individual
    if (disciplinaId) where.disciplinaId = Number(disciplinaId);
    if (categoriaId) where.categoriaId = Number(categoriaId);
    // join on participante.institucionId
    if (institucionId) where.participante = { institucionId: Number(institucionId) };

    if (q) {
      where.AND = [
        where,
        {
          participante: {
            OR: [
              { nombres: { contains: q, mode: "insensitive" } },
              { apellidoPaterno: { contains: q, mode: "insensitive" } },
              { apellidoMaterno: { contains: q, mode: "insensitive" } },
              { matricula: { contains: q, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    const inscripciones = await prisma.inscripcion.findMany({
      where,
      include: {
        participante: {
          select: {
            id: true,
            nombres: true,
            apellidoPaterno: true,
            apellidoMaterno: true,
            matricula: true,
            institucion: { select: { id: true, nombre: true } },
          },
        },
        categoria: { select: { id: true, nombre: true } },
      },
      orderBy: { id: "desc" },
    });

    const mapped = inscripciones.map((i) => ({
      inscripcionId: i.id,
      participanteId: i.participante.id,
      nombres: i.participante.nombres,
      apellidoPaterno: i.participante.apellidoPaterno,
      apellidoMaterno: i.participante.apellidoMaterno,
      matricula: i.participante.matricula,
      institucion: i.participante.institucion,
      categoria: i.categoria ?? null,
      fechaRegistro: i.fechaRegistro,
      disciplinaId: i.disciplinaId,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET /api/participantes-inscritos error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}