// src/components/DisciplineModal.tsx
"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void; // callback cuando se creó correctamente
};

export default function DisciplineModal({ open, onClose, onCreated }: Props) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<"DEPORTIVA" | "CULTURAL">("DEPORTIVA");
  const [categoria, setCategoria] = useState<"FEMENIL" | "VARONIL" | "UNICA">("UNICA");
  const [modalidad, setModalidad] = useState<"INDIVIDUAL" | "EQUIPO">("EQUIPO");
  const [minIntegrantes, setMinIntegrantes] = useState<number>(1);
  const [maxIntegrantes, setMaxIntegrantes] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    // validaciones cliente (mirrors server)
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!Number.isInteger(minIntegrantes) || !Number.isInteger(maxIntegrantes)) {
      setError("Min/Max deben ser números enteros");
      return;
    }
    if (minIntegrantes <= 0 || maxIntegrantes <= 0) {
      setError("Min/Max deben ser mayores que 0");
      return;
    }
    if (minIntegrantes > maxIntegrantes) {
      setError("Min no puede ser mayor que Max");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/disciplinas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          tipo,
          categoria,
          modalidad,
          minIntegrantes,
          maxIntegrantes,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }

      // éxito
      setNombre("");
      setMinIntegrantes(1);
      setMaxIntegrantes(5);
      if (onCreated) await onCreated();
      onClose();
    } catch (err: any) {
      console.error("Error creando disciplina:", err);
      setError(err?.message || "Error al crear disciplina");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-10"
      >
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Registrar disciplina</h3>
          <button type="button" onClick={onClose} className="text-sm text-slate-600">Cerrar</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value as any)} className="w-full border rounded p-2">
              <option value="DEPORTIVA">Deportiva</option>
              <option value="CULTURAL">Cultural</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Modalidad</label>
            <select value={modalidad} onChange={(e) => setModalidad(e.target.value as any)} className="w-full border rounded p-2">
              <option value="EQUIPO">Equipo</option>
              <option value="INDIVIDUAL">Individual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Categoría</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value as any)} className="w-full border rounded p-2">
              <option value="UNICA">Única</option>
              <option value="FEMENIL">Femenil</option>
              <option value="VARONIL">Varonil</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Min integrantes</label>
            <input
              type="number"
              min={1}
              value={minIntegrantes}
              onChange={(e) => setMinIntegrantes(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Max integrantes</label>
            <input
              type="number"
              min={1}
              value={maxIntegrantes}
              onChange={(e) => setMaxIntegrantes(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {error && <div className="text-sm text-red-600 mt-3">{error}</div>}

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-2 border rounded">Cancelar</button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-amber-500 text-white rounded"
          >
            {loading ? "Guardando..." : "Crear disciplina"}
          </button>
        </div>
      </form>
    </div>
  );
}