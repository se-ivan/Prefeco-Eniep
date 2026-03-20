"use client";

import { useState } from "react";
// Remove xlsx import, using exceljs
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
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

      const keys = Object.keys(data[0] || {});
      const colCount = Math.max(keys.length, 1);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Participantes");

      // Título principal
      worksheet.mergeCells(1, 1, 1, colCount);
      const titleCell = worksheet.getCell(1, 1);
      titleCell.value = "REPORTE DE PARTICIPANTES";
      titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF08677A' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(1).height = 30;

      // Subtítulo con filtros
      worksheet.mergeCells(2, 1, 2, colCount);
      const subTitleCell = worksheet.getCell(2, 1);
      
      let subtitleText = [];
      if (selectedInstitucion) {
        const instName = instituciones?.find((i) => String(i.id) === selectedInstitucion)?.nombre;
        if (instName) subtitleText.push(`Institución: ${instName}`);
      }
      if (selectedDisciplina) {
        const discName = disciplinas?.find((d) => String(d.id) === selectedDisciplina)?.nombre;
        if (discName) subtitleText.push(`Disciplina: ${discName}`);
      }
      
      subTitleCell.value = subtitleText.length > 0 ? subtitleText.join(" | ") : "Todos los registros (Múltiples Instituciones)";
      subTitleCell.font = { bold: true, size: 12, color: { argb: 'FF333333' } };
      subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
      subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(2).height = 25;

      // Fila vacía de separación visual
      worksheet.addRow([]);

      // Encabezados de tabla
      const headerRow = worksheet.addRow(keys);
      headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF064C5A' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // Ajuste de ancho de columnas
        const column = worksheet.getColumn(colNumber);
        column.width = Math.max(keys[colNumber - 1].length + 5, 20);
      });
      worksheet.getRow(4).height = 25;

      // Insertar datos con fila de separación cuando cambia disciplina o institución
      let lastDisc = null;
      let lastInst = null;

      for (const row of data) {
        if (lastDisc !== null && (lastDisc !== row["Disciplina"] || lastInst !== row["Institución"])) {
          worksheet.addRow([]); // Fila vacía para separación visual
        }
        lastDisc = row["Disciplina"];
        lastInst = row["Institución"];

        const rowValues = keys.map(k => row[k]);
        worksheet.addRow(rowValues);
      }

      // Generar descarga
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, `Reporte_Participantes_${new Date().toISOString().split("T")[0]}.xlsx`);

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

      const keys = Object.keys(data[0] || {});
      const colCount = Math.max(keys.length, 1);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("PersonalApoyo");

      // Título principal
      worksheet.mergeCells(1, 1, 1, colCount);
      const titleCell = worksheet.getCell(1, 1);
      titleCell.value = "REPORTE DE PERSONAL DE APOYO";
      titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFA52D' } }; // Naranja en base al tema
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(1).height = 30;

      // Subtítulo con filtros
      worksheet.mergeCells(2, 1, 2, colCount);
      const subTitleCell = worksheet.getCell(2, 1);
      
      let subtitleText = [];
      if (selectedInstitucion) {
        const instName = instituciones?.find((i) => String(i.id) === selectedInstitucion)?.nombre;
        if (instName) subtitleText.push(`Institución: ${instName}`);
      }
      
      subTitleCell.value = subtitleText.length > 0 ? subtitleText.join(" | ") : "Todos los registros (Múltiples Instituciones)";
      subTitleCell.font = { bold: true, size: 12, color: { argb: 'FF333333' } };
      subTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
      subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(2).height = 25;

      // Fila vacía de separación visual
      worksheet.addRow([]);

      // Encabezados
      const headerRow = worksheet.addRow(keys);
      headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8911C' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        const column = worksheet.getColumn(colNumber);
        column.width = Math.max(keys[colNumber - 1].length + 5, 20);
      });
      worksheet.getRow(4).height = 25;

      // Insertar datos con fila de separación cuando cambia la institución
      let lastInst = null;

      for (const row of data) {
        if (lastInst !== null && lastInst !== row["Institución"]) {
          worksheet.addRow([]); // Fila vacía para separación
        }
        lastInst = row["Institución"];

        const rowValues = keys.map(k => row[k]);
        worksheet.addRow(rowValues);
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, `Reporte_PersonalApoyo_${new Date().toISOString().split("T")[0]}.xlsx`);

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
