//src\components\ParticipantsTable.tsx
"use client";

import React from "react";

type Equipo = {
  id: number;
  nombreEquipo: string;
  institucion: { id: number; nombre: string };
  categoria?: { id: number; nombre: string } | null | undefined;
  integrantesCount?: number | null;
};

type ParticipanteRow = {
  id: number;
  inscripcionId?: number | null;
  asignacionId?: number | null;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
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
  onViewTeam: (t: any) => void;
  onDeleteTeam: (id: number) => void;
  onEditParticipant: (participantId: number) => void;
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
    return <div className="p-6 bg-white rounded-xl border text-center">Cargando...</div>;
  }

  if (entityType === "ALUMNO" && modalidad === "EQUIPO") {
    // equipos view
    return (
      <div className="bg-white rounded-xl border p-4">
        <h3 className="font-semibold mb-3">Equipos</h3>
        <div className="max-h-[52vh] overflow-y-auto">
          {filteredTeams.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">No hay equipos.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-3 py-2">Equipo</th>
                  <th className="px-3 py-2">Institución</th>
                  <th className="px-3 py-2">Categoría</th>
                  <th className="px-3 py-2">Integrantes</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-3 py-3 font-medium">{t.nombreEquipo}</td>
                    <td className="px-3 py-3">{t.institucion?.nombre ?? "—"}</td>
                    <td className="px-3 py-3">{t.categoria?.nombre ?? "—"}</td>
                    <td className="px-3 py-3">{t.integrantesCount ?? "-"}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button onClick={() => onViewTeam(t)} className="px-2 py-1 text-xs border rounded">Ver</button>
                        <button onClick={() => onDeleteTeam(t.id)} className="px-2 py-1 text-xs border rounded text-red-600">Eliminar</button>
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
      <div className="bg-white rounded-xl border p-4">
        <h3 className="font-semibold mb-3">Participantes individuales</h3>
        <div className="max-h-[52vh] overflow-y-auto">
          {filteredIndividuals.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">No hay participantes individuales.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-3 py-2">Nombre completo</th>
                  <th className="px-3 py-2">Institución</th>
                  <th className="px-3 py-2">Categoría</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredIndividuals.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-3 py-3">{`${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno ?? ""}`}</td>
                    <td className="px-3 py-3">{p.institucion?.nombre ?? "—"}</td>
                    <td className="px-3 py-3">{p.categoria?.nombre ?? "—"}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => onEditParticipant(p.id)}
                          className="px-2 py-1 text-xs border rounded text-[#08677a]"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDeleteParticipant(p.inscripcionId ?? p.id)}
                          className="px-2 py-1 text-xs border rounded text-red-600"
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
    <div className="bg-white rounded-xl border p-4">
      <h3 className="font-semibold mb-3">Personal de apoyo</h3>
      <div className="max-h-[52vh] overflow-y-auto">
        {filteredApoyos.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-500">No hay personal de apoyo registrado.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-3 py-2">Nombre completo</th>
                <th className="px-3 py-2">Institución</th>
                <th className="px-3 py-2">Categoría</th>
                <th className="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredApoyos.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-3">{`${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno ?? ""}`}</td>
                  <td className="px-3 py-3">{p.institucion?.nombre ?? "—"}</td>
                  <td className="px-3 py-3">{p.categoria?.nombre ?? "—"}</td>
                  <td className="px-3 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => onEditApoyo(p.id)}
                        className="px-2 py-1 text-xs border rounded text-[#08677a]"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDeleteApoyo(p.asignacionId ?? p.id)}
                        className="px-2 py-1 text-xs border rounded text-red-600"
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