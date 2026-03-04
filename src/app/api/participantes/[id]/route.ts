import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const participanteId = Number(id);

    if (!Number.isInteger(participanteId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

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

    const currentParticipante = await prisma.participante.findUnique({
      where: { id: participanteId },
      select: { tutorId: true },
    });

    if (!currentParticipante) {
      return NextResponse.json({ error: "Participante no encontrado" }, { status: 404 });
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

    const updated = await prisma.$transaction(async (tx) => {
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
