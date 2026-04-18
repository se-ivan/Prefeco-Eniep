import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isAdmin, hasAdminViewAccess } from "@/lib/rbac";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!hasAdminViewAccess(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        username: true,
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

    if (!["ADMIN", "RESPONSABLE_INSTITUCION", "DIRECTIVO"].includes(String(role))) {
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
        username: true,
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
    const { name, username, password, role, institucionId } = body ?? {};

    if (!name || !username || !password) {
      return NextResponse.json({ error: "name, username y password son obligatorios" }, { status: 400 });
    }

    const normalizedRole = role ?? "RESPONSABLE_INSTITUCION";
    if (!["ADMIN", "RESPONSABLE_INSTITUCION", "DIRECTIVO"].includes(String(normalizedRole))) {
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

    const normalizedUsername = String(username).trim().toLowerCase();
    const normalizedPassword = String(password);

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(normalizedUsername)) {
      return NextResponse.json(
        { error: "username inválido. Usa 3-30 caracteres alfanuméricos o guion bajo" },
        { status: 400 }
      );
    }

    if (normalizedPassword.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    const internalEmail = `${normalizedUsername}@local.eniep`;

    const signUpAndAssign = async () => {
      await (auth.api as any).signUpEmail({
        body: {
          name: String(name).trim(),
          email: internalEmail,
          password: normalizedPassword,
          username: normalizedUsername,
        },
        headers: req.headers,
      });

      return prisma.user.update({
        where: { username: normalizedUsername },
        data: {
          role: normalizedRole,
          institucionId: normalizedRole === "RESPONSABLE_INSTITUCION" ? Number(institucionId) : null,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          role: true,
          institucionId: true,
          institucion: { select: { id: true, nombre: true, cct: true } },
        },
      });
    };

    let updated;
    try {
      updated = await signUpAndAssign();
    } catch (error: any) {
      const message = error?.message || "";
      const isDuplicateError =
        /existing email|already exists|already been taken|duplicate|P2002|username is already taken/i.test(
          message
        );

      if (!isDuplicateError) throw error;

      // Si el plantel fue eliminado antes, puede quedar un usuario responsable huérfano.
      // En ese caso, recreamos la cuenta para permitir el re-registro con el mismo username.
      const orphanUser = await prisma.user.findUnique({
        where: { username: normalizedUsername },
        select: { id: true, role: true, institucionId: true },
      });

      const canRecycleAccount =
        orphanUser?.role === "RESPONSABLE_INSTITUCION" && orphanUser.institucionId === null;

      if (!canRecycleAccount) {
        return NextResponse.json(
          { error: "El username ya existe" },
          { status: 409 }
        );
      }

      await prisma.user.delete({ where: { id: orphanUser.id } });
      updated = await signUpAndAssign();
    }

    return NextResponse.json(updated, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/usuarios error:", error);
    if (error?.code === "P1001") {
      return NextResponse.json({ error: "Base de datos no disponible temporalmente" }, { status: 503 });
    }
    const message = error?.message || "Error interno";
    if (/password|minimo|mínimo|at least|8/i.test(message)) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }
    if (/existing email|already exists|already been taken|duplicate|P2002|username is already taken/i.test(message)) {
      return NextResponse.json({ error: "El username ya existe" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
