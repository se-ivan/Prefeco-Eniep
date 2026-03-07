"use client";

import React, { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";

type Equipo = {
  id: number;
  nombreEquipo: string;
  institucion?: { id: number; nombre: string } | null;
  categoria?: { id: number; nombre: string } | null;
};

type Miembro = {
  participanteId: number;
  nombreCompleto: string;
  matricula?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  equipo: Equipo | null;
  onRemoveMember?: (memberId: number) => void; // callback para refrescar
};

export default function TeamMembersModal({ open, onClose, equipo, onRemoveMember }: Props) {
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    // fetch members for team
    async function load() {
      setLoading(true);
      try {
        if (!equipo) {
          setMiembros([]);
          return;
        }
        const res = await fetch(`/api/equipos/${equipo.id}/participantes`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // expected array with participanteId, nombreCompleto, matricula, etc.
        setMiembros(data ?? []);
      } catch (err) {
        console.error("No se pudieron cargar miembros:", err);
        setMiembros([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [open, equipo]);

  async function handleRemove(memberId: number) {
    if (!confirm("¿Quitar este participante del equipo?")) return;
    // Si backend: call DELETE /api/equipos/:equipoId/participantes/:participanteId (o endpoint tuyo)
    // Mientras, actualizar local state:
    setMiembros((prev) => prev.filter((m) => m.participanteId !== memberId));
    if (onRemoveMember) onRemoveMember(memberId);

    try {
      // intento de llamada real (si existe)
      const res = await fetch(`/api/equipos/${equipo?.id}/participantes/${memberId}`, { method: "DELETE" });
      if (!res.ok) {
        // no existe backend o error -> ignoramos (ya actualizamos interfaz)
      }
    } catch (err) {
      // ignore
    }
  }

  if (!open || !equipo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
        <header className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h3 className="font-bold text-lg">{equipo.nombreEquipo}</h3>
            <div className="text-sm text-gray-500">{equipo.institucion?.nombre ?? "—"} • {equipo.categoria?.nombre ?? "—"}</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 rounded hover:bg-gray-100"><X size={18} /></button>
          </div>
        </header>

        <div className="p-4 max-h-[66vh] overflow-y-auto space-y-3">
          {loading ? (
            <div className="py-8 text-center text-sm text-gray-500">Cargando miembros...</div>
          ) : miembros.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">No hay miembros en este equipo.</div>
          ) : (
            <div className="space-y-2">
              {miembros.map((m) => (
                <div key={m.participanteId} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{m.nombreCompleto}</div>
                    <div className="text-xs text-gray-400">Matrícula: {m.matricula ?? "—"}</div>
                  </div>
                  <div>
                    <button onClick={() => handleRemove(m.participanteId)} className="px-2 py-1 text-xs border rounded text-red-600">
                      <Trash2 size={14} /> Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cerrar</button>
        </div>
      </div>
    </div>
  );
}