"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, FileText, ChevronLeft, ChevronRight, ImagePlus, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PhotoCropperModal } from "@/components/PhotoCropperModal";
import { uploadImageToFirebase } from "@/lib/photo-upload";
import { uploadPersonalApoyoDocumentToFirebase } from "@/lib/document-upload";

const STEPS = [
  { id: 1, title: "Datos Personales", icon: User },
  { id: 2, title: "Contacto", icon: Phone },
  { id: 3, title: "Documentación", icon: FileText },
];

type PersonalApoyoDocumentField = "docCurpUrl" | "docIdentificacionOficialUrl" | "docComprobanteDomicilioUrl" | "docCartaAntecedentesUrl";

const DOCUMENT_UPLOAD_CONFIG: { field: PersonalApoyoDocumentField; category: any; label: string }[] = [
  { field: "docCurpUrl", category: "curp", label: "CURP" },
  { field: "docIdentificacionOficialUrl", category: "identificacion-oficial", label: "Identificación Oficial" },
  { field: "docComprobanteDomicilioUrl", category: "comprobante-domicilio", label: "Comprobante de Domicilio" },
  { field: "docCartaAntecedentesUrl", category: "carta-antecedentes", label: "Carta de Antecedentes" },
];

type Institucion = {
  id: number;
  nombre: string;
};

type UserScope = {
  role: "ADMIN" | "RESPONSABLE_INSTITUCION";
  institucionId: number | null;
  institucion: { id: number; nombre: string; cct: string } | null;
};

export default function RegistrarPersonalApoyoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loadingInstituciones, setLoadingInstituciones] = useState(false);
  const [scope, setScope] = useState<UserScope | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoToCrop, setPhotoToCrop] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingDocuments, setUploadingDocuments] = useState<Record<PersonalApoyoDocumentField, boolean>>({
    docCurpUrl: false,
    docIdentificacionOficialUrl: false,
    docComprobanteDomicilioUrl: false,
    docCartaAntecedentesUrl: false,
  });

  const [formData, setFormData] = useState({
    institucionId: "",
    fotoUrl: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    curp: "",
    puesto: "",
    telefono: "",
    email: "",
    contactoEmergenciaNombre: "",
    contactoEmergenciaTelefono: "",
    docCurp: false,
    docIdentificacionOficial: false,
    docComprobanteDomicilio: false,
    docCartaAntecedentes: false,
    docCurpUrl: "",
    docIdentificacionOficialUrl: "",
    docComprobanteDomicilioUrl: "",
    docCartaAntecedentesUrl: "",
  });

  useEffect(() => {
    let active = true;

    async function loadInstituciones() {
      setLoadingInstituciones(true);
      try {
        const res = await fetch("/api/instituciones");
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Institucion[] = await res.json();
        if (!active) return;
        setInstituciones(data);
      } catch (error) {
        console.error("Error al cargar instituciones", error);
        if (!active) return;
        setInstituciones([]);
        toast.error("No se pudieron cargar las instituciones");
      } finally {
        if (active) setLoadingInstituciones(false);
      }
    }

    loadInstituciones();

    async function loadScope() {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) return;
        const data: UserScope = await res.json();
        if (!active) return;
        setScope(data);
        if (data.role === "RESPONSABLE_INSTITUCION" && data.institucionId) {
          setFormData((prev) => ({ ...prev, institucionId: String(data.institucionId) }));
        }
      } catch {
        // ignore
      }
    }

    loadScope();

    return () => {
      active = false;
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStepError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setStepError(null);
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: PersonalApoyoDocumentField, category: any) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setUploadingDocuments((prev) => ({ ...prev, [field]: true }));

    try {
      const { url } = await uploadPersonalApoyoDocumentToFirebase(selectedFile, category);
      setFormData((prev) => ({ ...prev, [field]: url, [field.replace('Url', '')]: true }));
      toast.success(`${selectedFile.name} subido correctamente`);
    } catch (error: any) {
      const message = error?.message || "No se pudo subir el documento";
      setStepError(message);
      toast.error(message);
    } finally {
      setUploadingDocuments((prev) => ({ ...prev, [field]: false }));
      e.target.value = "";
    }
  };

  const clearDocumentSelection = (field: PersonalApoyoDocumentField) => {
    setFormData((prev) => ({ ...prev, [field]: "", [field.replace('Url', '')]: false }));
  };

  const clearPhotoSelection = () => {
    setPhotoPreview(null);
    setFormData((prev) => ({ ...prev, fotoUrl: "" }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setPhotoToCrop(selectedFile);
    e.target.value = "";
  };

  const handlePhotoCropped = async (croppedFile: File) => {
    setPhotoToCrop(null);
    setUploadingPhoto(true);
    setStepError(null);

    try {
      const { url } = await uploadImageToFirebase(croppedFile, "personal-apoyo");
      setPhotoPreview(url);
      setFormData((prev) => ({ ...prev, fotoUrl: url }));
      toast.success("Fotografia subida correctamente");
    } catch (error: any) {
      const message = error?.message || "No se pudo subir la fotografia";
      setStepError(message);
      toast.error(message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const validateStep1 = () => {
    const resolvedInstitucionId = Number(formData.institucionId || scope?.institucionId || 0);
    if (!resolvedInstitucionId) return "No se encontró una institución válida para el registro.";
    if (!formData.fotoUrl) return "La fotografía es obligatoria.";
    if (!formData.nombres.trim()) return "El nombre es obligatorio.";
    if (!formData.apellidoPaterno.trim()) return "El apellido paterno es obligatorio.";
    if (!formData.apellidoMaterno.trim()) return "El apellido materno es obligatorio.";
    if (!formData.curp.trim()) return "La CURP es obligatoria.";
    if (!formData.puesto.trim()) return "El puesto es obligatorio.";
    if (!formData.telefono.trim()) return "El teléfono es obligatorio.";
    return null;
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) return validateStep1();
    return null;
  };

  const nextStep = () => {
    const error = validateCurrentStep();
    if (error) {
      setStepError(error);
      toast.error(error);
      return;
    }

    if (currentStep < STEPS.length) {
      setStepError(null);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStepError(null);
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const step1Error = validateStep1();
    if (step1Error) {
      setStepError(step1Error);
      toast.error(step1Error);
      setCurrentStep(1);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        institucionId: Number(formData.institucionId || scope?.institucionId || 0),
        nombres: formData.nombres,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        fotoUrl: formData.fotoUrl || null,
        curp: formData.curp,
        puesto: formData.puesto,
        telefono: formData.telefono,
        email: formData.email || null,
        contactoEmergenciaNombre: formData.contactoEmergenciaNombre || null,
        contactoEmergenciaTelefono: formData.contactoEmergenciaTelefono || null,
        docCurp: formData.docCurp,
        docIdentificacionOficial: formData.docIdentificacionOficial,
        docComprobanteDomicilio: formData.docComprobanteDomicilio,
        docCartaAntecedentes: formData.docCartaAntecedentes,
        docCurpUrl: formData.docCurpUrl || null,
        docIdentificacionOficialUrl: formData.docIdentificacionOficialUrl || null,
        docComprobanteDomicilioUrl: formData.docComprobanteDomicilioUrl || null,
        docCartaAntecedentesUrl: formData.docCartaAntecedentesUrl || null,
        estatus: "ACTIVO",
      };

      const res = await fetch("/api/personal-apoyo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Error ${res.status} al registrar personal de apoyo`);
      }

      toast.success("Personal de apoyo registrado exitosamente");
      router.push("/dashboard/personal-apoyo/lista");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "No se pudo registrar al personal de apoyo");
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <>
      {photoToCrop && (
        <PhotoCropperModal
          file={photoToCrop}
          onClose={() => setPhotoToCrop(null)}
          onCropComplete={handlePhotoCropped}
          aspect={3 / 4}
        />
      )}
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-8 border-b border-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Registro de Personal de Apoyo</h2>
          <p className="text-gray-500 text-sm mt-1">Completa los datos en 3 sencillos pasos</p>
        </div>

        <div className="px-8 pt-8 pb-4">
          <div className="relative flex justify-between items-center max-w-3xl mx-auto">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10 w-24">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm
                      ${isActive || isPast ? "bg-[#08677a] text-white" : "bg-gray-100 text-gray-400"}`}
                  >
                    <step.icon size={20} />
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-3 text-center transition-colors duration-300
                      ${isActive || isPast ? "text-[#08677a]" : "text-gray-400"}`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}

            <div className="absolute top-6 left-[10%] right-[10%] h-0.5 bg-gray-100 z-0" />
          </div>

          <div className="mt-6 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#08677a] transition-all duration-500 ease-in-out"
              style={{ width: `${progressPercentage === 0 ? 15 : progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="px-8 py-6">
          {stepError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {stepError}
            </div>
          )}

          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Datos Personales</h3>
              <p className="text-xs text-gray-500 mb-8">Información general del personal de apoyo</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {scope?.role !== "RESPONSABLE_INSTITUCION" && (
                  <div className="group md:col-span-2">
                    <label className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                      Institución <span className="text-[#08677a]">*</span>
                    </label>
                    <select
                      name="institucionId"
                      value={formData.institucionId}
                      onChange={handleInputChange}
                      disabled={loadingInstituciones}
                      className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-500 focus:ring-0 focus:border-[#08677a] transition-colors outline-none appearance-none cursor-pointer disabled:opacity-60"
                    >
                      <option value="">{loadingInstituciones ? "Cargando instituciones..." : "Selecciona una institución"}</option>
                      {instituciones.map((institucion) => (
                        <option key={institucion.id} value={institucion.id}>
                          {institucion.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="group md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-1 mb-2">
                    Fotografia infantil (3:4 vertical)
                  </label>
                  <div className="rounded-xl border border-dashed border-gray-300 p-4 bg-gray-50/60">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                      <div className="text-xs text-gray-500">
                        Formatos: JPG, PNG o WEBP. Maximo 3MB. Proporcion aproximada 3:4.
                      </div>
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#08677a] text-white text-sm font-semibold cursor-pointer hover:bg-teal-800 transition-colors">
                        {uploadingPhoto ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                        {uploadingPhoto ? "Subiendo..." : "Seleccionar fotografia"}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={handlePhotoChange}
                          disabled={uploadingPhoto}
                        />
                      </label>
                    </div>

                    {photoPreview && (
                      <div className="mt-4 flex items-start gap-3">
                        <img
                          src={photoPreview}
                          alt="Vista previa de fotografia"
                          className="h-36 w-28 rounded-lg border border-gray-200 object-cover"
                        />
                        <button
                          type="button"
                          onClick={clearPhotoSelection}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Quitar fotografia
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Nombre(s) <span className="text-[#08677a]">*</span></label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Apellido Paterno <span className="text-[#08677a]">*</span></label>
                  <input
                    type="text"
                    name="apellidoPaterno"
                    value={formData.apellidoPaterno}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Apellido Materno <span className="text-[#08677a]">*</span></label>
                  <input
                    type="text"
                    name="apellidoMaterno"
                    value={formData.apellidoMaterno}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">CURP <span className="text-[#08677a]">*</span></label>
                  <input
                    type="text"
                    name="curp"
                    value={formData.curp}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none uppercase"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Puesto <span className="text-[#08677a]">*</span></label>
                  <input
                    type="text"
                    name="puesto"
                    value={formData.puesto}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Teléfono <span className="text-[#08677a]">*</span></label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Contacto de Emergencia</h3>
              <p className="text-xs text-gray-500 mb-8">Persona de contacto para cualquier eventualidad</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Nombre del contacto</label>
                  <input
                    type="text"
                    name="contactoEmergenciaNombre"
                    value={formData.contactoEmergenciaNombre}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Teléfono del contacto</label>
                  <input
                    type="tel"
                    name="contactoEmergenciaTelefono"
                    value={formData.contactoEmergenciaTelefono}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Documentación</h3>
              <p className="text-xs text-gray-500 mb-8">Sube los archivos en PDF, JPG, PNG o WEBP (máximo 10MB)</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DOCUMENT_UPLOAD_CONFIG.map((doc) => {
                  const hasFile = !!formData[doc.field];
                  const isUploading = uploadingDocuments[doc.field];
                  return (
                    <div key={doc.field} className="rounded-xl border border-gray-200 p-4 bg-white">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-800">{doc.label}</p>
                        {hasFile ? (
                          <span className="text-xs rounded-full bg-emerald-100 text-emerald-700 px-2 py-1">Subido</span>
                        ) : (
                          <span className="text-xs rounded-full bg-slate-100 text-slate-600 px-2 py-1">Pendiente</span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#08677a] text-white text-xs font-semibold cursor-pointer hover:bg-teal-800 transition-colors">
                          {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          {isUploading ? "Subiendo..." : "Seleccionar archivo"}
                          <input
                            type="file"
                            accept="application/pdf,image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => handleDocumentUpload(e, doc.field, doc.category)}
                            disabled={isUploading}
                          />
                        </label>

                        {hasFile && (
                          <button
                            type="button"
                            onClick={() => clearDocumentSelection(doc.field)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Quitar
                          </button>
                        )}
                      </div>

                      {/* Checkbox manual en caso de entrega física (opcional, pero se marca auto) */}
                      <label className="flex items-center gap-2 mt-4 text-xs text-gray-600">
                        <input
                          type="checkbox"
                          name={doc.field.replace('Url', '')}
                          checked={formData[doc.field.replace('Url', '') as keyof typeof formData] as boolean}
                          onChange={handleCheckboxChange}
                          className="rounded border-gray-300 h-3.5 w-3.5 text-[#08677a] focus:ring-[#08677a]"
                        />
                        Marcar como entregado físicamente (sin subir archivo)
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#08677a] text-white hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#08677a] text-white hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? "Guardando..." : "Registrar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
