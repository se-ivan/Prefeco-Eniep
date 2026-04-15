import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, hasAdminViewAccess } from "@/lib/rbac";

export async function GET(req: Request) {
  try {
    const scope = await getUserScope(req.headers as any);
    if (!scope) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const admin = hasAdminViewAccess(scope);
    const userInstitucionId = scope.institucionId;

    if (!admin && !userInstitucionId) {
       return NextResponse.json({ error: "No autorizado" }, { status: 403 });   
    }

    const { searchParams } = new URL(req.url);
    const filterInstitucionId = searchParams.get("institucionId");
    const filterDisciplinaId = searchParams.get("disciplinaId");

    const whereParticipante: any = {};

    if (!admin) {
      whereParticipante.institucionId = userInstitucionId;
    } else if (filterInstitucionId) {
      whereParticipante.institucionId = parseInt(filterInstitucionId);
    }

    const disciplinaId = filterDisciplinaId ? parseInt(filterDisciplinaId) : undefined;

    const participantes = await prisma.participante.findMany({
      where: whereParticipante,
      include: {
        institucion: true,
        inscripciones: {
          where: disciplinaId ? { disciplinaId } : undefined,
          include: {
            disciplina: true,
            categoria: true,
            equipo: true,
          },
          orderBy: {
            disciplina: { nombre: "asc" },
          },
        },
      },
      orderBy: [
        { institucion: { nombre: "asc" } },
        { apellidoPaterno: "asc" },
        { apellidoMaterno: "asc" },
        { nombres: "asc" },
      ]
    });

    const data = participantes.flatMap((p) => {
      if (!p.inscripciones.length) {
        return [{
          "Institución": p.institucion.nombre,
          "CCT": p.institucion.cct,
          "Estado": p.institucion.estado,
          "Apellido Paterno": p.apellidoPaterno,
          "Apellido Materno": p.apellidoMaterno,
          "Nombres": p.nombres,
          "CURP": p.curp,
          "Matrícula": p.matricula,
          "Rama": "—",
          "Modalidad": "—",
          "Disciplina": "SIN INSCRIPCION",
          "Categoría": "—",
          "Equipo": "—"
        }];
      }

      return p.inscripciones.map((i) => ({
        "Institución": p.institucion.nombre,
        "CCT": p.institucion.cct,
        "Estado": p.institucion.estado,
        "Apellido Paterno": p.apellidoPaterno,
        "Apellido Materno": p.apellidoMaterno,
        "Nombres": p.nombres,
        "CURP": p.curp,
        "Matrícula": p.matricula,
        "Rama": i.disciplina.rama,
        "Modalidad": i.disciplina.modalidad,
        "Disciplina": i.disciplina.nombre,
        "Categoría": i.categoria?.nombre || "—",
        "Equipo": i.equipo?.nombreEquipo || "—"
      }));
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generando reporte de participantes:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
