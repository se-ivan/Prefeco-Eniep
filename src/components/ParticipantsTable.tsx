//src\components\ParticipantsTable.tsx
"use client";

import React from "react";
import { formatTaekwondoCintaLabel } from "@/lib/taekwondo";

type Equipo = {
  id: number;
  nombreEquipo: string;
  institucion: { id: number; nombre: string };
  categoria?: { id: number; nombre: string } | null | undefined;
  cintaTaekwondo?: string | null;
  integrantesCount?: number | null;
};

type ParticipanteRow = {
  id: number;
  inscripcionId?: number | null;
  asignacionId?: number | null;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  cintaTaekwondo?: string | null;
  institucion: { id: number; nombre: string };
  categoria?: { id: number; nombre: string } | null | undefined;
};

type Props = {
  loading: boolean;
  modalidad?: "INDIVIDUAL" | "EQUIPO";
  entityType: "ALUMNO" | "APOYO";
  teams: Equipo[];
  individuals: ParticipanteRow[];
  apoyos: ParticipanteRow[];
  selectedCategoriaId?: number | "";
  isTaekwondo?: boolean;
  onViewTeam: (t: any) => void;
  onDeleteTeam: (id: number) => void;
  onEditParticipant: (participant: ParticipanteRow) => void;
  onDeleteParticipant: (inscripcionId: number) => void;
  onEditApoyo: (personalId: number) => void;
  onDeleteApoyo: (asignacionId: number) => void;
};

