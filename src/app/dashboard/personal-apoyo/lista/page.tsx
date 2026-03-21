"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Edit3, Eye, ImagePlus, Loader2, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PhotoCropperModal } from "@/components/PhotoCropperModal";
import { uploadImageToFirebase } from "@/lib/photo-upload";

type Institucion = {
  id: number;
  nombre: string;
};

type PersonalApoyo = {
  id: number;
  institucionId: number;
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fotoUrl: string | null;
  puesto: string;
  telefono: string;
  email: string | null;
  contactoEmergenciaNombre: string | null;
  contactoEmergenciaTelefono: string | null;
  docCurp: boolean;
  docIdentificacionOficial: boolean;
  docCurpUrl: string | null;
  docIdentificacionOficialUrl: string | null;
  estatus: "ACTIVO" | "INACTIVO";
  institucion: {
    id: number;
    nombre: string;
  };
};

type UserScope = {
  role: "ADMIN" | "RESPONSABLE_INSTITUCION" | "DIRECTIVO";
  institucionId: number | null;
};

type EditForm = {
  institucionId: string;
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fotoUrl: string;
  puesto: string;
  telefono: string;
  email: string;
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
  docCurp: boolean;
  docIdentificacionOficial: boolean;
  docCurpUrl: string;
  docIdentificacionOficialUrl: string;
  estatus: "ACTIVO" | "INACTIVO";
};

const initialEditForm: EditForm = {
  institucionId: "",
  curp: "",
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  fotoUrl: "",
  puesto: "",
  telefono: "",
  email: "",
  contactoEmergenciaNombre: "",
  contactoEmergenciaTelefono: "",
  docCurp: false,
  docIdentificacionOficial: false,
  docCurpUrl: "",
  docIdentificacionOficialUrl: "",
  estatus: "ACTIVO",
};

