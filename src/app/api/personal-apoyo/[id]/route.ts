import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isResponsable } from "@/lib/rbac";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    if (scope.role === "DIRECTIVO") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const { id } = await params;
    const personalId = Number(id);

    if (!Number.isInteger(personalId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    const {
      institucionId: bodyInstitucionId,
      curp,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      fotoUrl,
      puesto,
      telefono,
      email,
      contactoEmergenciaNombre,
      contactoEmergenciaTelefono,
      docCurp,
      docIdentificacionOficial,
      docCurpUrl,
      docIdentificacionOficialUrl,
      estatus,
    } = body ?? {};

    if (
      !bodyInstitucionId ||
      !curp ||
      !nombres ||
      !apellidoPaterno ||
      !puesto ||
      !telefono ||
      !estatus
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios del personal de apoyo" },
        { status: 400 }
      );
    }

    if (isResponsable(scope) && !scope.institucionId) {
      return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
    }

    const institucionId = isResponsable(scope) ? scope.institucionId : Number(bodyInstitucionId);

    const existing = await prisma.personalApoyo.findUnique({
      where: { id: personalId },
      select: { id: true, institucionId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Personal de apoyo no encontrado" }, { status: 404 });
    }

    if (isResponsable(scope) && existing.institucionId !== scope.institucionId) {
      return NextResponse.json({ error: "No autorizado para editar este registro" }, { status: 403 });
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
        fotoUrl: fotoUrl ? String(fotoUrl).trim() : null,
        puesto: String(puesto).trim(),
        telefono: String(telefono).trim(),
        email: email ? String(email).trim() : null,
        contactoEmergenciaNombre: contactoEmergenciaNombre ? String(contactoEmergenciaNombre).trim() : null,
        contactoEmergenciaTelefono: contactoEmergenciaTelefono ? String(contactoEmergenciaTelefono).trim() : null,
        docCurp: docCurp !== undefined ? !!docCurp : (docCurpUrl ? true : undefined),
        docIdentificacionOficial:
          docIdentificacionOficial !== undefined ? !!docIdentificacionOficial : (docIdentificacionOficialUrl ? true : undefined),
        docCurpUrl: docCurpUrl !== undefined ? (docCurpUrl ? String(docCurpUrl) : null) : undefined,
        docIdentificacionOficialUrl: docIdentificacionOficialUrl !== undefined ? (docIdentificacionOficialUrl ? String(docIdentificacionOficialUrl) : null) : undefined,
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    if (scope.role === "DIRECTIVO") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const { id } = await params;
    const personalId = Number(id);
    if (!Number.isInteger(personalId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const existing = await prisma.personalApoyo.findUnique({
      where: { id: personalId },
      select: { id: true, institucionId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Personal de apoyo no encontrado" }, { status: 404 });
    }

    if (isResponsable(scope) && existing.institucionId !== scope.institucionId) {
      return NextResponse.json({ error: "No autorizado para eliminar este registro" }, { status: 403 });
    }

    await prisma.personalApoyo.delete({ where: { id: personalId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar personal de apoyo:", error);
    return NextResponse.json({ error: "Error al eliminar personal de apoyo" }, { status: 500 });
  }
}
