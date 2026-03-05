// src/components/TeamMembersModal.tsx
"use client";

import { useEffect, useState } from "react";

type Member = {
  participanteId: number;
  nombreCompleto: string;
  matricula?: string | null;
  esTitular: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  equipoId: number | null;
};

export default function TeamMembersModal({ open, onClose, equipoId }: Props) {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setMembers([]);
      setError(null);
      return;
    }
    if (!equipoId) {
      setMembers([]);
      setError("Equipo inválido");
      return;
    }

    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/equipos/${equipoId}/participantes`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Member[] = await res.json();
        if (!active) return;
        setMembers(data);
      } catch (err: any) {
        console.error("Error cargando integrantes:", err);
        if (active) setError(err?.message || "Error cargando integrantes");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [open, equipoId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4 z-10">
        <header className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Integrantes</h3>
          <button onClick={onClose} className="text-sm text-slate-600">Cerrar</button>
        </header>

        {loading && <div className="text-sm text-slate-500">Cargando...</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {!loading && !error && (
          <>
            {members.length === 0 ? (
              <div className="text-sm text-slate-500">No hay integrantes registrados.</div>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto">
                {members.map((m) => (
                  <li key={m.participanteId} className="p-2 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-medium">{m.nombreCompleto}</div>
                      <div className="text-xs text-slate-500">Matrícula: {m.matricula ?? "—"}</div>
                    </div>
                    <div className="text-sm">
                      {m.esTitular ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs">Titular</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">Suplente</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-3 py-2 border rounded text-sm">Cerrar</button>
        </div>
      </div>
    </div>
  );
}