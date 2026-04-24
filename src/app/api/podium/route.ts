import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const instituciones = await prisma.institucion.findMany({
      include: {
        resultados: true,
      },
    });

    const podiumData = instituciones.map((inst) => {
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

    // Filtramos los que no tienen puntos (opcional) pero para un podio general es bueno mostrarlos todos o solo los que tienen puntos
    // Dejaremos todos para que la tabla de posiciones muestre a todas las escuelas
    return NextResponse.json(podiumData);
  } catch (error: any) {
    console.error("GET /api/podium error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
