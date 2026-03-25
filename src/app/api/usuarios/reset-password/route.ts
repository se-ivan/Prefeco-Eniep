import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isAdmin } from "@/lib/rbac";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!isAdmin(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const { userId } = body ?? {};
    if (!userId) return NextResponse.json({ error: "userId es obligatorio" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: String(userId) } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    // Intenta solicitar el correo de restablecimiento usando la API de better-auth
    // El método disponible en auth.api para solicitar restablecimiento en cliente es requestPasswordReset;
    // aquí intentamos usarlo desde el servidor. Si la librería cambia, el catch devolverá error.
    await (auth.api as any).requestPasswordReset({
      body: {
        email: user.email,
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || ""}/reset-password`,
      },
      headers: req.headers,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("POST /api/usuarios/reset-password error:", error);
    if (error?.code === "P1001") {
      return NextResponse.json({ error: "Base de datos no disponible temporalmente" }, { status: 503 });
    }
    return NextResponse.json({ error: error?.message || "Error interno" }, { status: 500 });
  }
}
