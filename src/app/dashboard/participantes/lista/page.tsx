"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  Building2,
  CreditCard,
  Droplets,
  Eye,
  Edit,
  Phone,
  Loader2,
  ImagePlus,
  Upload,
  Search,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { PhotoCropperModal } from "@/components/PhotoCropperModal";
import { uploadImageToFirebase } from "@/lib/photo-upload";
import { uploadParticipantDocumentToFirebase } from "@/lib/document-upload";

type Institucion = {
  id: number;
  nombre: string;
};

type Tutor = {
  nombreCompleto: string;
  parentesco: string;
  telefono: string;
  email: string | null;
  direccion: string | null;
} | null;

type UserScope = {
  role: "ADMIN" | "RESPONSABLE_INSTITUCION" | "DIRECTIVO";
  institucionId: number | null;
};

type Participante = {
  id: number;
  institucionId: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  matricula: string;
  semestre?: number | null;
  fechaNacimiento: string;
  genero: "MASCULINO" | "FEMENINO" | "OTRO";
  fotoUrl?: string | null;
  estatus: "ACTIVO" | "INACTIVO";
  alergias?: string | null;
  tipoSangre?: string;
  padecimientos?: string | null;
  medicamentos?: string | null;
  contactoEmergenciaNombre?: string;
  contactoEmergenciaTelefono?: string;
  docCurp: boolean;
  docComprobanteEstudios: boolean;
  docCartaResponsiva: boolean;
  docCertificadoMedico: boolean;
  docCredencialUrl?: string | null;
  docCartaResponsivaTutorUrl?: string | null;
  docHistorialMedicoUrl?: string | null;
  docActaNacimientoUrl?: string | null;
  tutor: Tutor;
  institucion: Institucion;
};

type ParticipantDocumentField =
  | "docCredencialUrl"
  | "docCartaResponsivaTutorUrl"
  | "docHistorialMedicoUrl"
  | "docActaNacimientoUrl";

type ParticipantDocumentCategory =
  | "credencial"
  | "carta-responsiva-tutor"
  | "historial-medico"
  | "acta-nacimiento";

type Categoria = {
  id: number;
  nombre: string;
  disciplinaId: number;
};

type DisciplinaInscripcion = {
  id: number;
  nombre: string;
  rama: "VARONIL" | "FEMENIL" | "UNICA" | "MIXTO";
  modalidad: "EQUIPO" | "INDIVIDUAL";
  equipos: string[];
  categorias: Categoria[];
};

type InscripcionesData = {
  disciplinas: DisciplinaInscripcion[];
};

const DOCUMENT_UPLOAD_CONFIG: Array<{
  field: ParticipantDocumentField;
  boolField: "docComprobanteEstudios" | "docCartaResponsiva" | "docCertificadoMedico" | "docCurp";
  label: string;
  category: ParticipantDocumentCategory;
}> = [
  {
    field: "docCredencialUrl",
    boolField: "docComprobanteEstudios",
    label: "Credencial",
    category: "credencial",
  },
  {
    field: "docCartaResponsivaTutorUrl",
    boolField: "docCartaResponsiva",
    label: "Carta responsiva del tutor",
    category: "carta-responsiva-tutor",
  },
  {
    field: "docHistorialMedicoUrl",
    boolField: "docCertificadoMedico",
    label: "Historial académico",
    category: "historial-medico",
  },
  {
    field: "docActaNacimientoUrl",
    boolField: "docCurp",
    label: "Acta de nacimiento",
    category: "acta-nacimiento",
  },
];

