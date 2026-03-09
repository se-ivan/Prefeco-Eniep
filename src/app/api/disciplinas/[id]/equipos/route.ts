// app/api/disciplinas/[id]/equipos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from '@/lib/rateLimit';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    
      if (!rateLimit(ip, 140, 60 * 1000)) {
        return NextResponse.json(
          { error: "Demasiadas solicitudes. Intenta más tarde." },
          { status: 429 }
        );
      }
  const { id } = await params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum)) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  const equipos = await prisma.equipo.findMany({
    where: { disciplinaId: idNum },
    select: { id: true, nombreEquipo: true, folioRegistro: true },
  });

  return NextResponse.json(equipos);
}