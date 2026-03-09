// app/api/equipos/[id]/inscripciones/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const equipoId = Number(id);
  if (!Number.isInteger(equipoId)) return NextResponse.json({ error: "Invalid equipo id" }, { status: 400 });

    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    
      if (!rateLimit(ip, 50, 60 * 1000)) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes. Intenta más tarde." },
          { status: 429 }
        );
      }
  try {
    const body = await req.json();
      const { participantes: participantesRaw, categoriaId } = body ?? {};
    
      if (!Array.isArray(participantesRaw) || participantesRaw.length === 0) {
      return NextResponse.json({ error: "participants array is required" }, { status: 400 });
    }
    
      if (!categoriaId) {
        return NextResponse.json({ error: "categoriaId is required" }, { status: 400 });
      }

    const created = await prisma.$transaction(async (tx) => {
      const equipo = await tx.equipo.findUnique({
        where: { id: equipoId },
        include: { disciplina: true },
      });
      if (!equipo) throw { status: 404, message: "Equipo no encontrado" };

      // ccuenta inscripciones actuales
      const existingCount = await tx.inscripcion.count({ where: { equipoId } });

      const participantIds: number[] = Array.from(
        new Set(participantesRaw.map((p: any) => Number(p.participanteId)))
      );

        const maxIntegrantes = equipo.disciplina.maxIntegrantes ?? Infinity;
        if (existingCount + participantIds.length > maxIntegrantes) {
        throw { status: 409, message: "Capacidad del equipo excedida" };
      }

      for (const pid of participantIds) {
        const participante = await tx.participante.findUnique({
          where: { id: pid },
          select: { id: true, nombres: true },
        });
        if (!participante) throw { status: 404, message: "Participante no encontrado" };

        // revisa si el participante ya esta inscrito en esta disciplina y categoria
        const already = await tx.inscripcion.findFirst({
          where: {
            participanteId: pid,
            equipo: { disciplinaId: equipo.disciplinaId },
            categoriaId: Number(categoriaId),
          },
        });
        if (already) throw { status: 409, message: `${participante.nombres} ya esta inscrito en esta disciplina y categoria` };
      }

      // si paso todas las validaciones, crea la inscripncion
      const now = new Date();
      const data = participantesRaw.map((p: any) => ({
        participanteId: Number(p.participanteId),
        equipoId: equipoId,
        disciplinaId: equipo.disciplinaId,
        categoriaId: Number(categoriaId),
        fechaRegistro: now,
      }));

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