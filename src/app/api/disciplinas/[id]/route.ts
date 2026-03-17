// src/app/api/disciplinas/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserScope, isAdmin } from "@/lib/rbac";
import { isValidDisciplinaBase, type TipoDisciplina } from "@/lib/disciplinas-base";

function normalizeTipoDisciplina(tipo: unknown) {
  if (typeof tipo !== "string") return "";
  const trimmed = tipo.trim().toUpperCase();
  return trimmed === "EMBAJADORA NACIONAL" ? "EMBAJADORA_NACIONAL" : trimmed;
}

/**
 * GET /api/disciplinas/:id
 * Devuelve detalle de una disciplina, incluyendo sus categorías.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const did = Number(id);
    if (!Number.isInteger(did)) return NextResponse.json({ error: "id inválido" }, { status: 400 });

    const d = await prisma.disciplina.findFirst({
      where: { id: did, deletedAt: null },
      include: {
        categorias: { where: { deletedAt: null }, orderBy: { nombre: "asc" } },
      },
    });

    if (!d) return NextResponse.json({ error: "Disciplina no encontrada" }, { status: 404 });

    return NextResponse.json(d);
  } catch (err) {
    console.error("GET /api/disciplinas/:id error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const scope = await getUserScope(req.headers);
    if (!isAdmin(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const did = Number(id);
    if (!Number.isInteger(did)) return NextResponse.json({ error: "id inválido" }, { status: 400 });

    const current = await prisma.disciplina.findFirst({
      where: { id: did, deletedAt: null },
      select: { id: true },
    });
    if (!current) return NextResponse.json({ error: "Disciplina no encontrada" }, { status: 404 });

    const body = await req.json();
    const {
      nombre,
      tipo,
      disciplinaBase,
      rama,
      modalidad,
      minIntegrantes,
      maxIntegrantes,
      maxParticipantesPorEscuela,
      categorias,
    } = body ?? {};

    if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
      return NextResponse.json({ error: "nombre es requerido" }, { status: 400 });
    }

    const normalizedTipo = normalizeTipoDisciplina(tipo);
    const allowedTipos = ["DEPORTIVA", "CULTURAL", "CIVICA", "ACADEMICA", "EXHIBICION", "EMBAJADORA_NACIONAL"];
    const allowedRamas = ["VARONIL", "FEMENIL", "UNICA", "MIXTO"];
    const allowedModalidades = ["INDIVIDUAL", "EQUIPO"];

    if (!allowedTipos.includes(normalizedTipo)) {
      return NextResponse.json({ error: "tipo inválido" }, { status: 400 });
    }
    if (!allowedRamas.includes(String(rama))) {
      return NextResponse.json({ error: "rama inválida" }, { status: 400 });
    }
    if (!allowedModalidades.includes(String(modalidad))) {
      return NextResponse.json({ error: "modalidad inválida" }, { status: 400 });
    }
    const hasDisciplinaBase = typeof disciplinaBase === "string" && disciplinaBase.trim().length > 0;
    if (hasDisciplinaBase && !isValidDisciplinaBase(disciplinaBase, normalizedTipo as TipoDisciplina)) {
      return NextResponse.json({ error: "disciplinaBase inválida para el tipo" }, { status: 400 });
    }

    if (!Array.isArray(categorias) || categorias.length === 0) {
      return NextResponse.json({ error: "categorias debe ser un arreglo no vacío" }, { status: 400 });
    }

    const cleanCats = categorias
      .map((c: any) => (typeof c === "string" ? c.trim() : ""))
      .filter((c: string) => c.length > 0);
    if (cleanCats.length === 0) {
      return NextResponse.json({ error: "categorias inválidas" }, { status: 400 });
    }

    const normalized = new Set<string>();
    for (const c of cleanCats) {
      const key = c.toLowerCase();
      if (normalized.has(key)) {
        return NextResponse.json({ error: "categorias duplicadas en el payload" }, { status: 400 });
      }
      normalized.add(key);
    }

    if (modalidad === "EQUIPO") {
      const minI = Number(minIntegrantes);
      const maxI = Number(maxIntegrantes);
      if (!Number.isInteger(minI) || !Number.isInteger(maxI)) {
        return NextResponse.json({ error: "minIntegrantes y maxIntegrantes deben ser enteros" }, { status: 400 });
      }
      if (minI <= 0 || maxI <= 0) {
        return NextResponse.json({ error: "minIntegrantes y maxIntegrantes deben ser mayores que 0" }, { status: 400 });
      }
      if (minI > maxI) {
        return NextResponse.json({ error: "minIntegrantes no puede ser mayor que maxIntegrantes" }, { status: 400 });
      }
    } else {
      const maxPorEsc = Number(maxParticipantesPorEscuela);
      if (!Number.isInteger(maxPorEsc) || maxPorEsc <= 0) {
        return NextResponse.json({ error: "maxParticipantesPorEscuela debe ser entero mayor que 0" }, { status: 400 });
      }
    }

    const duplicate = await prisma.disciplina.findFirst({
      where: {
        id: { not: did },
        nombre: { equals: nombre.trim(), mode: "insensitive" },
        modalidad: modalidad as any,
        rama: rama as any,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json({ error: "Ya existe otra disciplina activa con ese nombre/modo/rama" }, { status: 409 });
    }

    const now = new Date();

    const updated = await prisma.$transaction(async (tx: any) => {
      const disciplina = await tx.disciplina.update({
        where: { id: did },
        data: {
          nombre: nombre.trim(),
          disciplinaBase: hasDisciplinaBase ? String(disciplinaBase).trim() : null,
          tipo: normalizedTipo as any,
          rama: rama as any,
          modalidad: modalidad as any,
          minIntegrantes: modalidad === "EQUIPO" ? Number(minIntegrantes) : null,
          maxIntegrantes: modalidad === "EQUIPO" ? Number(maxIntegrantes) : null,
          maxParticipantesPorEscuela: modalidad === "INDIVIDUAL" ? Number(maxParticipantesPorEscuela) : null,
        },
      });

      const activeCats = await tx.categoria.findMany({
        where: { disciplinaId: did, deletedAt: null },
        select: { id: true, nombre: true },
      });

      const cleanCatSet = new Set(cleanCats.map((c: string) => c.toLowerCase()));
      const toSoftDeleteIds = activeCats
        .filter((c: any) => !cleanCatSet.has(String(c.nombre).toLowerCase()))
        .map((c: any) => c.id);

      if (toSoftDeleteIds.length > 0) {
        await tx.categoria.updateMany({
          where: { id: { in: toSoftDeleteIds }, deletedAt: null },
          data: { deletedAt: now },
        });
      }

      for (const catName of cleanCats) {
        const alreadyActive = activeCats.some((c: any) => c.nombre.toLowerCase() === catName.toLowerCase());
        if (alreadyActive) continue;

        const previous = await tx.categoria.findFirst({
          where: {
            disciplinaId: did,
            nombre: { equals: catName, mode: "insensitive" },
            deletedAt: { not: null },
          },
          orderBy: { id: "desc" },
          select: { id: true },
        });

        if (previous) {
          await tx.categoria.update({
            where: { id: previous.id },
            data: { deletedAt: null },
          });
        } else {
          await tx.categoria.create({
            data: {
              disciplinaId: did,
              nombre: catName,
              deletedAt: null,
            },
          });
        }
      }

      const categoriasActivas = await tx.categoria.findMany({
        where: { disciplinaId: did, deletedAt: null },
        orderBy: { nombre: "asc" },
      });

      return { ...disciplina, categorias: categoriasActivas };
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PUT /api/disciplinas/:id error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const scope = await getUserScope(req.headers);
    if (!isAdmin(scope)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const did = Number(id);
    if (!Number.isInteger(did)) return NextResponse.json({ error: "id inválido" }, { status: 400 });

    const result = await prisma.$transaction(async (tx: any) => {
      const disciplina = await tx.disciplina.findFirst({
        where: { id: did, deletedAt: null },
        select: { id: true },
      });
      if (!disciplina) return null;

      // Verificar si la disciplina ha sido usada
      const [inscripciones, equipos, asignaciones] = await Promise.all([
        tx.inscripcion.count({ where: { disciplinaId: did } }),
        tx.equipo.count({ where: { disciplinaId: did } }),
        tx.asignacionApoyo.count({ where: { disciplinaId: did } }),
      ]);

      const tieneUso = inscripciones > 0 || equipos > 0 || asignaciones > 0;

      if (tieneUso) {
        // Soft-delete: marcar como eliminada lógicamente
        const now = new Date();
        await tx.disciplina.update({
          where: { id: did },
          data: { deletedAt: now },
        });
        await tx.categoria.updateMany({
          where: { disciplinaId: did, deletedAt: null },
          data: { deletedAt: now },
        });
        return { ok: true, tipo: "soft" };
      } else {
        // Hard-delete: eliminar permanentemente categorías y disciplina
        await tx.categoria.deleteMany({ where: { disciplinaId: did } });
        await tx.disciplina.delete({ where: { id: did } });
        return { ok: true, tipo: "hard" };
      }
    });

    if (!result) return NextResponse.json({ error: "Disciplina no encontrada" }, { status: 404 });

    return NextResponse.json(result);
  } catch (err) {
    console.error("DELETE /api/disciplinas/:id error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}