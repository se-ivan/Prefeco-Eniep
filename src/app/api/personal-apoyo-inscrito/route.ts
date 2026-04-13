// src/app/api/personal-apoyo-inscrito/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isResponsable } from "@/lib/rbac";

/**
 * GET /api/personal-apoyo-inscrito
 * Query params:
 *  - disciplinaId
 *  - categoriaId
 *  - institucionId (filtra por institucion del personal)
 *  - q (búsqueda por nombre/puesto)
 */
export async function GET(req: Request) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const url = new URL(req.url);
    const disciplinaId = url.searchParams.get("disciplinaId");
    const categoriaId = url.searchParams.get("categoriaId");
    const institucionId = url.searchParams.get("institucionId");
    const q = url.searchParams.get("q")?.trim().toLowerCase();

    const where: any = {
      disciplina: { deletedAt: null },
      categoria: { deletedAt: null },
    };
    if (disciplinaId) where.disciplinaId = Number(disciplinaId);
    if (categoriaId) where.categoriaId = Number(categoriaId);
    if (isResponsable(scope)) {
      if (!scope.institucionId) {
        return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
      }
      where.personal = { institucionId: scope.institucionId };
    } else if (institucionId) {
      where.personal = { institucionId: Number(institucionId) };
    }

    if (q) {
      const baseWhere = { ...where };
      where.AND = [
        baseWhere,
        {
          personal: {
            OR: [
              { nombres: { contains: q, mode: "insensitive" } },
              { apellidoPaterno: { contains: q, mode: "insensitive" } },
              { apellidoMaterno: { contains: q, mode: "insensitive" } },
              { puesto: { contains: q, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    const asignaciones = await prisma.asignacionApoyo.findMany({
      where,
      include: {
        personal: {
          select: {
            id: true,
            nombres: true,
            apellidoPaterno: true,
            apellidoMaterno: true,
            fotoUrl: true,
            curp: true,
            institucion: { select: { id: true, nombre: true, cct: true, estado: true } },
            puesto: true,
            telefono: true,
          },
        },
        disciplina: { select: { id: true, nombre: true, rama: true, modalidad: true } },
        categoria: { select: { id: true, nombre: true } },
      },
      orderBy: { id: "desc" },
    });

    const mapped = asignaciones.map((a: any) => ({
      asignacionId: a.id,
      personalId: a.personal.id,
      nombres: a.personal.nombres,
      apellidoPaterno: a.personal.apellidoPaterno,
      apellidoMaterno: a.personal.apellidoMaterno,
      fotoUrl: a.personal.fotoUrl,
      curp: a.personal.curp,
      institucion: a.personal.institucion,
      puesto: a.personal.puesto,
      telefono: a.personal.telefono,
      disciplina: a.disciplina ?? null,
      categoria: a.categoria ?? null,
      disciplinaId: a.disciplinaId,
      creadoEn: a.creadoEn,
      rol: a.rol ?? null,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET /api/personal-apoyo-inscrito error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

