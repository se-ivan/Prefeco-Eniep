// src/components/disciplinas/RegisterParticipantsModal.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * RegisterParticipantsModal
 * Modal dinámico para inscribir participantes en una disciplina.
 *
 * Props:
 *  - open, onClose
 *  - disciplinaId: id de la disciplina (se usa para fetch de detalles)
 *  - modalidad: opcional, si no se pasa se usa la modalidad que venga del fetch
 *  - onRegistered: callback cuando se registra correctamente
 *
 * Flujo:
 *  - carga datos de disciplina: min/max, maxPorEscuela, categorias, minPersonalApoyo
 *  - carga lista de participantes (API) (filtrable, por institución opcional)
 *  - carga lista de personal de apoyo (API)
 *  - valida cliente (edad, rama, cantidades)
 *  - arma payload y POST a /api/inscripciones (o endpoint que maneje la creación)
 *
 * IMPORTANTE: la validación final debe ocurrir en backend (atomicidad / race conditions).
 */

type Modalidad = "EQUIPO" | "INDIVIDUAL";

type DisciplinaDetalle = {
  id: number;
  nombre: string;
  tipo: string;
  rama: "VARONIL" | "FEMENIL" | "UNICA" | "MIXTO";
  modalidad: Modalidad;
  minIntegrantes?: number | null;
  maxIntegrantes?: number | null;
  maxParticipantesPorEscuela?: number | null;
  minPersonalApoyo: number;
  categorias: { id: number; nombre: string }[];
};

type ParticipanteShort = {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string; // ISO
  genero: "MASCULINO" | "FEMENINO" | "OTRO";
  institucionId: number;
  matricula?: string | null;
};

type PersonalShort = {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  institucionId: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  disciplinaId: number;
  modalidadOverride?: Modalidad | null; // opcional: forzar modalidad
  onRegistered?: () => void;
  // opcional: fechaInicioEvento para validar edad. Si no, usamos hoy.
  fechaInicioEventoISO?: string | null;
};

