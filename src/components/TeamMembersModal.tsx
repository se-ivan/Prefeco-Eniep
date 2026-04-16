"use client";

import React, { useEffect, useState } from "react";
import { Search, X, UserCheck, Trash2, AlertCircle, Users as UsersIcon } from "lucide-react";
import {
  TAEKWONDO_CINTAS,
  formatTaekwondoCintaLabel,
  normalizeTaekwondoCinta,
} from "@/lib/taekwondo";

type Equipo = {
  id: number;
  nombreEquipo: string;
  institucionId: number;
  disciplinaId: number;
  institucion?: { id: number; nombre: string } | null;
  categoria?: { id: number; nombre: string } | null;
};

type Miembro = {
  inscripcionId?: number;
  participanteId: number;
  nombreCompleto: string;
  matricula?: string | null;
  cintaTaekwondo?: string | null;
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
  isTaekwondo?: boolean;
  categoriaId?: number;
  onSuccess?: () => Promise<void> | void;
};

export default function TeamMembersModal({
  open,
  onClose,
  equipo,
  disciplina,
  isTaekwondo = false,
  categoriaId,
  onSuccess,
}: Props) {
  const [q, setQ] = useState("");
  const [disponibles, setDisponibles] = useState<ParticipanteApi[]>([]);
  const [miembrosPrevios, setMiembrosPrevios] = useState<Miembro[]>([]);
  const [seleccionados, setSeleccionados] = useState<Miembro[]>([]);
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [cintaTaekwondo, setCintaTaekwondo] = useState("");

  const [loadingMiembros, setLoadingMiembros] = useState(false);
  const [loadingDisponibles, setLoadingDisponibles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Cargar miembros actuales del equipo
  useEffect(() => {
    if (!open || !equipo) return;

    setNombreEquipo(equipo.nombreEquipo ?? "");

    setLoadingMiembros(true);
    fetch(`/api/equipos/${equipo.id}/participantes`)
      .then((r) => r.json())
      .then((data) => {
        setMiembrosPrevios(data ?? []);
        setSeleccionados(data ?? []);
        if (isTaekwondo) {
          const primeraCinta = normalizeTaekwondoCinta(
            (data ?? []).find((item: any) => !!item?.cintaTaekwondo)?.cintaTaekwondo
          ) ?? "";
          setCintaTaekwondo(primeraCinta);
        }
      })
      .catch((err) => {
        console.error("Error cargando miembros:", err);
        setMiembrosPrevios([]);
        setSeleccionados([]);
      })
      .finally(() => setLoadingMiembros(false));
  }, [open, equipo, isTaekwondo]);

  useEffect(() => {
    if (!open) return;
    if (!isTaekwondo) {
      setCintaTaekwondo("");
    }
  }, [open, isTaekwondo]);

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

    if (!nombreEquipo.trim()) {
      setError("Escribe el nombre del equipo.");
      return;
    }

    if (isTaekwondo && !cintaTaekwondo) {
      setError("Selecciona la cinta de Taekwondo.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/equipos/${equipo?.id}/editar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreEquipo: nombreEquipo.trim(),
          participantes: seleccionados.map((m) => ({ participanteId: m.participanteId })),
          categoriaId,
          cintaTaekwondo: isTaekwondo ? cintaTaekwondo : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        const rawError = String(data?.error || "");
        const userFriendlyError = (() => {
          if (rawError.includes("No autenticado")) return "Tu sesión expiró. Por favor, recarga la página.";
          if (rawError.includes("No autorizado")) return "No tienes permisos para actualizar este equipo.";
          if (rawError.toLowerCase().includes("cintataekwondo")) return "Debes seleccionar una cinta válida para Taekwondo.";
          if (rawError.includes("Categoría no encontrada")) return "La categoría seleccionada no está disponible.";
          if (rawError.includes("equipo")) return "No fue posible actualizar el equipo. Verifica los datos e intenta de nuevo.";
          return "No se pudo guardar los cambios del equipo. Intenta nuevamente.";
        })();
        throw new Error(userFriendlyError);
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
        <header className="bg-[#08677a] px-6 py-4 text-white flex justify-between items-center shrink-0">
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
            <button onClick={onClose} className="p-2 cursor-pointer hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Body con dos columnas */}
        <div className="flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* COLUMNA IZQUIERDA: Búsqueda y Resultados */}
          <div className="flex-[1.4] border-r border-gray-100 flex flex-col min-h-0 bg-gray-50/30">
            {/* Búsqueda */}
            <div className="p-6 pb-2 shrink-0">
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
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group cursor-pointer
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
            <div className="p-6 pb-2 shrink-0">
              <div className="mb-4">
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Nombre del equipo</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#08677a] outline-none transition-all shadow-sm"
                  value={nombreEquipo}
                  onChange={(e) => setNombreEquipo(e.target.value)}
                  placeholder="Ejemplo: Lobos"
                />
              </div>
              {isTaekwondo && (
                <div className="mb-4">
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Cinta Taekwondo</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-[#08677a] outline-none transition-all shadow-sm"
                    value={cintaTaekwondo}
                    onChange={(e) => setCintaTaekwondo(e.target.value)}
                  >
                    <option value="">Selecciona cinta</option>
                    {TAEKWONDO_CINTAS.map((cinta) => (
                      <option key={cinta.value} value={cinta.value}>
                        {cinta.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
                      {isTaekwondo && (
                        <div className="text-[10px] text-[#08677a] mt-1">
                          Cinta: {formatTaekwondoCintaLabel(m.cintaTaekwondo || cintaTaekwondo)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setSeleccionados((prev) => prev.filter((x) => x.participanteId !== m.participanteId))}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-50 shrink-0 space-y-3">
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
                <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  disabled={submitting || isMinNotMet}
                  className="flex-2 py-2.5 bg-[#ffb041] hover:bg-[#f0a030] disabled:opacity-50 disabled:cursor-not-allowed text-[#08677a] rounded-xl text-sm font-black transition-all shadow-lg shadow-orange-200 cursor-pointer"
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