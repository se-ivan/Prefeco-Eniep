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
        
        const maleStudents = await prisma.participante.count({ where: { ...whereClause, genero: "MASCULINO" } });
        const femaleStudents = await prisma.participante.count({ where: { ...whereClause, genero: "FEMENINO" } });
        const supportStaff = await prisma.personalApoyo.count({ where: whereClause });

        const activeDisciplines = await prisma.disciplina.count();

        // Obtener la actividad reciente (últimos 4 participantes registrados)
        const recentParticipants = await prisma.participante.findMany({
            where: whereClause,
            orderBy: { id: "desc" },
            take: 4,
            select: {
                id: true,
                nombres: true,
                apellidoPaterno: true,
                apellidoMaterno: true,
                estatus: true,
            }
        });

        const dashboardData = {
            totalStudents: totalStudents,
            maleStudents,
            femaleStudents,
            supportStaff,
            upcomingEvents: 0,
            activeDisciplines: activeDisciplines,
            recentActivity: recentParticipants,
        };

        return NextResponse.json(dashboardData);

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
