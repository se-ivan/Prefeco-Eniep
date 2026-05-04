"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Save, Trophy, Medal, Award, Check, ChevronsUpDown, Search, Image as ImageIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/components/ui/utils";
import Image from "next/image";

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
  const [selectedCinta, setSelectedCinta] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openDisciplina, setOpenDisciplina] = useState(false);
  const [openOro, setOpenOro] = useState(false);
  const [openPlata, setOpenPlata] = useState(false);
  const [openBronce, setOpenBronce] = useState(false);

  const currentDisciplina = disciplinas?.find((d: any) => d.id === Number(selectedDisciplina));
  const categorias = currentDisciplina?.categorias || [];
  
  const isTaekwondo = currentDisciplina?.disciplinaBaseNombre === "TAEKWONDO";
  
  const cintasOptions = [
    "CINTA_BLANCA",
    "CINTA_AMARILLA",
    "CINTA_NARANJA",
    "CINTA_VERDE",
    "CINTA_AZUL",
    "CINTA_ROJA",
    "CINTA_NEGRA",
    "CINTA_ROJINEGRA",
  ];

  const handleSave = async () => {
    if (!selectedDisciplina || !selectedCategoria) {
      toast.error("Selecciona una disciplina y una categoría");
      return;
    }

    if (isTaekwondo && !selectedCinta) {
      toast.error("Debes seleccionar una cinta de taekwondo");
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
              ...(isTaekwondo && { cintaTaekwondo: selectedCinta }),
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
              ...(isTaekwondo && { cintaTaekwondo: selectedCinta }),
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
              ...(isTaekwondo && { cintaTaekwondo: selectedCinta }),
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
        setSelectedCinta("");
        
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
              <Popover open={openDisciplina} onOpenChange={setOpenDisciplina}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openDisciplina}
                    className="w-full justify-between font-normal"
                    disabled={loadingDisciplinas}
                  >
                    {selectedDisciplina
                      ? disciplinas?.find((d: any) => d.id.toString() === selectedDisciplina)?.nombre + " (" + disciplinas?.find((d: any) => d.id.toString() === selectedDisciplina)?.rama + ")"
                      : "Selecciona una disciplina"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar disciplina..." />
                    <CommandList>
                      <CommandEmpty>No se encontró la disciplina.</CommandEmpty>
                      <CommandGroup>
                        {disciplinas?.map((d: any) => (
                          <CommandItem
                            key={d.id}
                            value={`${d.nombre} ${d.rama} ${d.modalidad}`}
                            onSelect={() => {
                              setSelectedDisciplina(d.id.toString());
                              setSelectedCategoria("");
                              setOpenDisciplina(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedDisciplina === d.id.toString() ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col text-sm">
                              <span className="truncate">{d.nombre} ({d.rama})</span>
                              <span className="text-xs text-slate-500">{d.modalidad}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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

            {isTaekwondo && (
              <div className="space-y-2">
                <label className="text-sm font-medium ">
                  Cinta de Taekwondo *
                </label>
                <Select value={selectedCinta} onValueChange={setSelectedCinta} disabled={!selectedDisciplina}>
                  <SelectTrigger >
                    <SelectValue placeholder="Selecciona una cinta" />
                  </SelectTrigger>
                  <SelectContent>
                    {cintasOptions.map((cinta) => (
                      <SelectItem key={cinta} value={cinta}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" 
                            style={{
                              backgroundColor: cinta === "CINTA_BLANCA" ? "#ffffff" : 
                                             cinta === "CINTA_AMARILLA" ? "#eab308" :
                                             cinta === "CINTA_NARANJA" ? "#f97316" :
                                             cinta === "CINTA_VERDE" ? "#22c55e" :
                                             cinta === "CINTA_AZUL" ? "#3b82f6" :
                                             cinta === "CINTA_ROJA" ? "#ef4444" :
                                             cinta === "CINTA_NEGRA" ? "#000000" :
                                             cinta === "CINTA_ROJINEGRA" ? "#dc2626" : "#999999",
                              border: cinta === "CINTA_BLANCA" ? "1px solid #ccc" : "none"
                            }} />
                          {cinta.replace("CINTA_", "").replace(/_/g, " ")}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="pt-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center text-yellow-600 dark:text-yellow-500">
                  <Trophy className="w-4 h-4 mr-2" /> 1º Lugar (Oro)
                </label>
                <Popover open={openOro} onOpenChange={setOpenOro}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openOro}
                      className="w-full justify-between font-normal border-yellow-200 dark:border-yellow-900 focus:ring-yellow-500 h-auto py-2"
                      disabled={loadingInstituciones}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {oroInstitucion && oroInstitucion !== "none" ? (
                          <>
                            {instituciones?.find((i: any) => i.id.toString() === oroInstitucion)?.urlLogo ? (
                              <div className="relative w-6 h-6 flex-shrink-0">
                                <Image 
                                  src={instituciones.find((i: any) => i.id.toString() === oroInstitucion).urlLogo} 
                                  alt="Logo" 
                                  fill 
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-300" />
                            )}
                            <span className="truncate">
                              {instituciones?.find((i: any) => i.id.toString() === oroInstitucion)?.nombre}
                            </span>
                          </>
                        ) : (
                          "Sin asignar"
                        )}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar institución..." />
                      <CommandList>
                        <CommandEmpty>No se encontró la institución.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="none"
                            onSelect={() => {
                              setOroInstitucion("none");
                              setOpenOro(false);
                            }}
                            className="text-slate-500 italic"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                oroInstitucion === "none" ? "opacity-100" : "opacity-0"
                              )}
                            />
                            Sin asignar
                          </CommandItem>
                          {instituciones?.map((i: any) => (
                            <CommandItem
                              key={i.id}
                              value={`${i.nombre} ${i.cct} ${i.estado}`}
                              onSelect={() => {
                                setOroInstitucion(i.id.toString());
                                setOpenOro(false);
                              }}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 flex-shrink-0",
                                    oroInstitucion === i.id.toString() ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {i.urlLogo ? (
                                  <div className="relative w-8 h-8 flex-shrink-0">
                                    <Image src={i.urlLogo} alt={i.nombre} fill className="object-contain" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded flex-shrink-0">
                                    <ImageIcon className="w-4 h-4 text-slate-400" />
                                  </div>
                                )}
                                <div className="flex flex-col text-sm w-full truncate">
                                  <span className="truncate font-medium">{i.nombre}</span>
                                  <span className="text-xs text-slate-500">{i.estado} - {i.cct}</span>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center text-slate-600 dark:text-slate-400">
                  <Medal className="w-4 h-4 mr-2" /> 2º Lugar (Plata)
                </label>
                <Popover open={openPlata} onOpenChange={setOpenPlata}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openPlata}
                      className="w-full justify-between font-normal border-slate-300 dark:border-slate-700 h-auto py-2"
                      disabled={loadingInstituciones}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {plataInstitucion && plataInstitucion !== "none" ? (
                          <>
                            {instituciones?.find((i: any) => i.id.toString() === plataInstitucion)?.urlLogo ? (
                              <div className="relative w-6 h-6 flex-shrink-0">
                                <Image 
                                  src={instituciones.find((i: any) => i.id.toString() === plataInstitucion).urlLogo} 
                                  alt="Logo" 
                                  fill 
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-300" />
                            )}
                            <span className="truncate">
                              {instituciones?.find((i: any) => i.id.toString() === plataInstitucion)?.nombre}
                            </span>
                          </>
                        ) : (
                          "Sin asignar"
                        )}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar institución..." />
                      <CommandList>
                        <CommandEmpty>No se encontró la institución.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="none"
                            onSelect={() => {
                              setPlataInstitucion("none");
                              setOpenPlata(false);
                            }}
                            className="text-slate-500 italic"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                plataInstitucion === "none" ? "opacity-100" : "opacity-0"
                              )}
                            />
                            Sin asignar
                          </CommandItem>
                          {instituciones?.map((i: any) => (
                            <CommandItem
                              key={i.id}
                              value={`${i.nombre} ${i.cct} ${i.estado}`}
                              onSelect={() => {
                                setPlataInstitucion(i.id.toString());
                                setOpenPlata(false);
                              }}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 flex-shrink-0",
                                    plataInstitucion === i.id.toString() ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {i.urlLogo ? (
                                  <div className="relative w-8 h-8 flex-shrink-0">
                                    <Image src={i.urlLogo} alt={i.nombre} fill className="object-contain" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded flex-shrink-0">
                                    <ImageIcon className="w-4 h-4 text-slate-400" />
                                  </div>
                                )}
                                <div className="flex flex-col text-sm w-full truncate">
                                  <span className="truncate font-medium">{i.nombre}</span>
                                  <span className="text-xs text-slate-500">{i.estado} - {i.cct}</span>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center text-amber-700 dark:text-amber-600">
                  <Award className="w-4 h-4 mr-2" /> 3º Lugar (Bronce)
                </label>
                <Popover open={openBronce} onOpenChange={setOpenBronce}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openBronce}
                      className="w-full justify-between font-normal border-amber-200 dark:border-amber-900/50 h-auto py-2"
                      disabled={loadingInstituciones}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {bronceInstitucion && bronceInstitucion !== "none" ? (
                          <>
                            {instituciones?.find((i: any) => i.id.toString() === bronceInstitucion)?.urlLogo ? (
                              <div className="relative w-6 h-6 flex-shrink-0">
                                <Image 
                                  src={instituciones.find((i: any) => i.id.toString() === bronceInstitucion).urlLogo} 
                                  alt="Logo" 
                                  fill 
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-300" />
                            )}
                            <span className="truncate">
                              {instituciones?.find((i: any) => i.id.toString() === bronceInstitucion)?.nombre}
                            </span>
                          </>
                        ) : (
                          "Sin asignar"
                        )}
                      </div>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar institución..." />
                      <CommandList>
                        <CommandEmpty>No se encontró la institución.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="none"
                            onSelect={() => {
                              setBronceInstitucion("none");
                              setOpenBronce(false);
                            }}
                            className="text-slate-500 italic"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                bronceInstitucion === "none" ? "opacity-100" : "opacity-0"
                              )}
                            />
                            Sin asignar
                          </CommandItem>
                          {instituciones?.map((i: any) => (
                            <CommandItem
                              key={i.id}
                              value={`${i.nombre} ${i.cct} ${i.estado}`}
                              onSelect={() => {
                                setBronceInstitucion(i.id.toString());
                                setOpenBronce(false);
                              }}
                            >
                              <div className="flex items-center gap-2 w-full">
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 flex-shrink-0",
                                    bronceInstitucion === i.id.toString() ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {i.urlLogo ? (
                                  <div className="relative w-8 h-8 flex-shrink-0">
                                    <Image src={i.urlLogo} alt={i.nombre} fill className="object-contain" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded flex-shrink-0">
                                    <ImageIcon className="w-4 h-4 text-slate-400" />
                                  </div>
                                )}
                                <div className="flex flex-col text-sm w-full truncate">
                                  <span className="truncate font-medium">{i.nombre}</span>
                                  <span className="text-xs text-slate-500">{i.estado} - {i.cct}</span>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
                          <span className="text-xs text-slate-500">{i.estado}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full mt-4" 
              onClick={handleSave} 
              disabled={isSubmitting || !selectedDisciplina || !selectedCategoria || (isTaekwondo && !selectedCinta) || (!oroInstitucion && !plataInstitucion && !bronceInstitucion)}
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
                      <TableHead className="text-center">Cinta</TableHead>
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
                          <div className="text-xs text-slate-500">{r.disciplina.modalidad}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium truncate">{r.institucion.nombre} - {r.institucion.cct}</div>
                          <div className="text-xs text-slate-500">{r.institucion.estado}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={getBadgeColor(r.lugar)}>
                            {getLugarIcon(r.lugar)}
                            {r.lugar}º Lugar
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {r.cintaTaekwondo ? (
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              {r.cintaTaekwondo.replace("CINTA_", "").replace(/_/g, " ")}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
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
