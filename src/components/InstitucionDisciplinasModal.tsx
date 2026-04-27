"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Loader2, Volleyball, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Institucion = {
  id: number;
  nombre: string;
};

type Props = {
  institucion: Institucion | null;
  onClose: () => void;
};

export default function InstitucionDisciplinasModal({ institucion, onClose }: Props) {
  const router = useRouter();

  // Fetch participants for this institution to determine their grouped disciplines
  // We use the same SWR fetcher as the rest of the app, assuming SWR defaults or typical fetch
  const { data: registros, isLoading } = useSWR<any[]>(
    institucion ? `/api/participantes-inscritos?institucionId=${institucion.id}&includeEquipos=true` : null
  );

  const disciplinasUnicas = registros
    ? Array.from(
        new Map(
          registros
            .filter((r) => r.disciplina) // Ensure the record has a discipline
            .map((r) => [r.disciplina.id, r.disciplina]) // Use ID as the Map key
        ).values()
      ).sort((a: any, b: any) => a.nombre.localeCompare(b.nombre))
    : [];

  return (
    <Dialog open={!!institucion} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Disciplinas Registradas</DialogTitle>
          <DialogDescription>
            {institucion?.nombre}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#0b697d]">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="mt-4 font-medium text-sm">Cargando disciplinas...</p>
            </div>
          ) : disciplinasUnicas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
              <Volleyball className="h-10 w-10 mb-3 text-slate-300" />
              <p className="text-base font-medium text-slate-600">No hay disciplinas</p>
              <p className="text-sm mt-1 text-center max-w-sm">
                Esta institución aún no tiene participantes registrados en ninguna disciplina.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {disciplinasUnicas.map((disciplina: any) => {
                // Count how many participants from this institution are in this discipline
                const count = registros?.filter(r => r.disciplina?.id === disciplina.id).length || 0;

                return (
                  <div
                    key={disciplina.id}
                    onClick={() => {
                        onClose();
                        router.push(`/dashboard/disciplinas/${disciplina.id}/participantes?institucionId=${institucion?.id}`);
                    }}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:border-[#0b697d] hover:shadow-md cursor-pointer transition-all"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">
                        {disciplina.nombre}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {disciplina.rama} • {disciplina.modalidad}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0b697d] bg-[#0b697d]/10 px-2 py-1 rounded-md">
                        <Users className="h-3 w-3" />
                        {count} {count === 1 ? 'part.' : 'part.'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}