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

    const whereClause: any = {};

    if (!admin) {
      whereClause.institucionId = userInstitucionId;
    } else if (filterInstitucionId) {
      whereClause.institucionId = parseInt(filterInstitucionId);
    }

    if (filterDisciplinaId) {
      whereClause.asignacionesApoyo = {
        some: { disciplinaId: parseInt(filterDisciplinaId) }
      };
    }

    const personalApoyo = await prisma.personalApoyo.findMany({
      where: whereClause,
      include: {
        institucion: true,
        asignacionesApoyo: {
          include: {
            disciplina: true,
            categoria: true,
          }
        }
      },
      orderBy: [
        { institucion: { nombre: 'asc' } },
        { apellidoPaterno: 'asc' }
      ]
    });

    const data = personalApoyo.map(p => {
      // If multiple assignments, join them. Usually it's better to duplicate rows,
      // but a combined string is acceptable for a flat Excel.
      const disciplinas = p.asignacionesApoyo.map(a => a.disciplina.nombre).join(" / ") || "—";
      const roles = p.asignacionesApoyo.map(a => a.rol).filter(Boolean).join(" / ") || "—";
      const categorias = p.asignacionesApoyo.map(a => a.categoria?.nombre).filter(Boolean).join(" / ") || "—";

      return {
        "Institución": p.institucion.nombre,
        "CCT": p.institucion.cct,
        "Estado": p.institucion.estado,
        "Apellido Paterno": p.apellidoPaterno,
        "Apellido Materno": p.apellidoMaterno,
        "Nombres": p.nombres,
        "CURP": p.curp,
        "Puesto Oficial": p.puesto,
        "Disciplina(s) Asignada(s)": disciplinas,
        "Categoría(s)": categorias,
        "Rol en Evento": roles,
        "Teléfono": p.telefono,
        "Email": p.email || "—",
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generando reporte de apoyo:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
