"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  X,
  UserCheck,
  Trash2,
  Info,
  Users as UsersIcon,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* -------------------- Tipos -------------------- */

export type SeleccionParticipante = {
  participanteId: number;
  nombreCompleto: string;
  matricula?: string | null;
};

export type ParticipanteApi = {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  matricula?: string | null;
};

export type PersonalApi = {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  puesto?: string | null;
  telefono?: string | null;
};

type Categoria = { id: number; nombre: string };

type InstitucionOption = {
  id: number;
  nombre: string;
  municipio?: string | null;
};

type Disciplina = {
  id: number;
  nombre: string;
  modalidad: "INDIVIDUAL" | "EQUIPO";
  categorias?: Categoria[];
  minIntegrantes?: number | null;
  maxIntegrantes?: number | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  disciplina: Disciplina;
  onSuccess: () => Promise<void> | void;
  maxIntegrantes?: number;
  existingParticipants?: SeleccionParticipante[];
};

export default function NuevoParticipanteModal({
  open,
  onClose,
  disciplina,
  onSuccess,
  maxIntegrantes,
  existingParticipants = [],
}: Props) {
  function buildInstitutionTeamName(nombreInstitucion: string, municipio?: string | null) {
    const quotedMatch = nombreInstitucion.match(/"([^"]+)"/);
    const quotedText = quotedMatch?.[1]?.trim() || "";
    const prioritizedText = quotedText || nombreInstitucion;

    const normalizedWords = prioritizedText
      .replace(/["'“”‘’.,;:()\[\]{}]/g, " ")
      .split(/\s+/)
      .map((word) => word.trim())
      .filter(Boolean);

    const safeMunicipio = (municipio ?? "").trim();

    if (quotedText) {
      return safeMunicipio ? `${quotedText} - ${safeMunicipio}` : quotedText;
    }

    const importantWords = normalizedWords.filter((word) => word.length >= 4);
    const sourceWords = importantWords.length > 0 ? importantWords : normalizedWords;

    const acronym = sourceWords
      .slice(0, 3)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");

    const fallbackAcronym = prioritizedText.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "").slice(0, 3).toUpperCase() || "EQP";

    return safeMunicipio ? `${acronym || fallbackAcronym} - ${safeMunicipio}` : acronym || fallbackAcronym;
  }

  const [q, setQ] = useState("");
  const [resultados, setResultados] = useState<ParticipanteApi[] | PersonalApi[]>([]);
  const [seleccionados, setSeleccionados] = useState<SeleccionParticipante[]>([]);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const initialRef = useRef<string | null>(null);

  const [instituciones, setInstituciones] = useState<InstitucionOption[]>([]);
  const [institucionId, setInstitucionId] = useState<number | "">("");
  const [tipo, setTipo] = useState<"ALUMNO" | "APOYO" | "">("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");

  const [submitting, setSubmitting] = useState(false);
  const [isResponsable, setIsResponsable] = useState(false);
  const [userInstitucionId, setUserInstitucionId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      setQ("");
      setResultados([]);
      setSeleccionados([]);
      setSearchError(null);
      setCategoriaId("");
      setTipo("");
      if (!isResponsable) {
        setInstitucionId("");
      }
      initialRef.current = null;
    }
  }, [open, isResponsable]);

  // Obtener datos del usuario actual (rol e institucionId)
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) return;
        const me = await res.json();
        if (me?.role === "RESPONSABLE_INSTITUCION" && me?.institucionId) {
          setIsResponsable(true);
          setUserInstitucionId(Number(me.institucionId));
          setInstitucionId(Number(me.institucionId));
        } else {
          setIsResponsable(false);
          setUserInstitucionId(null);
        }
      } catch (err) {
        setIsResponsable(false);
        setUserInstitucionId(null);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/instituciones")
      .then((r) => r.json())
      .then((data) => setInstituciones(data ?? []))
      .catch(() => setInstituciones([]));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const serialized = JSON.stringify(existingParticipants ?? []);
    if (initialRef.current !== serialized) {
      setSeleccionados(existingParticipants ?? []);
      initialRef.current = serialized;
    }
  }, [open, existingParticipants]);

  useEffect(() => {
    if (!open) return;
    if (!institucionId || !tipo) {
      setResultados([]);
      return;
    }

    const controller = new AbortController();
    setLoadingSearch(true);
    setSearchError(null);

    const endpoint = tipo === "APOYO" ? "/api/personal-apoyo" : "/api/participantes";
    const params = new URLSearchParams({
      institucionId: String(institucionId),
      estatus: "ACTIVO",
    });

    fetch(`${endpoint}?${params.toString()}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setResultados(data ?? []);
      })
      .catch((err: any) => {
        if (err?.name === "AbortError") return;
        setResultados([]);
        setSearchError(err?.message ?? "Error al cargar la lista");
      })
      .finally(() => setLoadingSearch(false));

    return () => controller.abort();
  }, [institucionId, tipo, open]);

  const estáEnExisting = (id: number) =>
    existingParticipants.some((p) => p.participanteId === id);

  function toggleSeleccionFromApiResult(p: ParticipanteApi | PersonalApi) {
    const id = (p as any).id as number;
    if (estáEnExisting(id)) return;

    const existe = seleccionados.find((s) => s.participanteId === id);
    if (existe) {
      setSeleccionados((prev) => prev.filter((s) => s.participanteId !== id));
      return;
    }

    if (maxIntegrantes && existingParticipants.length + seleccionados.length + 1 > maxIntegrantes) {
      setSearchError(`Capacidad máxima (${maxIntegrantes}) excedida`);
      return;
    }

    const nombreCompleto = `${(p as any).apellidoPaterno ?? ""} ${(p as any).apellidoMaterno ?? ""} ${(p as any).nombres ?? ""}`.trim();

    setSeleccionados((prev) => [
      ...prev,
      {
        participanteId: id,
        nombreCompleto: nombreCompleto || String(id),
        matricula: (p as any).matricula ?? null,
      },
    ]);
    setSearchError(null);
  }

  function removerSeleccion(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setSeleccionados((prev) => prev.filter((x) => x.participanteId !== id));
  }

  function pickMessageFromUnknown(input: unknown): string | null {
    if (!input) return null;
    if (typeof input === "string") return input.trim() || null;
    if (typeof input !== "object") return null;

    const obj = input as Record<string, unknown>;
    const errorVal = obj.error;
    const msgVal = obj.message;

    if (typeof errorVal === "string" && errorVal.trim()) return errorVal;
    if (typeof msgVal === "string" && msgVal.trim()) return msgVal;

    if (errorVal && typeof errorVal === "object") {
      const nested = errorVal as Record<string, unknown>;
      if (typeof nested.message === "string" && nested.message.trim()) return nested.message;
    }

    return null;
  }

  async function getApiErrorMessage(res: Response, fallback: string) {
    try {
      const parsed = await res.json();
      
      if (typeof parsed?.error === "string" && parsed.error.trim()) {
        return parsed.error;
      }
      if (typeof parsed?.message === "string" && parsed.message.trim()) {
        return parsed.message;
      }
      
      return `${fallback} (HTTP ${res.status})`;
    } catch (err) {
      return `${fallback} (HTTP ${res.status})`;
    }
  }

  async function confirmarAltas() {
    setSearchError(null);
    if (!tipo || (tipo === "ALUMNO" && !institucionId) || !categoriaId || seleccionados.length === 0) {
      setSearchError("Por favor completa los campos y selecciona participantes.");
      return;
    }

    setSubmitting(true);
    try {
      if (tipo === "ALUMNO") {
        const institucionSeleccionada = instituciones.find(
          (ins) => ins.id === Number(institucionId)
        );
        const nombreInstitucion = institucionSeleccionada?.nombre?.trim() || String(institucionId);
        const municipioInstitucion = institucionSeleccionada?.municipio?.trim() || "";

        const payload: any = {
          disciplinaId: Number(disciplina.id),
          modalidad: disciplina.modalidad,
          institucionId: Number(institucionId),
          categoriaId: Number(categoriaId),
          personalIds: [],
          participantes: seleccionados.map((s) => ({ participanteId: s.participanteId })),
        };
        if (disciplina.modalidad === "EQUIPO") {
          payload.nombreEquipo = buildInstitutionTeamName(nombreInstitucion, municipioInstitucion);
        }
        const res = await fetch("/api/inscripciones", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const msg = await getApiErrorMessage(res, "Error en la inscripción");
          throw new Error(msg);
        }
      } else {
        for (const s of seleccionados) {
          const res = await fetch("/api/asignacion-apoyo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              personalId: s.participanteId,
              disciplinaId: Number(disciplina.id),
              categoriaId: Number(categoriaId),
            }),
          });
          if (!res.ok) {
            const msg = await getApiErrorMessage(res, "Error al asignar personal de apoyo");
            throw new Error(msg);
          }
        }
      }
      await onSuccess();
      onClose();
    } catch (err: any) {
      const msg =
        (typeof err?.message === "string" && err.message) ||
        (typeof err === "string" && err) ||
        "Error al registrar";
      setSearchError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const resultadosFiltrados = resultados.filter((p: any) => {
    if (!q) return true;
    const text = `${p.nombres ?? ""} ${p.apellidoPaterno ?? ""} ${p.apellidoMaterno ?? ""} ${p.matricula ?? ""}`.toLowerCase();
    return text.includes(q.toLowerCase());
  });

  const totalIntegrantes = existingParticipants.length + seleccionados.length;
  const isMaxReached = maxIntegrantes ? totalIntegrantes >= maxIntegrantes : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      {/* Modal Contenedor: overflow-hidden y flex-col son clave */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header (Estatico) */}
        <header className="bg-[#08677a] px-6 py-4 text-white flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <UsersIcon size={20} />
            <div>
              <h3 className="font-bold text-lg">Seleccionar participantes</h3>
              <p className="text-xs opacity-80">
                {disciplina.nombre} — {disciplina.modalidad}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`text-xs px-3 py-1 rounded-full font-bold ${isMaxReached ? "bg-red-500 text-white" : "bg-white/20 text-white"}`}>
              {totalIntegrantes} {maxIntegrantes ? `/ ${maxIntegrantes}` : ''} Integrantes
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Body principal con dos columnas */}
        <div className="flex flex-1 flex-col lg:flex-row min-h-0 overflow-hidden">
          
          {/* COLUMNA IZQUIERDA: Búsqueda y Resultados */}
          <div className="flex-[1.4] border-r border-gray-100 flex flex-col min-h-0 bg-gray-50/30">
            {/* Controles fijos arriba */}
            <div className="p-6 pb-2 flex-shrink-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!isResponsable && (
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-500 mb-1 block">Institución</label>
                    <Select
                      value={institucionId ? String(institucionId) : "none"}
                      onValueChange={(value) => setInstitucionId(value === "none" ? "" : Number(value))}
                    >
                      <SelectTrigger className="w-full border border-gray-200 bg-white text-sm font-normal text-gray-700 data-placeholder:text-gray-500 focus:ring-2 focus:ring-[#08677a]/20">
                        <SelectValue placeholder="Selecciona institución" />
                      </SelectTrigger>
                      <SelectContent className="max-h-56 w-[min(92vw,28rem)] bg-white text-gray-700">
                        <SelectItem value="none" className="text-sm font-normal text-gray-700">Selecciona institución</SelectItem>
                        {instituciones.map((ins) => (
                          <SelectItem key={ins.id} value={String(ins.id)} className="text-sm font-normal text-gray-700">
                            {ins.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {isResponsable && (
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-500 mb-1 block">Institución</label>
                    <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-600">
                      {instituciones.find((ins) => ins.id === userInstitucionId)?.nombre || "Cargando..."}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 mb-1 block">Tipo participante</label>
                  <div className="flex gap-2">
                    {(["ALUMNO", "APOYO"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTipo(t)}
                        className={`flex-1 py-2 border rounded-lg text-xs font-bold transition-all ${tipo === t ? "bg-[#08677a] text-white border-[#08677a]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                      >
                        {t === "ALUMNO" ? "Alumno" : "Apoyo"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 mb-1 block">Categoría</label>
                  <Select
                    value={categoriaId ? String(categoriaId) : "none-category"}
                    onValueChange={(value) => setCategoriaId(value === "none-category" ? "" : Number(value))}
                  >
                    <SelectTrigger className="w-full border border-gray-200 bg-white text-sm font-normal text-gray-700 data-placeholder:text-gray-500 focus:ring-2 focus:ring-[#08677a]/20">
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 w-[min(92vw,24rem)] bg-white text-gray-700">
                      <SelectItem value="none-category" className="text-sm font-normal text-gray-700">
                        Selecciona categoría
                      </SelectItem>
                      {(disciplina.categorias ?? []).map((c) => (
                        <SelectItem key={c.id} value={String(c.id)} className="text-sm font-normal text-gray-700">
                          {c.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

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

            {/* LISTA DE RESULTADOS (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0 space-y-2 custom-scrollbar">
              {!institucionId || !tipo ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                  <AlertCircle size={40} className="mb-2 opacity-20" />
                  <p className="text-sm">Configura institución y tipo para listar</p>
                </div>
              ) : loadingSearch ? (
                <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-[#08677a] border-t-transparent rounded-full animate-spin" /></div>
              ) : resultadosFiltrados.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">No hay coincidencias</div>
              ) : (
                resultadosFiltrados.map((p: any) => {
                  const seleccionado = seleccionados.some((s) => s.participanteId === p.id);
                  const enExisting = estáEnExisting(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => !enExisting && toggleSeleccionFromApiResult(p)}
                      disabled={enExisting}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group
                        ${enExisting ? "bg-gray-100 opacity-50 cursor-not-allowed" : seleccionado ? "bg-[#08677a]/5 border-[#08677a] shadow-sm" : "bg-white border-gray-100 hover:border-gray-300"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${seleccionado ? "bg-[#08677a] text-white" : "bg-gray-200 text-gray-500"}`}>
                          {String(p.nombres || "").charAt(0)}{String(p.apellidoPaterno || "").charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-800 leading-tight">{p.nombres} {p.apellidoPaterno}</div>
                          <div className="text-[11px] text-gray-500">Matrícula: {p.matricula ?? "S/N"}</div>
                        </div>
                      </div>
                      {enExisting ? <span className="text-[9px] font-black text-gray-400 uppercase">En equipo</span> : seleccionado ? <UserCheck className="text-[#08677a]" size={18} /> : <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-gray-400" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: Resumen */}
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            <div className="p-6 pb-2 flex-shrink-0">
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Resumen de selección</h4>
            </div>

            <div className="flex-1 overflow-y-auto px-6 min-h-0 space-y-6">
              {existingParticipants.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Ya registrados</p>
                  <div className="space-y-2">
                    {existingParticipants.map((p) => (
                      <div key={p.participanteId} className="p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex justify-between items-center opacity-70">
                        <span className="text-xs font-medium text-gray-600">{p.nombreCompleto}</span>
                        <div className="text-[10px] bg-gray-200 px-2 py-0.5 rounded text-gray-500">Fijo</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-[10px] font-bold text-[#08677a] uppercase mb-2 flex justify-between">
                  Nuevas Altas <span>{seleccionados.length} seleccionados</span>
                </p>
                {seleccionados.length === 0 ? (
                  <div className="py-10 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-300">
                    <UsersIcon size={32} className="mb-2 opacity-20" />
                    <p className="text-xs">Sin selección aún</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {seleccionados.map((s) => (
                      <div key={s.participanteId} className="group p-3 bg-white rounded-xl border border-gray-200 hover:border-red-200 transition-colors flex justify-between items-center shadow-sm">
                        <div className="overflow-hidden">
                          <div className="font-bold text-xs text-gray-800 truncate">{s.nombreCompleto}</div>
                          <div className="text-[10px] text-gray-400">{s.matricula}</div>
                        </div>
                        <button onClick={(e) => removerSeleccion(s.participanteId, e)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Fijo en la derecha */}
            <div className="p-6 border-t border-gray-50 flex-shrink-0 space-y-3">
              {searchError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs flex items-center gap-2 animate-pulse">
                  <AlertCircle size={14} /> {searchError}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">Cancelar</button>
                <button
                  onClick={confirmarAltas}
                  disabled={submitting}
                  className="flex-[2] py-2.5 bg-[#ffb041] hover:bg-[#f0a030] text-[#08677a] rounded-xl text-sm font-black transition-all disabled:opacity-50 shadow-lg shadow-orange-200"
                >
                  {submitting ? "Guardando..." : `Confirmar Selección`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}