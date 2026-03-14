"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

type Categoria = { id: number; nombre: string; deletedAt?: Date | null };

type Disciplina = {
  id: number;
  nombre: string;
  rama?: string | null;
  // tipo lo dejamos fuera de la UI pero puede existir en datos
  modalidad: "INDIVIDUAL" | "EQUIPO";
  minIntegrantes?: number | null;
  maxIntegrantes?: number | null;
  totalEquipos?: number | null;
  totalParticipantes?: number | null;
  totalApoyos?: number | null;
  categorias?: Categoria[] | null | undefined;
  deletedAt?: Date | null;
};

type Props = {
  disciplina: Disciplina;
  /**
   * Llamada cuando el usuario quiere crear/inscribir (+ Nuevo).
   * Opcional — si no se pasa, nada ocurre al pulsar +Nuevo.
   */
  onCreateTeam?: (d: Disciplina) => void | Promise<void>;
  /**
   * Opcional: si lo pasas, el botón "Ver Participantes" llamará esta función.
   * Si no se pasa, el componente navegará automáticamente a:
   * /dashboard/disciplinas/{disciplina.id}/participantes
   */
  onViewParticipants?: (d: Disciplina) => void | Promise<void>;
  isAdmin?: boolean;
  onEditDisciplina?: (d: Disciplina) => void | Promise<void>;
  onDeleteDisciplina?: (d: Disciplina) => void | Promise<void>;
};

function prettyRama(rama?: string | null) {
  if (!rama) return "—";
  switch (rama) {
    case "VARONIL":
      return "Varonil";
    case "FEMENIL":
      return "Femenil";
    case "UNICA":
      return "Única";
    case "MIXTO":
      return "Mixto";
    default:
      return rama;
  }
}

function prettyModalidad(m?: "INDIVIDUAL" | "EQUIPO") {
  if (!m) return "—";
  return m === "EQUIPO" ? "Equipo" : "Individual";
}

export default function DisciplinaCard({
  disciplina,
  onCreateTeam,
  onViewParticipants,
  isAdmin = false,
  onEditDisciplina,
  onDeleteDisciplina,
}: Props) {
  const router = useRouter();

  const handleView = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      // Si el padre proporciona callback, lo usamos (compatibilidad)
      if (onViewParticipants) {
        onViewParticipants(disciplina);
        return;
      }
      // Si no hay callback, navegamos a la página de participantes (ruta dinámica)
      router.push(`/dashboard/disciplinas/${disciplina.id}/participantes`);
    },
    [onViewParticipants, disciplina, router]
  );

  const handleCreate = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      if (onCreateTeam) onCreateTeam(disciplina);
    },
    [onCreateTeam, disciplina]
  );

  return (
    <article className="bg-white rounded-xl shadow border p-5 flex flex-col justify-between">
      {/* HEADER */}
      <div>
        {isAdmin && (
          <div className="flex justify-end gap-2 mb-2">
            <button
              type="button"
              onClick={() => onEditDisciplina?.(disciplina)}
              className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
              aria-label={`Editar disciplina ${disciplina.nombre}`}
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDeleteDisciplina?.(disciplina)}
              className="text-xs px-2 py-1 rounded border border-red-200 text-red-700 hover:bg-red-50"
              aria-label={`Borrar disciplina ${disciplina.nombre}`}
            >
              Borrar
            </button>
          </div>
        )}
        <h3 className="text-lg font-semibold">{disciplina.nombre}</h3>

        {/* Rama y Modalidad - debajo del nombre para mejor responsive */}
        <div className="mt-2 flex flex-wrap gap-3 items-center text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">Rama:</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded">{prettyRama((disciplina as any).rama)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Modalidad:</span>
            <span className="px-2 py-0.5 bg-amber-50 rounded">{prettyModalidad(disciplina.modalidad)}</span>
          </div>
        </div>
      </div>

      {/* CONTADORES */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {disciplina.modalidad === "EQUIPO" && (
          <div>
            <div className="text-sm text-slate-500">Equipos</div>
            <div className="text-2xl font-bold">{disciplina.totalEquipos ?? 0}</div>
          </div>
        )}

        <div className={disciplina.modalidad === "EQUIPO" ? "" : "col-span-2"}>
          <div className="text-sm text-slate-500">Participantes</div>
          <div className="text-2xl font-bold">
            {(disciplina.totalParticipantes ?? 0) + (disciplina.totalApoyos ?? 0)}
          </div>
        </div>
      </div>

      {/* INTEGRANTES: solo si es modalidad EQUIPO */}
      {disciplina.modalidad === "EQUIPO" && (
        <div className="mt-4 border-t pt-3">
          <div className="text-sm text-slate-500 mb-2">Integrantes por equipo</div>

          <div className="flex gap-2">
            <span className="text-xs bg-slate-100 px-2 py-1 rounded">Min: {disciplina.minIntegrantes ?? "-"}</span>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded">Max: {disciplina.maxIntegrantes ?? "-"}</span>
          </div>
        </div>
      )}

      {/* BOTONES */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleView}
          className="flex-1 border rounded py-2 text-sm"
          aria-label={`Ver participantes de ${disciplina.nombre}`}
        >
          Ver Participantes
        </button>

        <button
          onClick={handleCreate}
          className="bg-amber-500 text-white px-4 py-2 rounded text-sm"
          aria-label={`Registrar nuevo participante en ${disciplina.nombre}`}
        >
          + Nuevo
        </button>
      </div>
    </article>
  );
}