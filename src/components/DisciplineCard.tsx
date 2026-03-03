// src/components/DisciplineCard.tsx
"use client";
import React from "react";

type Disciplina = {
  id: number;
  nombre: string;
  tipo: "DEPORTIVA" | "CULTURAL";
  categoria: "FEMENIL" | "VARONIL" | "UNICA";
  modalidad: "INDIVIDUAL" | "EQUIPO";
  minIntegrantes: number;
  maxIntegrantes: number;
  equiposCount?: number;
  participantesCount?: number;
};

type Props = {
  disciplina: Disciplina;
  onOpenTeams: (d: Disciplina) => void;
  onCreateTeam: (d: Disciplina) => void;
};

export function DisciplineCard({ disciplina, onOpenTeams, onCreateTeam }: Props) {
  return (
    <article className="bg-white rounded-lg shadow-sm border p-5 flex flex-col justify-between min-h-[220px]">
      <header>
        <div className="text-lg font-semibold mb-1">{disciplina.nombre}</div>
        <div className="text-xs text-slate-500 uppercase tracking-wide">
          {disciplina.tipo.toLowerCase()} • {disciplina.modalidad.toLowerCase()}
        </div>
      </header>

      <section className="mt-4 flex-1">
        <div className="text-sm text-slate-600">Equipos</div>
        <div className="text-2xl font-bold">{disciplina.equiposCount ?? "—"}</div>

        <div className="mt-4 text-sm text-slate-600">Participantes</div>
        <div className="text-2xl font-bold">{disciplina.participantesCount ?? "—"}</div>

        <div className="mt-3 text-xs text-slate-500">
          Integrantes por equipo
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-slate-100 mr-2 rounded text-xs">
              Min: {disciplina.minIntegrantes}
            </span>
            <span className="inline-block px-2 py-1 bg-slate-100 rounded text-xs">
              Max: {disciplina.maxIntegrantes}
            </span>
          </div>
        </div>
      </section>

      <footer className="mt-4 flex gap-3">
        <button
          onClick={() => onOpenTeams(disciplina)}
          className="flex-1 py-2 rounded border text-sm bg-cream-50 hover:bg-cream-100"
        >
          Ver Equipos
        </button>
        <button
          onClick={() => onCreateTeam(disciplina)}
          className="py-2 px-3 rounded bg-amber-500 text-white text-sm"
        >
          + Nuevo
        </button>
      </footer>
    </article>
  );
}