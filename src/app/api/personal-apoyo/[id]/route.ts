import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const personalId = Number(id);

    if (!Number.isInteger(personalId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

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

    const updated = await prisma.personalApoyo.update({
      where: { id: personalId },
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

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error al actualizar personal de apoyo:", error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Personal de apoyo no encontrado" }, { status: 404 });
    }

    if (error?.code === "P2002") {
      return NextResponse.json({ error: "CURP ya registrada" }, { status: 409 });
    }

    return NextResponse.json({ error: "Error al actualizar personal de apoyo" }, { status: 500 });
  }
}
