import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from '@/lib/rateLimit';

// GET  /api/instituciones  → lista todas las instituciones
export async function GET(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    
      if (!rateLimit(ip, 180, 60 * 1000)) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes. Intenta más tarde." },
          { status: 429 }
        );
      }
  try {
    const instituciones = await prisma.institucion.findMany({
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(instituciones);
  } catch (error) {
    console.error("Error al obtener instituciones:", error);
    return NextResponse.json(
      { error: "Error al obtener instituciones" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

if (!rateLimit(ip, 50, 60 * 1000)) {
  return NextResponse.json(
    { error: "Demasiadas solicitudes. Intenta más tarde." },
    { status: 429 }
  );
}
  try {
    const body = await req.json();
    const { cct, nombre, estado, zonaEscolar, urlLogo } = body;

    if (!cct || !nombre || !estado || !zonaEscolar) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (cct, nombre, estado, zona_escolar)" },
        { status: 400 }
      );
    }

    const existe = await prisma.institucion.findUnique({ where: { cct } });
    if (existe) {
      return NextResponse.json(
        { error: "Ya existe una institución con esa CCT" },
        { status: 409 }
      );
    }

    const institucion = await prisma.institucion.create({
      data: {
        cct,
        nombre,
        estado,
        zonaEscolar,
        urlLogo: urlLogo || null,
      },
    });

    return NextResponse.json(institucion, { status: 201 });
  } catch (error) {
    console.error("Error al crear institución:", error);
    return NextResponse.json(
      { error: "Error al crear institución" },
      { status: 500 }
    );
  }
}