export default function ParticipantsTable({
  loading,
  modalidad,
  entityType,
  teams,
  individuals,
  apoyos,
  selectedCategoriaId,
  isTaekwondo,
  onViewTeam,
  onDeleteTeam,
  onEditParticipant,
  onDeleteParticipant,
  onEditApoyo,
  onDeleteApoyo,
}: Props) {
  // Filtrar por categoría si está seleccionada
  const filteredTeams = selectedCategoriaId
    ? teams.filter((t) => t.categoria?.id === selectedCategoriaId)
    : teams;

  const filteredIndividuals = selectedCategoriaId
    ? individuals.filter((p) => p.categoria?.id === selectedCategoriaId)
    : individuals;

  const filteredApoyos = selectedCategoriaId
    ? apoyos.filter((p) => p.categoria?.id === selectedCategoriaId)
    : apoyos;
  if (loading) {
    return <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 text-center">Cargando...</div>;
  }

  if (entityType === "ALUMNO" && modalidad === "EQUIPO") {
    // equipos view
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 p-4">
        <h3 className="font-semibold mb-3 dark:text-slate-100">Equipos</h3>
        <div className="max-h-[52vh] overflow-y-auto overflow-x-auto">
          {filteredTeams.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500 dark:text-slate-400">No hay equipos.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800/50 text-left text-xs text-gray-500 dark:text-slate-400 uppercase">
                <tr>
                  <th className="px-3 py-2">Equipo</th>
                  <th className="px-3 py-2">Institución</th>
                  <th className="px-3 py-2">Categoría</th>
                  {isTaekwondo && <th className="px-3 py-2">Cinta</th>}
                  <th className="px-3 py-2">Integrantes</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="dark:divide-slate-800">
                {filteredTeams.map((t) => (
                  <tr key={t.id} className="border-t dark:border-slate-800">
                    <td className="px-3 py-3 font-medium dark:text-slate-200">{t.nombreEquipo}</td>
                    <td className="px-3 py-3 dark:text-slate-300">{t.institucion?.nombre ?? "—"}</td>
                    <td className="px-3 py-3 dark:text-slate-300">{t.categoria?.nombre ?? "—"}</td>
                    {isTaekwondo && (
                      <td className="px-3 py-3 dark:text-slate-300 font-medium text-amber-600 dark:text-amber-400">
                        {t.cintaTaekwondo ? (
                          <span className="inline-block px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-900 dark:text-amber-300 text-xs whitespace-nowrap">
                            {formatTaekwondoCintaLabel(t.cintaTaekwondo)}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-slate-500 text-xs">Sin asignar</span>
                        )}
                      </td>
                    )}
                    <td className="px-3 py-3 dark:text-slate-300">{t.integrantesCount ?? "-"}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button onClick={() => onViewTeam(t)} className="px-2 py-1 text-xs border dark:border-slate-700 rounded dark:text-slate-300 hover:dark:bg-slate-800">Ver</button>
                        <button onClick={() => onDeleteTeam(t.id)} className="px-2 py-1 text-xs border dark:border-slate-700 rounded text-red-600 dark:text-red-400 hover:dark:bg-slate-800">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // individuales
  if (entityType === "ALUMNO" && modalidad === "INDIVIDUAL") {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 p-4">
        <h3 className="font-semibold mb-3 dark:text-slate-100">Participantes individuales</h3>
        <div className="max-h-[52vh] overflow-y-auto overflow-x-auto">
          {filteredIndividuals.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500 dark:text-slate-400">No hay participantes individuales.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800/50 text-left text-xs text-gray-500 dark:text-slate-400 uppercase">
                <tr>
                  <th className="px-3 py-2">Nombre completo</th>
                  <th className="px-3 py-2">Institución</th>
                  <th className="px-3 py-2">Categoría</th>
                  {isTaekwondo && <th className="px-3 py-2">Cinta</th>}
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="dark:divide-slate-800">
                {filteredIndividuals.map((p) => (
                  <tr key={p.id} className="border-t dark:border-slate-800">
                    <td className="px-3 py-3 dark:text-slate-200">{`${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno ?? ""}`}</td>
                    <td className="px-3 py-3 dark:text-slate-300">{p.institucion?.nombre ?? "—"}</td>
                    <td className="px-3 py-3 dark:text-slate-300">{p.categoria?.nombre ?? "—"}</td>
                    {isTaekwondo && (
                      <td className="px-3 py-3 dark:text-slate-300 font-medium text-amber-600 dark:text-amber-400">
                        {p.cintaTaekwondo ? (
                          <span className="inline-block px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded text-amber-900 dark:text-amber-300 text-xs whitespace-nowrap">
                            {p.cintaTaekwondo.replace(/_/g, " ")}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-slate-500 text-xs">Sin asignar</span>
                        )}
                      </td>
                    )}
                    <td className="px-3 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => onEditParticipant(p)}
                          className="px-2 py-1 text-xs border dark:border-slate-700 rounded text-[#08677a] dark:text-[#2eb4cc] hover:dark:bg-slate-800"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => onDeleteParticipant(p.inscripcionId ?? p.id)}
                          className="px-2 py-1 text-xs border dark:border-slate-700 rounded text-red-600 dark:text-red-400 hover:dark:bg-slate-800"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  // personal de apoyo
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 p-4">
      <h3 className="font-semibold mb-3 dark:text-slate-100">Personal de apoyo</h3>
      <div className="max-h-[52vh] overflow-y-auto overflow-x-auto">
        {filteredApoyos.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-500 dark:text-slate-400">No hay personal de apoyo registrado.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800/50 text-left text-xs text-gray-500 dark:text-slate-400 uppercase">
              <tr>
                <th className="px-3 py-2">Nombre completo</th>
                <th className="px-3 py-2">Institución</th>
                <th className="px-3 py-2">Categoría</th>
                <th className="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="dark:divide-slate-800">
              {filteredApoyos.map((p) => (
                <tr key={p.id} className="border-t dark:border-slate-800">
                  <td className="px-3 py-3 dark:text-slate-200">{`${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno ?? ""}`}</td>
                  <td className="px-3 py-3 dark:text-slate-300">{p.institucion?.nombre ?? "—"}</td>
                  <td className="px-3 py-3 dark:text-slate-300">{p.categoria?.nombre ?? "—"}</td>
                  <td className="px-3 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => onEditApoyo(p.id)}
                        className="px-2 py-1 text-xs border dark:border-slate-700 rounded text-[#08677a] dark:text-[#2eb4cc] hover:dark:bg-slate-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDeleteApoyo(p.asignacionId ?? p.id)}
                        className="px-2 py-1 text-xs border dark:border-slate-700 rounded text-red-600 dark:text-red-400 hover:dark:bg-slate-800"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}