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
    const { name, email, telefono } = body ?? {};

    const dataToUpdate: any = {};
    if (name && String(name).trim()) dataToUpdate.name = String(name).trim();
    if (email && String(email).trim()) dataToUpdate.email = String(email).trim().toLowerCase();

    if (Object.keys(dataToUpdate).length === 0 && !telefono) {
      return NextResponse.json({ error: "No hay datos para actualizar" }, { status: 400 });
    }

    if (telefono && scope.institucionId) {
      await prisma.institucion.update({
        where: { id: scope.institucionId },
        data: { telefono: String(telefono).trim() },
      });
    }

    let updated = null;
    if (Object.keys(dataToUpdate).length > 0) {
      updated = await prisma.user.update({
        where: { id: scope.id },
        data: dataToUpdate,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          institucionId: true,
          institucion: { select: { id: true, nombre: true, cct: true, telefono: true } },
        },
      });
    } else {
      updated = await prisma.user.findUnique({
        where: { id: scope.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          institucionId: true,
          institucion: { select: { id: true, nombre: true, cct: true, telefono: true } },
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH /api/cuenta error:", error);
    if (error?.code === "P2002" && error.meta?.target?.includes("email")) {
      return NextResponse.json({ error: "Este correo electrónico ya está en uso por otra cuenta" }, { status: 409 });
    }
    if (error?.code === "P1001") {
      return NextResponse.json({ error: "Base de datos no disponible temporalmente" }, { status: 503 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
