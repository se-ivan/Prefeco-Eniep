import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ajusta la ruta de tu cliente de prisma si es necesario

export async function GET() {
  try {
    // EL ERROR DE NOVATO: Traer todos los registros y enviarlos completos
    const usuarios = await prisma.user.findMany();

    return NextResponse.json(usuarios);
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
