"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import useSWR from "swr";
import { Download, Users, Briefcase, Loader2, Filter } from "lucide-react";

type Institucion = { id: number; nombre: string };
type Disciplina = { id: number; nombre: string; rama: string };

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ReportesPage() {
  const [loadingParticipantes, setLoadingParticipantes] = useState(false);
  const [loadingApoyo, setLoadingApoyo] = useState(false);

  const [selectedInstitucion, setSelectedInstitucion] = useState<string>("");
  const [selectedDisciplina, setSelectedDisciplina] = useState<string>("");

  const { data: instituciones } = useSWR<Institucion[]>("/api/instituciones", fetcher);
  const { data: disciplinas } = useSWR<Disciplina[]>("/api/disciplinas", fetcher);

  const generarReporteParticipantes = async () => {
    try {
      setLoadingParticipantes(true);
      let url = "/api/reportes/participantes?";
      if (selectedInstitucion) url += `institucionId=${selectedInstitucion}&`;
      if (selectedDisciplina) url += `disciplinaId=${selectedDisciplina}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al descargar reporte");
      const data = await res.json();
      
      if (!data || data.length === 0) {
        toast.info("No hay participantes registrados para generar el reporte con estos filtros.");
        return;
      }

      // Insertar una fila vacía para separar entre grupos (disciplinas/instituciones)
      const windowedData = [];
      let lastDisc = null;
      let lastInst = null;

      for (const row of data) {
        if (lastDisc !== null && (lastDisc !== row["Disciplina"] || lastInst !== row["Institución"])) {
          windowedData.push({}); // Fila de separación
        }
        lastDisc = row["Disciplina"];
        lastInst = row["Institución"];
        windowedData.push(row);
      }

      const worksheet = XLSX.utils.json_to_sheet(windowedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Participantes");

      // Auto-size columns slightly
      const columnWidths = Object.keys(data[0] || {}).map(() => ({ wch: 20 }));
      if (columnWidths.length > 0) worksheet["!cols"] = columnWidths;

      XLSX.writeFile(workbook, `Reporte_Participantes_${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success("Reporte de participantes generado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al generar el reporte");
    } finally {
      setLoadingParticipantes(false);
    }
  };

  const generarReporteApoyo = async () => {
    try {
      setLoadingApoyo(true);
      let url = "/api/reportes/apoyo?";
      if (selectedInstitucion) url += `institucionId=${selectedInstitucion}&`;
      if (selectedDisciplina) url += `disciplinaId=${selectedDisciplina}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al descargar reporte");
      const data = await res.json();

      if (!data || data.length === 0) {
        toast.info("No hay personal de apoyo registrado para generar el reporte con estos filtros.");
        return;
      }

      // Insertar una fila vacía para separar entre instituciones
      const windowedData = [];
      let lastInst = null;

      for (const row of data) {
        if (lastInst !== null && lastInst !== row["Institución"]) {
          windowedData.push({}); // Fila de separación
        }
        lastInst = row["Institución"];
        windowedData.push(row);
      }

      const worksheet = XLSX.utils.json_to_sheet(windowedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "PersonalApoyo");

      const columnWidths = Object.keys(data[0] || {}).map(() => ({ wch: 20 }));
      if (columnWidths.length > 0) worksheet["!cols"] = columnWidths;

      XLSX.writeFile(workbook, `Reporte_PersonalApoyo_${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success("Reporte de personal de apoyo generado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al generar el reporte");
    } finally {
      setLoadingApoyo(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-slate-50/50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reportes Excel</h1>
          <p className="text-slate-500 mt-1">Genera y descarga reportes detallados en formato Excel.</p>
        </div>

        {/* Filtros */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
            <Filter size={18} />
            <h3>Filtros para Reportes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Institución</label>
              <select
                value={selectedInstitucion}
                onChange={(e) => setSelectedInstitucion(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#08677a]/20 focus:border-[#08677a] outline-none"
              >
                <option value="">Todas las instituciones</option>
                {instituciones?.map((inst) => (
                  <option key={inst.id} value={inst.id}>{inst.nombre}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Disciplina</label>
              <select
                value={selectedDisciplina}
                onChange={(e) => setSelectedDisciplina(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#08677a]/20 focus:border-[#08677a] outline-none"
              >
                <option value="">Todas las disciplinas</option>
                {disciplinas?.map((disc) => (
                  <option key={disc.id} value={disc.id}>{disc.nombre} ({disc.rama})</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 italic">
            * Estos filtros se aplicarán al archivo Excel que descargues a continuación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Participantes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-[#08677a]/10 text-[#08677a] rounded-full flex items-center justify-center">
              <Users size={32} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Participantes</h2>
              <p className="text-sm text-slate-500 max-w-sm mt-2">
                Descarga una lista de todos los alumnos inscritos, desglosados por institución, disciplina y categoría.
              </p>
            </div>
            <button
              onClick={generarReporteParticipantes}
              disabled={loadingParticipantes}
              className="mt-auto inline-flex items-center gap-2 bg-[#08677a] hover:bg-[#064c5a] text-white px-6 py-2.5 rounded-xl transition-colors font-medium text-sm disabled:opacity-70"
            >
              {loadingParticipantes ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              Generar Excel
            </button>
          </div>

          {/* Card Personal Apoyo */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-[#ffa52d]/10 text-[#ffa52d] rounded-full flex items-center justify-center">
              <Briefcase size={32} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Personal de Apoyo</h2>
              <p className="text-sm text-slate-500 max-w-sm mt-2">
                Descarga una lista del personal de apoyo registrado (entrenadores, delegados, árbitros, etc.) por institución.
              </p>
            </div>
            <button
              onClick={generarReporteApoyo}
              disabled={loadingApoyo}
              className="mt-auto inline-flex items-center gap-2 bg-[#ffa52d] hover:bg-[#e8911c] text-white px-6 py-2.5 rounded-xl transition-colors font-medium text-sm disabled:opacity-70"
            >
              {loadingApoyo ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              Generar Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
