import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isResponsable } from "@/lib/rbac";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id } = await params;
    const participanteId = Number(id);

    if (!Number.isInteger(participanteId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

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

    const currentParticipante = await prisma.participante.findUnique({
      where: { id: participanteId },
      select: { tutorId: true, institucionId: true },
    });

    if (!currentParticipante) {
      return NextResponse.json({ error: "Participante no encontrado" }, { status: 404 });
    }

    if (isResponsable(scope) && currentParticipante.institucionId !== scope.institucionId) {
      return NextResponse.json({ error: "No autorizado para editar este participante" }, { status: 403 });
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

    const updated = await prisma.$transaction(async (tx: any) => {
      let tutorId = currentParticipante.tutorId;

      if (hasTutorData) {
        if (tutorId) {
          await tx.tutor.update({
            where: { id: tutorId },
            data: {
              nombreCompleto: String(tutorPayload.nombreCompleto).trim(),
              parentesco: String(tutorPayload.parentesco).trim(),
              telefono: String(tutorPayload.telefono).trim(),
              email: tutorPayload.email ? String(tutorPayload.email).trim() : null,
              direccion: tutorPayload.direccion ? String(tutorPayload.direccion).trim() : null,
            },
          });
        } else {
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
      }

      return tx.participante.update({
        where: { id: participanteId },
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
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error al actualizar participante:", error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Participante no encontrado" }, { status: 404 });
    }

    if (error?.code === "P2002") {
      return NextResponse.json({ error: "CURP o matrícula ya registrada" }, { status: 409 });
    }

    return NextResponse.json({ error: "Error al actualizar participante" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const scope = await getUserScope(req.headers);
    if (!scope) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id } = await params;
    const participanteId = Number(id);
    if (!Number.isInteger(participanteId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const existing = await prisma.participante.findUnique({
      where: { id: participanteId },
      select: { id: true, institucionId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Participante no encontrado" }, { status: 404 });
    }

    if (isResponsable(scope) && existing.institucionId !== scope.institucionId) {
      return NextResponse.json({ error: "No autorizado para eliminar este participante" }, { status: 403 });
    }

    await prisma.participante.delete({ where: { id: participanteId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar participante:", error);
    return NextResponse.json({ error: "Error al eliminar participante" }, { status: 500 });
  }
}
