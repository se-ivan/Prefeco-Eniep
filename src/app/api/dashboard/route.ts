import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    try {

        const [totalStudents, activeDisciplines] = await Promise.all([
            prisma.participante.count(),
            prisma.disciplina.count()
        ]);

        const dashboardData = {
            totalStudents,
            pendingDocuments: 18,
            upcomingEvents: 5,
            activeDisciplines
        };

        return NextResponse.json(dashboardData);

    } catch (error) {
        console.error("Dashboard API Error:", error);

        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}