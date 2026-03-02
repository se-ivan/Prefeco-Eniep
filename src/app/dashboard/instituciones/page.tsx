"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Building2,
  MapPin,
  Globe,
  Search,
  Hash,
  Loader2,
  CalendarDays,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Institucion = {
  id: number;
  cct: string;
  nombre: string;
  estado: string;
  zonaEscolar: string;
  urlLogo: string | null;
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

export default function ListaInstitucionesPage() {
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInstituciones = useCallback(async () => {
    try {
      const res = await fetch("/api/instituciones");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setInstituciones(data);
    } catch {
      toast.error("Error al cargar instituciones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstituciones();
  }, [fetchInstituciones]);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta institución?")) return;
    try {
      const res = await fetch(`/api/instituciones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Institución eliminada");
      fetchInstituciones();
    } catch {
      toast.error("Error al eliminar institución");
    }
  };

  const filteredInstituciones = instituciones.filter(
    (inst) =>
      inst.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.cct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFFFF8]">

      <header className="border-b border-slate-200/60 bg-white border-dashed">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-[17px] font-bold text-[#0b697d]">
              Instituciones Registradas
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Directorio de la Red PREFECO
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-md bg-[#0b697d]/1 px-3 py-1.5 text-[13px] font-medium text-[#0b697d]">
              <CalendarDays className="h-4 w-4 opacity-70" />
              <span>{formatDate(new Date())}</span>
            </div>
            <Link href="/dashboard/instituciones/registro">
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
              placeholder="Buscar por CCT, nombre o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 h-11 rounded-xl border-slate-200 bg-white shadow-sm focus:border-[#0b697d] focus:ring-[#0b697d]/20"
            />
          </div>
          <div className="bg-[#0b697d]/5  px-4 py-2 rounded-xl text-sm font-semibold text-[#0b697d] w-full sm:w-auto text-center">
            Total Registrados: {instituciones.length}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#0b697d]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-4 font-medium">Cargando instituciones...</p>
          </div>
        ) : filteredInstituciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-10 shadow-sm">
            <Building2 className="h-12 w-12 mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-60">
              No se encontraron planteles
            </p>
            {searchTerm ? (
              <p className="text-sm">Intenta con otros términos de búsqueda.</p>
            ) : (
              <p className="text-sm mt-1">Comienza agregando una nueva institución al sistema.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstituciones.map((inst) => (
              <div
                key={inst.id}
                className="group relative flex flex-col bg-white rounded-2xl p-6 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] border border-slate-100 transition-all hover:shadow-lg overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#0b697d] to-[#ffa52d] opacity-80" />

                <div className="flex justify-between items-start mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b697d]/10 text-[#0b697d]">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(inst.id)}
                    title="Eliminar institución"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight line-clamp-2">
                  {inst.nombre}
                </h3>

                <div className="mt-4 space-y-3 flex-1">
                  <div className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Hash className="h-4 w-4 text-[#ffa52d] shrink-0 mt-0.5" />
                    <span className="font-mono text-xs bg-slate-100  px-1.5 py-0.5 rounded text-slate-700">
                      {inst.cct}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2.5 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-[#ffa52d] shrink-0 mt-0.5" />
                    <span>{inst.estado}</span>
                  </div>

                  <div className="flex items-start gap-2.5 text-sm text-slate-60">
                    <Globe className="h-4 w-4 text-[#ffa52d] shrink-0 mt-0.5" />
                    <span>{inst.zonaEscolar}</span>
                  </div>
                </div>

                {inst.urlLogo ? (
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                    <img
                      src={inst.urlLogo}
                      alt={`Logo de ${inst.nombre}`}
                      className="h-8 w-8 rounded-full object-cover border border-slate-200 bg-white"
                    />
                    <span className="text-xs text-slate-500 font-medium">Logo configurado</span>
                  </div>
                ) : (
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-400">
                    <div className="h-8 w-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center">
                      <Building2 className="h-3 w-3 opacity-50" />
                    </div>
                    Sin logotipo
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
