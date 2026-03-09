import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isAdmin } from "@/lib/rbac";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!isAdmin(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        institucionId: true,
        institucion: { select: { id: true, nombre: true, cct: true } },
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("GET /api/usuarios error:", error);
    if (error?.code === "P1001") {
      return NextResponse.json({ error: "Base de datos no disponible temporalmente" }, { status: 503 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!isAdmin(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, role, institucionId } = body ?? {};

    if (!userId || !role) {
      return NextResponse.json({ error: "userId y role son obligatorios" }, { status: 400 });
    }

    if (!["ADMIN", "RESPONSABLE_INSTITUCION"].includes(String(role))) {
      return NextResponse.json({ error: "role inválido" }, { status: 400 });
    }

    if (role === "RESPONSABLE_INSTITUCION" && !institucionId) {
      return NextResponse.json({ error: "institucionId es obligatorio para responsables" }, { status: 400 });
    }

    if (institucionId) {
      const institucion = await prisma.institucion.findUnique({ where: { id: Number(institucionId) } });
      if (!institucion) {
        return NextResponse.json({ error: "Institución no encontrada" }, { status: 404 });
      }
    }

    const updated = await prisma.user.update({
      where: { id: String(userId) },
      data: {
        role,
        institucionId: role === "RESPONSABLE_INSTITUCION" ? Number(institucionId) : null,
      },
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
    console.error("PATCH /api/usuarios error:", error);
    if (error?.code === "P1001") {
      return NextResponse.json({ error: "Base de datos no disponible temporalmente" }, { status: 503 });
    }
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!isAdmin(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, role, institucionId } = body ?? {};

    if (!name || !email || !password) {
      return NextResponse.json({ error: "name, email y password son obligatorios" }, { status: 400 });
    }

    const normalizedRole = role ?? "RESPONSABLE_INSTITUCION";
    if (!["ADMIN", "RESPONSABLE_INSTITUCION"].includes(String(normalizedRole))) {
      return NextResponse.json({ error: "role inválido" }, { status: 400 });
    }

    if (normalizedRole === "RESPONSABLE_INSTITUCION" && !institucionId) {
      return NextResponse.json({ error: "institucionId es obligatorio para responsables" }, { status: 400 });
    }

    if (institucionId) {
      const institucion = await prisma.institucion.findUnique({ where: { id: Number(institucionId) } });
      if (!institucion) {
        return NextResponse.json({ error: "Institución no encontrada" }, { status: 404 });
      }
    }

    await (auth.api as any).signUpEmail({
      body: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        password: String(password),
      },
      headers: req.headers,
    });

    const updated = await prisma.user.update({
      where: { email: String(email).trim().toLowerCase() },
      data: {
        role: normalizedRole,
        institucionId: normalizedRole === "RESPONSABLE_INSTITUCION" ? Number(institucionId) : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        institucionId: true,
        institucion: { select: { id: true, nombre: true, cct: true } },
      },
    });

    return NextResponse.json(updated, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/usuarios error:", error);
    if (error?.code === "P1001") {
      return NextResponse.json({ error: "Base de datos no disponible temporalmente" }, { status: 503 });
    }
    const message = error?.message || "Error interno";
    if (/existing email|already exists|already been taken|duplicate|P2002/i.test(message)) {
      return NextResponse.json({ error: "El correo ya existe" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
