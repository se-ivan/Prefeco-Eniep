"use client";

import React, { useState } from "react";

/**
 * CrearDisciplinaModal (ajustado al schema.prisma)
 *
 * - Ya NO pide ni envía `minPersonalApoyo`.
 * - Categorías: entrada dinámica.
 * - Si modalidad === "EQUIPO" se muestran min/max integrantes.
 * - Si modalidad === "INDIVIDUAL" se muestra maxParticipantesPorEscuela.
 *
 * Nota: el backend espera `categorias: string[]`.
 */

type Tipo = "DEPORTIVA" | "CULTURAL" | "CIVICA" | "ACADEMICA" | "EXHIBICION" | "EMBAJADORA_NACIONAL";
type Modalidad = "EQUIPO" | "INDIVIDUAL";
type Rama = "VARONIL" | "FEMENIL" | "UNICA" | "MIXTO";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function CrearDisciplinaModal({ open, onClose, onCreated }: Props) {
  // --> Estado formulario
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<Tipo>("DEPORTIVA");
  const [rama, setRama] = useState<Rama>("VARONIL");
  const [modalidad, setModalidad] = useState<Modalidad>("EQUIPO");

  // campos equipo
  const [minIntegrantes, setMinIntegrantes] = useState<number>(3);
  const [maxIntegrantes, setMaxIntegrantes] = useState<number>(6);

  // campo individual
  const [maxParticipantesPorEscuela, setMaxParticipantesPorEscuela] = useState<number>(1);

  // categorías dinámicas
  const [categoriaInput, setCategoriaInput] = useState("");
  const [categorias, setCategorias] = useState<string[]>([]);

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  function agregarCategoria() {
    const v = categoriaInput.trim();
    if (!v) return;
    setCategorias((s) => [...s, v]);
    setCategoriaInput("");
  }

  function quitarCategoria(i: number) {
    setCategorias((s) => s.filter((_, idx) => idx !== i));
  }

  // validaciones cliente antes de enviar
  function validaCliente() {
    if (!nombre.trim()) return "El nombre es obligatorio";
    if (modalidad === "EQUIPO") {
      if (!Number.isInteger(minIntegrantes) || minIntegrantes < 1) return "Min integrantes inválido";
      if (!Number.isInteger(maxIntegrantes) || maxIntegrantes < minIntegrantes) return "Max debe ser >= Min";
    } else {
      if (!Number.isInteger(maxParticipantesPorEscuela) || maxParticipantesPorEscuela < 1) return "Max por escuela inválido";
    }
    if (categorias.length === 0) return "Agrega al menos una categoría";
    return null;
  }

  async function handleSubmit() {
    setError(null);
    const v = validaCliente();
    if (v) {
      setError(v);
      return;
    }

    setSaving(true);
    try {
      // Payload recomendado para backend: crear disciplina y categorías en una transacción.
      const payload: any = {
        nombre: nombre.trim(),
        tipo,
        rama,
        modalidad,
        // solo setear min/max si modalidad EQUIPO
        minIntegrantes: modalidad === "EQUIPO" ? minIntegrantes : undefined,
        maxIntegrantes: modalidad === "EQUIPO" ? maxIntegrantes : undefined,
        // solo setear maxParticipantesPorEscuela si INDIVIDUAL
        maxParticipantesPorEscuela: modalidad === "INDIVIDUAL" ? maxParticipantesPorEscuela : undefined,
        categorias, // array de string
      };

      const res = await fetch("/api/disciplinas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || `HTTP ${res.status}`);
      }

      if (onCreated) await onCreated();
      onClose();
      // limpiar (opcional)
      setNombre("");
      setCategorias([]);
    } catch (err: any) {
      console.error("CrearDisciplinaModal:", err);
      setError(err?.message || "Error al crear disciplina");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* fondo */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* modal */}
      <div className="relative bg-white w-full max-w-2xl rounded-lg shadow p-6 z-10">
        {/* encabezado */}
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Registrar disciplina</h3>
          <button className="text-sm text-slate-600" onClick={onClose}>Cerrar</button>
        </header>

        {/* formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* nombre */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Nombre</label>
            <input className="w-full border rounded p-2" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          {/* tipo */}
          <div>
            <label className="block text-sm mb-1">Tipo</label>
            <select
              className="w-full border rounded p-2"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as Tipo)}
            >
              <option value="DEPORTIVA">Deportiva</option>
              <option value="CULTURAL">Cultural</option>
              <option value="CIVICA">Cívica</option>
              <option value="ACADEMICA">Académica</option>
              <option value="EXHIBICION">Exhibición</option>
              <option value="EMBAJADORA_NACIONAL">Embajadora Nacional</option>
            </select>
          </div>

          {/* rama */}
          <div>
            <label className="block text-sm mb-1">Rama</label>
            <select className="w-full border rounded p-2" value={rama} onChange={(e) => setRama(e.target.value as Rama)}>
              <option value="VARONIL">Varonil</option>
              <option value="FEMENIL">Femenil</option>
              <option value="UNICA">Única</option>
              <option value="MIXTO">Mixto</option>
            </select>
          </div>

          {/* modalidad */}
          <div>
            <label className="block text-sm mb-1">Modalidad</label>
            <select className="w-full border rounded p-2" value={modalidad} onChange={(e) => setModalidad(e.target.value as Modalidad)}>
              <option value="EQUIPO">Equipo</option>
              <option value="INDIVIDUAL">Individual</option>
            </select>
          </div>

          {/* campos condicionales */}
          {modalidad === "EQUIPO" && (
            <>
              <div>
                <label className="block text-sm mb-1">Min. integrantes (titulares)</label>
                <input type="number" min={1} className="w-full border rounded p-2"
                  value={minIntegrantes}
                  onChange={(e) => setMinIntegrantes(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Max. integrantes (incluye suplentes)</label>
                <input type="number" min={minIntegrantes} className="w-full border rounded p-2"
                  value={maxIntegrantes}
                  onChange={(e) => setMaxIntegrantes(Number(e.target.value))}
                />
              </div>
            </>
          )}

          {modalidad === "INDIVIDUAL" && (
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Max participantes por categoria de una escuela</label>
              <input type="number" min={1} className="w-full border rounded p-2"
                value={maxParticipantesPorEscuela}
                onChange={(e) => setMaxParticipantesPorEscuela(Number(e.target.value))}
              />
            </div>
          )}

          {/* categorías dinámicas */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Categorías (agrega una por vez)</label>
            <div className="flex gap-2 mb-2">
              <input className="flex-1 border rounded p-2" placeholder="Nombre de la categoría" value={categoriaInput}
                onChange={(e) => setCategoriaInput(e.target.value)} />
              <button type="button" className="px-3 py-2 bg-amber-500 text-white rounded" onClick={agregarCategoria}>+ Agregar</button>
            </div>

            <div className="flex flex-wrap gap-2">
              {categorias.map((c, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded">
                  <span className="text-sm">{c}</span>
                  <button type="button" onClick={() => quitarCategoria(i)} className="text-xs text-red-600">x</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* errores y botones */}
        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-2 border rounded" onClick={onClose}>Cancelar</button>
          <button className="px-4 py-2 bg-amber-500 text-white rounded" disabled={saving} onClick={handleSubmit}>
            {saving ? "Guardando..." : "Crear disciplina"}
          </button>
        </div>
      </div>
    </div>
  );
}