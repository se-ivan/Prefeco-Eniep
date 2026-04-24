import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const instituciones = await prisma.institucion.findMany({
      include: {
        resultados: true,
        _count: {
          select: {
            participantes: true,
            usuariosResponsables: true,
          },
        },
      },
    });

    const podiumData = instituciones
      // Filtrar: solo instituciones que tengan al menos 1 participante registrado
      // O que tengan al menos 1 usuario responsable (es decir, alguien inició sesión)
      .filter((inst) => inst._count.participantes > 0 || inst._count.usuariosResponsables > 0)
      .map((inst) => {
        let oro = 0;
        let plata = 0;
        let bronce = 0;
        let puntos = 0;

        inst.resultados.forEach((res) => {
          if (res.lugar === 1) {
            oro++;
            puntos += 3;
          } else if (res.lugar === 2) {
            plata++;
            puntos += 2;
          } else if (res.lugar === 3) {
            bronce++;
            puntos += 1;
          }
        });

        return {
          id: inst.id,
          nombre: inst.nombre,
          cct: inst.cct,
          urlLogo: inst.urlLogo,
          oro,
          plata,
          bronce,
          puntos,
          totalMedallas: oro + plata + bronce,
          totalParticipantes: inst._count.participantes,
        };
      });

    // Ordenar con el Sistema Olímpico:
    // 1. Más medallas de oro
    // 2. Más medallas de plata
    // 3. Más medallas de bronce
    podiumData.sort((a, b) => {
      if (b.oro !== a.oro) return b.oro - a.oro;
      if (b.plata !== a.plata) return b.plata - a.plata;
      if (b.bronce !== a.bronce) return b.bronce - a.bronce;
      return a.nombre.localeCompare(b.nombre);
    });

    return NextResponse.json(podiumData);
  } catch (error: any) {
    console.error("GET /api/podium error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