export default function RegisterParticipantsModal({
  open,
  onClose,
  disciplinaId,
  modalidadOverride = null,
  onRegistered,
  fechaInicioEventoISO = null,
}: Props) {
  // estado: datos de disciplina desde backend
  const [disc, setDisc] = useState<DisciplinaDetalle | null>(null);
  const [loadingDisc, setLoadingDisc] = useState(false);
  const [errorDisc, setErrorDisc] = useState<string | null>(null);

  // participantes (lista para seleccionar)
  const [participantes, setParticipantes] = useState<ParticipanteShort[]>([]);
  const [loadingPart, setLoadingPart] = useState(false);
  const [qPart, setQPart] = useState("");
  const [institucionFilter, setInstitucionFilter] = useState<number | "">("");

  // personal de apoyo
  const [personalList, setPersonalList] = useState<PersonalShort[]>([]);
  const [selectedPersonalIds, setSelectedPersonalIds] = useState<number[]>([]);

  // selección de participantes para inscribir
  // si modalidad equipo -> lista de { participanteId, esTitular }
  const [selectedTeam, setSelectedTeam] = useState<{ participanteId: number; esTitular: boolean }[]>([]);
  // si individual -> lista simple de participanteId
  const [selectedIndividuals, setSelectedIndividuals] = useState<number[]>([]);

  // campos equipo (nombre, institucion, categoria)
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [equipoInstitucionId, setEquipoInstitucionId] = useState<number | "">("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // calcular fechaInicioEvento (para validación edad)
  const fechaInicio = useMemo(() => {
    if (fechaInicioEventoISO) return new Date(fechaInicioEventoISO);
    return new Date(); // por defecto hoy
  }, [fechaInicioEventoISO]);

  // edad calculada helper
  function edadEnFecha(fechaNacimientoISO: string, referencia: Date) {
    const n = new Date(fechaNacimientoISO);
    let edad = referencia.getFullYear() - n.getFullYear();
    const m = referencia.getMonth() - n.getMonth();
    if (m < 0 || (m === 0 && referencia.getDate() < n.getDate())) edad--;
    return edad;
  }

  // si el modal se abre, cargar detalle de disciplina
  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoadingDisc(true);
    setErrorDisc(null);

    (async () => {
      try {
        const res = await fetch(`/api/disciplinas/${disciplinaId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: DisciplinaDetalle = await res.json();
        if (!active) return;
        setDisc(json);
        // set default categoria si existe
        if (json.categorias?.length) setSelectedCategoriaId(json.categorias[0].id);
      } catch (err: any) {
        console.error("error al cargar disciplina", err);
        if (active) setErrorDisc(err?.message || "Error al cargar disciplina");
      } finally {
        if (active) setLoadingDisc(false);
      }
    })();

    // limpiar al cerrar
    return () => { active = false; };
  }, [open, disciplinaId]);

  // cargar participantes cuando abre o cambia q/institucionFilter
  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoadingPart(true);
    (async () => {
      try {
        const params = new URLSearchParams();
        if (qPart) params.set("q", qPart);
        if (institucionFilter) params.set("institucionId", String(institucionFilter));
        const res = await fetch(`/api/participantes?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr: ParticipanteShort[] = await res.json();
        if (!active) return;
        setParticipantes(arr);
      } catch (err) {
        console.error("error cargar participantes", err);
        if (active) setParticipantes([]);
      } finally {
        if (active) setLoadingPart(false);
      }
    })();
    return () => { active = false; };
  }, [open, qPart, institucionFilter]);

  // cargar personal de apoyo
  useEffect(() => {
    if (!open) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/personal-apoyo`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr: PersonalShort[] = await res.json();
        if (!active) return;
        setPersonalList(arr);
      } catch (err) {
        console.error("error personal apoyo", err);
        if (active) setPersonalList([]);
      }
    })();
    return () => { active = false; };
  }, [open]);

  // helper: toggle selección de participante (para equipo)
  function toggleSelectTeam(p: ParticipanteShort) {
    const exists = selectedTeam.find((s) => s.participanteId === p.id);
    if (exists) {
      setSelectedTeam((s) => s.filter((x) => x.participanteId !== p.id));
    } else {
      setSelectedTeam((s) => [...s, { participanteId: p.id, esTitular: false }]);
    }
  }

  function toggleTitular(id: number) {
    setSelectedTeam((s) => s.map((x) => x.participanteId === id ? { ...x, esTitular: !x.esTitular } : x));
  }

  // helper: select individual
  function toggleSelectIndividual(id: number) {
    setSelectedIndividuals((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  // helper personal apoyo
  function togglePersonal(id: number) {
    setSelectedPersonalIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  // validar cliente (resumen)
  function validaClienteAntesSubmit() {
    if (!disc) return "Disciplina no cargada";
    const modalidad = modalidadOverride ?? disc.modalidad;

    // validar personal apoyo
    if ((selectedPersonalIds.length) < disc.minPersonalApoyo) {
      return `Selecciona al menos ${disc.minPersonalApoyo} personal(es) de apoyo`;
    }

    if (modalidad === "EQUIPO") {
      // nombre equipo
      if (!nombreEquipo.trim()) return "Nombre del equipo obligatorio";
      if (!equipoInstitucionId) return "Selecciona la institución del equipo";

      const minI = disc.minIntegrantes ?? 0;
      const maxI = disc.maxIntegrantes ?? Infinity;
      const total = selectedTeam.length;
      if (total < minI) return `Faltan participantes (min ${minI})`;
      if (total > maxI) return `Excediste el máximo de participantes (${maxI})`;

      // verificar titulares: al menos minIntegrantes deben ser marcados titulares
      const titulares = selectedTeam.filter(s => s.esTitular).length;
      if (titulares < minI) return `Marca al menos ${minI} titulares`;
    } else {
      // INDIVIDUAL
      const maxPorEsc = disc.maxParticipantesPorEscuela ?? 1;
      if (selectedIndividuals.length === 0) return "Selecciona al menos 1 participante";
      // ver límite por institución: contamos por partic antes de enviar (cliente puede mostrar aviso, backend lo valida)
      // aquí hacemos validación simple: si todos son de la misma institucion y exceden, avisamos al usuario
      if (institucionFilter) {
        const seleccionPorInst = participantes.filter(p => selectedIndividuals.includes(p.id) && p.institucionId === Number(institucionFilter)).length;
        if (seleccionPorInst > maxPorEsc) return `La institución seleccionada excede el máximo por escuela (${maxPorEsc})`;
      }
    }

    // validación rama para cada participante seleccionado
    // const referencia = fechaInicio;
    const checarParticipantes = modalidad === "EQUIPO" ? selectedTeam.map(s => participantes.find(p => p.id === s.participanteId)).filter(Boolean) : selectedIndividuals.map(id => participantes.find(p => p.id === id)).filter(Boolean);
    for (const p of checarParticipantes as ParticipanteShort[]) {
      if (!p) continue;
      /*
      const edad = edadEnFecha(p.fechaNacimiento, referencia);
      if (edad >= 20) return `El participante ${p.nombres} ${p.apellidoPaterno} tiene ${edad} años (>=20)`;
      */
      // rama/genero
      if (disc.rama !== "MIXTO" && disc.rama !== "UNICA") {
        if (disc.rama === "VARONIL" && p.genero !== "MASCULINO") return `El participante ${p.nombres} no cumple la rama VARONIL`;
        if (disc.rama === "FEMENIL" && p.genero !== "FEMENINO") return `El participante ${p.nombres} no cumple la rama FEMENIL`;
      }
    }

    return null;
  }

  // Submit: arma payload según modalidad y lo envía
  async function handleSubmit() {
    setError(null);
    if (!disc) {
      setError("Disciplina no cargada");
      return;
    }
    const modalidad = modalidadOverride ?? disc.modalidad;
    const v = validaClienteAntesSubmit();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    try {
      // payload unificado
      let payload: any = {
        disciplinaId: disc.id,
        modalidad,
        personalIds: selectedPersonalIds,
      };

      if (modalidad === "EQUIPO") {
        payload = {
          ...payload,
          nombreEquipo: nombreEquipo.trim(),
          institucionId: Number(equipoInstitucionId),
          participantes: selectedTeam.map(s => ({ participanteId: s.participanteId, esTitular: !!s.esTitular })),
          categoriaId: selectedCategoriaId ?? null,
        };
      } else {
        payload = {
          ...payload,
          institucionId: institucionFilter ? Number(institucionFilter) : undefined,
          participantes: selectedIndividuals.map(id => ({ participanteId: id })),
          categoriaId: selectedCategoriaId ?? null,
        };
      }

      // Enviar a endpoint encargado de inscripciones (backend debe validar todo)
      const res = await fetch("/api/inscripciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.error || json?.message || `Error ${res.status}`);
      }

      // éxito: refrescar vista principal si se necesita
      if (onRegistered) await onRegistered();
      onClose();
    } catch (err: any) {
      console.error("RegisterParticipantsModal:", err);
      setError(err?.message || "Error al registrar");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const modalidad = modalidadOverride ?? disc?.modalidad ?? "EQUIPO";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow w-full max-w-4xl p-4 z-10">
        {/* header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">
            {modalidad === "EQUIPO" ? "Inscribir equipo" : "Inscribir participantes (individual)"}
          </h3>
          <button className="text-sm text-slate-600" onClick={onClose}>Cerrar</button>
        </div>

        {/* contenido principal: si cargando disciplina, mostrar loader */}
        {loadingDisc && <div className="text-sm text-slate-500">Cargando datos de la disciplina...</div>}
        {errorDisc && <div className="text-sm text-red-600">{errorDisc}</div>}
        {!loadingDisc && disc && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* COL1: Form (nombre equipo / institucion / categoria / personal) */}
            <div className="lg:col-span-1 border rounded p-3">
              {modalidad === "EQUIPO" ? (
                <>
                  <label className="block text-sm mb-1">Nombre del equipo</label>
                  <input value={nombreEquipo} onChange={e => setNombreEquipo(e.target.value)} className="w-full border rounded p-2 mb-3" />

                  <label className="block text-sm mb-1">Institución</label>
                  <select className="w-full border rounded p-2 mb-3" value={equipoInstitucionId} onChange={e => setEquipoInstitucionId(e.target.value ? Number(e.target.value) : "")}>
                    <option value="">-- seleccionar institución (opcional) --</option>
                    {/* TODO: debes proveer endpoint /api/instituciones para poblar */}
                  </select>
                </>
              ) : (
                <>
                  <label className="block text-sm mb-1">Filtrar por institución (para validar cupos)</label>
                  <select className="w-full border rounded p-2 mb-3" value={institucionFilter} onChange={e => setInstitucionFilter(e.target.value ? Number(e.target.value) : "")}>
                    <option value="">-- Todas las instituciones --</option>
                    {/* TODO: poblar con /api/instituciones */}
                  </select>
                </>
              )}

              <div>
                <label className="block text-sm mb-1">Categoría</label>
                <select className="w-full border rounded p-2 mb-3" value={selectedCategoriaId ?? ""} onChange={e => setSelectedCategoriaId(e.target.value ? Number(e.target.value) : null)}>
                  <option value="">-- Seleccionar categoría --</option>
                  {disc.categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Asignar personal de apoyo (mín. {disc.minPersonalApoyo})</label>
                <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-2">
                  {personalList.map(p => (
                    <label key={p.id} className="flex items-center justify-between gap-2">
                      <div>
                        {p.nombres} {p.apellidoPaterno}
                        <div className="text-xs text-slate-500">Inst: {p.institucionId}</div>
                      </div>
                      <input type="checkbox" checked={selectedPersonalIds.includes(p.id)} onChange={() => togglePersonal(p.id)} />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* COL2: selector de participantes (búsqueda, lista) */}
            <div className="lg:col-span-2 border rounded p-3">
              <div className="flex items-center gap-3 mb-2">
                <input placeholder="Buscar nombre o matrícula" value={qPart} onChange={e => setQPart(e.target.value)} className="flex-1 border rounded p-2" />
                <button className="px-3 py-1 border rounded">Buscar</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-slate-500 mb-2">Resultados</div>
                  <div className="max-h-64 overflow-y-auto border rounded divide-y">
                    {loadingPart && <div className="p-3 text-sm text-slate-500">Cargando...</div>}
                    {!loadingPart && participantes.length === 0 && <div className="p-3 text-sm text-slate-500">No hay participantes</div>}
                    {!loadingPart && participantes.map(p => {
                      const isSelected = modalidad === "EQUIPO" ? selectedTeam.some(s => s.participanteId === p.id) : selectedIndividuals.includes(p.id);
                      return (
                        <div key={p.id} className="p-2 flex items-center justify-between">
                          <div>
                            <div className="font-medium">{p.apellidoPaterno} {p.apellidoMaterno} {p.nombres}</div>
                            <div className="text-xs text-slate-500">Matrícula: {p.matricula ?? "—"} • Edad: {edadEnFecha(p.fechaNacimiento, fechaInicio)}</div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            {modalidad === "EQUIPO" ? (
                              <>
                                <button className={`px-3 py-1 rounded text-sm ${isSelected ? "bg-amber-500 text-white" : "border"}`} onClick={() => toggleSelectTeam(p)}>{isSelected ? "Seleccionado" : "Seleccionar"}</button>
                                {isSelected && <button className="text-xs text-slate-600" onClick={() => toggleTitular(p.id)}>Marcar/Desmarcar Titular</button>}
                              </>
                            ) : (
                              <button className={`px-3 py-1 rounded text-sm ${isSelected ? "bg-amber-500 text-white" : "border"}`} onClick={() => toggleSelectIndividual(p.id)}>{isSelected ? "Seleccionado" : "Seleccionar"}</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-2">Seleccionados</div>
                  <div className="max-h-64 overflow-y-auto border rounded p-2 space-y-2">
                    {modalidad === "EQUIPO" ? (
                      selectedTeam.length === 0 ? <div className="text-sm text-slate-500">No hay seleccionados</div> :
                      selectedTeam.map(s => {
                        const p = participantes.find(x => x.id === s.participanteId);
                        if (!p) return null;
                        return (
                          <div key={s.participanteId} className="p-2 border rounded flex items-center justify-between">
                            <div>
                              <div className="font-medium">{p.apellidoPaterno} {p.apellidoMaterno} {p.nombres}</div>
                              <div className="text-xs text-slate-500">Matrícula: {p.matricula ?? "—"}</div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="text-xs">{s.esTitular ? <span className="text-emerald-700">Titular</span> : <span className="text-slate-600">Suplente</span>}</div>
                              <div className="flex gap-1">
                                <button className="text-xs text-slate-600" onClick={() => toggleTitular(s.participanteId)}>Alternar Titular</button>
                                <button className="text-xs text-red-600" onClick={() => setSelectedTeam(prev => prev.filter(x => x.participanteId !== s.participanteId))}>Quitar</button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      selectedIndividuals.length === 0 ? <div className="text-sm text-slate-500">No hay seleccionados</div> :
                      selectedIndividuals.map(id => {
                        const p = participantes.find(x => x.id === id);
                        if (!p) return null;
                        return (
                          <div key={id} className="p-2 border rounded flex items-center justify-between">
                            <div>
                              <div className="font-medium">{p.apellidoPaterno} {p.apellidoMaterno} {p.nombres}</div>
                              <div className="text-xs text-slate-500">Matrícula: {p.matricula ?? "—"}</div>
                            </div>
                            <div>
                              <button className="text-xs text-red-600" onClick={() => setSelectedIndividuals(prev => prev.filter(x => x !== id))}>Quitar</button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* mensajes / reglas visibles */}
              <div className="mt-3 text-sm text-slate-600">
                <div>Reglas visibles:</div>
                <ul className="list-disc ml-5">
                  <li>Rama: {disc.rama}</li>
                  <li>Modalidad: {disc.modalidad}</li>
                  {disc.modalidad === "EQUIPO" && <li>Min/Max integrantes: {disc.minIntegrantes} / {disc.maxIntegrantes}</li>}
                  {disc.modalidad === "INDIVIDUAL" && <li>Max por escuela: {disc.maxParticipantesPorEscuela}</li>}
                  <li>Min personal apoyo requerido: {disc.minPersonalApoyo}</li>
                </ul>
              </div>

              {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

              <div className="mt-4 flex justify-end gap-2">
                <button className="px-3 py-2 border rounded" onClick={onClose}>Cancelar</button>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded" disabled={submitting} onClick={handleSubmit}>
                  {submitting ? "Registrando..." : "Confirmar inscripción"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}