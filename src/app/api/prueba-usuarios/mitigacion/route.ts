import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const usuariosSeguros = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
      },
    });

    return NextResponse.json(usuariosSeguros);
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
