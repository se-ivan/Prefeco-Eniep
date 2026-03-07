"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Users,
  Search,
  Loader2,
  CalendarDays,
  Plus,
  Trash2,
  Building2,
  Phone,
  Droplets,
  CreditCard,
  Edit
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Institucion = {
  nombre: string;
};

type Participante = {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  matricula: string;
  genero: string;
  estatus: string;
  tipoSangre?: string;
  contactoEmergenciaNombre?: string;
  contactoEmergenciaTelefono?: string;
  institucion: Institucion;
};

function formatDate(date: Date) {
  const str = date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ListaParticipantesPage() {
  const { data: participantes = [], isLoading, mutate } = useSWR<Participante[]>("/api/participantes");
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este participante?")) return;
    try {
      const res = await fetch(`/api/participantes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Participante eliminado");
      mutate();
    } catch {
      toast.error("Error al eliminar participante");
    }
  };

  const filteredParticipantes = participantes.filter(
    (part) => {
      const name = `${part.nombres} ${part.apellidoPaterno} ${part.apellidoMaterno}`.toLowerCase();
      return name.includes(searchTerm.toLowerCase()) ||
      part.curp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.institucion?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    }
  );

  return (
    <div className="min-h-screen bg-[#FFFFF8]">
      <header className="border-b border-slate-200/60 bg-white border-dashed">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-[17px] font-bold text-[#0b697d]">
              Participantes Registrados
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Directorio de Estudiantes PREFECO
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/participantes">
              <Button className="h-9 gap-2 bg-[#ffa52d] text-white hover:bg-[#ffa52d]/90">
                <Plus className="h-4 w-4" />
                Registrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Actions Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por nombre, CURP, matrícula o institución..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 h-11 rounded-xl border-slate-200 bg-white shadow-sm focus:border-[#0b697d] focus:ring-[#0b697d]/20"
            />
          </div>
          <div className="bg-[#0b697d]/5 px-4 py-2 rounded-xl text-sm font-semibold text-[#0b697d] w-full sm:w-auto text-center border border-[#0b697d]/10">
            Total Registrados: {participantes.length}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#0b697d]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-4 font-medium">Cargando participantes...</p>
          </div>
        ) : filteredParticipantes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <Users className="h-12 w-12 mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-600">
              No se encontraron participantes
            </p>
            {searchTerm ? (
              <p className="text-sm">Intenta con otros términos de búsqueda.</p>
            ) : (
              <p className="text-sm mt-1">Comienza agregando un nuevo participante al sistema.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParticipantes.map((part) => (
              <div
                key={part.id}
                className="group relative flex flex-col bg-white rounded-2xl p-6 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] border border-slate-100 transition-all hover:shadow-lg overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#0b697d] to-[#ffa52d] opacity-80" />
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#0b697d]/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-[#0b697d]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 line-clamp-1">{part.nombres} {part.apellidoPaterno} {part.apellidoMaterno}</h3>
                      <p className="text-xs text-slate-500 font-medium tracking-wide">
                        {part.matricula}
                      </p>
                    </div>
                  </div>
                  <Badge variant={part.estatus === "ACTIVO" ? "default" : "secondary"} className={part.estatus === "ACTIVO" ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200" : ""}>
                    {part.estatus}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <span className="truncate" title={part.institucion?.nombre}>{part.institucion?.nombre || "Sin institución"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      <span className="truncate">{part.curp.substring(0, 10)}...</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                      <Droplets className="h-4 w-4 text-slate-400" />
                      <span>{part.tipoSangre || "N/A"}</span>
                    </div>
                  </div>
                  {(part.contactoEmergenciaNombre || part.contactoEmergenciaTelefono) && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                      <Phone className="h-3 w-3" />
                      <span className="truncate">{part.contactoEmergenciaNombre} ({part.contactoEmergenciaTelefono})</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700 w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(part.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
