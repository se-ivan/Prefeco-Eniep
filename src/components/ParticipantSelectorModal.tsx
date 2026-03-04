"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Search, 
  X, 
  UserCheck, 
  Star, 
  Trash2, 
  Info, 
  Users as UsersIcon,
  AlertCircle
} from "lucide-react";

export type SeleccionParticipante = {
  participanteId: number;
  nombreCompleto: string;
  matricula?: string | null;
  esTitular?: boolean;
};

export type ParticipanteApi = {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  matricula?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: (seleccionados: SeleccionParticipante[]) => Promise<void> | void;
  maxIntegrantes?: number;
  initialSelected?: SeleccionParticipante[]; 
  existingParticipants?: SeleccionParticipante[];
};

export default function ParticipantSelectorModal({
  open,
  onClose,
  onConfirm,
  maxIntegrantes,
  initialSelected = [],
  existingParticipants = [],
}: Props) {
  const [q, setQ] = useState("");
  const [resultados, setResultados] = useState<ParticipanteApi[]>([]);
  const [seleccionados, setSeleccionados] = useState<SeleccionParticipante[]>(initialSelected);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialRef = useRef<string | null>(null);

  // Limpiar estado al cerrar
  useEffect(() => {
    if (!open) {
      setQ("");
      setResultados([]);
      setSeleccionados([]);
      setError(null);
      initialRef.current = null;
    }
  }, [open]);

  // Sincronizar initialSelected
  useEffect(() => {
    if (!open) return;
    const serialized = JSON.stringify(initialSelected ?? []);
    if (initialRef.current !== serialized) {
      setSeleccionados(initialSelected ?? []);
      initialRef.current = serialized;
    }
  }, [open, initialSelected]);


  useEffect(() => {
    if (q.length < 2) {
      setResultados([]);
      setLoading(false);
      setError(null);
      return;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q,
          estatus: "ACTIVO",
        });

        const res = await fetch(`/api/participantes?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status} al buscar participantes`);
        }

        const data: ParticipanteApi[] = await res.json();
        setResultados(data);
        setError(null);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setResultados([]);
        setError(err?.message || "No se pudieron cargar los participantes.");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [q]);

  const estáEnExisting = (id: number) => existingParticipants.some((p) => p.participanteId === id);

  const toggleSeleccion = (p: ParticipanteApi) => {
    if (estáEnExisting(p.id)) return;

    const existe = seleccionados.find((s) => s.participanteId === p.id);
    if (existe) {
      setSeleccionados((prev) => prev.filter((s) => s.participanteId !== p.id));
      setError(null);
      return;
    }

    if (maxIntegrantes && (existingParticipants.length + seleccionados.length + 1) > maxIntegrantes) {
      setError(`Capacidad máxima (${maxIntegrantes}) excedida`);
      return;
    }

    setSeleccionados((prev) => [
      ...prev,
      {
        participanteId: p.id,
        nombreCompleto: `${p.apellidoPaterno} ${p.apellidoMaterno} ${p.nombres}`,
        matricula: p.matricula,
        esTitular: false,
      },
    ]);
    setError(null);
  };

  const toggleTitular = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSeleccionados((prev) =>
      prev.map((s) => (s.participanteId === id ? { ...s, esTitular: !s.esTitular } : s))
    );
  };

  const removerSeleccion = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSeleccionados((prev) => prev.filter((x) => x.participanteId !== id));
    setError(null); 
  };

  const confirmar = async () => {
    setError(null);
    if (maxIntegrantes && (existingParticipants.length + seleccionados.length) > maxIntegrantes) {
      setError("Se excede el máximo de integrantes permitido.");
      return;
    }
    if (seleccionados.length === 0) {
      setError("Debes seleccionar al menos un participante.");
      return;
    }
    await onConfirm(seleccionados);
    onClose();
  };

  if (!open) return null;

  const totalIntegrantes = existingParticipants.length + seleccionados.length;
  const isMaxReached = maxIntegrantes ? totalIntegrantes >= maxIntegrantes : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#08677a]/30 backdrop-blur-sm transition-opacity">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header ENIEP */}
        <header className="bg-[#08677a] px-6 py-5 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <UsersIcon size={20} className="text-[#ffb041]" />
              </div>
              Seleccionar Participantes
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-gray-50/50">
          
          {/* Panel Izquierdo: Buscador y Resultados */}
          <div className="flex-[1.2] p-6 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col min-h-[400px]">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar nombre, matrícula o CURP..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#08677a] focus:border-transparent outline-none transition-all shadow-sm text-sm"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {loading && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 space-y-3">
                  <div className="w-6 h-6 border-2 border-[#08677a] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm">Buscando participantes...</p>
                </div>
              )}
              
              {!loading && q.length > 0 && resultados.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 space-y-2">
                  <AlertCircle size={32} className="text-gray-300" />
                  <p className="text-sm">No se encontraron coincidencias.</p>
                </div>
              )}

              {!loading && q.length === 0 && resultados.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 space-y-2 opacity-60">
                  <Search size={32} className="text-gray-300" />
                  <p className="text-sm text-center">Escribe al menos 2 letras<br/>para comenzar la búsqueda</p>
                </div>
              )}

              {!loading && resultados.map((p) => {
                const seleccionado = seleccionados.some(s => s.participanteId === p.id);
                const enExisting = estáEnExisting(p.id);
                
                return (
                  <button
                    key={p.id}
                    onClick={() => !enExisting && toggleSeleccion(p)}
                    disabled={enExisting}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group
                      ${enExisting ? "bg-gray-100/50 border-gray-200 opacity-60 cursor-not-allowed" : 
                        seleccionado ? "bg-teal-50/50 border-[#08677a] shadow-sm" : "bg-white border-gray-100 hover:border-[#08677a]/30 hover:shadow-sm"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors
                        ${seleccionado ? "bg-[#08677a] text-white" : "bg-gray-100 text-gray-600 group-hover:bg-[#08677a]/10 group-hover:text-[#08677a]"}`}>
                        {p.nombres[0]}{p.apellidoPaterno[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">
                          {p.nombres} {p.apellidoPaterno} {p.apellidoMaterno}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">Matrícula: {p.matricula ?? "—"}</div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {enExisting ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-200 px-2.5 py-1 rounded-md">Ya en equipo</span>
                      ) : seleccionado ? (
                        <div className="bg-[#08677a] text-white p-1.5 rounded-full">
                          <UserCheck size={16} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-[#08677a] transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel Derecho: Selección */}
          <div className="flex-1 p-6 flex flex-col bg-white overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h4 className="font-bold text-gray-800 text-sm">Resumen de Selección</h4>
              <div className={`text-xs px-2.5 py-1 rounded-full font-bold ${isMaxReached ? "bg-red-100 text-red-700" : "bg-teal-50 text-[#08677a]"}`}>
                {totalIntegrantes} {maxIntegrantes ? `/ ${maxIntegrantes}` : ''} Integrantes
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-5">
              
              {/* Participantes Existentes */}
              {existingParticipants.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actualmente en el equipo</p>
                  <div className="space-y-2">
                    {existingParticipants.map((p) => (
                      <div key={p.participanteId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-700">{p.nombreCompleto}</p>
                          <p className="text-xs text-gray-400">Matrícula: {p.matricula ?? "—"}</p>
                        </div>
                        {p.esTitular && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md">
                            <Star size={10} className="fill-amber-600" /> Titular
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nuevos Seleccionados */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-[#08677a] uppercase tracking-widest flex items-center justify-between">
                  Nuevas Altas
                  <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[9px]">{seleccionados.length}</span>
                </p>
                
                {seleccionados.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-gray-100 rounded-2xl text-center bg-gray-50/50">
                    <p className="text-xs text-gray-400">Selecciona participantes de la lista izquierda para agregarlos al equipo.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {seleccionados.map((s) => (
                      <div key={s.participanteId} className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm group hover:border-[#08677a]/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm font-bold text-gray-800 leading-tight">{s.nombreCompleto}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Matrícula: {s.matricula ?? "—"}</p>
                          </div>
                          <button
                            onClick={(e) => removerSeleccion(s.participanteId, e)}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                            title="Quitar participante"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-start border-t border-gray-100 pt-2">
                          <button
                            onClick={(e) => toggleTitular(s.participanteId, e)}
                            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all font-medium
                              ${s.esTitular ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                          >
                            <Star size={14} className={s.esTitular ? "fill-amber-500 text-amber-500" : ""} />
                            {s.esTitular ? "Es Titular" : "Marcar Titular"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer interno */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              {error && (
                <div className="mb-4 p-3 bg-red-50/80 border border-red-100 text-red-600 text-xs rounded-xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
                  <Info size={16} className="flex-shrink-0" /> 
                  <p>{error}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button 
                  onClick={onClose} 
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmar} 
                  disabled={seleccionados.length === 0}
                  className="flex-[1.5] py-2.5 bg-[#ffb041] hover:bg-[#e69b35] disabled:bg-gray-100 disabled:text-gray-400 text-[#08677a] text-sm rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  Confirmar Altas {seleccionados.length > 0 && `(${seleccionados.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}