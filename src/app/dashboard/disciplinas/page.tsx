"use client";

import { useEffect, useState } from "react";
import CrearDisciplinaModal from "@/components/CrearDisciplinaModal";
import DisciplinaCard from "@/components/DisciplinaCard";
import NuevoParticipanteModal from "@/components/NuevoParticipanteModal";
import DisciplinaModalEditar from "@/components/DisciplinaModalEditar";

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
  disciplinaBaseId?: number | null;

  categorias?: {
    id: number;
    nombre: string;
    deletedAt?: Date | null;
  }[];

  deletedAt?: Date | null;

  totalEquipos?: number | null;
  totalParticipantes?: number | null;
  totalApoyos?: number | null;
};

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  const [disciplinaSeleccionada, setDisciplinaSeleccionada] =
    useState<Disciplina | null>(null);


  const [nuevoParticipanteOpen, setNuevoParticipanteOpen] = useState(false);

  const [crearDisciplinaOpen, setCrearDisciplinaOpen] = useState(false);
  const [editarDisciplinaOpen, setEditarDisciplinaOpen] = useState(false);
  const [disciplinaAEditar, setDisciplinaAEditar] = useState<Disciplina | null>(null);

  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [isDirectivo, setIsDirectivo] = useState(false);

  // Filtros - iniciados con valores por defecto
  const [filtroTipo, setFiltroTipo] = useState<string>("TODAS");
  const [filtroRama, setFiltroRama] = useState<string>("TODAS");
  const [filtroModalidad, setFiltroModalidad] = useState<string>("TODAS");
  const [busquedaNombre, setBusquedaNombre] = useState<string>("");

  const ramasDisponibles = ["TODAS", "VARONIL", "FEMENIL", "UNICA", "MIXTO"];

  // Mantener función para no tocar el onChange actual
  const handleModalidadChange = (nuevaModalidad: string) => {
    setFiltroModalidad(nuevaModalidad);
  };

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

    (async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) return;
        const me = await res.json();
        setIsAdmin(me?.role === "ADMIN");
        setIsDirectivo(me?.role === "DIRECTIVO");
      } catch {
        // ignore
      }
    })();
  }, []);

  // Callback que refresca listas tras crear algo (equipo / inscripcion / asignacion)
  async function handleAfterCreate() {
    await cargarDisciplinas();
  }

  function handleOpenEditDisciplina(d: Disciplina) {
    setDisciplinaAEditar(d);
    setEditarDisciplinaOpen(true);
  }

  async function handleDeleteDisciplina(d: Disciplina) {
    if (!confirm(`¿Deseas borrar la disciplina ${d.nombre}?`)) return;
    try {
      const res = await fetch(`/api/disciplinas/${d.id}`, { method: "DELETE" });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }
      await handleAfterCreate();
    } catch (err: any) {
      alert(err?.message || "No se pudo borrar la disciplina");
    }
  }

  // Filtrar disciplinas según los filtros activos
  const disciplinasFiltradas = disciplinas.filter((d) => {
    if (filtroTipo !== "TODAS" && d.tipo !== filtroTipo) return false;
    if (filtroRama !== "TODAS" && d.rama !== filtroRama) return false;
    if (filtroModalidad !== "TODAS" && d.modalidad !== filtroModalidad) return false;
    if (busquedaNombre.trim()) {
      const nombre = d.nombre?.toLowerCase() ?? "";
      const termino = busquedaNombre.trim().toLowerCase();
      if (!nombre.includes(termino)) return false;
    }
    return true;
  });

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Disciplinas</h1>

        {isAdmin && (
          <button
            onClick={() => setCrearDisciplinaOpen(true)}
            className="px-4 py-2 bg-amber-500 text-white rounded shadow-sm text-sm cursor-pointer transition-colors hover:bg-amber-600"
          >
            + Crear disciplina
          </button>
        )}
      </div>

      {/* FILTROS */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Filtro por Tipo */}
          <div className="flex-1 min-w-50">
            <label htmlFor="filtro-tipo" className="block text-sm font-medium text-slate-700 mb-1">
              Tipo de Disciplina
            </label>
            <select
              id="filtro-tipo"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="TODAS">Todas</option>
              <option value="DEPORTIVA">Deportiva</option>
              <option value="CULTURAL">Cultural</option>
              <option value="CIVICA">Cívica</option>
              <option value="ACADEMICA">Académica</option>
              <option value="EXHIBICION">Exhibición</option>
              <option value="EMBAJADORA_NACIONAL">Embajadora Nacional</option>
            </select>
          </div>

          {/* Filtro por Modalidad */}
          <div className="flex-1 min-w-50">
            <label htmlFor="filtro-modalidad" className="block text-sm font-medium text-slate-700 mb-1">
              Modalidad
            </label>
            <select
              id="filtro-modalidad"
              value={filtroModalidad}
              onChange={(e) => handleModalidadChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="TODAS">Todas</option>
              <option value="INDIVIDUAL">Individual</option>
              <option value="EQUIPO">Equipo</option>
            </select>
          </div>

          {/* Filtro por Rama - dinámico según modalidad */}
          <div className="flex-1 min-w-50">
            <label htmlFor="filtro-rama" className="block text-sm font-medium text-slate-700 mb-1">
              Rama
              <span className="text-xs text-slate-500 ml-1">(Varonil/Femenil/Única/Mixto)</span>
            </label>
            <select
              id="filtro-rama"
              value={filtroRama}
              onChange={(e) => setFiltroRama(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {ramasDisponibles.map((rama) => (
                <option key={rama} value={rama}>
                  {rama === "TODAS" ? "Todas" : rama.charAt(0) + rama.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="busqueda-disciplina" className="block text-sm font-medium text-slate-700 mb-1">
            Buscar disciplina por nombre
          </label>
          <input
            id="busqueda-disciplina"
            type="text"
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            placeholder="Ej. Ajedrez"
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {loading && (
        <div className="text-sm text-slate-500 mb-4">
          Cargando disciplinas...
        </div>
      )}

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {disciplinasFiltradas.map((d) => (
          <DisciplinaCard
            key={d.id}
            disciplina={d as any}
            isAdmin={isAdmin}
            canCreate={!isDirectivo}
            onEditDisciplina={(disc) => handleOpenEditDisciplina(disc as Disciplina)}
            onDeleteDisciplina={(disc) => handleDeleteDisciplina(disc as Disciplina)}
            onCreateTeam={(disc) => {
              setDisciplinaSeleccionada(disc as Disciplina);
              setNuevoParticipanteOpen(true);
            }}
          />
        ))}
      </div>

      {/* Nuevo participante (modal combinado que maneja equipo/individual/apoyo) */}
      {disciplinaSeleccionada && (
        <NuevoParticipanteModal
          open={nuevoParticipanteOpen}
          onClose={() => setNuevoParticipanteOpen(false)}
          disciplina={disciplinaSeleccionada}
          onSuccess={async () => {
            await handleAfterCreate();
          }}
        />
      )}

      {/* Modal crear disciplina */}
      {isAdmin && (
        <CrearDisciplinaModal
          open={crearDisciplinaOpen}
          onClose={() => setCrearDisciplinaOpen(false)}
          onCreated={async () => {
            setCrearDisciplinaOpen(false);
            await handleAfterCreate();
          }}
        />
      )}

      {isAdmin && (
        <DisciplinaModalEditar
          open={editarDisciplinaOpen}
          disciplina={disciplinaAEditar}
          onClose={() => {
            setEditarDisciplinaOpen(false);
            setDisciplinaAEditar(null);
          }}
          onSaved={async () => {
            setEditarDisciplinaOpen(false);
            setDisciplinaAEditar(null);
            await handleAfterCreate();
          }}
        />
      )}
    </main>
  );
}