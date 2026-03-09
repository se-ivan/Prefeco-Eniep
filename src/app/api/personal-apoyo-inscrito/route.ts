// src/app/api/personal-apoyo-inscrito/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from '@/lib/rateLimit';

/**
 * GET /api/personal-apoyo-inscrito
 * Query params:
 *  - disciplinaId
 *  - categoriaId
 *  - institucionId (filtra por institucion del personal)
 *  - q (búsqueda por nombre/puesto)
 */
export async function GET(req: Request) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    
      if (!rateLimit(ip, 150, 60 * 1000)) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes. Intenta más tarde." },
          { status: 429 }
        );
      }
  try {
    const url = new URL(req.url);
    const disciplinaId = url.searchParams.get("disciplinaId");
    const categoriaId = url.searchParams.get("categoriaId");
    const institucionId = url.searchParams.get("institucionId");
    const q = url.searchParams.get("q")?.trim().toLowerCase();

    const where: any = {};
    if (disciplinaId) where.disciplinaId = Number(disciplinaId);
    if (categoriaId) where.categoriaId = Number(categoriaId);
    if (institucionId) where.personal = { institucionId: Number(institucionId) };

    if (q) {
      where.AND = [
        where,
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
            institucion: { select: { id: true, nombre: true } },
            puesto: true,
            telefono: true,
          },
        },
        categoria: { select: { id: true, nombre: true } },
      },
      orderBy: { id: "desc" },
    });

    const mapped = asignaciones.map((a) => ({
      asignacionId: a.id,
      personalId: a.personal.id,
      nombres: a.personal.nombres,
      apellidoPaterno: a.personal.apellidoPaterno,
      apellidoMaterno: a.personal.apellidoMaterno,
      institucion: a.personal.institucion,
      puesto: a.personal.puesto,
      telefono: a.personal.telefono,
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