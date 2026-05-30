import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // Only allow E2E seeding in development or test environment to ensure security
  if (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  try {
    console.log("Starting API E2E database seeding...");

    // 1. Delete existing E2E users to prevent duplicate collisions
    const existingAdmin = await prisma.user.findUnique({ where: { username: "admin_test" } });
    if (existingAdmin) {
      await prisma.user.delete({ where: { id: existingAdmin.id } }).catch(() => {});
    }

    const existingCoordinator = await prisma.user.findUnique({ where: { username: "prueba" } });
    if (existingCoordinator) {
      await prisma.user.delete({ where: { id: existingCoordinator.id } }).catch(() => {});
    }

    // 2. Ensure Test Institution exists
    const instCct = "15SBC9999Z";
    const institucion = await prisma.institucion.upsert({
      where: { cct: instCct },
      update: {
        nombre: "Preparatoria Test E2E",
        estado: "México",
        municipio: "Melchor Ocampo",
        telefono: "5512345678",
        nombreDirector: "Director Test E2E",
        urlLogo: "https://mockedlogo.png",
        avalPresidenciaUrl: "https://mockedaval.pdf",
        liberacionAdeudosUrl: "https://mockedadeudo.pdf",
      },
      create: {
        cct: instCct,
        nombre: "Preparatoria Test E2E",
        estado: "México",
        municipio: "Melchor Ocampo",
        telefono: "5512345678",
        nombreDirector: "Director Test E2E",
        urlLogo: "https://mockedlogo.png",
        avalPresidenciaUrl: "https://mockedaval.pdf",
        liberacionAdeudosUrl: "https://mockedadeudo.pdf",
      },
    });

    // 3. Register Admin User 'admin_test' using Better Auth API (handles scrypt hashing correctly)
    await auth.api.signUpEmail({
      body: {
        name: "Administrador Test E2E",
        email: "admin_test@local.eniep",
        password: "Password123!",
        username: "admin_test",
      },
    });

    // Update role to ADMIN and verify email
    await prisma.user.update({
      where: { username: "admin_test" },
      data: {
        role: "ADMIN",
        emailVerified: true,
      },
    });

    // 4. Register Coordinator User 'prueba' using Better Auth API
    await auth.api.signUpEmail({
      body: {
        name: "Coordinador Prueba E2E",
        email: "prueba@prepaif.edu.mx",
        password: "Password123!",
        username: "prueba",
      },
    });

    // Update role to RESPONSABLE_INSTITUCION and link school
    await prisma.user.update({
      where: { username: "prueba" },
      data: {
        role: "RESPONSABLE_INSTITUCION",
        institucionId: institucion.id,
        emailVerified: true,
      },
    });

    // 5. Ensure some base disciplines exist
    const baseDisciplinas = [
      { nombre: "Fútbol Varonil", tipo: "DEPORTIVA", rama: "VARONIL", modalidad: "EQUIPO" as const },
      { nombre: "Taekwondo Femenil", tipo: "DEPORTIVA", rama: "FEMENIL", modalidad: "INDIVIDUAL" as const },
      { nombre: "Oratoria Única", tipo: "CULTURAL", rama: "UNICA", modalidad: "INDIVIDUAL" as const },
    ];

    for (const disc of baseDisciplinas) {
      // Create base discipline first if needed
      const dbBase = await prisma.disciplinaBase.upsert({
        where: { nombre_tipo: { nombre: disc.nombre, tipo: disc.tipo } },
        update: {},
        create: {
          nombre: disc.nombre,
          tipo: disc.tipo,
        },
      });

      await prisma.disciplina.create({
        data: {
          nombre: disc.nombre,
          tipo: disc.tipo,
          rama: disc.rama,
          modalidad: disc.modalidad,
          disciplinaBaseId: dbBase.id,
          categorias: {
            create: [
              { nombre: "Única" },
            ],
          },
        },
      }).catch(() => {
        // Ignore if already exists
      });
    }

    console.log("API E2E database seeding completed successfully!");
    return NextResponse.json({ success: true, message: "Base de datos E2E poblada exitosamente." });
  } catch (error: any) {
    console.error("API E2E Seeding error:", error);
    return NextResponse.json({ error: error.message || "Error al poblar la base de datos" }, { status: 500 });
  }
}
