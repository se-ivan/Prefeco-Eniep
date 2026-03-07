// src/components/TeamsDrawer.tsx
"use client";
import React, { useState } from "react";
import ExistingTeamInscribeModal from "./ExistingTeamInscribeModal";

type Equipo = {
  id: number;
  nombreEquipo: string;
  folioRegistro?: string| null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  disciplinaNombre?: string;
  equipos?: Equipo[];
  // opcional: pasar maxIntegrantes por disciplina si lo sabes
  maxIntegrantes?: number;
};

export default function TeamsDrawer({ open, onClose, disciplinaNombre, equipos = [], maxIntegrantes }: Props) {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
  const [modalInscribirOpen, setModalInscribirOpen] = useState(false);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex">
        <div className="flex-1" onClick={onClose} />
        <aside className="w-[420px] bg-white shadow-lg p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{disciplinaNombre ?? "Equipos"}</h3>
            <button onClick={onClose} className="text-sm text-slate-600">Cerrar</button>
          </div>

          <ul className="space-y-3">
            {equipos.length === 0 && <li className="text-sm text-slate-600">No hay equipos</li>}
            {equipos.map((e) => (
              <li key={e.id} className="border rounded p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{e.nombreEquipo}</div>
                  <div className="text-xs text-slate-500">Folio: {e.folioRegistro || "—"}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    className="text-sm text-blue-600"
                    onClick={() => { setEquipoSeleccionado(e); setModalInscribirOpen(true); }}
                  >
                    Inscribir participantes
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <ExistingTeamInscribeModal
        open={modalInscribirOpen}
        onClose={() => { setModalInscribirOpen(false); setEquipoSeleccionado(null); }}
        equipoId={equipoSeleccionado?.id ?? null}
        onSuccess={() => {
          // opcional: refrescar lista de equipos o inscripciones en la página principal
        }}
        maxIntegrantes={maxIntegrantes}
      />
    </>
  );
}