type EditForm = {
  institucionId: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  matricula: string;
  semestre: string;
  fechaNacimiento: string;
  genero: "MASCULINO" | "FEMENINO" | "OTRO";
  estatus: "ACTIVO" | "INACTIVO";
  fotoUrl: string;
  tipoSangre: string;
  alergias: string;
  padecimientos: string;
  medicamentos: string;
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
  docCurp: boolean;
  docComprobanteEstudios: boolean;
  docCartaResponsiva: boolean;
  docCertificadoMedico: boolean;
  docCredencialUrl: string;
  docCartaResponsivaTutorUrl: string;
  docHistorialMedicoUrl: string;
  docActaNacimientoUrl: string;
  tutorNombreCompleto: string;
  tutorParentesco: string;
  tutorTelefono: string;
  tutorEmail: string;
  tutorDireccion: string;
};

const INITIAL_EDIT_FORM: EditForm = {
  institucionId: "",
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  curp: "",
  matricula: "",
  semestre: "",
  fechaNacimiento: "",
  genero: "MASCULINO",
  estatus: "ACTIVO",
  fotoUrl: "",
  tipoSangre: "",
  alergias: "",
  padecimientos: "",
  medicamentos: "",
  contactoEmergenciaNombre: "",
  contactoEmergenciaTelefono: "",
  docCurp: false,
  docComprobanteEstudios: false,
  docCartaResponsiva: false,
  docCertificadoMedico: false,
  docCredencialUrl: "",
  docCartaResponsivaTutorUrl: "",
  docHistorialMedicoUrl: "",
  docActaNacimientoUrl: "",
  tutorNombreCompleto: "",
  tutorParentesco: "",
  tutorTelefono: "",
  tutorEmail: "",
  tutorDireccion: "",
};

