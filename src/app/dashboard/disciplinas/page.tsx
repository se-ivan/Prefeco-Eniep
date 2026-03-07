"use client";

import { useEffect, useState } from "react";
import TeamsDrawer from "@/components/TeamsDrawer";
import CrearDisciplinaModal from "@/components/CrearDisciplinaModal";
import DisciplinaCard from "@/components/DisciplinaCard";
import NuevoParticipanteModal from "@/components/NuevoParticipanteModal";

/**
 * Página de Disciplinas (dashboard)
 */

type Disciplina = {
  id: number;
  nombre: string;
  rama?: string | null;
  tipo?: string | null;
  modalidad: "INDIVIDUAL" | "EQUIPO";
  minIntegrantes?: number | null;
  maxIntegrantes?: number | null;
  maxParticipantesPorEscuela?: number | null;

  categorias?: {
    id: number;
    nombre: string;
  }[];

  totalEquipos?: number | null;
  totalParticipantes?: number | null;
};

type Equipo = any;

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);

  const [disciplinaSeleccionada, setDisciplinaSeleccionada] =
    useState<Disciplina | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  // ya no usamos TeamModal; usamos NewParticipantModal
  const [nuevoParticipanteOpen, setNuevoParticipanteOpen] = useState(false);

  const [crearDisciplinaOpen, setCrearDisciplinaOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  // Cargar disciplinas (simple GET)
  async function cargarDisciplinas() {
    setLoading(true);
    try {
      const res = await fetch("/api/disciplinas");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Disciplina[] = await res.json();
      setDisciplinas(data);
    } catch (err) {
      console.error("Error cargando disciplinas:", err);
      setDisciplinas([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarDisciplinas();
  }, []);

  // Abrir drawer y cargar equipos para la disciplina seleccionada
  async function abrirEquipos(d: Disciplina) {
    setDisciplinaSeleccionada(d);
    setDrawerOpen(true);

    try {
      const res = await fetch(`/api/disciplinas/${d.id}/equipos`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Equipo[] = await res.json();
      setEquipos(data);
    } catch (err) {
      console.error("Error cargando equipos:", err);
      setEquipos([]);
    }
  }

  // wrapper sincrónico para pasarlo a DisciplineCard (evita error de firma)
  function abrirEquiposSync(d: Disciplina) {
    abrirEquipos(d).catch((e) => {
      console.error("abrirEquipos error:", e);
    });
  }

  // Callback que refresca listas tras crear algo (equipo / inscripcion / asignacion)
  async function handleAfterCreate() {
    await cargarDisciplinas();

    if (drawerOpen && disciplinaSeleccionada) {
      try {
        const res = await fetch(
          `/api/disciplinas/${disciplinaSeleccionada.id}/equipos`
        );
        if (res.ok) {
          const data: Equipo[] = await res.json();
          setEquipos(data);
        }
      } catch (err) {
        console.warn("No se pudieron refrescar equipos:", err);
      }
    }
  }

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Disciplinas</h1>

        <button
          onClick={() => setCrearDisciplinaOpen(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded shadow-sm text-sm"
        >
          + Registrar disciplina
        </button>
      </div>

      {loading && (
        <div className="text-sm text-slate-500 mb-4">
          Cargando disciplinas...
        </div>
      )}

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {disciplinas.map((d) => (
          <DisciplinaCard
            key={d.id}
            disciplina={d as any}
            onOpenTeams={abrirEquiposSync}
            onCreateTeam={(disc) => {
              setDisciplinaSeleccionada(disc as Disciplina);
              setNuevoParticipanteOpen(true);
            }}
          />
        ))}
      </div>

      {/* Drawer de equipos */}
      <TeamsDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setDisciplinaSeleccionada(null);
          setEquipos([]);
        }}
        disciplinaNombre={disciplinaSeleccionada?.nombre}
        equipos={equipos as any}
        maxIntegrantes={disciplinaSeleccionada?.maxIntegrantes ?? undefined}
      />

      {/* Nuevo participante (modal combinado que maneja equipo/individual/apoyo) */}
      {disciplinaSeleccionada && (
        <NuevoParticipanteModal
          open={nuevoParticipanteOpen}
          onClose={() => setNuevoParticipanteOpen(false)}
          disciplina={disciplinaSeleccionada}
          onSuccess={async () => {
            setNuevoParticipanteOpen(false);
            await handleAfterCreate();
          }}
        />
      )}

      {/* Modal crear disciplina */}
      <CrearDisciplinaModal
        open={crearDisciplinaOpen}
        onClose={() => setCrearDisciplinaOpen(false)}
        onCreated={async () => {
          setCrearDisciplinaOpen(false);
          await handleAfterCreate();
        }}
      />
    </main>
  );
}