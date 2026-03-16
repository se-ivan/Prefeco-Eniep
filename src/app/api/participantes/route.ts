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

    const participantes = await prisma.participante.findMany({
      where: {
        ...(scopedInstitucionId ? { institucionId: scopedInstitucionId } : {}),
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
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const body = await req.json();
    const {
      institucionId: bodyInstitucionId,
      curp,
      matricula,
      semestre,
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
      docCredencialUrl,
      docCartaResponsivaTutorUrl,
      docHistorialMedicoUrl,
      docActaNacimientoUrl,
      tutor,
    } = body ?? {};

    if (
      !bodyInstitucionId ||
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

    if (isResponsable(scope) && !scope.institucionId) {
      return NextResponse.json({ error: "Tu usuario no tiene institución asignada" }, { status: 403 });
    }

    const institucionId = isResponsable(scope) ? scope.institucionId : Number(bodyInstitucionId);
    const parsedSemestre =
      semestre === null || semestre === undefined || String(semestre).trim() === ""
        ? null
        : Number(semestre);

    if (parsedSemestre !== null && (!Number.isInteger(parsedSemestre) || parsedSemestre < 1 || parsedSemestre > 20)) {
      return NextResponse.json({ error: "Semestre inválido" }, { status: 400 });
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

    const created = await prisma.$transaction(async (tx: any) => {
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

      const newParticipante = await tx.participante.create({
        data: {
          institucionId: Number(institucionId),
          tutorId,
          curp: String(curp).trim().toUpperCase(),
          matricula: String(matricula).trim().toUpperCase(),
          semestre: parsedSemestre,
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
          docCurp: !!docCurp || !!docActaNacimientoUrl,
          docComprobanteEstudios: !!docComprobanteEstudios || !!docCredencialUrl,
          docCartaResponsiva: !!docCartaResponsiva || !!docCartaResponsivaTutorUrl,
          docCertificadoMedico: !!docCertificadoMedico || !!docHistorialMedicoUrl,
          docIneTutor: !!docIneTutor,
          docCredencialUrl: docCredencialUrl ? String(docCredencialUrl).trim() : null,
          docCartaResponsivaTutorUrl: docCartaResponsivaTutorUrl ? String(docCartaResponsivaTutorUrl).trim() : null,
          docHistorialMedicoUrl: docHistorialMedicoUrl ? String(docHistorialMedicoUrl).trim() : null,
          docActaNacimientoUrl: docActaNacimientoUrl ? String(docActaNacimientoUrl).trim() : null,
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

      await tx.bitacora.create({
        data: {
          accion: "ALUMNO_REGISTRADO",
          descripcion: `Se registró al alumno: ${String(nombres).trim()} ${String(apellidoPaterno).trim()} ${String(apellidoMaterno).trim()} (${String(curp).trim().toUpperCase()})`,
          institucionId: Number(institucionId),
        }
      });

      return newParticipante;
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
