// src/app/api/participantes-inscritos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isResponsable } from "@/lib/rbac";

/**
 * GET /api/participantes-inscritos
 * Query params:
 *  - disciplinaId (opcional)
 *  - categoriaId (opcional)
 *  - institucionId (opcional)  // filtra por institución del participante
 *  - includeEquipos (opcional) // true/1 => incluye inscripciones de equipo
 *  - q (opcional) // búsqueda por nombre/matrícula
 *
 * Devuelve array de inscripciones individuales por defecto.
 * Si includeEquipos=true, también incluye inscripciones ligadas a equipo.
 */
export async function GET(req: Request) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const url = new URL(req.url);
    const disciplinaId = url.searchParams.get("disciplinaId");
    const categoriaId = url.searchParams.get("categoriaId");
    const institucionId = url.searchParams.get("institucionId");
    const includeEquipos = ["1", "true", "yes", "si"].includes(
      (url.searchParams.get("includeEquipos") ?? "").toLowerCase()
    );
    const q = url.searchParams.get("q")?.trim().toLowerCase();

    const where: any = {
      disciplina: { deletedAt: null },
      categoria: { deletedAt: null },
    };
    if (!includeEquipos) where.equipoId = null;
    if (disciplinaId) where.disciplinaId = Number(disciplinaId);
    if (categoriaId) where.categoriaId = Number(categoriaId);
    // join on participante.institucionId
    if (isResponsable(scope)) {
      if (!scope.institucionId) {
        return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
      }
      where.participante = { institucionId: scope.institucionId };
    } else if (institucionId) {
      where.participante = { institucionId: Number(institucionId) };
    }

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
            fotoUrl: true,
            curp: true,
            matricula: true,
            semestre: true,
            contactoEmergenciaTelefono: true,
            institucion: { select: { id: true, nombre: true, cct: true, estado: true } },
          },
        },
        disciplina: { select: { id: true, nombre: true, rama: true, modalidad: true } },
        categoria: { select: { id: true, nombre: true } },
      },
      orderBy: { id: "desc" },
    } as any);

    const mapped = (inscripciones as any[]).map((i: any) => {
      const participante = i.participante ?? i.alumno ?? null;
      return {
      inscripcionId: i.id,
      participanteId: participante?.id,
      nombres: participante?.nombres,
      apellidoPaterno: participante?.apellidoPaterno,
      apellidoMaterno: participante?.apellidoMaterno,
      fotoUrl: participante?.fotoUrl,
      curp: participante?.curp,
      matricula: participante?.matricula,
      semestre: participante?.semestre,
      telefono: participante?.contactoEmergenciaTelefono,
      institucion: participante?.institucion,
      disciplina: i.disciplina ?? null,
      categoria: i.categoria ?? null,
      fechaRegistro: i.fechaRegistro,
      disciplinaId: i.disciplinaId,
      };
    });

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET /api/participantes-inscritos error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

