"use client";
import { useState } from "react";

type ParticipanteInput = {
  participanteId: number;
  esTitular: boolean;
};

type Props = {
  onSubmit: (data: {
    nombreEquipo?: string;
    participantes: ParticipanteInput[];
  }) => Promise<void>;
  mostrarNombreEquipo?: boolean;
};

export default function InscripcionForm({
  onSubmit,
  mostrarNombreEquipo = false,
}: Props) {
  const [nombreEquipo, setNombreEquipo] = useState("");
  const [participantes, setParticipantes] = useState<ParticipanteInput[]>([
    { participanteId: 0, esTitular: true },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function agregarParticipante() {
    setParticipantes([
      ...participantes,
      { participanteId: 0, esTitular: false },
    ]);
  }

  function actualizarParticipante(
    index: number,
    campo: keyof ParticipanteInput,
    valor: any
  ) {
    const copia = [...participantes];
    copia[index] = { ...copia[index], [campo]: valor };
    setParticipantes(copia);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (participantes.some((p) => !p.participanteId)) {
      return setError("Todos los participantes deben tener un ID válido");
    }

    setLoading(true);
    try {
      await onSubmit({
        nombreEquipo: mostrarNombreEquipo ? nombreEquipo : undefined,
        participantes,
      });
    } catch (err: any) {
      setError(err.message || "Error al registrar la inscripción");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mostrarNombreEquipo && (
        <div>
          <label className="block text-sm mb-1">Nombre del equipo</label>
          <input
            className="w-full border rounded p-2"
            value={nombreEquipo}
            onChange={(e) => setNombreEquipo(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <h4 className="font-semibold mb-2">Participantes</h4>

        {participantes.map((p, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="ID Participante"
              className="border rounded p-2 w-32"
              value={p.participanteId || ""}
              onChange={(e) =>
                actualizarParticipante(
                  index,
                  "participanteId",
                  Number(e.target.value)
                )
              }
            />

            <select
              className="border rounded p-2"
              value={p.esTitular ? "titular" : "suplente"}
              onChange={(e) =>
                actualizarParticipante(
                  index,
                  "esTitular",
                  e.target.value === "titular"
                )
              }
            >
              <option value="titular">Titular</option>
              <option value="suplente">Suplente</option>
            </select>
          </div>
        ))}

        <button
          type="button"
          onClick={agregarParticipante}
          className="text-sm text-blue-600"
        >
          + Agregar participante
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-amber-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Registrando..." : "Registrar inscripción"}
      </button>
    </form>
  );
}