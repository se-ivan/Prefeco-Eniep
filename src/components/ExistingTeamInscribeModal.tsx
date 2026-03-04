// src/components/ExistingTeamInscribeModal.tsx
"use client";

import { useEffect, useState } from "react";
import ParticipantSelectorModal, { SeleccionParticipante } from "./ParticipantSelectorModal";

type Props = {
  open: boolean;
  onClose: () => void;
  equipoId: number | null;
  onSuccess?: () => void;
  maxIntegrantes?: number;
};

export default function ExistingTeamInscribeModal({ open, onClose, equipoId, onSuccess, maxIntegrantes }: Props) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [existing, setExisting] = useState<SeleccionParticipante[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !equipoId) return;
    let active = true;
    setLoadingExisting(true);
    fetch(`/api/equipos/${equipoId}/participantes`)
      .then((res) => res.json())
      .then((data: SeleccionParticipante[]) => {
        if (!active) return;
        setExisting(data);
      })
      .catch((err) => {
        console.error(err);
        setExisting([]);
      })
      .finally(() => { if (active) setLoadingExisting(false); });
    return () => { active = false; };
  }, [open, equipoId]);

  async function handleConfirmSeleccion(seleccion: SeleccionParticipante[]) {
    if (!equipoId) return;
    setError(null);
    try {
      // Enviamos solo los nuevos participantes
      const nuevos = seleccion.map(s => ({ participanteId: s.participanteId, esTitular: !!s.esTitular }));
      const res = await fetch(`/api/equipos/${equipoId}/inscripciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantes: nuevos }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || json?.message || `Error ${res.status}`);
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error al inscribir participantes");
    }
  }

  if (!open || !equipoId) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-xl p-6 z-50">
          <header className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Inscribir participantes (equipo existente)</h3>
            <button onClick={onClose} className="text-sm text-slate-600">Cerrar</button>
          </header>

          <div>
            <p className="text-sm text-slate-600 mb-3">Participantes actualmente en el equipo: {existing.length}</p>
            {loadingExisting ? (
              <div className="text-sm text-slate-500">Cargando...</div>
            ) : (
              <ul className="text-sm mb-3 space-y-2 max-h-40 overflow-y-auto">
                {existing.map(p => (
                  <li key={p.participanteId} className="p-2 border rounded">
                    <div className="font-medium">{p.nombreCompleto}</div>
                    <div className="text-xs text-slate-500">Matrícula: {p.matricula ?? "—"}</div>
                    <div className="text-xs text-slate-500">Titular: {p.esTitular ? "Sí" : "No"}</div>
                  </li>
                ))}
                {existing.length === 0 && <li className="text-sm text-slate-500">No hay participantes en este equipo.</li>}
              </ul>
            )}

            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

            <div className="flex gap-2">
              <button onClick={() => setSelectorOpen(true)} className="px-3 py-2 bg-blue-600 text-white rounded">Seleccionar nuevos participantes</button>
              <div className="flex-1 text-sm text-slate-500">{maxIntegrantes ? `Máx integrantes: ${maxIntegrantes}` : ""}</div>
            </div>
          </div>

          <footer className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="px-3 py-2 border rounded">Cancelar</button>
            <button onClick={() => setSelectorOpen(true)} className="px-4 py-2 bg-amber-500 text-white rounded">Abrir selector</button>
          </footer>
        </div>
      </div>

      <ParticipantSelectorModal
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onConfirm={handleConfirmSeleccion}
        maxIntegrantes={maxIntegrantes}
        existingParticipants={existing}
      />
    </>
  );
}