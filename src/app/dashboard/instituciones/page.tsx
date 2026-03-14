"use client";

import { ChangeEvent, useState } from "react";
import useSWR from "swr";
import {
  Building2,
  MapPin,
  Globe,
  Search,
  Hash,
  Loader2,
  Plus,
  Trash2,
  Pencil,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { uploadImageToFirebase } from "@/lib/photo-upload";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Institucion = {
  id: number;
  cct: string;
  nombre: string;
  estado: string;
  municipio: string;
  urlLogo: string | null;
  nombreDirector: string | null;
};

type InstitucionEditForm = {
  id: number;
  cct: string;
  nombre: string;
  estado: string;
  municipio: string;
  urlLogo: string;
  nombreDirector: string;
};

const estadosMexico = [
  "Aguascalientes",
  "Baja California",
  "Baja California Sur",
  "Campeche",
  "Chiapas",
  "Chihuahua",
  "Ciudad de México",
  "Coahuila",
  "Colima",
  "Durango",
  "Estado de México",
  "Guanajuato",
  "Guerrero",
  "Hidalgo",
  "Jalisco",
  "Michoacán",
  "Morelos",
  "Nayarit",
  "Nuevo León",
  "Oaxaca",
  "Puebla",
  "Querétaro",
  "Quintana Roo",
  "San Luis Potosí",
  "Sinaloa",
  "Sonora",
  "Tabasco",
  "Tamaulipas",
  "Tlaxcala",
  "Veracruz",
  "Yucatán",
  "Zacatecas",
];

export default function ListaInstitucionesPage() {
  const { data: instituciones = [], isLoading, mutate } = useSWR<Institucion[]>("/api/instituciones");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Institucion | null>(null);
  const [editTarget, setEditTarget] = useState<InstitucionEditForm | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/instituciones/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Institución eliminada");
      setDeleteTarget(null);
      mutate();
    } catch {
      toast.error("Error al eliminar institución");
    }
  };

  const openEdit = (inst: Institucion) => {
    setEditTarget({
      id: inst.id,
      cct: inst.cct,
      nombre: inst.nombre,
      estado: inst.estado,
      municipio: inst.municipio,
      urlLogo: inst.urlLogo ?? "",
      nombreDirector: inst.nombreDirector ?? "",
    });
  };

  const closeEdit = () => {
    if (savingEdit || uploadingLogo) return;
    setEditTarget(null);
  };

  const onEditField = (field: keyof InstitucionEditForm, value: string) => {
    if (!editTarget) return;
    setEditTarget({ ...editTarget, [field]: value });
  };

  const onEditLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile || !editTarget) return;

    setUploadingLogo(true);
    try {
      const { url } = await uploadImageToFirebase(selectedFile, "institucion");
      setEditTarget({ ...editTarget, urlLogo: url });
      toast.success("Logo subido correctamente");
    } catch (error: any) {
      toast.error(error?.message || "No se pudo subir el logo");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  const saveEdit = async () => {
    if (!editTarget) return;

    if (!editTarget.nombre.trim() || !editTarget.cct.trim() || !editTarget.estado.trim() || !editTarget.municipio.trim()) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/instituciones/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cct: editTarget.cct.trim().toUpperCase(),
          nombre: editTarget.nombre.trim(),
          estado: editTarget.estado,
          municipio: editTarget.municipio.trim(),
          urlLogo: editTarget.urlLogo.trim() || null,
          nombreDirector: editTarget.nombreDirector?.trim() || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "No se pudo actualizar la institución");
      }

      toast.success("Institución actualizada");
      setEditTarget(null);
      mutate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar institución");
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredInstituciones = instituciones.filter(
    (inst) =>
      inst.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.cct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen ">
      <main className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
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
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-[#0b697d]/5 px-4 py-2 rounded-xl text-sm font-semibold text-[#0b697d] text-center flex-1 sm:flex-none">
              Total Registrados: {instituciones.length}
            </div>
            <Link href="/dashboard/instituciones/registro" className="flex-1 sm:flex-none">
              <Button className="w-full h-9 gap-2 bg-[#ffa52d] text-white hover:bg-[#ffa52d]/90">
                <Plus className="h-4 w-4" />
                Registrar
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
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
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-[#0b697d] hover:bg-[#0b697d]/10"
                      onClick={() => openEdit(inst)}
                      title="Editar institución"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => setDeleteTarget(inst)}
                      title="Eliminar institución"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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

                  <div className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Globe className="h-4 w-4 text-[#ffa52d] shrink-0 mt-0.5" />
                    <span>{inst.municipio}</span>
                  </div>

                  {inst.nombreDirector && (
                    <div className="flex items-start gap-2.5 text-sm text-slate-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#ffa52d] shrink-0 mt-0.5">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span className="truncate">Dir. {inst.nombreDirector}</span>
                    </div>
                  )}
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

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar institución</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la institución {deleteTarget?.nombre}. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!editTarget} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar institución</DialogTitle>
            <DialogDescription>
              Actualiza los datos del plantel y guarda los cambios.
            </DialogDescription>
          </DialogHeader>

          {editTarget && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-nombre">Nombre</Label>
                <Input
                  id="edit-nombre"
                  value={editTarget.nombre}
                  onChange={(e) => onEditField("nombre", e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-director">Nombre del director (Opcional)</Label>
                <Input
                  id="edit-director"
                  value={editTarget.nombreDirector || ""}
                  onChange={(e) => onEditField("nombreDirector", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-cct">CCT</Label>
                <Input
                  id="edit-cct"
                  maxLength={15}
                  value={editTarget.cct}
                  onChange={(e) => onEditField("cct", e.target.value.toUpperCase())}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-municipio">Municipio</Label>
                <Input
                  id="edit-municipio"
                  value={editTarget.municipio}
                  onChange={(e) => onEditField("municipio", e.target.value)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label>Estado</Label>
                <Select
                  value={editTarget.estado}
                  onValueChange={(value) => onEditField("estado", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadosMexico.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-logo">Logo (opcional)</Label>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="edit-logo"
                    className="inline-flex h-10 px-3 items-center gap-2 rounded-md border border-slate-200 bg-white text-sm cursor-pointer hover:bg-slate-50"
                  >
                    {uploadingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                    {uploadingLogo ? "Subiendo logo..." : "Subir logo"}
                  </label>
                  <Input
                    id="edit-logo"
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onEditLogoChange}
                    disabled={uploadingLogo}
                  />
                  {editTarget.urlLogo && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onEditField("urlLogo", "")}
                    >
                      Quitar logo
                    </Button>
                  )}
                </div>

                {editTarget.urlLogo && (
                  <img
                    src={editTarget.urlLogo}
                    alt="Vista previa del logo"
                    className="h-24 w-full rounded-md border border-slate-200 bg-white object-contain p-2"
                  />
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeEdit} disabled={savingEdit || uploadingLogo}>
              Cancelar
            </Button>
            <Button type="button" onClick={saveEdit} disabled={savingEdit || uploadingLogo}>
              {savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
