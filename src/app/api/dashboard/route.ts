import { authClient } from "@/lib/auth-client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// Importa Prisma o las funciones que usen tus otras APIs
// import prisma from "@/lib/prisma"; 


export async function GET(request: NextRequest) {
    const session = await authClient.getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const estudiantes = await prisma.participante.findMany();
        const disciplinas = await prisma.disciplina.findMany();

        const dashboardData = {
            totalStudents: estudiantes.length,
            pendingDocuments: 18,
            upcomingEvents: 5,
            activeDisciplines: disciplinas.length,
        };

        return NextResponse.json(dashboardData);

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}