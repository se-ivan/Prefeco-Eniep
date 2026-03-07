"use client";

import { useEffect, useState } from "react";
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
  totalApoyos?: number | null;
};

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  const [disciplinaSeleccionada, setDisciplinaSeleccionada] =
    useState<Disciplina | null>(null);


  const [nuevoParticipanteOpen, setNuevoParticipanteOpen] = useState(false);

  const [crearDisciplinaOpen, setCrearDisciplinaOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  // Filtros - iniciados con valores por defecto
  const [filtroTipo, setFiltroTipo] = useState<string>("TODAS");
  const [filtroRama, setFiltroRama] = useState<string>("TODAS");
  const [filtroModalidad, setFiltroModalidad] = useState<string>("TODAS");

  // Determinar qué ramas mostrar según la modalidad
  const ramasDisponibles = (() => {
    if (filtroModalidad === "INDIVIDUAL") {
      return ["TODAS", "UNICA", "MIXTO"];
    } else if (filtroModalidad === "EQUIPO") {
      return ["TODAS", "VARONIL", "FEMENIL"];
    }
    return ["TODAS", "VARONIL", "FEMENIL", "UNICA", "MIXTO"];
  })();

  // Función para cambiar modalidad y ajustar rama si es necesario
  const handleModalidadChange = (nuevaModalidad: string) => {
    setFiltroModalidad(nuevaModalidad);
    
    // Ajustar rama si la actual no está disponible en la nueva modalidad
    if (nuevaModalidad === "INDIVIDUAL" && filtroRama !== "TODAS" && filtroRama !== "UNICA" && filtroRama !== "MIXTO") {
      setFiltroRama("TODAS");
    } else if (nuevaModalidad === "EQUIPO" && filtroRama !== "TODAS" && filtroRama !== "VARONIL" && filtroRama !== "FEMENIL") {
      setFiltroRama("TODAS");
    }
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
  }, []);

  // Callback que refresca listas tras crear algo (equipo / inscripcion / asignacion)
  async function handleAfterCreate() {
    await cargarDisciplinas();
  }

  // Filtrar disciplinas según los filtros activos
  const disciplinasFiltradas = disciplinas.filter((d) => {
    if (filtroTipo !== "TODAS" && d.tipo !== filtroTipo) return false;
    if (filtroRama !== "TODAS" && d.rama !== filtroRama) return false;
    if (filtroModalidad !== "TODAS" && d.modalidad !== filtroModalidad) return false;
    return true;
  });

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
              {filtroModalidad === "INDIVIDUAL" && <span className="text-xs text-slate-500 ml-1">(Única/Mixto)</span>}
              {filtroModalidad === "EQUIPO" && <span className="text-xs text-slate-500 ml-1">(Varonil/Femenil)</span>}
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