export default function ListaParticipantesPage() {
  const searchParams = useSearchParams();
  const { data: participantes = [], isLoading, mutate } = useSWR<Participante[]>("/api/participantes");
  const { data: instituciones = [] } = useSWR<Institucion[]>("/api/instituciones");
  const [searchTerm, setSearchTerm] = useState("");
  const [scope, setScope] = useState<UserScope | null>(null);
  const [previewItem, setPreviewItem] = useState<Participante | null>(null);
  const [editingItem, setEditingItem] = useState<Participante | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(INITIAL_EDIT_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<Participante | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState<Record<ParticipantDocumentField, boolean>>({
    docCredencialUrl: false,
    docCartaResponsivaTutorUrl: false,
    docHistorialMedicoUrl: false,
    docActaNacimientoUrl: false,
  });
  const [photoToCrop, setPhotoToCrop] = useState<File | null>(null);
  const [autoEditHandled, setAutoEditHandled] = useState(false);
  const [previewInscripciones, setPreviewInscripciones] = useState<InscripcionesData | null>(null);
  const [loadingPreviewInscripciones, setLoadingPreviewInscripciones] = useState(false);

  function booleanFieldForUrl(urlField: string) {
    switch (urlField) {
      case "docCredencialUrl":
        return "docComprobanteEstudios";
      case "docCartaResponsivaTutorUrl":
        return "docCartaResponsiva";
      case "docHistorialMedicoUrl":
        return "docCertificadoMedico";
      case "docActaNacimientoUrl":
        return "docCurp";
      default:
        return null;
    }
  }

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/participantes/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Participante eliminado");
      setDeleteTarget(null);
      mutate();
    } catch {
      toast.error("Error al eliminar participante");
    }
  };

  const openEditModal = (part: Participante) => {
    setEditingItem(part);
    setFormErrors({});
    setEditForm({
      institucionId: String(part.institucionId),
      nombres: part.nombres,
      apellidoPaterno: part.apellidoPaterno,
      apellidoMaterno: part.apellidoMaterno,
      curp: part.curp,
      matricula: part.matricula,
      semestre: part.semestre != null ? String(part.semestre) : "",
      fechaNacimiento: part.fechaNacimiento?.slice(0, 10) ?? "",
      genero: part.genero,
      estatus: part.estatus,
      fotoUrl: part.fotoUrl ?? "",
      tipoSangre: part.tipoSangre ?? "",
      alergias: part.alergias ?? "",
      padecimientos: part.padecimientos ?? "",
      medicamentos: part.medicamentos ?? "",
      contactoEmergenciaNombre: part.contactoEmergenciaNombre ?? "",
      contactoEmergenciaTelefono: part.contactoEmergenciaTelefono ?? "",
      docCurp: part.docCurp,
      docComprobanteEstudios: part.docComprobanteEstudios,
      docCartaResponsiva: part.docCartaResponsiva,
      docCertificadoMedico: part.docCertificadoMedico,
      docCredencialUrl: part.docCredencialUrl ?? "",
      docCartaResponsivaTutorUrl: part.docCartaResponsivaTutorUrl ?? "",
      docHistorialMedicoUrl: part.docHistorialMedicoUrl ?? "",
      docActaNacimientoUrl: part.docActaNacimientoUrl ?? "",
      tutorNombreCompleto: part.tutor?.nombreCompleto ?? "",
      tutorParentesco: part.tutor?.parentesco ?? "",
      tutorTelefono: part.tutor?.telefono ?? "",
      tutorEmail: part.tutor?.email ?? "",
      tutorDireccion: part.tutor?.direccion ?? "",
    });
  };

  const closePreviewModal = () => {
    setPreviewItem(null);
    setPreviewInscripciones(null);
    setLoadingPreviewInscripciones(false);
  };

  const loadPreviewInscripciones = async (participanteId: number) => {
    setLoadingPreviewInscripciones(true);
    try {
      const res = await fetch(`/api/participantes/${participanteId}/inscripciones`);
      if (!res.ok) throw new Error();
      const data: InscripcionesData = await res.json();
      setPreviewInscripciones(data);
    } catch {
      setPreviewInscripciones({ disciplinas: [] });
    } finally {
      setLoadingPreviewInscripciones(false);
    }
  };

  useEffect(() => {
    if (previewItem) {
      loadPreviewInscripciones(previewItem.id);
    }
  }, [previewItem]);

  useEffect(() => {
    if (autoEditHandled) return;
    const editIdParam = searchParams.get("editId");
    if (!editIdParam) {
      setAutoEditHandled(true);
      return;
    }

    const editId = Number(editIdParam);
    if (isNaN(editId)) {
      setAutoEditHandled(true);
      return;
    }

    if (isLoading) return;

    const target = participantes.find((p) => p.id === editId);
    if (target) {
      openEditModal(target);
    } else {
      toast.error("No se encontró el participante para editar");
    }
    setAutoEditHandled(true);
  }, [autoEditHandled, isLoading, participantes, searchParams]);

  const closeEditModal = () => {
    if (saving || uploadingPhoto) return;
    setEditingItem(null);
    setEditForm(INITIAL_EDIT_FORM);
    setFormErrors({});
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
      const { url } = await uploadImageToFirebase(croppedFile, "participante");
      setEditForm((prev) => ({ ...prev, fotoUrl: url }));
      toast.success("Fotografia actualizada");
    } catch (error: any) {
      toast.error(error?.message || "No se pudo subir la fotografia");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const clearDocumentSelection = (field: string) => {
    const booleanField = booleanFieldForUrl(field);
    setEditForm((prev) => ({ ...prev, [field]: "", ...(booleanField ? { [booleanField]: false } : {}) } as any));
  };

  const handleEditDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    category: "credencial" | "carta-responsiva-tutor" | "historial-medico" | "acta-nacimiento"
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setUploadingDocuments((prev) => ({ ...prev, [field]: true }));
    try {
      const { url } = await uploadParticipantDocumentToFirebase(selectedFile, category);
      const booleanField = booleanFieldForUrl(field) as string | null;
      setEditForm((prev) => ({ ...prev, [field]: url, ...(booleanField ? { [booleanField]: true } : {}) } as any));
      toast.success(`${selectedFile.name} subido correctamente`);
    } catch (err: any) {
      toast.error(err?.message || "No se pudo subir el documento");
    } finally {
      setUploadingDocuments((prev) => ({ ...prev, [field]: false }));
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!editingItem) return;

    const nextErrors: Record<string, string> = {};
    if (!editForm.nombres.trim()) nextErrors.nombres = "El nombre es obligatorio";
    if (!editForm.apellidoPaterno.trim()) nextErrors.apellidoPaterno = "El apellido paterno es obligatorio";
    if (!editForm.curp.trim()) nextErrors.curp = "La CURP es obligatoria";
    if (!editForm.matricula.trim()) nextErrors.matricula = "La matrícula es obligatoria";
    if (!editForm.semestre.trim()) nextErrors.semestre = "El semestre es obligatorio";
    if (editForm.semestre.trim() && (!Number.isInteger(Number(editForm.semestre)) || Number(editForm.semestre) < 1 || Number(editForm.semestre) > 20)) {
      nextErrors.semestre = "El semestre debe ser un número entre 1 y 20";
    }
    if (!editForm.fechaNacimiento) nextErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria";

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
      const hasTutorData =
        !!editForm.tutorNombreCompleto.trim() ||
        !!editForm.tutorParentesco.trim() ||
        !!editForm.tutorTelefono.trim() ||
        !!editForm.tutorEmail.trim() ||
        !!editForm.tutorDireccion.trim();

      const payload = {
        institucionId: resolvedInstitucionId,
        curp: editForm.curp,
        matricula: editForm.matricula,
        semestre: Number(editForm.semestre),
        nombres: editForm.nombres,
        apellidoPaterno: editForm.apellidoPaterno,
        apellidoMaterno: editForm.apellidoMaterno,
        fechaNacimiento: editForm.fechaNacimiento,
        genero: editForm.genero,
        fotoUrl: editForm.fotoUrl || null,
        estatus: editForm.estatus,
        alergias: editForm.alergias || null,
        tipoSangre: editForm.tipoSangre || null,
        padecimientos: editForm.padecimientos || null,
        medicamentos: editForm.medicamentos || null,
        contactoEmergenciaNombre: editForm.contactoEmergenciaNombre || null,
        contactoEmergenciaTelefono: editForm.contactoEmergenciaTelefono || null,
        docCurp: editForm.docCurp,
        docComprobanteEstudios: editForm.docComprobanteEstudios,
        docCartaResponsiva: editForm.docCartaResponsiva,
        docCertificadoMedico: editForm.docCertificadoMedico,
        docCredencialUrl: editForm.docCredencialUrl || null,
        docCartaResponsivaTutorUrl: editForm.docCartaResponsivaTutorUrl || null,
        docHistorialMedicoUrl: editForm.docHistorialMedicoUrl || null,
        docActaNacimientoUrl: editForm.docActaNacimientoUrl || null,
        tutor: hasTutorData
          ? {
              nombreCompleto: editForm.tutorNombreCompleto,
              parentesco: editForm.tutorParentesco,
              telefono: editForm.tutorTelefono,
              email: editForm.tutorEmail || null,
              direccion: editForm.tutorDireccion || null,
            }
          : null,
      };

      const res = await fetch(`/api/participantes/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "No se pudo actualizar el participante");
      }

      toast.success("Participante actualizado");
      closeEditModal();
      mutate();
    } catch (error: any) {
      toast.error(error?.message || "Error al actualizar participante");
    } finally {
      setSaving(false);
    }
  };

  const filteredParticipantes = useMemo(
    () => participantes.filter((part) => {
      const name = `${part.nombres} ${part.apellidoPaterno} ${part.apellidoMaterno}`.toLowerCase();
      return name.includes(searchTerm.toLowerCase()) ||
      part.curp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.institucion?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    }),
    [participantes, searchTerm]
  );

  return (
    <div className="min-h-screen">
      {photoToCrop && (
        <PhotoCropperModal
          file={photoToCrop}
          onClose={() => setPhotoToCrop(null)}
          onCropComplete={handlePhotoCropped}
          aspect={3 / 4}
        />
      )}
      <main className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
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
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-[#0b697d]/5 px-4 py-2 rounded-xl text-sm font-semibold text-[#0b697d] text-center border border-[#0b697d]/10 flex-1 sm:flex-none">
              Total Registrados: {participantes.length}
            </div>
            <Link href="/dashboard/participantes" className="flex-1 sm:flex-none">
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

                <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 text-slate-600 hover:bg-slate-100 hover:text-slate-800 w-full ${scope?.role === "DIRECTIVO" ? "col-span-3" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setPreviewItem(part);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                    {scope?.role !== "DIRECTIVO" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-[#08677a] hover:bg-teal-50 hover:text-[#08677a] w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            openEditModal(part);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-red-600 hover:bg-red-50 hover:text-red-700 w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteTarget(part);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>                      </>
                    )}                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar participante</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el registro de {deleteTarget?.nombres} {deleteTarget?.apellidoPaterno}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Previsualización del participante</h2>
                <p className="text-sm text-gray-500">Consulta rápida del registro antes de editarlo.</p>
              </div>
              <button onClick={closePreviewModal} className="text-sm text-gray-500 hover:text-gray-700">Cerrar</button>
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
                    <PreviewField label="Matrícula" value={previewItem.matricula} />
                    <PreviewField label="Semestre" value={previewItem.semestre != null ? String(previewItem.semestre) : "-"} />
                    <PreviewField label="Fecha de nacimiento" value={previewItem.fechaNacimiento?.slice(0, 10) || "-"} />
                    <PreviewField label="Género" value={previewItem.genero} />
                    <PreviewField label="Estatus" value={previewItem.estatus} />
                    <PreviewField label="Tipo de sangre" value={previewItem.tipoSangre || "N/A"} />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-800">Salud y emergencia</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <PreviewField label="Alergias" value={previewItem.alergias || "N/A"} />
                    <PreviewField label="Padecimientos" value={previewItem.padecimientos || "N/A"} />
                    <PreviewField label="Medicamentos" value={previewItem.medicamentos || "N/A"} />
                    <PreviewField label="Contacto de emergencia" value={previewItem.contactoEmergenciaNombre || "N/A"} />
                    <PreviewField label="Tel. emergencia" value={previewItem.contactoEmergenciaTelefono || "N/A"} />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-800">Tutor legal</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <PreviewField label="Nombre" value={previewItem.tutor?.nombreCompleto || "N/A"} />
                    <PreviewField label="Parentesco" value={previewItem.tutor?.parentesco || "N/A"} />
                    <PreviewField label="Teléfono" value={previewItem.tutor?.telefono || "N/A"} />
                    <PreviewField label="Email" value={previewItem.tutor?.email || "N/A"} />
                    <div className="sm:col-span-2">
                      <PreviewField label="Dirección" value={previewItem.tutor?.direccion || "N/A"} />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-800">Documentación</h3>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <PreviewCheck label="CURP" checked={previewItem.docCurp} />
                    <PreviewCheck label="Comprobante estudios" checked={previewItem.docComprobanteEstudios} />
                    <PreviewCheck label="Carta responsiva" checked={previewItem.docCartaResponsiva} />
                    <PreviewCheck label="Certificado médico" checked={previewItem.docCertificadoMedico} />
                    
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="text-sm font-semibold text-slate-800">Inscripciones a disciplinas</h3>
                  {loadingPreviewInscripciones ? (
                    <div className="mt-3 flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    </div>
                  ) : previewInscripciones?.disciplinas && previewInscripciones.disciplinas.length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {previewInscripciones.disciplinas.map((disciplina) => (
                        <div key={disciplina.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-800">{disciplina.nombre}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                Rama: <span className="font-medium">{disciplina.rama}</span>
                              </p>
                              <p className="text-xs text-slate-500">
                                Modalidad: <span className="font-medium">{disciplina.modalidad}</span>
                              </p>
                              {(disciplina.modalidad === "EQUIPO" || disciplina.equipos.length > 0) && (
                                <p className="text-xs text-slate-500">
                                  Equipo: <span className="font-medium">{disciplina.equipos.length > 0 ? disciplina.equipos.join(", ") : "--"}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <p className="text-xs text-slate-500 mt-1" >Categorías:</p>
                            {disciplina.categorias && disciplina.categorias.length > 0 ? (
                              disciplina.categorias.map((cat) => (
                                <span key={cat.id} className="inline-flex items-center rounded-full bg-[#0b697d]/10 px-2.5 py-0.5 text-xs font-medium text-[#0b697d]">
                                  {cat.nombre}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">Sin categorías asignadas</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 text-center py-4">
                      <p className="text-sm text-slate-500">--</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closePreviewModal} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                Cerrar
              </button>
              <button
                onClick={() => {
                  const current = previewItem;
                  closePreviewModal();
                  if (current) openEditModal(current);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#08677a] px-4 py-2 text-sm font-semibold text-white"
              >
                <Edit className="h-4 w-4" />
                Editar participante
              </button>
            </div>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Editar participante</h2>
              <button onClick={closeEditModal} className="text-sm text-gray-500 hover:text-gray-700">Cerrar</button>
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
                      <option key={institucion.id} value={institucion.id}>{institucion.nombre}</option>
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
                  <img src={editForm.fotoUrl} alt="Foto participante" className="mt-3 h-36 w-28 rounded-lg border object-cover" />
                )}
              </div>

              <Field label="Nombre(s) *" name="nombres" value={editForm.nombres} onChange={handleEditInputChange} error={formErrors.nombres} />
              <Field label="Apellido paterno *" name="apellidoPaterno" value={editForm.apellidoPaterno} onChange={handleEditInputChange} error={formErrors.apellidoPaterno} />
              <Field label="Apellido materno" name="apellidoMaterno" value={editForm.apellidoMaterno} onChange={handleEditInputChange} error={formErrors.apellidoMaterno} />
              <Field label="CURP *" name="curp" value={editForm.curp} onChange={handleEditInputChange} error={formErrors.curp} />
              <Field label="Matrícula *" name="matricula" value={editForm.matricula} onChange={handleEditInputChange} error={formErrors.matricula} />
              <Field label="Semestre *" name="semestre" value={editForm.semestre} onChange={handleEditInputChange} type="number" error={formErrors.semestre} />
              <Field label="Fecha nacimiento *" name="fechaNacimiento" value={editForm.fechaNacimiento} onChange={handleEditInputChange} type="date" error={formErrors.fechaNacimiento} />

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Género</label>
                <select name="genero" value={editForm.genero} onChange={handleEditInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Estatus</label>
                <select name="estatus" value={editForm.estatus} onChange={handleEditInputChange} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>
              </div>

              <Field label="Tipo de sangre" name="tipoSangre" value={editForm.tipoSangre} onChange={handleEditInputChange} />
              <Field label="Alergias" name="alergias" value={editForm.alergias} onChange={handleEditInputChange} />
              <Field label="Padecimientos" name="padecimientos" value={editForm.padecimientos} onChange={handleEditInputChange} />
              <Field label="Medicamentos" name="medicamentos" value={editForm.medicamentos} onChange={handleEditInputChange} />
              <Field label="Contacto emergencia" name="contactoEmergenciaNombre" value={editForm.contactoEmergenciaNombre} onChange={handleEditInputChange} />
              <Field label="Tel. emergencia" name="contactoEmergenciaTelefono" value={editForm.contactoEmergenciaTelefono} onChange={handleEditInputChange} />

              <div className="md:col-span-2 rounded-lg border border-gray-200 p-3">
                <p className="mb-2 text-xs font-semibold text-gray-600">Tutor legal</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field label="Nombre" name="tutorNombreCompleto" value={editForm.tutorNombreCompleto} onChange={handleEditInputChange} />
                  <Field label="Parentesco" name="tutorParentesco" value={editForm.tutorParentesco} onChange={handleEditInputChange} />
                  <Field label="Teléfono" name="tutorTelefono" value={editForm.tutorTelefono} onChange={handleEditInputChange} />
                  <Field label="Email" name="tutorEmail" value={editForm.tutorEmail} onChange={handleEditInputChange} />
                  <div className="md:col-span-2">
                    <Field label="Dirección" name="tutorDireccion" value={editForm.tutorDireccion} onChange={handleEditInputChange} />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {DOCUMENT_UPLOAD_CONFIG.map((doc) => {
                  const hasFile = !!editForm[doc.field];
                  const isUploading = uploadingDocuments[doc.field];
                  return (
                    <div key={doc.field} className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-700">{doc.label}</p>
                        {hasFile ? (
                          <span className="text-xs rounded-full bg-emerald-100 text-emerald-700 px-2 py-1">Subido</span>
                        ) : (
                          <span className="text-xs rounded-full bg-slate-100 text-slate-600 px-2 py-1">Pendiente</span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-2 rounded-lg bg-[#08677a] px-3 py-2 text-xs font-semibold text-white cursor-pointer hover:bg-teal-800 transition-colors">
                          {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          {isUploading ? "Subiendo..." : hasFile ? "Reemplazar" : "Subir archivo"}
                          <input
                            type="file"
                            accept="application/pdf,image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => handleEditDocumentUpload(e, doc.field, doc.category)}
                            disabled={isUploading}
                          />
                        </label>

                        {hasFile && (
                          <>
                            <a
                              href={editForm[doc.field]}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-[#08677a] hover:underline"
                            >
                              Ver archivo
                            </a>
                            <button
                              type="button"
                              onClick={() => clearDocumentSelection(doc.field)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Quitar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="md:col-span-2 grid grid-cols-1 gap-3 mt-3">
                <p className="text-xs font-semibold text-gray-600">Subir documentos (opcional)</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {DOCUMENT_UPLOAD_CONFIG.map((cfg) => (
                    <div key={cfg.field} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3">
                      <div className="truncate">
                        <p className="text-sm font-medium">{cfg.label}</p>
                        <p className="text-xs text-gray-500 truncate">{(editForm as any)[cfg.field] ? String((editForm as any)[cfg.field]).slice(0, 80) : "No subido"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 rounded bg-[#08677a] px-3 py-2 text-white cursor-pointer">
                          {uploadingDocuments[cfg.field] ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          <span className="text-sm">{uploadingDocuments[cfg.field] ? "Subiendo" : "Subir"}</span>
                          <input
                            type="file"
                            accept="application/pdf,image/*"
                            className="hidden"
                            onChange={(e) => handleEditDocumentUpload(e, cfg.field, cfg.category)}
                          />
                        </label>
                        {(editForm as any)[cfg.field] && (
                          <button className="text-sm text-red-600" onClick={() => clearDocumentSelection(cfg.field)}>
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                      {`${editForm.nombres} ${editForm.apellidoPaterno} ${editForm.apellidoMaterno}`.trim() || "Nombre del participante"}
                    </p>
                    <p>CURP: {editForm.curp || "-"}</p>
                    <p>Matrícula: {editForm.matricula || "-"}</p>
                    <p>Semestre: {editForm.semestre || "-"}</p>
                    <p>Institución: {editingItem?.institucion?.nombre || "-"}</p>
                    <p>Estatus: {editForm.estatus}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeEditModal} disabled={saving} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50">Cancelar</button>
              <button onClick={handleSave} disabled={saving || uploadingPhoto} className="inline-flex items-center gap-2 rounded-lg bg-[#08677a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
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
  type = "text",
  onChange,
  error,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      <input
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="mt-1 text-sm text-gray-800 wrap-break-word">{value || "-"}</p>
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

