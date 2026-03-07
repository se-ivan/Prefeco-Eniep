"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ParticipantsTable from "@/components/ParticipantsTable";
import TeamMembersModal from "@/components/TeamMembersModal";

/* ---------- Tipos locales (compatibles con tus componentes) ---------- */

type PageDisciplina = {
  id: number;
  nombre: string;
  rama?: string | null;
  modalidad: "INDIVIDUAL" | "EQUIPO";
  categorias?: { id: number; nombre: string }[] | null;
  minIntegrantes?: number | null;
  maxIntegrantes?: number | null;
};

type Equipo = {
  id: number;
  nombreEquipo: string;
  institucionId: number;
  disciplinaId: number;
  institucion: { id: number; nombre: string };
  categoria?: { id: number; nombre: string } | null;
  integrantesCount?: number | null;
};

type ParticipanteRow = {
  id: number; // id del participante / personal
  inscripcionId?: number | null;
  asignacionId?: number | null;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  institucion: { id: number; nombre: string };
  categoria?: { id: number; nombre: string } | null;
};

/* ------------------ Componente principal ------------------ */

export default function ParticipantesPage() {
  const params = useParams();
  const disciplinaIdFromUrl = Number(params?.id ?? NaN);

  const [disciplina, setDisciplina] = useState<PageDisciplina | null>(null);
  const [instituciones, setInstituciones] = useState<{ id: number; nombre: string }[]>([]);
  const [selectedInstitucionId, setSelectedInstitucionId] = useState<number | "">("");

  // solo ALUMNO / APOYO (default ALUMNO)
  const [entityType, setEntityType] = useState<"ALUMNO" | "APOYO">("ALUMNO");
  
  // Filtro de categoría (default: todas)
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | "">("");

  const [rowsTeams, setRowsTeams] = useState<Equipo[]>([]);
  const [rowsIndividuals, setRowsIndividuals] = useState<ParticipanteRow[]>([]);
  const [rowsApoyo, setRowsApoyo] = useState<ParticipanteRow[]>([]);

  const [loading, setLoading] = useState(false);

  // Team viewer modal
  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Equipo | null>(null);

  // --- cargar disciplina y instituciones al montar ---
  useEffect(() => {
    if (!Number.isInteger(disciplinaIdFromUrl)) {
      setDisciplina(null);
      return;
    }

    // cargar disciplina
    (async () => {
      try {
        const res = await fetch(`/api/disciplinas/${disciplinaIdFromUrl}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d = await res.json();
        setDisciplina(d ?? null);
      } catch (err) {
        console.error("No se pudo cargar la disciplina:", err);
        setDisciplina(null);
      }
    })();

    // cargar instituciones (para filtro opcional)
    (async () => {
      try {
        const res = await fetch("/api/instituciones");
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        setInstituciones(data ?? []);
      } catch (err) {
        console.error("No se pudo cargar instituciones:", err);
        setInstituciones([]);
      }
    })();
  }, [disciplinaIdFromUrl]);

  // --- recargar lista cuando cambien disciplina / tipo (ALUMNO/APOYO) / institucion ---
  useEffect(() => {
    async function load() {
      if (!Number.isInteger(disciplinaIdFromUrl)) return;
      setLoading(true);

      try {
        const disciplinaModalidad = disciplina?.modalidad ?? undefined;

        // parámetros opcionales
        const qs = new URLSearchParams();
        qs.set("disciplinaId", String(disciplinaIdFromUrl));
        if (selectedInstitucionId) qs.set("institucionId", String(selectedInstitucionId));
        if (selectedCategoriaId) qs.set("categoriaId", String(selectedCategoriaId));

        if (entityType === "ALUMNO") {
          if (disciplinaModalidad === "EQUIPO") {
            // equipos
            const res = await fetch(`/api/equipos?${qs.toString()}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            // esperar: [{ id, nombreEquipo, institucion, categoria, integrantesCount }]
            setRowsTeams(data ?? []);
            setRowsIndividuals([]);
            setRowsApoyo([]);
          } else {
            // individuales
            const res = await fetch(`/api/participantes-inscritos?${qs.toString()}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            // mapear al tipo ParticipanteRow (esperamos inscripcionId, participanteId, nombres, apellidoPaterno, institucion, categoria)
            const mapped: ParticipanteRow[] = (data ?? []).map((i: any) => ({
              id: i.participanteId ?? i.id,
              inscripcionId: i.inscripcionId ?? null,
              nombres: i.nombres,
              apellidoPaterno: i.apellidoPaterno,
              apellidoMaterno: i.apellidoMaterno ?? null,
              institucion: i.institucion ?? { id: 0, nombre: "—" },
              categoria: i.categoria ?? null,
            }));
            setRowsIndividuals(mapped);
            setRowsTeams([]);
            setRowsApoyo([]);
          }
        } else {
          // APOYO
          const res = await fetch(`/api/personal-apoyo-inscrito?${qs.toString()}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const mapped: ParticipanteRow[] = (data ?? []).map((a: any) => ({
            id: a.personalId ?? a.id,
            asignacionId: a.asignacionId ?? null,
            nombres: a.nombres,
            apellidoPaterno: a.apellidoPaterno,
            apellidoMaterno: a.apellidoMaterno ?? null,
            institucion: a.institucion ?? { id: 0, nombre: "—" },
            categoria: a.categoria ?? null,
          }));
          setRowsApoyo(mapped);
          setRowsTeams([]);
          setRowsIndividuals([]);
        }
      } catch (err) {
        console.error("Error cargando datos de tabla:", err);
        setRowsTeams([]);
        setRowsIndividuals([]);
        setRowsApoyo([]);
      } finally {
        setLoading(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps, selectedCategoriaId
  }, [disciplina, disciplinaIdFromUrl, entityType, selectedInstitucionId]);

  // --- acciones UI / CRUD local + llamadas a endpoints ---
  function handleOpenTeam(team: Equipo | any) {
    setCurrentTeam(team as Equipo);
    setOpenTeamModal(true);
  }

  async function handleDeleteTeamLocally(id: number) {
    if (!confirm("¿Eliminar equipo? Esta acción borra todas las inscripciones del equipo.")) return;
    try {
      const res = await fetch(`/api/equipos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      // borrar localmente
      setRowsTeams((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error borrando equipo:", err);
      alert("No se pudo eliminar el equipo (revisa consola).");
    }
  }

  async function handleDeleteInscripcionLocally(inscripcionId: number) {
    if (!confirm("¿Eliminar?")) return;
    try {
      const res = await fetch(`/api/inscripciones/${inscripcionId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `HTTP ${res.status}`);
      }

      setRowsIndividuals((prev) => prev.filter((p) => p.inscripcionId !== inscripcionId));
    } catch (err) {
      console.error("Error eliminando inscripción:", err);
      alert("Error eliminando (revisa consola).");
    }
  }

  async function handleDeleteApoyoLocally(asignacionId: number) {
    if (!confirm("¿Eliminar?")) return;
    try {
      const res = await fetch(`/api/asignacion-apoyo/${asignacionId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `HTTP ${res.status}`);
      }

      setRowsApoyo((prev) => prev.filter((p) => p.asignacionId !== asignacionId));
    } catch (err) {
      console.error("Error eliminando asignación de apoyo:", err);
      alert("Error eliminando (revisa consola).");
    }
  }

  const ramaPretty = (r?: string | null) => {
    if (!r) return "—";
    switch (r) {
      case "VARONIL": return "Varonil";
      case "FEMENIL": return "Femenil";
      case "UNICA": return "Única";
      case "MIXTO": return "Mixto";
      default: return r;
    }
  };

  // instituciones + opción vacía
  const institucionOptions = [{ id: 0, nombre: "(todas)" }, ...instituciones];

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Participantes — Disciplina</h1>
          <p className="text-sm text-slate-500">Vista por disciplina — ver participantes o equipos registrados.</p>
        </div>
      </div>

      {/* Cabecera: mostrar disciplina (no editable) + selector alumno/apoyo + institución */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-4">
          <div>
            <div className="text-xs text-gray-500">Disciplina</div>
            <div className="font-medium">{disciplina?.nombre ?? "Cargando..."}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Rama</div>
            <div className="font-medium">{ramaPretty(disciplina?.rama)}</div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Modalidad</div>
            <div className="font-medium">{disciplina?.modalidad === "EQUIPO" ? "Equipo" : disciplina?.modalidad === "INDIVIDUAL" ? "Individual" : "—"}</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-50">
            <label htmlFor="filtro-tipo" className="block text-xs text-gray-500 mb-1">
              Mostrar
            </label>
            <select
              id="filtro-tipo"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as "ALUMNO" | "APOYO")}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALUMNO">Alumnos</option>
              <option value="APOYO">Personal de apoyo</option>
            </select>
          </div>

          <div className="flex-1 min-w-50">
            <label htmlFor="filtro-categoria" className="block text-xs text-gray-500 mb-1">
              Categoría
            </label>
            <select
              id="filtro-categoria"
              value={selectedCategoriaId}
              onChange={(e) => setSelectedCategoriaId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">(todas las categorías)</option>
              {(disciplina?.categorias ?? []).map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-50">
            <label htmlFor="filtro-institucion" className="block text-xs text-gray-500 mb-1">
              Institución
            </label>
            <select
              id="filtro-institucion"
              value={selectedInstitucionId ?? ""}
              onChange={(e) => setSelectedInstitucionId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">(todas las instituciones)</option>
              {instituciones.map((ins) => (
                <option key={ins.id} value={ins.id}>{ins.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="space-y-4">
        <ParticipantsTable
          loading={loading}
          modalidad={disciplina?.modalidad ?? undefined}
          entityType={entityType}
          teams={rowsTeams}
          individuals={rowsIndividuals}
          apoyos={rowsApoyo}
          selectedCategoriaId={selectedCategoriaId}
          onViewTeam={handleOpenTeam}
          onDeleteTeam={(id) => handleDeleteTeamLocally(id)}
          onDeleteParticipant={(id) => handleDeleteInscripcionLocally(id)}
          onDeleteApoyo={(id) => handleDeleteApoyoLocally(id)}
        />
      </div>

      {/* Team modal */}
      <TeamMembersModal
        open={openTeamModal}
        onClose={() => setOpenTeamModal(false)}
        equipo={currentTeam}
        disciplina={disciplina ? { minIntegrantes: disciplina.minIntegrantes, maxIntegrantes: disciplina.maxIntegrantes } : undefined}
        categoriaId={currentTeam?.categoria?.id}
        onSuccess={async () => {
          // Recargar la lista de equipos
          if (disciplina?.modalidad === "EQUIPO") {
            const qs = new URLSearchParams();
            qs.set("disciplinaId", String(disciplinaIdFromUrl));
            if (selectedInstitucionId) qs.set("institucionId", String(selectedInstitucionId));
            if (selectedCategoriaId) qs.set("categoriaId", String(selectedCategoriaId));
            try {
              const res = await fetch(`/api/equipos?${qs.toString()}`);
              if (res.ok) {
                const data = await res.json();
                setRowsTeams(data ?? []);
              }
            } catch (err) {
              console.error("Error recargando equipos:", err);
            }
          }
        }}
      />
    </main>
  );
}