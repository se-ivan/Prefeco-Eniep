"use client";

import { useEffect, useState } from "react";
import TeamsDrawer from "@/components/TeamsDrawer";
import TeamModal from "@/components/TeamModal";
import DisciplineModal from "@/components/DisciplineModal";

type Disciplina = {
  id: number;
  nombre: string;
  minIntegrantes: number;
  maxIntegrantes: number;
  totalEquipos: number;
  totalParticipantes: number;
};

type Equipo = {
  id: number;
  nombreEquipo: string;
  folioRegistro?: string;
};

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);

  const [disciplinaSeleccionada, setDisciplinaSeleccionada] = useState<Disciplina | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [crearEquipoOpen, setCrearEquipoOpen] = useState(false);

  // nuevo: modal para crear disciplina
  const [crearDisciplinaOpen, setCrearDisciplinaOpen] = useState(false);

  // Cargar disciplinas (con contadores)
  async function cargarDisciplinas() {
    try {
      const res = await fetch("/api/disciplinas");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Disciplina[] = await res.json();
      setDisciplinas(data);
    } catch (err) {
      console.error("Error cargando disciplinas:", err);
      setDisciplinas([]);
    }
  }

  useEffect(() => {
    cargarDisciplinas();
  }, []);

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

  async function handleAfterCreate() {
    await cargarDisciplinas();

    if (drawerOpen && disciplinaSeleccionada) {
      try {
        const res = await fetch(`/api/disciplinas/${disciplinaSeleccionada.id}/equipos`);
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

        <div>
          <button
            onClick={() => setCrearDisciplinaOpen(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded shadow-sm text-sm"
          >
            + Registrar disciplina
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {disciplinas.map((d) => (
          <article
            key={d.id}
            className="bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{d.nombre}</h2>

              <div className="mt-3 text-sm text-slate-600 space-y-2">
                <div>
                  <span className="font-medium">{d.totalEquipos ?? "—"}</span> equipos
                </div>

                <div>
                  <span className="font-medium">{d.totalParticipantes ?? "—"}</span>{" "}
                  participantes
                </div>

                <div>
                  Integrantes por equipo:{" "}
                  <span className="font-medium">
                    {d.minIntegrantes} – {d.maxIntegrantes}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => abrirEquipos(d)}
                className="flex-1 px-3 py-2 border rounded text-sm"
              >
                Ver equipos
              </button>

              <button
                onClick={() => {
                  setDisciplinaSeleccionada(d);
                  setCrearEquipoOpen(true);
                }}
                className="px-3 py-2 bg-amber-500 text-white rounded text-sm"
              >
                Crear equipo
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Drawer de equipos */}
      <TeamsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        disciplinaNombre={disciplinaSeleccionada?.nombre}
        equipos={equipos}
        maxIntegrantes={disciplinaSeleccionada?.maxIntegrantes}
      />

      {/* Modal crear equipo */}
      {disciplinaSeleccionada && (
        <TeamModal
          open={crearEquipoOpen}
          onClose={() => setCrearEquipoOpen(false)}
          disciplinaId={disciplinaSeleccionada.id}
          onSuccess={async () => {
            setCrearEquipoOpen(false);
            await handleAfterCreate();
          }}
        />
      )}

      {/* Modal crear disciplina */}
      <DisciplineModal
        open={crearDisciplinaOpen}
        onClose={() => setCrearDisciplinaOpen(false)}
        onCreated={async () => {
          // cerrar y recargar
          setCrearDisciplinaOpen(false);
          await handleAfterCreate();
        }}
      />
    </main>
  );
}