import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isResponsable } from "@/lib/rbac";

export async function GET(req: NextRequest) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const institucionIdParam = searchParams.get("institucionId");
    const estatus = searchParams.get("estatus") as "ACTIVO" | "INACTIVO" | null;

    const institucionId = institucionIdParam ? Number(institucionIdParam) : null;
    const scopedInstitucionId = isResponsable(scope) ? scope.institucionId : institucionId;
    if (institucionIdParam && !Number.isInteger(institucionId)) {
      return NextResponse.json({ error: "institucionId inválido" }, { status: 400 });
    }

    if (isResponsable(scope) && !scope.institucionId) {
      return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
    }

    const personal = await prisma.personalApoyo.findMany({
      where: {
        ...(scopedInstitucionId ? { institucionId: scopedInstitucionId } : {}),
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
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    if (scope.role === "RESPONSABLE_INSTITUCION") {
      return NextResponse.json({ error: "No tienes permiso para registrar" }, { status: 403 });
    }
    if (scope.role === "DIRECTIVO") return NextResponse.json({ error: "No autorizado" }, { status: 403 });

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
      !telefono 
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
        fotoUrl: fotoUrl ? String(fotoUrl).trim() : null,
        puesto: String(puesto).trim(),
        telefono: String(telefono).trim(),
        email: email ? String(email).trim() : null,
        contactoEmergenciaNombre: contactoEmergenciaNombre ? String(contactoEmergenciaNombre).trim() : null,
        contactoEmergenciaTelefono: contactoEmergenciaTelefono ? String(contactoEmergenciaTelefono).trim() : null,
        docCurp: !!docCurp || !!docCurpUrl,
        docIdentificacionOficial: !!docIdentificacionOficial || !!docIdentificacionOficialUrl,
        docCurpUrl: docCurpUrl ? String(docCurpUrl) : null,
        docIdentificacionOficialUrl: docIdentificacionOficialUrl ? String(docIdentificacionOficialUrl) : null,
        estatus: "ACTIVO",
      },
      include: {
        institucion: {
          select: { id: true, nombre: true },
        },
      },
    });

    await (prisma as any).bitacora.create({
      data: {
        accion: "PERSONAL_APOYO_REGISTRADO",
        descripcion: `Personal de apoyo registrado: ${String(nombres).trim()} ${String(apellidoPaterno).trim()} ${String(apellidoMaterno).trim()} (${String(puesto).trim()})`,
        institucionId: Number(institucionId),
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