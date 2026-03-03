"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  disciplinaId: number; // asegurar que se renderiza solo si hay disciplina
  onSuccess?: () => void;
};

type Institucion = { id: number; nombre: string };
type ParticipanteApi = {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  matricula?: string | null;
};
type SeleccionParticipante = {
  participanteId: number;
  nombreCompleto: string;
  matricula?: string | null;
  esTitular: boolean;
};

export default function TeamModal({ open, onClose, disciplinaId, onSuccess }: Props) {
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [folio, setFolio] = useState("");
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [institucionId, setInstitucionId] = useState<number | "">("");
  const [participantes, setParticipantes] = useState<ParticipanteApi[]>([]);
  const [q, setQ] = useState("");
  const [resultados, setResultados] = useState<ParticipanteApi[]>([]);
  const [seleccionados, setSeleccionados] = useState<SeleccionParticipante[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(false);

  // reset cuando se cierra
  useEffect(() => {
    if (!open) {
      setNombreEquipo("");
      setFolio("");
      setInstitucionId("");
      setQ("");
      setResultados([]);
      setSeleccionados([]);
      setError(null);
      setLoading(false);
      setSending(false);
    }
  }, [open]);

  // cargar instituciones al abrir (una vez)
  useEffect(() => {
    if (!open) return;
    let active = true;
    async function loadInstituciones() {
      try {
        const res = await fetch("/api/instituciones");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Institucion[] = await res.json();
        if (!active) return;
        setInstituciones(data);
      } catch (e) {
        console.error("Error cargando instituciones", e);
        setInstituciones([]);
      }
    }
    loadInstituciones();
    return () => { active = false; };
  }, [open]);

  // cargar participantes (puedes cambiar para hacer server-side search)
  // hacemos fetch con query q; si q vacío cargamos todos activos
  useEffect(() => {
    if (!open) return;
    let active = true;
    async function loadParticipantes() {
      // dentro de loadParticipantes()
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (institucionId) params.set("institucionId", String(institucionId));
      const url = `/api/participantes?${params.toString()}`;
      setLoading(true);
      try {
        const url = `/api/participantes?q=${encodeURIComponent(q ?? "")}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ParticipanteApi[] = await res.json();
        if (!active) return;
        // ordenar por apellido paterno, materno, nombres
        data.sort((a, b) => {
          const ap = (a.apellidoPaterno ?? "").localeCompare(b.apellidoPaterno ?? "");
          if (ap !== 0) return ap;
          const am = (a.apellidoMaterno ?? "").localeCompare(b.apellidoMaterno ?? "");
          if (am !== 0) return am;
          return (a.nombres ?? "").localeCompare(b.nombres ?? "");
        });
        setParticipantes(data);
        setResultados(data);
      } catch (e) {
        console.error("error participantes", e);
        setParticipantes([]);
        setResultados([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    // si es la primera vez que abrimos, solo cargar participantes una vez
    // pero permitimos recargar cuando cambia q
    loadParticipantes();
    return () => { active = false; };
  }, [open, q]); // dependemos de q para buscar dinamicamente

  // filtrar resultados client-side (por si el backend no recibe q)
  useEffect(() => {
    if (!q) {
      setResultados(participantes);
      return;
    }
    const lower = q.toLowerCase();
    setResultados(
      participantes.filter((p) =>
        `${p.apellidoPaterno} ${p.apellidoMaterno} ${p.nombres} ${p.matricula ?? ""}`
          .toLowerCase()
          .includes(lower)
      )
    );
  }, [q, participantes]);

  function nombreCompletoFrom(p: ParticipanteApi) {
    return `${p.apellidoPaterno} ${p.apellidoMaterno} ${p.nombres}`;
  }

  function toggleSeleccion(p: ParticipanteApi) {
    const existe = seleccionados.find((s) => s.participanteId === p.id);
    if (existe) {
      setSeleccionados((prev) => prev.filter((s) => s.participanteId !== p.id));
    } else {
      setSeleccionados((prev) => [
        ...prev,
        { participanteId: p.id, nombreCompleto: nombreCompletoFrom(p), matricula: p.matricula, esTitular: false },
      ]);
    }
  }

  function toggleTitular(id: number) {
    setSeleccionados((prev) => prev.map((s) => (s.participanteId === id ? { ...s, esTitular: !s.esTitular } : s)));
  }

  function quitarSeleccion(id: number) {
    setSeleccionados((prev) => prev.filter((s) => s.participanteId !== id));
  }

  async function handleConfirm() {
    setError(null);

    if (!nombreEquipo.trim()) {
      setError("El nombre del equipo es obligatorio");
      return;
    }
    if (!institucionId) {
      setError("Selecciona la institución del equipo");
      return;
    }
    if (seleccionados.length === 0) {
      setError("Selecciona al menos un participante");
      return;
    }

    setSending(true);
    try {
      const body = {
        disciplinaId,
        nombreEquipo,
        folioRegistro: folio || undefined,
        institucionId: Number(institucionId),
        participantes: seleccionados.map((s) => ({
          participanteId: s.participanteId,
          esTitular: !!s.esTitular,
        })),
      };

      const res = await fetch("/api/equipos-with-inscripciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || json?.message || `Error ${res.status}`);
      }

      // éxito
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error al crear equipo e inscripciones");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 z-10">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Crear equipo e inscribir participantes</h3>
          <button onClick={onClose} className="text-sm text-slate-600">Cerrar</button>
        </header>

        {/* FORM: Nombre / Folio / Institución */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Nombre del equipo</label>
            <input value={nombreEquipo} onChange={(e) => setNombreEquipo(e.target.value)} className="w-full border rounded p-2" />
          </div>

          <div>
            <label className="block text-sm mb-1">Folio (opcional)</label>
            <input value={folio} onChange={(e) => setFolio(e.target.value)} className="w-full border rounded p-2" />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm mb-1">Institución</label>
            <select
              value={institucionId}
              onChange={(e) => setInstitucionId(e.target.value ? Number(e.target.value) : "")}
              className="w-full border rounded p-2"
            >
              <option value="">-- Seleccionar institución --</option>
              {instituciones.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  {ins.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PARTICIPANT SELECTOR (integrado) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: búsqueda y resultados (2/3) */}
          <div className="lg:col-span-2">
            <label className="block text-sm mb-2">Buscar participante (nombre o matrícula)</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Escribe nombre o matrícula..."
              className="w-full border rounded p-2 mb-3"
            />

            <div className="border rounded max-h-[420px] overflow-y-auto divide-y">
              {loading && <div className="p-3 text-sm text-slate-500">Cargando...</div>}
              {!loading && resultados.length === 0 && <div className="p-3 text-sm text-slate-500">No se encontraron participantes</div>}
              {!loading && resultados.map((p) => {
                const sel = seleccionados.some((s) => s.participanteId === p.id);
                return (
                  <div key={p.id} className="flex items-center justify-between p-3 hover:bg-slate-50">
                    <div>
                      <div className="font-medium">{p.apellidoPaterno} {p.apellidoMaterno} {p.nombres}</div>
                      <div className="text-xs text-slate-500">Matrícula: {p.matricula ?? "—"}</div>
                    </div>

                    <div>
                      <button
                        onClick={() => toggleSeleccion(p)}
                        className={`px-3 py-1 rounded text-sm ${sel ? "bg-amber-500 text-white" : "border"}`}
                      >
                        {sel ? "Seleccionado" : "Seleccionar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: seleccionados */}
          <div className="border rounded p-3 h-[420px] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <strong>Seleccionados</strong>
              <span className="text-sm text-slate-500">{seleccionados.length}</span>
            </div>

            {seleccionados.length === 0 && <div className="text-sm text-slate-500">No hay participantes seleccionados</div>}

            <ul className="space-y-2">
              {seleccionados.map((s) => (
                <li key={s.participanteId} className="p-2 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.nombreCompleto}</div>
                    <div className="text-xs text-slate-500">Matrícula: {s.matricula ?? "—"}</div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <label className="text-xs flex items-center gap-1">
                      <input type="checkbox" checked={!!s.esTitular} onChange={() => toggleTitular(s.participanteId)} />
                      <span>Titular</span>
                    </label>

                    <button onClick={() => quitarSeleccion(s.participanteId)} className="text-xs text-red-600">Quitar</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* error y botones */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-red-600">{error}</div>

          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-2 border rounded">Cancelar</button>
            <button
              onClick={handleConfirm}
              disabled={sending}
              className="px-4 py-2 bg-amber-500 text-white rounded"
            >
              {sending ? "Registrando..." : "Crear y registrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}