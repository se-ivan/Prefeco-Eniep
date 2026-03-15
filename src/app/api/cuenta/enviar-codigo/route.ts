import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope } from "@/lib/rbac";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    
    const body = await req.json();
    const { email } = body ?? {};

    if (!email || !String(email).trim()) {
      return NextResponse.json({ error: "El correo electrónico es requerido" }, { status: 400 });
    }

    const emailToVerify = String(email).trim().toLowerCase();

    // Check if email is already in use by another user
    const existingUser = await prisma.user.findFirst({
        where: { 
            email: emailToVerify,
            // Exclude the current user
            NOT: { id: scope.id }
        }
    });

    if (existingUser) {
        return NextResponse.json({ error: "Este correo electrónico ya está en uso" }, { status: 409 });
    }

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Verification table
    // Delete any existing codes for this email to avoid duplicates
    await prisma.verification.deleteMany({
      where: { identifier: emailToVerify }
    });

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 mins expiry

    await prisma.verification.create({
      data: {
        id: crypto.randomUUID(),
        identifier: emailToVerify,
        value: code,
        expiresAt: expiresAt,
      }
    });

    // Enviar correo real usando Resend
    try {
      await sendVerificationEmail({ to: emailToVerify, code });
      console.log(`\n📧 Email enviado con éxito a ${emailToVerify} usando Resend`);
    } catch (emailError: any) {
      console.error("Error al enviar email con Resend:", emailError);
      return NextResponse.json({ error: "Error al enviar el correo. Revisa la configuración de Resend." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Código enviado" });
  } catch (error: any) {
    console.error("POST /api/cuenta/enviar-codigo error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
