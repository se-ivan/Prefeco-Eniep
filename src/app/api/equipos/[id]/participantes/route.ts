// src/app/api/equipos/[id]/participantes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from '@/lib/rateLimit';

/**
 * GET /api/equipos/:id/participantes
 * Devuelve array de participantes inscritos en el equipo
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    
      if (!rateLimit(ip, 180, 60 * 1000)) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes. Intenta más tarde." },
          { status: 429 }
        );
      }
  try {
    const { id } = await params;
    const equipoId = Number(id);

    if (!Number.isInteger(equipoId)) {
      return NextResponse.json({ error: "invalid equipo id" }, { status: 400 });
    }

    const equipo = await prisma.equipo.findUnique({
      where: { id: equipoId },
      select: {
        id: true,
        nombreEquipo: true,
        inscripciones: {
          orderBy: { id: "asc" },
          select: {
            participanteId: true,
            participante: {
              select: {
                nombres: true,
                apellidoPaterno: true,
                apellidoMaterno: true,
                matricula: true,
                fechaNacimiento: true,
                genero: true,
              },
            },
          },
        },
      },
    });

    if (!equipo) {
      return NextResponse.json({ error: "Equipo no encontrado" }, { status: 404 });
    }

    const mapped = equipo.inscripciones.map((ins) => ({
      participanteId: ins.participanteId,
      nombreCompleto: `${ins.participante.apellidoPaterno} ${ins.participante.apellidoMaterno} ${ins.participante.nombres}`,
      matricula: ins.participante.matricula,
      fechaNacimiento: ins.participante.fechaNacimiento,
      genero: ins.participante.genero,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET /api/equipos/:id/participantes error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}