import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isResponsable, hasAdminViewAccess } from "@/lib/rbac";

export async function GET(request: NextRequest) {
    const scope = await getUserScope(request.headers);
    if (!scope) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const inscripcionesWhere: any = {
            disciplina: { deletedAt: null },
            categoria: { deletedAt: null },
        };
        const asignacionesWhere: any = {
            disciplina: { deletedAt: null },
            categoria: { deletedAt: null },
        };

        if (isResponsable(scope)) {
            const institucionId = scope.institucionId ?? -1;
            inscripcionesWhere.participante = { institucionId };
            asignacionesWhere.personal = { institucionId };
        }

        const totalStudents = await prisma.inscripcion.count({ where: inscripcionesWhere });

        const maleStudents = await prisma.inscripcion.count({
            where: {
                ...inscripcionesWhere,
                participante: {
                    ...(inscripcionesWhere.participante ?? {}),
                    genero: "MASCULINO",
                },
            },
        });

        const femaleStudents = await prisma.inscripcion.count({
            where: {
                ...inscripcionesWhere,
                participante: {
                    ...(inscripcionesWhere.participante ?? {}),
                    genero: "FEMENINO",
                },
            },
        });

        const supportStaff = await prisma.asignacionApoyo.count({ where: asignacionesWhere });

        const activeDisciplines = await prisma.disciplina.count();

        const recentActivity = await prisma.bitacora.findMany({
            where: isResponsable(scope) ? { institucionId: scope.institucionId ?? -1 } : {},
            orderBy: { createdAt: "desc" },
            take: 6,
            select: {
                id: true,
                accion: true,
                descripcion: true,
                createdAt: true,
                institucion: {
                    select: {
                        nombre: true,
                    },
                },
            },
        });

        const dashboardData = {
            totalStudents: totalStudents,
            maleStudents,
            femaleStudents,
            supportStaff,
            upcomingEvents: 0,
            activeDisciplines: activeDisciplines,
            recentActivity,
            isAdmin: hasAdminViewAccess(scope),
        };

        return NextResponse.json(dashboardData);

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
