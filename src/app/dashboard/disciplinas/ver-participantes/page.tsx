//src\app\dashboard\disciplinas\ver-participantes\page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import ParticipantsTable from "@/components/ParticipantsTable";
import TeamMembersModal from "@/components/TeamMembersModal";

type PageDisciplina = {
  id: number;
  nombre: string;
  rama?: string | null;
  modalidad: "INDIVIDUAL" | "EQUIPO";
  categorias?: { id: number; nombre: string }[] | null;
};

type Equipo = {
  id: number;
  nombreEquipo: string;
  institucion: { id: number; nombre: string };
  categoria: { id: number; nombre: string } | null;
  integrantesCount?: number;
};

type ParticipanteRow = {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  institucion: { id: number; nombre: string };
  categoria: { id: number; nombre: string } | null;
};

export default function ParticipantesPage() {
  const [disciplinas, setDisciplinas] = useState<PageDisciplina[]>([]);
  const [selectedDisciplinaId, setSelectedDisciplinaId] = useState<number | "">("");
  const [selectedRama, setSelectedRama] = useState<string | "">("");
  const [selectedModalidad, setSelectedModalidad] = useState<"INDIVIDUAL" | "EQUIPO" | "">("");
  const [entityType, setEntityType] = useState<"ALUMNO" | "APOYO">("ALUMNO");

  const [rowsTeams, setRowsTeams] = useState<Equipo[]>([]);
  const [rowsIndividuals, setRowsIndividuals] = useState<ParticipanteRow[]>([]);
  const [rowsApoyo, setRowsApoyo] = useState<ParticipanteRow[]>([]);

  const [loading, setLoading] = useState(false);

  // Team viewer
  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Equipo | null>(null);

  // cargar disciplinas (para filtros)
  useEffect(() => {
    fetch("/api/disciplinas")
      .then((r) => r.json())
      .then((data) => {
        setDisciplinas(data ?? []);
      })
      .catch((err) => {
        console.error("No se pudieron cargar disciplinas:", err);
        setDisciplinas([]);
      });
  }, []);

  // Cuando cambian filtros, recargar tabla correspondiente
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Si no hay disciplina seleccionada, limpia filas
        if (!selectedDisciplinaId) {
          setRowsTeams([]);
          setRowsIndividuals([]);
          setRowsApoyo([]);
          setLoading(false);
          return;
        }

        // Si modalidad seleccionada está vacía, intentar inferir desde la disciplina
        let modalidad = selectedModalidad;
        if (!modalidad) {
          const d = disciplinas.find((x) => x.id === Number(selectedDisciplinaId));
          modalidad = (d?.modalidad ?? "") as "INDIVIDUAL" | "EQUIPO" | "";
        }

        // --------------------------
        //  NOTE:
        //  Aquí llamamos a las rutas que tú tendrías que implementar en backend.
        //  Mientras no existan, estas fetch devolverán vacío o fallarán.
        //  Las rutas sugeridas (puedes adaptarlas):
        //   - Equipos: GET /api/disciplinas/:id/equipos
        //   - Inscripciones individuales: GET /api/disciplinas/:id/inscripciones?modalidad=INDIVIDUAL
        //   - Apoyos asignados: GET /api/disciplinas/:id/asignaciones-apoyo
        // --------------------------

        if (entityType === "ALUMNO") {
          if (modalidad === "EQUIPO") {
            // equipos
            const res = await fetch(`/api/disciplinas/${selectedDisciplinaId}/equipos`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            // data should be Equipo[]
            setRowsTeams(data ?? []);
            setRowsIndividuals([]);
            setRowsApoyo([]);
          } else {
            // individual participantes
            const res = await fetch(`/api/disciplinas/${selectedDisciplinaId}/inscripciones?modalidad=INDIVIDUAL`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setRowsIndividuals(data ?? []);
            setRowsTeams([]);
            setRowsApoyo([]);
          }
        } else {
          // APOYO list
          const res = await fetch(`/api/disciplinas/${selectedDisciplinaId}/asignaciones-apoyo`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          setRowsApoyo(data ?? []);
          setRowsTeams([]);
          setRowsIndividuals([]);
        }
      } catch (err) {
        console.error("Error cargando datos de tabla:", err);
        // deja arrays vacíos para evitar crash
        setRowsTeams([]);
        setRowsIndividuals([]);
        setRowsApoyo([]);
      } finally {
        setLoading(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDisciplinaId, selectedRama, selectedModalidad, entityType, disciplinas]);

  const disciplinaOptions = disciplinas;

  // Deriva modalidades/rama del dropdown si el usuario no quiere elegir manualmente
  const ramaOptions = useMemo(() => {
    // podrías extraer ramas desde disciplinas si quieres opciones dinámicas
    return ["VARONIL", "FEMENIL", "UNICA", "MIXTO"];
  }, []);

  function handleOpenTeam(e: Equipo) {
    setCurrentTeam(e);
    setOpenTeamModal(true);
  }

  function handleDeleteTeamLocally(id: number) {
    setRowsTeams((prev) => prev.filter((x) => x.id !== id));
    // Si backend implementado -> llamar DELETE /api/equipos/:id
  }

  function handleDeleteParticipantLocally(id: number) {
    setRowsIndividuals((prev) => prev.filter((x) => x.id !== id));
    setRowsApoyo((prev) => prev.filter((x) => x.id !== id));
    // If backend -> DELETE /api/inscripciones/:id or /api/personal-apoyo/:id as appropriate
  }

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Listado — Participantes / Equipos</h1>
          <p className="text-sm text-slate-500">Filtra por disciplina, rama y modalidad. Selecciona si buscas alumnos o personal de apoyo.</p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-xs block mb-1">Disciplina</label>
            <select
              className="w-full border rounded p-2 text-sm"
              value={selectedDisciplinaId ?? ""}
              onChange={(e) => setSelectedDisciplinaId(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">-- Selecciona disciplina --</option>
              {disciplinaOptions.map((d) => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs block mb-1">Rama</label>
            <select className="w-full border rounded p-2 text-sm" value={selectedRama} onChange={(e) => setSelectedRama(e.target.value)}>
              <option value="">(cualquiera)</option>
              {ramaOptions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs block mb-1">Modalidad</label>
            <select className="w-full border rounded p-2 text-sm" value={selectedModalidad} onChange={(e) => setSelectedModalidad(e.target.value as any)}>
              <option value="">(por disciplina)</option>
              <option value="INDIVIDUAL">Individual</option>
              <option value="EQUIPO">Equipo</option>
            </select>
          </div>

          <div>
            <label className="text-xs block mb-1">Mostrar</label>
            <div className="flex gap-2">
              <button
                onClick={() => setEntityType("ALUMNO")}
                className={`px-3 py-2 rounded text-sm border ${entityType === "ALUMNO" ? "bg-[#08677a] text-white" : ""}`}
              >
                Alumnos
              </button>
              <button
                onClick={() => setEntityType("APOYO")}
                className={`px-3 py-2 rounded text-sm border ${entityType === "APOYO" ? "bg-[#08677a] text-white" : ""}`}
              >
                Personal apoyo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="space-y-4">
        <ParticipantsTable
          loading={loading}
          modalidad={selectedModalidad || undefined}
          entityType={entityType}
          teams={rowsTeams}
          individuals={rowsIndividuals}
          apoyos={rowsApoyo}
          onViewTeam={handleOpenTeam}
          onDeleteTeam={(id) => {
            // confirmar
            if (!confirm("¿Eliminar equipo? Esta acción borra todas las inscripciones del equipo.")) return;
            handleDeleteTeamLocally(id);
          }}
          onDeleteParticipant={(id) => {
            if (!confirm("¿Eliminar participante?")) return;
            handleDeleteParticipantLocally(id);
          }}
        />
      </div>

      {/* Modal ver equipo */}
      <TeamMembersModal
        open={openTeamModal}
        onClose={() => setOpenTeamModal(false)}
        equipo={currentTeam}
        // NOTE: si backend implementado, aquí pasarías callbacks para refrescar
        onRemoveMember={(memberId) => {
          // simulación local: quitar uno del count
          setRowsTeams((prev) => prev.map(t => t.id === currentTeam?.id ? { ...t, integrantesCount: Math.max(0, (t.integrantesCount ?? 1) - 1) } : t));
        }}
      />
    </main>
  );
}