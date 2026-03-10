import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    return NextResponse.json({
      id: scope.id,
      name: scope.name,
      email: scope.email,
      role: scope.role,
      institucion: scope.institucion,
    });
  } catch (error: any) {
    if (error?.code === "P1001") {
      return NextResponse.json({ error: "Base de datos no disponible temporalmente" }, { status: 503 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const body = await req.json();
    const { name } = body ?? {};

    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: scope.id },
      data: { name: String(name).trim() },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        institucionId: true,
        institucion: { select: { id: true, nombre: true, cct: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH /api/cuenta error:", error);
    if (error?.code === "P1001") {
      return NextResponse.json({ error: "Base de datos no disponible temporalmente" }, { status: 503 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
