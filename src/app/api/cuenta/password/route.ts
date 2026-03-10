import { NextRequest, NextResponse } from "next/server";
import { getUserScope } from "@/lib/rbac";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const body = await req.json();
    const { currentPassword, newPassword } = body ?? {};

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "currentPassword y newPassword son obligatorios" }, { status: 400 });
    }

    if (String(newPassword).length < 8) {
      return NextResponse.json({ error: "La nueva contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    }

    await (auth.api as any).changePassword({
      headers: req.headers,
      body: {
        currentPassword: String(currentPassword),
        newPassword: String(newPassword),
        revokeOtherSessions: false,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("POST /api/cuenta/password error:", error);

    if (error?.code === "P1001") {
      return NextResponse.json({ error: "Base de datos no disponible temporalmente" }, { status: 503 });
    }

    const message = error?.message || "No se pudo cambiar la contraseña";
    if (/invalid password|incorrect|wrong|credenciales|actual/i.test(message)) {
      return NextResponse.json({ error: "La contraseña actual es incorrecta" }, { status: 400 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
