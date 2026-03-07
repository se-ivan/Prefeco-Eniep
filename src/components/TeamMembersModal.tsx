"use client";

import React, { useEffect, useState } from "react";
import { Search, X, UserCheck, Trash2, AlertCircle, Users as UsersIcon } from "lucide-react";

type Equipo = {
  id: number;
  nombreEquipo: string;
  institucionId: number;
  disciplinaId: number;
  institucion?: { id: number; nombre: string } | null;
  categoria?: { id: number; nombre: string } | null;
};

type Miembro = {
  participanteId: number;
  nombreCompleto: string;
  matricula?: string | null;
};

type ParticipanteApi = {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  matricula?: string | null;
};

type Disciplina = {
  minIntegrantes?: number | null;
  maxIntegrantes?: number | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  equipo: Equipo | null;
  disciplina?: Disciplina;
  categoriaId?: number;
  onSuccess?: () => Promise<void> | void;
};

export default function TeamMembersModal({
  open,
  onClose,
  equipo,
  disciplina,
  categoriaId,
  onSuccess,
}: Props) {
  const [q, setQ] = useState("");
  const [disponibles, setDisponibles] = useState<ParticipanteApi[]>([]);
  const [miembrosPrevios, setMiembrosPrevios] = useState<Miembro[]>([]);
  const [seleccionados, setSeleccionados] = useState<Miembro[]>([]);

  const [loadingMiembros, setLoadingMiembros] = useState(false);
  const [loadingDisponibles, setLoadingDisponibles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Cargar miembros actuales del equipo
  useEffect(() => {
    if (!open || !equipo) return;

    setLoadingMiembros(true);
    fetch(`/api/equipos/${equipo.id}/participantes`)
      .then((r) => r.json())
      .then((data) => {
        setMiembrosPrevios(data ?? []);
        setSeleccionados(data ?? []);
      })
      .catch((err) => {
        console.error("Error cargando miembros:", err);
        setMiembrosPrevios([]);
        setSeleccionados([]);
      })
      .finally(() => setLoadingMiembros(false));
  }, [open, equipo]);

  // Cargar participantes disponibles
  useEffect(() => {
    if (!open || !equipo) return;

    setLoadingDisponibles(true);
    const params = new URLSearchParams({
      institucionId: String(equipo.institucionId),
      estatus: "ACTIVO",
    });

    fetch(`/api/participantes?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setDisponibles(data ?? []))
      .catch((err) => {
        console.error("Error cargando participantes:", err);
        setDisponibles([]);
      })
      .finally(() => setLoadingDisponibles(false));
  }, [open, equipo]);

  function toggleParticipante(p: ParticipanteApi) {
    const existe = seleccionados.find((m) => m.participanteId === p.id);

    if (existe) {
      setSeleccionados((prev) => prev.filter((m) => m.participanteId !== p.id));
      setError(null);
      return;
    }

    const maxIntegrantes = disciplina?.maxIntegrantes ?? Infinity;
    if (seleccionados.length >= maxIntegrantes) {
      setError(`Capacidad máxima (${maxIntegrantes}) alcanzada`);
      return;
    }

    const nombreCompleto = `${p.apellidoPaterno ?? ""} ${p.apellidoMaterno ?? ""} ${p.nombres ?? ""}`.trim();
    setSeleccionados((prev) => [
      ...prev,
      {
        participanteId: p.id,
        nombreCompleto: nombreCompleto || String(p.id),
        matricula: p.matricula ?? null,
      },
    ]);
    setError(null);
  }

  async function handleGuardar() {
    setError(null);

    const minIntegrantes = disciplina?.minIntegrantes ?? 0;
    const maxIntegrantes = disciplina?.maxIntegrantes ?? Infinity;

    if (seleccionados.length < minIntegrantes) {
      setError(`El equipo debe tener al menos ${minIntegrantes} integrante(s)`);
      return;
    }

    if (seleccionados.length > maxIntegrantes) {
      setError(`El equipo no puede exceder ${maxIntegrantes} integrante(s)`);
      return;
    }

    if (!categoriaId) {
      setError("No se especificó la categoría");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/equipos/${equipo?.id}/editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantes: seleccionados.map((m) => ({ participanteId: m.participanteId })),
          categoriaId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar");
      }

      await onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Error al guardar los cambios");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open || !equipo) return null;

  const resultadosFiltrados = disponibles.filter((p) => {
    if (!q) return true;
    const texto = `${p.nombres ?? ""} ${p.apellidoPaterno ?? ""} ${p.apellidoMaterno ?? ""} ${p.matricula ?? ""}`.toLowerCase();
    return texto.includes(q.toLowerCase());
  });

  const minIntegrantes = disciplina?.minIntegrantes ?? 0;
  const maxIntegrantes = disciplina?.maxIntegrantes ?? Infinity;
  const isMinNotMet = seleccionados.length < minIntegrantes;
  const isMaxReached = seleccionados.length >= maxIntegrantes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#08677a] px-6 py-4 text-white flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <UsersIcon size={20} />
            <div>
              <h3 className="font-bold text-lg">Editar Equipo</h3>
              <p className="text-xs opacity-80">{equipo.nombreEquipo}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`text-xs px-3 py-1 rounded-full font-bold ${isMaxReached ? "bg-red-500 text-white" : "bg-white/20 text-white"}`}>
              {seleccionados.length} {maxIntegrantes !== Infinity ? `/ ${maxIntegrantes}` : ""} Integrantes
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Body con dos columnas */}
        <div className="flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* COLUMNA IZQUIERDA: Búsqueda y Resultados */}
          <div className="flex-[1.4] border-r border-gray-100 flex flex-col min-h-0 bg-gray-50/30">
            {/* Búsqueda */}
            <div className="p-6 pb-2 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  className="w-full pl-10 pr-4 py-2.5 border-gray-200 border rounded-xl text-sm focus:border-[#08677a] outline-none transition-all shadow-sm"
                  placeholder="Buscar por nombre o matrícula..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>

            {/* Lista de Disponibles */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0 space-y-2">
              {loadingDisponibles ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-[#08677a] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : resultadosFiltrados.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">No hay participantes disponibles</div>
              ) : (
                resultadosFiltrados.map((p) => {
                  const seleccionado = seleccionados.some((m) => m.participanteId === p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleParticipante(p)}
                      disabled={isMaxReached && !seleccionado}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group
                        ${isMaxReached && !seleccionado ? "opacity-50 cursor-not-allowed" : seleccionado ? "bg-[#08677a]/5 border-[#08677a] shadow-sm" : "bg-white border-gray-100 hover:border-gray-300"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${seleccionado ? "bg-[#08677a] text-white" : "bg-gray-200 text-gray-500"}`}>
                          {String(p.nombres || "").charAt(0)}{String(p.apellidoPaterno || "").charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-800 leading-tight">
                            {p.nombres} {p.apellidoPaterno}
                          </div>
                          <div className="text-[11px] text-gray-500">Matrícula: {p.matricula ?? "S/N"}</div>
                        </div>
                      </div>
                      {seleccionado ? <UserCheck className="text-[#08677a]" size={18} /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-gray-400" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: Resumen */}
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            <div className="p-6 pb-2 flex-shrink-0">
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Miembros del Equipo</h4>
            </div>

            <div className="flex-1 overflow-y-auto px-6 min-h-0 space-y-2">
              {seleccionados.length === 0 ? (
                <div className="py-10 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-300">
                  <UsersIcon size={32} className="mb-2 opacity-20" />
                  <p className="text-xs">Sin miembros seleccionados</p>
                </div>
              ) : (
                seleccionados.map((m) => (
                  <div key={m.participanteId} className="group p-3 bg-white rounded-xl border border-gray-200 hover:border-red-200 transition-colors flex justify-between items-center shadow-sm">
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs text-gray-800 truncate">{m.nombreCompleto}</div>
                      <div className="text-[10px] text-gray-400">{m.matricula}</div>
                    </div>
                    <button
                      onClick={() => setSeleccionados((prev) => prev.filter((x) => x.participanteId !== m.participanteId))}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-50 flex-shrink-0 space-y-3">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle size={14} /> {error}
                </div>
              )}
              {minIntegrantes > 0 && (
                <div className={`p-2 text-[11px] rounded-lg ${isMinNotMet ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
                  ✓ Mínimo: {minIntegrantes} | Máximo: {maxIntegrantes}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  disabled={submitting || isMinNotMet}
                  className="flex-[2] py-2.5 bg-[#ffb041] hover:bg-[#f0a030] disabled:opacity-50 text-[#08677a] rounded-xl text-sm font-black transition-all shadow-lg shadow-orange-200"
                >
                  {submitting ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}