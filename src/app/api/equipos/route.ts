// app/api/equipos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isResponsable } from "@/lib/rbac";

export async function POST(req: Request) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const body = await req.json();
    const { disciplinaId, nombreEquipo, folioRegistro, institucionId: bodyInstitucionId } = body ?? {};

    if (!disciplinaId || !nombreEquipo || !bodyInstitucionId) {
      return NextResponse.json({ error: "disciplinaId, nombreEquipo e institucionId son requeridos" }, { status: 400 });
    }

    if (isResponsable(scope) && !scope.institucionId) {
      return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
    }

    const institucionId = isResponsable(scope) ? scope.institucionId : Number(bodyInstitucionId);

    // validar disciplina
    const disciplina = await prisma.disciplina.findUnique({ where: { id: Number(disciplinaId) } });
    if (!disciplina) return NextResponse.json({ error: "Disciplina no encontrada" }, { status: 404 });

    const institucion = await prisma.institucion.findUnique({ where: { id: Number(institucionId) } });
    if (!institucion) return NextResponse.json({ error: "Institución no encontrada" }, { status: 404 });

    const data = {
      disciplinaId: Number(disciplinaId),
      institucionId: Number(institucionId),
      nombreEquipo: String(nombreEquipo),
      folioRegistro: folioRegistro || null,
    };

    const equipo = await prisma.equipo.create({ data });

    return NextResponse.json(equipo, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const url = new URL(req.url);
    const disciplinaId = url.searchParams.get("disciplinaId");
    const institucionId = url.searchParams.get("institucionId");
    const categoriaId = url.searchParams.get("categoriaId");

    const where: any = {};
    if (disciplinaId) where.disciplinaId = Number(disciplinaId);
    if (isResponsable(scope)) {
      if (!scope.institucionId) {
        return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
      }
      where.institucionId = scope.institucionId;
    } else if (institucionId) {
      where.institucionId = Number(institucionId);
    }
    if (categoriaId) {
      where.inscripciones = { some: { categoriaId: Number(categoriaId) } };
    }

    const equipos = await prisma.equipo.findMany({
      where,
      include: {
        institucion: { select: { id: true, nombre: true } },
        inscripciones: { select: { categoria: { select: { id: true, nombre: true } } } },
      },
      orderBy: { id: "asc" },
    });

    const mapped = equipos.map((e: any) => ({
      id: e.id,
      nombreEquipo: e.nombreEquipo,
      institucionId: e.institucionId,
      disciplinaId: e.disciplinaId,
      institucion: e.institucion,
      categoria: e.inscripciones[0]?.categoria ?? null,
      integrantesCount: e.inscripciones.length,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET /api/equipos error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}