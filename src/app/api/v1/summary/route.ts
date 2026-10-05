import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseProjectSummary, type ProjectSummary } from "@/lib/project-summary";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const validRelations = { disciplina: { deletedAt: null }, categoria: { deletedAt: null } };
    const [institutions, registrations, disciplines, supportAssignments, registrationsByDiscipline, disciplineTypes] = await Promise.all([
      prisma.institucion.count(),
      prisma.inscripcion.count({ where: validRelations }),
      prisma.disciplina.count({ where: { deletedAt: null } }),
      prisma.asignacionApoyo.count({ where: validRelations }),
      prisma.inscripcion.groupBy({ by: ["disciplinaId"], where: validRelations, _count: { _all: true } }),
      prisma.disciplina.findMany({ where: { deletedAt: null }, select: { id: true, tipo: true } }),
    ]);
    const typeLabels: Record<string, string> = {
      DEPORTIVA: "Deportiva", CULTURAL: "Cultural", CIVICA: "Cívica", ACADEMICA: "Académica",
      EXHIBICION: "Exhibición", EMBAJADORA_NACIONAL: "Embajadora nacional", COORDINACION_DEPORTIVA: "Coordinación deportiva",
    };
    const totals = new Map(Object.keys(typeLabels).map((type) => [type, 0]));
    const typeById = new Map(disciplineTypes.map((discipline) => [discipline.id, discipline.tipo]));
    for (const row of registrationsByDiscipline) {
      const type = typeById.get(row.disciplinaId);
      if (type) totals.set(type, (totals.get(type) ?? 0) + row._count._all);
    }
    const summary: ProjectSummary = {
      projectId: "prefeco-eniep", generatedAt: new Date().toISOString(), periodLabel: "Registro vigente · ENIEP",
      metrics: [
        { id: "institutions", label: "Instituciones registradas", value: institutions, unit: "count" },
        { id: "registrations", label: "Inscripciones vigentes", value: registrations, unit: "count" },
        { id: "disciplines", label: "Disciplinas vigentes", value: disciplines, unit: "count" },
        { id: "supportAssignments", label: "Asignaciones de apoyo vigentes", value: supportAssignments, unit: "count" },
      ],
      chart: { title: "Inscripciones por tipo de disciplina", points: [...totals].map(([type, value]) => ({ label: typeLabels[type], value })) },
    };
    return NextResponse.json(parseProjectSummary(summary, "prefeco-eniep"), { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("[summary:v1] ENIEP summary unavailable");
    return NextResponse.json({ error: "Resumen no disponible" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
};
