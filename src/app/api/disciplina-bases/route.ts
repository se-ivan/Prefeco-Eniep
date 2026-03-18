import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const bases = await prisma.disciplinaBase.findMany({
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(bases);
  } catch (err) {
    console.error("GET /api/disciplina-bases error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
