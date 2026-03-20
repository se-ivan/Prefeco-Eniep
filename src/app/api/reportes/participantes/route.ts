import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isAdmin } from "@/lib/rbac";

export async function GET(req: Request) {
  try {
    const scope = await getUserScope(req.headers as any);
    if (!scope) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const admin = isAdmin(scope);
    const userInstitucionId = scope.institucionId;

    if (!admin && !userInstitucionId) {
       return NextResponse.json({ error: "No autorizado" }, { status: 403 });   
    }

    const { searchParams } = new URL(req.url);
    const filterInstitucionId = searchParams.get("institucionId");
    const filterDisciplinaId = searchParams.get("disciplinaId");

    const whereClause: any = {};

    if (!admin) {
      whereClause.participante = { institucionId: userInstitucionId };
    } else if (filterInstitucionId) {
      whereClause.participante = { institucionId: parseInt(filterInstitucionId) };
    }

    if (filterDisciplinaId) {
      whereClause.disciplinaId = parseInt(filterDisciplinaId);
    }

    const inscripciones = await prisma.inscripcion.findMany({
      where: whereClause,
      include: {
        participante: {
          include: {
            institucion: true,
          }
        },
        disciplina: true,
        categoria: true,
        equipo: true,
      },
      orderBy: [
        { disciplina: { nombre: 'asc' } },
        { participante: { institucion: { nombre: 'asc' } } }
      ]
    });

    const data = inscripciones.map(i => ({
      "Institución": i.participante.institucion.nombre,
      "CCT": i.participante.institucion.cct,
      "Estado": i.participante.institucion.estado,
      "Apellido Paterno": i.participante.apellidoPaterno,
      "Apellido Materno": i.participante.apellidoMaterno,
      "Nombres": i.participante.nombres,
      "CURP": i.participante.curp,
      "Matrícula": i.participante.matricula,
      "Rama": i.disciplina.rama,
      "Modalidad": i.disciplina.modalidad,
      "Disciplina": i.disciplina.nombre,
      "Categoría": i.categoria?.nombre || "—",
      "Equipo": i.equipo?.nombreEquipo || "—"
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generando reporte de participantes:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
