import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope } from "@/lib/rbac";

export async function POST(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    
    const body = await req.json();
    const { email, code } = body ?? {};

    if (!email || !code) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    const emailToVerify = String(email).trim().toLowerCase();

    // Find valid verification
    const verification = await prisma.verification.findFirst({
      where: {
        identifier: emailToVerify,
        value: code,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!verification) {
      return NextResponse.json({ error: "Código inválido o expirado" }, { status: 400 });
    }

    // Update user's email
    const updated = await prisma.user.update({
        where: { id: scope.id },
        data: { email: emailToVerify },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          institucionId: true
        }
    });

    // Delete used code
    await prisma.verification.delete({
        where: { id: verification.id }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("POST /api/cuenta/verificar-codigo error:", error);
    if (error?.code === "P2002" && error.meta?.target?.includes("email")) {     
      return NextResponse.json({ error: "Este correo electrónico ya está en uso por otra cuenta" }, { status: 409 });
    }
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
