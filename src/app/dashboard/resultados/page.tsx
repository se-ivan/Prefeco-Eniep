"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Save, Trophy, Medal, Award } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ResultadosAdminPage() {
  const { data: disciplinas, isLoading: loadingDisciplinas } = useSWR("/api/disciplinas", fetcher);
  const { data: instituciones, isLoading: loadingInstituciones } = useSWR("/api/instituciones", fetcher);
  const { data: resultados, isLoading: loadingResultados } = useSWR("/api/resultados", fetcher);

  const [selectedDisciplina, setSelectedDisciplina] = useState<string>("");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("");
  const [oroInstitucion, setOroInstitucion] = useState<string>("");
  const [plataInstitucion, setPlataInstitucion] = useState<string>("");
  const [bronceInstitucion, setBronceInstitucion] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentDisciplina = disciplinas?.find((d: any) => d.id === Number(selectedDisciplina));
  const categorias = currentDisciplina?.categorias || [];

  const handleSave = async () => {
    if (!selectedDisciplina || !selectedCategoria) {
      toast.error("Selecciona una disciplina y una categoría");
      return;
    }

    if (!oroInstitucion && !plataInstitucion && !bronceInstitucion) {
      toast.error("Debes asignar al menos un ganador");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const promises = [];

      if (oroInstitucion && oroInstitucion !== "none") {
        promises.push(
          fetch("/api/resultados", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              disciplinaId: Number(selectedDisciplina),
              categoriaId: Number(selectedCategoria),
              institucionId: Number(oroInstitucion),
              lugar: 1,
            }),
          })
        );
      }

      if (plataInstitucion && plataInstitucion !== "none") {
        promises.push(
          fetch("/api/resultados", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              disciplinaId: Number(selectedDisciplina),
              categoriaId: Number(selectedCategoria),
              institucionId: Number(plataInstitucion),
              lugar: 2,
            }),
          })
        );
      }

      if (bronceInstitucion && bronceInstitucion !== "none") {
        promises.push(
          fetch("/api/resultados", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              disciplinaId: Number(selectedDisciplina),
              categoriaId: Number(selectedCategoria),
              institucionId: Number(bronceInstitucion),
              lugar: 3,
            }),
          })
        );
      }

      const responses = await Promise.all(promises);
      const errors = responses.filter(r => !r.ok);
      
      if (errors.length > 0) {
        toast.error("Hubo un error al guardar algunos resultados");
      } else {
        toast.success("Resultados guardados correctamente");
        // Limpiar formulario
        setOroInstitucion("");
        setPlataInstitucion("");
        setBronceInstitucion("");
        
        // Refrescar datos
        mutate("/api/resultados");
        mutate("/api/podium");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este resultado?")) return;

    try {
      const res = await fetch(`/api/resultados/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Resultado eliminado");
        mutate("/api/resultados");
        mutate("/api/podium");
      } else {
        toast.error("Error al eliminar el resultado");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    }
  };

  const getBadgeColor = (lugar: number) => {
    if (lugar === 1) return "bg-yellow-500 hover:bg-yellow-600 text-white";
    if (lugar === 2) return "bg-slate-300 hover:bg-slate-400 text-slate-800";
    if (lugar === 3) return "bg-amber-600 hover:bg-amber-700 text-white";
    return "";
  };

  const getLugarIcon = (lugar: number) => {
    if (lugar === 1) return <Trophy className="w-4 h-4 mr-1 inline" />;
    if (lugar === 2) return <Medal className="w-4 h-4 mr-1 inline" />;
    if (lugar === 3) return <Award className="w-4 h-4 mr-1 inline" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Gestión de Resultados
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FORMULARIO */}
        <Card className="md:col-span-1 shadow-sm border-slate-200 dark:border-slate-800 h-fit">
          <CardHeader>
            <CardTitle>Asignar Ganadores</CardTitle>
            <CardDescription>Registra el 1º, 2º y 3º lugar por disciplina y categoría.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Disciplina</label>
              <Select value={selectedDisciplina} onValueChange={(val) => {
                setSelectedDisciplina(val);
                setSelectedCategoria("");
              }} disabled={loadingDisciplinas}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {disciplinas?.map((d: any) => (
                    <SelectItem key={d.id} value={d.id.toString()}>
                      {d.nombre} ({d.rama})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select 
                value={selectedCategoria} 
                onValueChange={setSelectedCategoria} 
                disabled={!selectedDisciplina || categorias.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={categorias.length === 0 ? "No hay categorías" : "Selecciona una categoría"} />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((c: any) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center text-yellow-600 dark:text-yellow-500">
                  <Trophy className="w-4 h-4 mr-2" /> 1º Lugar (Oro)
                </label>
                <Select value={oroInstitucion} onValueChange={setOroInstitucion} disabled={loadingInstituciones}>
                  <SelectTrigger className="border-yellow-200 dark:border-yellow-900 focus:ring-yellow-500">
                    <SelectValue placeholder="Sin asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-slate-500 italic">Sin asignar</SelectItem>
                    {instituciones?.map((i: any) => (
                      <SelectItem key={i.id} value={i.id.toString()}>{i.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center text-slate-600 dark:text-slate-400">
                  <Medal className="w-4 h-4 mr-2" /> 2º Lugar (Plata)
                </label>
                <Select value={plataInstitucion} onValueChange={setPlataInstitucion} disabled={loadingInstituciones}>
                  <SelectTrigger className="border-slate-300 dark:border-slate-700">
                    <SelectValue placeholder="Sin asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-slate-500 italic">Sin asignar</SelectItem>
                    {instituciones?.map((i: any) => (
                      <SelectItem key={i.id} value={i.id.toString()}>{i.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center text-amber-700 dark:text-amber-600">
                  <Award className="w-4 h-4 mr-2" /> 3º Lugar (Bronce)
                </label>
                <Select value={bronceInstitucion} onValueChange={setBronceInstitucion} disabled={loadingInstituciones}>
                  <SelectTrigger className="border-amber-200 dark:border-amber-900/50">
                    <SelectValue placeholder="Sin asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none" className="text-slate-500 italic">Sin asignar</SelectItem>
                    {instituciones?.map((i: any) => (
                      <SelectItem key={i.id} value={i.id.toString()}>{i.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full mt-4" 
              onClick={handleSave} 
              disabled={isSubmitting || !selectedDisciplina || !selectedCategoria || (!oroInstitucion && !plataInstitucion && !bronceInstitucion)}
            >
              {isSubmitting ? "Guardando..." : (
                <><Save className="w-4 h-4 mr-2" /> Guardar Resultados</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* TABLA DE RESULTADOS */}
        <Card className="md:col-span-2 shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Resultados Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingResultados ? (
              <div className="py-8 text-center text-slate-500">Cargando resultados...</div>
            ) : resultados?.length === 0 ? (
              <div className="py-8 text-center text-slate-500 border border-dashed rounded-lg">
                No hay resultados registrados aún.
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900">
                    <TableRow>
                      <TableHead>Disciplina y Categoría</TableHead>
                      <TableHead>Institución</TableHead>
                      <TableHead className="text-center">Lugar</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados?.map((r: any) => (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="font-medium">{r.disciplina.nombre}</div>
                          <div className="text-xs text-slate-500">
                            {r.categoria.nombre} • {r.disciplina.rama}
                          </div>
                        </TableCell>
                        <TableCell>{r.institucion.nombre}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={getBadgeColor(r.lugar)}>
                            {getLugarIcon(r.lugar)}
                            {r.lugar}º Lugar
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(r.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