export default function ListaPersonalApoyoPage() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<PersonalApoyo[]>([]);
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoToCrop, setPhotoToCrop] = useState<File | null>(null);
  const [scope, setScope] = useState<UserScope | null>(null);
  const [previewItem, setPreviewItem] = useState<PersonalApoyo | null>(null);
  const [editingItem, setEditingItem] = useState<PersonalApoyo | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(initialEditForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [autoEditHandled, setAutoEditHandled] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [resPersonal, resInstituciones] = await Promise.all([
        fetch("/api/personal-apoyo"),
        fetch("/api/instituciones"),
      ]);

      if (!resPersonal.ok || !resInstituciones.ok) {
        throw new Error("Error al cargar datos");
      }

      const [dataPersonal, dataInstituciones] = await Promise.all([
        resPersonal.json(),
        resInstituciones.json(),
      ]);

      setItems(dataPersonal);
      setInstituciones(dataInstituciones);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cargar personal de apoyo");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok || !active) return;
        const data: UserScope = await res.json();
        setScope(data);
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();
    if (!value) return items;

    return items.filter((item) => {
      const fullName = `${item.nombres} ${item.apellidoPaterno} ${item.apellidoMaterno}`.toLowerCase();
      return (
        fullName.includes(value) ||
        item.curp.toLowerCase().includes(value) ||
        item.puesto.toLowerCase().includes(value) ||
        item.institucion.nombre.toLowerCase().includes(value)
      );
    });
  }, [items, searchTerm]);

  const openEditModal = (item: PersonalApoyo) => {
    setEditingItem(item);
    setFormErrors({});
    setEditForm({
      institucionId: String(item.institucionId),
      curp: item.curp,
      nombres: item.nombres,
      apellidoPaterno: item.apellidoPaterno,
      apellidoMaterno: item.apellidoMaterno,
      fotoUrl: item.fotoUrl ?? "",
      puesto: item.puesto,
      telefono: item.telefono,
      email: item.email ?? "",
      contactoEmergenciaNombre: item.contactoEmergenciaNombre ?? "",
      contactoEmergenciaTelefono: item.contactoEmergenciaTelefono ?? "",
      docCurp: item.docCurp,
      docIdentificacionOficial: item.docIdentificacionOficial,
      docCurpUrl: item.docCurpUrl ?? "",
      docIdentificacionOficialUrl: item.docIdentificacionOficialUrl ?? "",
      estatus: item.estatus,
    });
  };

  useEffect(() => {
    if (autoEditHandled) return;
    const editIdParam = searchParams.get("editId");
    if (!editIdParam) {
      setAutoEditHandled(true);
      return;
    }

    const editId = Number(editIdParam);
    if (!Number.isInteger(editId)) {
      setAutoEditHandled(true);
      return;
    }

    if (loading) return;

    const target = items.find((item) => item.id === editId);
    if (target) {
      openEditModal(target);
    } else {
      toast.error("No se encontró el personal de apoyo para editar");
    }

    setAutoEditHandled(true);
  }, [autoEditHandled, items, loading, searchParams]);

  const closeEditModal = () => {
    if (saving || uploadingPhoto) return;
    setEditingItem(null);
    setEditForm(initialEditForm);
    setFormErrors({});
  };

  const closePreviewModal = () => {
    setPreviewItem(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEditCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleEditPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setPhotoToCrop(selectedFile);
    e.target.value = "";
  };

  const handlePhotoCropped = async (croppedFile: File) => {
    setPhotoToCrop(null);
    setUploadingPhoto(true);
    try {
      const { url } = await uploadImageToFirebase(croppedFile, "personal-apoyo");
      setEditForm((prev) => ({ ...prev, fotoUrl: url }));
      toast.success("Fotografia actualizada");
    } catch (error: any) {
      toast.error(error?.message || "No se pudo subir la fotografia");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;

    const nextErrors: Record<string, string> = {};
    if (!editForm.curp.trim()) nextErrors.curp = "La CURP es obligatoria";
    if (!editForm.nombres.trim()) nextErrors.nombres = "El nombre es obligatorio";
    if (!editForm.apellidoPaterno.trim()) nextErrors.apellidoPaterno = "El apellido paterno es obligatorio";
    if (!editForm.apellidoMaterno.trim()) nextErrors.apellidoMaterno = "El apellido materno es obligatorio";
    if (!editForm.puesto.trim()) nextErrors.puesto = "El puesto es obligatorio";
    if (!editForm.telefono.trim()) nextErrors.telefono = "El teléfono es obligatorio";

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      toast.error("Completa los campos obligatorios");
      return;
    }

    const resolvedInstitucionId = Number(editForm.institucionId || scope?.institucionId || 0);
    if (!resolvedInstitucionId) {
      toast.error("Institución inválida");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        institucionId: resolvedInstitucionId,
        curp: editForm.curp,
        nombres: editForm.nombres,
        apellidoPaterno: editForm.apellidoPaterno,
        apellidoMaterno: editForm.apellidoMaterno,
        fotoUrl: editForm.fotoUrl || null,
        puesto: editForm.puesto,
        telefono: editForm.telefono,
        email: editForm.email || null,
        contactoEmergenciaNombre: editForm.contactoEmergenciaNombre || null,
        contactoEmergenciaTelefono: editForm.contactoEmergenciaTelefono || null,
        docCurp: editForm.docCurp,
        docIdentificacionOficial: editForm.docIdentificacionOficial,
        docCurpUrl: editForm.docCurpUrl || null,
        docIdentificacionOficialUrl: editForm.docIdentificacionOficialUrl || null,
        estatus: editForm.estatus,
      };

      const res = await fetch(`/api/personal-apoyo/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "No se pudo actualizar");
      }

      toast.success("Registro actualizado");
      closeEditModal();
      await loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {photoToCrop && (
        <PhotoCropperModal
          file={photoToCrop}
          onClose={() => setPhotoToCrop(null)}
          onCropComplete={handlePhotoCropped}
          aspect={3 / 4}
        />
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Personal de Apoyo</h1>
          <p className="text-sm text-gray-500">Listado y edición de registros</p>
        </div>
        {scope?.role !== "DIRECTIVO" && (
        <Link
          href="/dashboard/personal-apoyo"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#08677a] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          <UserPlus size={16} />
          Registrar personal
        </Link>
        )}
      </div>

      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, CURP, puesto o institución"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#08677a]"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-gray-500">
            <Loader2 className="animate-spin" size={18} />
            Cargando personal de apoyo...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No se encontraron registros.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 bg-slate-50/40">
            {filteredItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-800 leading-tight">
                      {item.nombres} {item.apellidoPaterno} {item.apellidoMaterno}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{item.institucion.nombre}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.estatus === "ACTIVO" ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-700"}`}>
                    {item.estatus}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Puesto:</span> {item.puesto}</p>
                  <p><span className="font-medium">Teléfono:</span> {item.telefono}</p>
                  <p><span className="font-medium">CURP:</span> {item.curp}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 ${scope?.role === "DIRECTIVO" ? "col-span-2" : ""}`}
                  >
                    <Eye size={14} />
                    Ver
                  </button>
                  {scope?.role !== "DIRECTIVO" && (
                  <button
                    onClick={() => openEditModal(item)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#08677a]/30 px-3 py-2 text-sm font-semibold text-[#08677a] hover:bg-[#08677a]/5"
                  >
                    <Edit3 size={14} />
                    Editar
                  </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Previsualización del personal de apoyo</h2>
                <p className="text-sm text-gray-500">Consulta rápida del registro antes de editarlo.</p>
              </div>
              <button onClick={closePreviewModal} className="text-sm text-gray-500 hover:text-gray-700">
                Cerrar
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[140px_1fr]">
              <div className="rounded-xl border border-gray-200 bg-slate-50 p-3">
                {previewItem.fotoUrl ? (
                  <img
                    src={previewItem.fotoUrl}
                    alt={`Foto de ${previewItem.nombres}`}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-sm text-gray-400">
                    Sin foto
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-800">Datos generales</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <PreviewField label="Nombre completo" value={`${previewItem.nombres} ${previewItem.apellidoPaterno} ${previewItem.apellidoMaterno}`} />
                    <PreviewField label="Institución" value={previewItem.institucion?.nombre || "-"} />
                    <PreviewField label="CURP" value={previewItem.curp} />
                    <PreviewField label="Puesto" value={previewItem.puesto} />
                    <PreviewField label="Teléfono" value={previewItem.telefono} />
                    <PreviewField label="Email" value={previewItem.email || "N/A"} />
                    <PreviewField label="Estatus" value={previewItem.estatus} />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-800">Emergencia y documentación</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <PreviewField label="Contacto de emergencia" value={previewItem.contactoEmergenciaNombre || "N/A"} />
                    <PreviewField label="Tel. emergencia" value={previewItem.contactoEmergenciaTelefono || "N/A"} />
                    <PreviewCheck label="CURP" checked={previewItem.docCurp} />
                    <PreviewCheck label="Identificación oficial" checked={previewItem.docIdentificacionOficial} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closePreviewModal}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
              >
                Cerrar
              </button>
              {scope?.role !== "DIRECTIVO" && (
              <button
                onClick={() => {
                  const current = previewItem;
                  closePreviewModal();
                  if (current) openEditModal(current);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#08677a] px-4 py-2 text-sm font-semibold text-white"
              >
                <Edit3 size={14} />
                Editar registro
              </button>
              )}
            </div>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Editar personal de apoyo</h2>
              <button onClick={closeEditModal} className="text-sm text-gray-500 hover:text-gray-700">
                Cerrar
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {scope?.role !== "RESPONSABLE_INSTITUCION" && (
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Institución *</label>
                  <select
                    name="institucionId"
                    value={editForm.institucionId}
                    onChange={handleEditInputChange}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <option value="">Selecciona una institución</option>
                    {instituciones.map((institucion) => (
                      <option key={institucion.id} value={institucion.id}>
                        {institucion.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="md:col-span-2 rounded-lg border border-dashed border-gray-300 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-500">Fotografia infantil 3:4</p>
                  <label className="inline-flex items-center gap-2 rounded-lg bg-[#08677a] px-3 py-2 text-sm text-white cursor-pointer">
                    {uploadingPhoto ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                    {uploadingPhoto ? "Subiendo..." : "Actualizar foto"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleEditPhotoChange}
                      disabled={uploadingPhoto}
                    />
                  </label>
                </div>
                {editForm.fotoUrl && (
                  <img src={editForm.fotoUrl} alt="Foto personal de apoyo" className="mt-3 h-36 w-28 rounded-lg border object-cover" />
                )}
              </div>

              <Field label="Nombre(s) *" name="nombres" value={editForm.nombres} onChange={handleEditInputChange} error={formErrors.nombres} />
              <Field label="Apellido paterno *" name="apellidoPaterno" value={editForm.apellidoPaterno} onChange={handleEditInputChange} error={formErrors.apellidoPaterno} />
              <Field label="Apellido materno *" name="apellidoMaterno" value={editForm.apellidoMaterno} onChange={handleEditInputChange} error={formErrors.apellidoMaterno} />
              <Field label="CURP *" name="curp" value={editForm.curp} onChange={handleEditInputChange} error={formErrors.curp} />
              <Field label="Puesto *" name="puesto" value={editForm.puesto} onChange={handleEditInputChange} error={formErrors.puesto} />
              <Field label="Teléfono *" name="telefono" value={editForm.telefono} onChange={handleEditInputChange} error={formErrors.telefono} />
              <Field label="Email" name="email" value={editForm.email} onChange={handleEditInputChange} />
              <Field
                label="Contacto emergencia"
                name="contactoEmergenciaNombre"
                value={editForm.contactoEmergenciaNombre}
                onChange={handleEditInputChange}
              />
              <Field
                label="Tel. emergencia"
                name="contactoEmergenciaTelefono"
                value={editForm.contactoEmergenciaTelefono}
                onChange={handleEditInputChange}
              />

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Estatus</label>
                <select
                  name="estatus"
                  value={editForm.estatus}
                  onChange={handleEditInputChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>
              </div>

              <div className="md:col-span-2 rounded-xl border border-[#08677a]/20 bg-[#08677a]/5 p-4">
                <p className="text-xs font-semibold text-[#08677a]">Vista previa de credencial</p>
                <div className="mt-3 flex items-start gap-4">
                  {editForm.fotoUrl ? (
                    <img src={editForm.fotoUrl} alt="Foto para credencial" className="h-28 w-22 rounded-lg border border-gray-200 object-cover" />
                  ) : (
                    <div className="h-28 w-22 rounded-lg border border-dashed border-gray-300 bg-white/70" />
                  )}
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">
                      {`${editForm.nombres} ${editForm.apellidoPaterno} ${editForm.apellidoMaterno}`.trim() || "Nombre del personal"}
                    </p>
                    <p>CURP: {editForm.curp || "-"}</p>
                    <p>Puesto: {editForm.puesto || "-"}</p>
                    <p>Institución: {editingItem?.institucion?.nombre || "-"}</p>
                    <p>Estatus: {editForm.estatus}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploadingPhoto}
                className="inline-flex items-center gap-2 rounded-lg bg-[#08677a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border px-3 py-2 text-sm ${error ? "border-red-400 bg-red-50/40" : "border-gray-200"}`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="mt-1 text-sm text-gray-800 break-words">{value || "-"}</p>
    </div>
  );
}

function PreviewCheck({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm ${checked ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-500"}`}>
      {label}: {checked ? "Entregado" : "Pendiente"}
    </div>
  );
}

function CheckField({
  label,
  name,
  checked,
  onChange,
}: {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className="h-4 w-4" />
      {label}
    </label>
  );
}
