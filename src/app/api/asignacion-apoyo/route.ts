// app/api/asignacion-apoyo/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { personalId, disciplinaId, categoriaId, rol } = body ?? {};

    if (!personalId) return NextResponse.json({ error: "personalId requerido" }, { status: 400 });

    // validar existencia de personal
    const personal = await prisma.personalApoyo.findUnique({ where: { id: Number(personalId) } });
    if (!personal) return NextResponse.json({ error: "personal no encontrado" }, { status: 404 });

    const data: any = {
      personalId: Number(personalId),
    };
    if (disciplinaId != null) data.disciplinaId = Number(disciplinaId);
    if (categoriaId != null) data.categoriaId = Number(categoriaId);
    if (rol != null) data.rol = String(rol);

    const asig = await prisma.asignacionApoyo.create({ data });

    return NextResponse.json(asig, { status: 201 });
  } catch (err) {
    console.error("POST /api/asignacion-apoyo error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}