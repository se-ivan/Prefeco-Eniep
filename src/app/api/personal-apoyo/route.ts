import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const institucionIdParam = searchParams.get("institucionId");
    const estatus = searchParams.get("estatus") as "ACTIVO" | "INACTIVO" | null;

    const institucionId = institucionIdParam ? Number(institucionIdParam) : null;
    if (institucionIdParam && !Number.isInteger(institucionId)) {
      return NextResponse.json({ error: "institucionId inválido" }, { status: 400 });
    }

    const personal = await prisma.personalApoyo.findMany({
      where: {
        ...(institucionId ? { institucionId } : {}),
        ...(estatus ? { estatus } : {}),
        ...(q
          ? {
              OR: [
                { nombres: { contains: q, mode: "insensitive" } },
                { apellidoPaterno: { contains: q, mode: "insensitive" } },
                { apellidoMaterno: { contains: q, mode: "insensitive" } },
                { curp: { contains: q, mode: "insensitive" } },
                { puesto: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [{ apellidoPaterno: "asc" }, { apellidoMaterno: "asc" }, { nombres: "asc" }],
      include: {
        institucion: {
          select: { id: true, nombre: true },
        },
      },
    });

    return NextResponse.json(personal);
  } catch (error) {
    console.error("Error al obtener personal de apoyo:", error);
    return NextResponse.json({ error: "Error al obtener personal de apoyo" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      institucionId,
      curp,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      puesto,
      telefono,
      email,
      contactoEmergenciaNombre,
      contactoEmergenciaTelefono,
      docCurp,
      docIdentificacionOficial,
      docComprobanteDomicilio,
      docCartaAntecedentes,
      estatus,
    } = body ?? {};

    if (
      !institucionId ||
      !curp ||
      !nombres ||
      !apellidoPaterno ||
      !apellidoMaterno ||
      !puesto ||
      !telefono ||
      !estatus
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios del personal de apoyo" },
        { status: 400 }
      );
    }

    const institucion = await prisma.institucion.findUnique({ where: { id: Number(institucionId) } });
    if (!institucion) {
      return NextResponse.json({ error: "Institución no encontrada" }, { status: 404 });
    }

    const created = await prisma.personalApoyo.create({
      data: {
        institucionId: Number(institucionId),
        curp: String(curp).trim().toUpperCase(),
        nombres: String(nombres).trim(),
        apellidoPaterno: String(apellidoPaterno).trim(),
        apellidoMaterno: String(apellidoMaterno).trim(),
        puesto: String(puesto).trim(),
        telefono: String(telefono).trim(),
        email: email ? String(email).trim() : null,
        contactoEmergenciaNombre: contactoEmergenciaNombre ? String(contactoEmergenciaNombre).trim() : null,
        contactoEmergenciaTelefono: contactoEmergenciaTelefono ? String(contactoEmergenciaTelefono).trim() : null,
        docCurp: !!docCurp,
        docIdentificacionOficial: !!docIdentificacionOficial,
        docComprobanteDomicilio: !!docComprobanteDomicilio,
        docCartaAntecedentes: !!docCartaAntecedentes,
        estatus,
      },
      include: {
        institucion: {
          select: { id: true, nombre: true },
        },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("Error al crear personal de apoyo:", error);

    if (error?.code === "P2002") {
      return NextResponse.json({ error: "CURP ya registrada" }, { status: 409 });
    }

    return NextResponse.json({ error: "Error al crear personal de apoyo" }, { status: 500 });
  }
}
