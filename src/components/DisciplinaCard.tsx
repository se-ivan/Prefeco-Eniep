"use client";

type Disciplina = {
  id: number;
  nombre: string;
  rama?: string | null;
  tipo?: string | null; // lo dejamos en el tipo pero NO se muestra en la UI
  modalidad: "INDIVIDUAL" | "EQUIPO";
  minIntegrantes?: number | null;
  maxIntegrantes?: number | null;
  totalEquipos?: number | null;
  totalParticipantes?: number | null;
  categorias?: {
    id: number;
    nombre: string;
  }[] ;
};

type Props = {
  disciplina: Disciplina;
  onOpenTeams: (d: Disciplina) => void | Promise<void>;
  onCreateTeam: (d: Disciplina) => void | Promise<void>;
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

export default function DisciplinaCard({ disciplina, onOpenTeams, onCreateTeam }: Props) {
  return (
    <article className="bg-white rounded-xl shadow border p-5 flex flex-col justify-between">

      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold">{disciplina.nombre}</h3>

        {/* Rama y Modalidad - ubicadas debajo del nombre para mejor responsive */}
        <div className="mt-2 flex flex-wrap gap-3 items-center text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">Rama:</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded">{prettyRama(disciplina.rama)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Modalidad:</span>
            <span className="px-2 py-0.5 bg-amber-50 rounded">{prettyModalidad(disciplina.modalidad)}</span>
          </div>
        </div>
      </div>

      {/* CONTADORES */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-slate-500">Equipos</div>
          <div className="text-2xl font-bold">{disciplina.totalEquipos ?? 0}</div>
        </div>

        <div>
          <div className="text-sm text-slate-500">Participantes</div>
          <div className="text-2xl font-bold">{disciplina.totalParticipantes ?? 0}</div>
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
          onClick={() => onOpenTeams(disciplina)}
          className="flex-1 border rounded py-2 text-sm"
        >
          Ver Participantes
        </button>

        <button
          onClick={() => onCreateTeam(disciplina)}
          className="bg-amber-500 text-white px-4 py-2 rounded text-sm"
        >
          + Nuevo
        </button>
      </div>
    </article>
  );
}