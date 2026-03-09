import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserScope, isAdmin } from "@/lib/rbac";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const scope = await getUserScope(req.headers);
    if (!isAdmin(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

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
