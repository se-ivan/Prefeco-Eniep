import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from '@/lib/rateLimit';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  
    if (!rateLimit(ip, 40, 60 * 1000)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta más tarde." },
        { status: 429 }
      );
    }
  try {
    const { id } = await params;
    const idNum = parseInt(id, 10);

    if (isNaN(idNum)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.institucion.delete({ where: { id: idNum } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar institución:", error);
    return NextResponse.json(
      { error: "Error al eliminar institución" },
      { status: 500 }
    );
  }
}
