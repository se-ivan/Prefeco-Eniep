// app/api/disciplinas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isAdmin } from "@/lib/rbac";

// GET: lista disciplinas 
export async function GET() {
  try {
    const disciplinas = await prisma.disciplina.findMany({
      orderBy: { nombre: "asc" },
      select: {
        id: true,
        nombre: true,
        tipo: true,
        rama: true,
        modalidad: true,
        minIntegrantes: true,
        maxIntegrantes: true,
        maxParticipantesPorEscuela: true,
        categorias: {
          select: { id: true, nombre: true },
        },
        _count: {
          select: {
            equipos: true,
            inscripciones: true,
            asignacionesApoyo: true,
          },
        },
      },
    });

    const mapped = (disciplinas as any[]).map((d) => ({
      id: d.id,
      nombre: d.nombre,
      tipo: d.tipo,
      rama: d.rama,
      modalidad: d.modalidad,
      minIntegrantes: d.minIntegrantes,
      maxIntegrantes: d.maxIntegrantes,
      maxParticipantesPorEscuela: d.maxParticipantesPorEscuela,
      categorias: d.categorias ?? [],
      totalEquipos: d._count?.equipos ?? 0,
      totalParticipantes: d._count?.inscripciones ?? 0,
      totalApoyos: d._count?.asignacionesApoyo ?? 0,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("GET /api/disciplinas error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const scope = await getUserScope(req.headers);
    if (!isAdmin(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const {
      nombre,
      tipo,
      rama,
      modalidad,
      minIntegrantes,
      maxIntegrantes,
      maxParticipantesPorEscuela,
      categorias,
    } = body ?? {};

    if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
      return NextResponse.json({ error: "nombre es requerido" }, { status: 400 });
    }

    const allowedTipos = ["DEPORTIVA", "CULTURAL", "CIVICA"];
    const allowedRamas = ["VARONIL", "FEMENIL", "UNICA", "MIXTO"];
    const allowedModalidades = ["INDIVIDUAL", "EQUIPO"];

    if (!allowedTipos.includes(String(tipo))) {
      return NextResponse.json({ error: "tipo inválido" }, { status: 400 });
    }
    if (!allowedRamas.includes(String(rama))) {
      return NextResponse.json({ error: "rama inválida" }, { status: 400 });
    }
    if (!allowedModalidades.includes(String(modalidad))) {
      return NextResponse.json({ error: "modalidad inválida" }, { status: 400 });
    }

    if (!Array.isArray(categorias) || categorias.length === 0) {
      return NextResponse.json({ error: "categorias debe ser un arreglo no vacío" }, { status: 400 });
    }

    const cleanCats = categorias
      .map((c: any) => (typeof c === "string" ? c.trim() : ""))
      .filter((c: string) => c.length > 0);
    if (cleanCats.length === 0) {
      return NextResponse.json({ error: "categorias inválidas" }, { status: 400 });
    }

    if (modalidad === "EQUIPO") {
      const minI = Number(minIntegrantes);
      const maxI = Number(maxIntegrantes);
      if (!Number.isInteger(minI) || !Number.isInteger(maxI)) {
        return NextResponse.json({ error: "minIntegrantes y maxIntegrantes deben ser enteros" }, { status: 400 });
      }
      if (minI <= 0 || maxI <= 0) {
        return NextResponse.json({ error: "minIntegrantes y maxIntegrantes deben ser mayores que 0" }, { status: 400 });
      }
      if (minI > maxI) {
        return NextResponse.json({ error: "minIntegrantes no puede ser mayor que maxIntegrantes" }, { status: 400 });
      }
    } else if (modalidad === "INDIVIDUAL") {
      const maxPorEsc = Number(maxParticipantesPorEscuela);
      if (!Number.isInteger(maxPorEsc) || maxPorEsc <= 0) {
        return NextResponse.json({ error: "maxParticipantesPorEscuela debe ser entero mayor que 0" }, { status: 400 });
      }
    }

    const existe = await prisma.disciplina.findFirst({
      where: {
        nombre: { equals: nombre.trim(), mode: "insensitive" },
        modalidad: modalidad as any,
        rama: rama as any,
      },
    });
    if (existe) {
      return NextResponse.json({ error: "Esta disciplina ya existe" }, { status: 409 });
    }

    const created = await prisma.$transaction(async (tx) => {
      const disciplina = await tx.disciplina.create({
        data: {
          nombre: nombre.trim(),
          tipo: tipo as any,
          rama: rama as any,
          modalidad: modalidad as any,
          minIntegrantes: modalidad === "EQUIPO" ? Number(minIntegrantes) : undefined,
          maxIntegrantes: modalidad === "EQUIPO" ? Number(maxIntegrantes) : undefined,
          maxParticipantesPorEscuela: modalidad === "INDIVIDUAL" ? Number(maxParticipantesPorEscuela) : undefined,
          categorias: {
            create: cleanCats.map((c: string) => ({ nombre: c })),
          },
        },
        include: { categorias: true },
      });

      return disciplina;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("Error POST /api/disciplinas:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}