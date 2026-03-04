// app/api/disciplinas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: lista disciplinas (ya lo tenías; lo dejo igual y con counts si es posible)
export async function GET() {
  const disciplinas = await prisma.disciplina.findMany({
    orderBy: { nombre: "asc" },
    select: {
      id: true,
      nombre: true,
      tipo: true,
      categoria: true,
      modalidad: true,
      minIntegrantes: true,
      maxIntegrantes: true,
      // si quieres counts, calculamos con subqueries:
      // totalEquipos: prisma cannot return dynamic fields directly in select,
      // so compute after (here we do plain disciplina list; front-end can fetch counts separately if needed)
    },
  });

  return NextResponse.json(disciplinas);
}

// POST: crear nueva disciplina con validaciones
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nombre,
      tipo,
      categoria,
      modalidad,
      minIntegrantes,
      maxIntegrantes,
    } = body ?? {};

    // Validaciones básicas
    if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
      return NextResponse.json({ error: "nombre es requerido" }, { status: 400 });
    }

    const allowedTipos = ["DEPORTIVA", "CULTURAL"];
    const allowedCategorias = ["FEMENIL", "VARONIL", "UNICA"];
    const allowedModalidades = ["INDIVIDUAL", "EQUIPO"];

    if (!allowedTipos.includes(String(tipo))) {
      return NextResponse.json({ error: "tipo inválido" }, { status: 400 });
    }
    if (!allowedCategorias.includes(String(categoria))) {
      return NextResponse.json({ error: "categoria inválida" }, { status: 400 });
    }
    if (!allowedModalidades.includes(String(modalidad))) {
      return NextResponse.json({ error: "modalidad inválida" }, { status: 400 });
    }

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

    // Verificar si ya existe (case-insensitive)
    const existe = await prisma.disciplina.findFirst({
      where: { nombre: { equals: nombre.trim(), mode: "insensitive" } },
    });
    if (existe) {
      return NextResponse.json({ error: "Ya existe una disciplina con ese nombre" }, { status: 409 });
    }

    // Crear
    const created = await prisma.disciplina.create({
      data: {
        nombre: nombre.trim(),
        tipo: tipo as any,
        categoria: categoria as any,
        modalidad: modalidad as any,
        minIntegrantes: minI,
        maxIntegrantes: maxI,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("Error POST /api/disciplinas:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}