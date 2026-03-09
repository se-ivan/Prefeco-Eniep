import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

if (!rateLimit(ip, 150, 60 * 1000)) {
  return NextResponse.json(
    { error: "Demasiadas solicitudes. Intenta más tarde." },
    { status: 429 }
  );
}
  
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const institucionIdParam = searchParams.get("institucionId");
    const estatus = searchParams.get("estatus") as "ACTIVO" | "INACTIVO" | null;

    const institucionId = institucionIdParam ? Number(institucionIdParam) : null;
    if (institucionIdParam && !Number.isInteger(institucionId)) {
      return NextResponse.json({ error: "institucionId inválido" }, { status: 400 });
    }

    const participantes = await prisma.participante.findMany({
      where: {
        ...(institucionId ? { institucionId } : {}),
        ...(estatus ? { estatus } : {}),
        ...(q
          ? {
              OR: [
                { nombres: { contains: q, mode: "insensitive" } },
                { apellidoPaterno: { contains: q, mode: "insensitive" } },
                { apellidoMaterno: { contains: q, mode: "insensitive" } },
                { matricula: { contains: q, mode: "insensitive" } },
                { curp: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [{ apellidoPaterno: "asc" }, { apellidoMaterno: "asc" }, { nombres: "asc" }],
      include: {
        institucion: {
          select: { id: true, nombre: true },
        },
        tutor: {
          select: {
            id: true,
            nombreCompleto: true,
            parentesco: true,
            telefono: true,
            email: true,
            direccion: true,
          },
        },
      },
    });

    return NextResponse.json(participantes);
  } catch (error) {
    console.error("Error al obtener participantes:", error);
    return NextResponse.json({ error: "Error al obtener participantes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

if (!rateLimit(ip, 40, 60 * 1000)) {
  return NextResponse.json(
    { error: "Demasiadas solicitudes. Intenta más tarde." },
    { status: 429 }
  );
}
  try {
    const body = await req.json();
    const {
      institucionId,
      curp,
      matricula,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      fechaNacimiento,
      genero,
      fotoUrl,
      estatus,
      alergias,
      tipoSangre,
      padecimientos,
      medicamentos,
      contactoEmergenciaNombre,
      contactoEmergenciaTelefono,
      docCurp,
      docComprobanteEstudios,
      docCartaResponsiva,
      docCertificadoMedico,
      docIneTutor,
      tutor,
    } = body ?? {};

    if (
      !institucionId ||
      !curp ||
      !matricula ||
      !nombres ||
      !apellidoPaterno ||
      !apellidoMaterno ||
      !fechaNacimiento ||
      !genero ||
      !estatus
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios del participante" },
        { status: 400 }
      );
    }

    const institucion = await prisma.institucion.findUnique({ where: { id: Number(institucionId) } });
    if (!institucion) {
      return NextResponse.json({ error: "Institución no encontrada" }, { status: 404 });
    }

    const tutorPayload = tutor ?? null;
    const hasTutorData =
      !!tutorPayload?.nombreCompleto ||
      !!tutorPayload?.parentesco ||
      !!tutorPayload?.telefono ||
      !!tutorPayload?.email ||
      !!tutorPayload?.direccion;

    if (hasTutorData) {
      if (!tutorPayload?.nombreCompleto || !tutorPayload?.parentesco || !tutorPayload?.telefono) {
        return NextResponse.json(
          { error: "Tutor incompleto: nombre, parentesco y teléfono son obligatorios" },
          { status: 400 }
        );
      }
    }

    const created = await prisma.$transaction(async (tx) => {
      let tutorId: number | null = null;

      if (hasTutorData) {
        const createdTutor = await tx.tutor.create({
          data: {
            nombreCompleto: String(tutorPayload.nombreCompleto).trim(),
            parentesco: String(tutorPayload.parentesco).trim(),
            telefono: String(tutorPayload.telefono).trim(),
            email: tutorPayload.email ? String(tutorPayload.email).trim() : null,
            direccion: tutorPayload.direccion ? String(tutorPayload.direccion).trim() : null,
          },
        });
        tutorId = createdTutor.id;
      }

      return tx.participante.create({
        data: {
          institucionId: Number(institucionId),
          tutorId,
          curp: String(curp).trim().toUpperCase(),
          matricula: String(matricula).trim().toUpperCase(),
          nombres: String(nombres).trim(),
          apellidoPaterno: String(apellidoPaterno).trim(),
          apellidoMaterno: String(apellidoMaterno).trim(),
          fechaNacimiento: new Date(fechaNacimiento),
          genero,
          fotoUrl: fotoUrl ? String(fotoUrl).trim() : null,
          estatus,
          alergias: alergias ? String(alergias).trim() : null,
          tipoSangre: tipoSangre ? String(tipoSangre).trim().toUpperCase() : null,
          padecimientos: padecimientos ? String(padecimientos).trim() : null,
          medicamentos: medicamentos ? String(medicamentos).trim() : null,
          contactoEmergenciaNombre: contactoEmergenciaNombre ? String(contactoEmergenciaNombre).trim() : null,
          contactoEmergenciaTelefono: contactoEmergenciaTelefono ? String(contactoEmergenciaTelefono).trim() : null,
          docCurp: !!docCurp,
          docComprobanteEstudios: !!docComprobanteEstudios,
          docCartaResponsiva: !!docCartaResponsiva,
          docCertificadoMedico: !!docCertificadoMedico,
          docIneTutor: !!docIneTutor,
        },
        include: {
          institucion: {
            select: { id: true, nombre: true },
          },
          tutor: {
            select: {
              id: true,
              nombreCompleto: true,
              parentesco: true,
              telefono: true,
              email: true,
              direccion: true,
            },
          },
        },
      });
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("Error al crear participante:", error);

    if (error?.code === "P2002") {
      return NextResponse.json({ error: "CURP o matrícula ya registrada" }, { status: 409 });
    }

    return NextResponse.json({ error: "Error al crear participante" }, { status: 500 });
  }
}
