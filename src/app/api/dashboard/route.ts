import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isResponsable } from "@/lib/rbac";

export async function GET(request: NextRequest) {
    const scope = await getUserScope(request.headers);
    if (!scope) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const whereClause = isResponsable(scope) ? { institucionId: scope.institucionId ?? -1 } : {};
        const totalStudents = await prisma.participante.count({ where: whereClause });
        
        
        let pendingTemp = 0;
        let pendingDocuments = 0; // Default to keep previous mock behaviour if needed, but better dynamic

        const activeDisciplines = await prisma.disciplina.count();

        // Si prefieres usar los datos reales, puedes quitar el pendingDocuments quemado
        // y calcularlo en base a mapParticipantes

        const dashboardData = {
            totalStudents: totalStudents,
            pendingDocuments: pendingDocuments,
            upcomingEvents: 0,
            activeDisciplines: activeDisciplines,
        };

        return NextResponse.json(dashboardData);

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}