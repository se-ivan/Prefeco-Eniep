// src/components/ParticipantSelectorModal.tsx
"use client";

import { useEffect, useState, useRef } from "react";

export type SeleccionParticipante = {
  participanteId: number;
  nombreCompleto: string;
  matricula?: string | null;
  esTitular?: boolean;
};

type ParticipanteApi = {
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
  // iniciales: ya seleccionados por el flujo que abre el modal (por ejemplo, participantes que ya estaban en el equipo)
  initialSelected?: SeleccionParticipante[]; 
  // participantes que ya forman parte del equipo (se muestran en sección separada, readonly)
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

  useEffect(() => {
    if (!open) {
      setQ("");
      setResultados([]);
      setSeleccionados([]);
      setError(null);
      initialRef.current = null;
    }
  }, [open]);

useEffect(() => {
  if (!open) return;

  // serializamos para comparar contenido (válido para arrays pequeños)
  const serialized = JSON.stringify(initialSelected ?? []);
  if (initialRef.current !== serialized) {
    setSeleccionados(initialSelected ?? []);
    initialRef.current = serialized;
  }
  // no ponemos initialSelected en deps para evitar re-ejecuciones por referencia
  // el efecto solo corre al abrir (cambio de `open`)
}, [open]);

  function estáEnExisting(id: number) {
    return existingParticipants.some((p) => p.participanteId === id);
  }

  function toggleSeleccion(p: ParticipanteApi) {
    // si ya está en existing, no se permite añadir (o podrías permitir marcar nuevo titular)
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
  }

  function toggleTitular(id: number) {
    setSeleccionados((prev) =>
      prev.map((s) => (s.participanteId === id ? { ...s, esTitular: !s.esTitular } : s))
    );
  }

  async function confirmar() {
    setError(null);
    if (maxIntegrantes && (existingParticipants.length + seleccionados.length) > maxIntegrantes) {
      setError("Se excede el máximo de integrantes");
      return;
    }
    if (seleccionados.length === 0) {
      setError("No hay participantes nuevos seleccionados");
      return;
    }
    await onConfirm(seleccionados);
    // onConfirm decidir si cerrar o no; por convención cerramos
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-lg w-full max-w-5xl p-6 z-10">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Seleccionar participantes</h3>
          <button onClick={onClose} className="text-sm text-slate-600">Cerrar</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* resultados - izquierda */}
          <div className="lg:col-span-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar nombre, matrícula o CURP..."
              className="w-full border rounded p-2 mb-3"
            />
            <div className="max-h-[420px] overflow-y-auto border rounded divide-y">
              {loading && <div className="p-3 text-sm text-slate-500">Buscando...</div>}
              {!loading && resultados.length === 0 && (
                <div className="p-3 text-sm text-slate-500">No se encontraron participantes</div>
              )}
              {!loading && resultados.map((p) => {
                const seleccionado = seleccionados.some(s => s.participanteId === p.id);
                const enExisting = estáEnExisting(p.id);
                return (
                  <div key={p.id} className="flex items-center justify-between p-3 hover:bg-slate-50">
                    <div>
                      <div className="font-medium">{p.apellidoPaterno} {p.apellidoMaterno} {p.nombres}</div>
                      <div className="text-xs text-slate-500">Matrícula: {p.matricula ?? "—"}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {enExisting ? (
                        <span className="text-xs text-slate-500">Ya en equipo</span>
                      ) : (
                        <button
                          onClick={() => toggleSeleccion(p)}
                          className={`px-3 py-1 rounded text-sm ${seleccionado ? "bg-amber-500 text-white" : "border"}`}
                        >
                          {seleccionado ? "Seleccionado" : "Seleccionar"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* derecha: existentes y nuevos seleccionados */}
          <div className="border rounded p-3 h-[420px] overflow-y-auto">
            <div className="mb-3">
              <strong>En el equipo</strong>
              <div className="text-xs text-slate-500">{existingParticipants.length} actualmente</div>
              <ul className="mt-2 space-y-2">
                {existingParticipants.map((p) => (
                  <li key={p.participanteId} className="p-2 border rounded">
                    <div className="text-sm font-medium">{p.nombreCompleto}</div>
                    <div className="text-xs text-slate-500">Matrícula: {p.matricula ?? "—"}</div>
                    <div className="text-xs text-slate-500">Titular: {p.esTitular ? "Sí" : "No"}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <strong>Nuevos a inscribir</strong>
              <div className="text-xs text-slate-500">{seleccionados.length} seleccionados</div>
              <ul className="mt-2 space-y-2">
                {seleccionados.map((s) => (
                  <li key={s.participanteId} className="p-2 border rounded flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{s.nombreCompleto}</div>
                      <div className="text-xs text-slate-500">Matrícula: {s.matricula ?? "—"}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <label className="text-xs">
                        <input
                          type="checkbox"
                          checked={!!s.esTitular}
                          onChange={() => toggleTitular(s.participanteId)}
                          className="mr-1"
                        />
                        Titular
                      </label>
                      <button
                        onClick={() => setSeleccionados(prev => prev.filter(x => x.participanteId !== s.participanteId))}
                        className="text-xs text-red-600"
                      >
                        Quitar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <footer className="mt-4 flex items-center justify-between">
          <div className="text-sm text-red-600">{error}</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-2 border rounded">Cancelar</button>
            <button onClick={confirmar} className="px-4 py-2 bg-amber-500 text-white rounded">
              Confirmar ({seleccionados.length})
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}