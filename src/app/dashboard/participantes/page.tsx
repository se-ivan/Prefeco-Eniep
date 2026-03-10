"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Heart, 
  Users, 
  FileText, 
  ImagePlus,
  Loader2,
  Upload,
  ChevronLeft, 
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { uploadImageToFirebase } from "@/lib/photo-upload";
import { uploadParticipantDocumentToFirebase } from "@/lib/document-upload";

// Definición de los pasos del Stepper
const STEPS = [
  { id: 1, title: "Datos del Alumno", icon: User },
  { id: 2, title: "Datos Médicos", icon: Heart },
  { id: 3, title: "Tutor Legal", icon: Users },
  { id: 4, title: "Documentación", icon: FileText },
];

type Institucion = {
  id: number;
  nombre: string;
};

type Genero = "MASCULINO" | "FEMENINO" | "OTRO";

type UserScope = {
  role: "ADMIN" | "RESPONSABLE_INSTITUCION";
  institucionId: number | null;
  institucion: { id: number; nombre: string; cct: string } | null;
};

type ParticipantDocumentField =
  | "docCredencialUrl"
  | "docCartaResponsivaTutorUrl"
  | "docHistorialMedicoUrl"
  | "docActaNacimientoUrl";

const DOCUMENT_UPLOAD_CONFIG: Array<{
  field: ParticipantDocumentField;
  label: string;
  category: "credencial" | "carta-responsiva-tutor" | "historial-medico" | "acta-nacimiento";
}> = [
  { field: "docCredencialUrl", label: "Credencial", category: "credencial" },
  {
    field: "docCartaResponsivaTutorUrl",
    label: "Carta responsiva del tutor",
    category: "carta-responsiva-tutor",
  },
  { field: "docHistorialMedicoUrl", label: "Historial médico", category: "historial-medico" },
  { field: "docActaNacimientoUrl", label: "Acta de nacimiento", category: "acta-nacimiento" },
];

export default function RegistrarAlumnoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loadingInstituciones, setLoadingInstituciones] = useState(false);
  const [scope, setScope] = useState<UserScope | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState<Record<ParticipantDocumentField, boolean>>({
    docCredencialUrl: false,
    docCartaResponsivaTutorUrl: false,
    docHistorialMedicoUrl: false,
    docActaNacimientoUrl: false,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    institucionId: "",
    fotoUrl: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    matricula: "",
    curp: "",
    fechaNacimiento: "",
    genero: "" as Genero | "",
    alergias: "",
    tipoSangre: "",
    padecimientos: "",
    medicamentos: "",
    contactoEmergenciaNombre: "",
    contactoEmergenciaTelefono: "",
    tutorNombreCompleto: "",
    tutorParentesco: "",
    tutorTelefono: "",
    tutorEmail: "",
    tutorDireccion: "",
    docCredencialUrl: "",
    docCartaResponsivaTutorUrl: "",
    docHistorialMedicoUrl: "",
    docActaNacimientoUrl: "",
    docCurp: false,
    docComprobanteEstudios: false,
    docCartaResponsiva: false,
    docCertificadoMedico: false,
    docIneTutor: false,
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

  const clearPhotoSelection = () => {
    setPhotoPreview(null);
    setFormData((prev) => ({ ...prev, fotoUrl: "" }));
  };

  const clearDocumentSelection = (field: ParticipantDocumentField) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const handleDocumentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: ParticipantDocumentField,
    category: "credencial" | "carta-responsiva-tutor" | "historial-medico" | "acta-nacimiento"
  ) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setStepError(null);
    setUploadingDocuments((prev) => ({ ...prev, [field]: true }));

    try {
      const { url } = await uploadParticipantDocumentToFirebase(selectedFile, category);
      setFormData((prev) => ({ ...prev, [field]: url }));
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

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setUploadingPhoto(true);
    setStepError(null);

    try {
      const { url } = await uploadImageToFirebase(selectedFile, "participante");
      setPhotoPreview(url);
      setFormData((prev) => ({ ...prev, fotoUrl: url }));
      toast.success("Fotografia subida correctamente");
    } catch (error: any) {
      const message = error?.message || "No se pudo subir la fotografia";
      toast.error(message);
      setStepError(message);
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const validateStep1 = () => {
    const resolvedInstitucionId = Number(formData.institucionId || scope?.institucionId || 0);
    if (!resolvedInstitucionId) return "No se encontró una institución válida para el registro.";
    if (!formData.nombres.trim()) return "El nombre es obligatorio.";
    if (!formData.apellidoPaterno.trim()) return "El apellido paterno es obligatorio.";
    if (!formData.apellidoMaterno.trim()) return "El apellido materno es obligatorio.";
    if (!formData.matricula.trim()) return "La matrícula es obligatoria.";
    if (!formData.curp.trim()) return "La CURP es obligatoria.";
    if (!formData.fechaNacimiento) return "La fecha de nacimiento es obligatoria.";
    if (!formData.genero) return "Selecciona el género.";
    return null;
  };

  const validateStep3 = () => {
    const hasAnyTutorData =
      !!formData.tutorNombreCompleto.trim() ||
      !!formData.tutorParentesco.trim() ||
      !!formData.tutorTelefono.trim() ||
      !!formData.tutorEmail.trim() ||
      !!formData.tutorDireccion.trim();

    if (!hasAnyTutorData) return null;
    if (!formData.tutorNombreCompleto.trim()) return "Completa el nombre del tutor legal.";
    if (!formData.tutorParentesco.trim()) return "Completa el parentesco del tutor legal.";
    if (!formData.tutorTelefono.trim()) return "Completa el teléfono del tutor legal.";

    return null;
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) return validateStep1();
    if (currentStep === 3) return validateStep3();
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

    const step3Error = validateStep3();
    if (step3Error) {
      setStepError(step3Error);
      toast.error(step3Error);
      setCurrentStep(3);
      return;
    }

    const hasTutorData =
      !!formData.tutorNombreCompleto.trim() ||
      !!formData.tutorParentesco.trim() ||
      !!formData.tutorTelefono.trim() ||
      !!formData.tutorEmail.trim() ||
      !!formData.tutorDireccion.trim();

    const error = validateCurrentStep();
    if (error) {
      setStepError(error);
      toast.error(error);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        institucionId: Number(formData.institucionId || scope?.institucionId || 0),
        curp: formData.curp,
        matricula: formData.matricula,
        nombres: formData.nombres,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        fechaNacimiento: formData.fechaNacimiento,
        genero: formData.genero,
        fotoUrl: formData.fotoUrl || null,
        alergias: formData.alergias || null,
        tipoSangre: formData.tipoSangre || null,
        padecimientos: formData.padecimientos || null,
        medicamentos: formData.medicamentos || null,
        contactoEmergenciaNombre: formData.contactoEmergenciaNombre || null,
        contactoEmergenciaTelefono: formData.contactoEmergenciaTelefono || null,
        docCurp: !!formData.docActaNacimientoUrl,
        docComprobanteEstudios: !!formData.docCredencialUrl,
        docCartaResponsiva: !!formData.docCartaResponsivaTutorUrl,
        docCertificadoMedico: !!formData.docHistorialMedicoUrl,
        docIneTutor: formData.docIneTutor,
        docCredencialUrl: formData.docCredencialUrl || null,
        docCartaResponsivaTutorUrl: formData.docCartaResponsivaTutorUrl || null,
        docHistorialMedicoUrl: formData.docHistorialMedicoUrl || null,
        docActaNacimientoUrl: formData.docActaNacimientoUrl || null,
        tutor: hasTutorData
          ? {
              nombreCompleto: formData.tutorNombreCompleto,
              parentesco: formData.tutorParentesco,
              telefono: formData.tutorTelefono,
              email: formData.tutorEmail || null,
              direccion: formData.tutorDireccion || null,
            }
          : null,
        estatus: "ACTIVO",
      };

      const res = await fetch("/api/participantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Error ${res.status} al registrar participante`);
      }

      toast.success("Alumno registrado exitosamente");
      router.push("/dashboard/participantes/lista");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "No se pudo registrar al alumno");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculamos el porcentaje de la barra de progreso
  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Tarjeta Principal del Formulario */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Cabecera de la Tarjeta */}
        <div className="px-8 py-8 border-b border-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Registro de Participante</h2>
          <p className="text-gray-500 text-sm mt-1">Completa los datos del alumno en 4 sencillos pasos</p>
        </div>

        {/* Zona del Stepper */}
        <div className="px-8 pt-8 pb-4">
          <div className="relative flex justify-between items-center max-w-3xl mx-auto">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center relative z-10 w-24">
                  {/* Círculo del Icono */}
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm
                      ${isActive || isPast ? "bg-[#08677a] text-white" : "bg-gray-100 text-gray-400"}`}
                  >
                    <step.icon size={20} />
                  </div>
                  {/* Título del Paso */}
                  <span 
                    className={`text-[11px] font-semibold mt-3 text-center transition-colors duration-300
                      ${isActive || isPast ? "text-[#08677a]" : "text-gray-400"}`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}

            {/* Líneas conectoras grises detrás de los círculos */}
            <div className="absolute top-6 left-[10%] right-[10%] h-0.5 bg-gray-100 z-0" />
          </div>

          {/* Barra de Progreso Inferior (La línea gruesa bajo el stepper) */}
          <div className="mt-6 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#08677a] transition-all duration-500 ease-in-out" 
              style={{ width: `${progressPercentage === 0 ? 15 : progressPercentage}%` }} // 15% inicial para que se vea que empezó
            />
          </div>
        </div>

        {/* Contenedor del Formulario Activo */}
        <div className="px-8 py-6">
          {stepError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {stepError}
            </div>
          )}
          
          {/* Renderizado Condicional del Paso 1 */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Datos del Alumno</h3>
              <p className="text-xs text-gray-500 mb-8">Información personal básica</p>

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
                
                {/* Input: Nombres */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                    Nombre(s) <span className="text-[#08677a]">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    placeholder="Ej: Juan Carlos"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                {/* Input: Apellido Paterno */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                    Apellido Paterno <span className="text-[#08677a]">*</span>
                  </label>
                  <input
                    type="text"
                    name="apellidoPaterno"
                    value={formData.apellidoPaterno}
                    onChange={handleInputChange}
                    placeholder="Ej: García"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                {/* Input: Apellido Materno */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    name="apellidoMaterno"
                    value={formData.apellidoMaterno}
                    onChange={handleInputChange}
                    placeholder="Ej: López"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                {/* Input: Matrícula */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                    Matrícula <span className="text-[#08677a]">*</span>
                  </label>
                  <input
                    type="text"
                    name="matricula"
                    value={formData.matricula}
                    onChange={handleInputChange}
                    placeholder="Ej: 2026001234"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                {/* Input: CURP */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                    CURP <span className="text-[#08677a]">*</span>
                  </label>
                  <input
                    type="text"
                    name="curp"
                    value={formData.curp}
                    onChange={handleInputChange}
                    placeholder="Ej: GAPL050815HDFRPNA09"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none uppercase"
                  />
                </div>
                
                {/* Div vacío para mantener el grid alineado como en la imagen */}
                <div className="hidden md:block"></div>

                {/* Input: Fecha de Nacimiento */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                {/* Select: Sexo */}
                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">
                    Género
                  </label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-500 focus:ring-0 focus:border-[#08677a] transition-colors outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMENINO">Femenino</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Aquí irían los demás pasos (Paso 2, 3, 4)... */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Datos Médicos</h3>
              <p className="text-xs text-gray-500 mb-8">Información médica y contacto de emergencia</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Tipo de Sangre</label>
                  <input
                    type="text"
                    name="tipoSangre"
                    value={formData.tipoSangre}
                    onChange={handleInputChange}
                    placeholder="Ej: O+"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none uppercase"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Alergias</label>
                  <input
                    type="text"
                    name="alergias"
                    value={formData.alergias}
                    onChange={handleInputChange}
                    placeholder="Ej: Penicilina"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Padecimientos</label>
                  <input
                    type="text"
                    name="padecimientos"
                    value={formData.padecimientos}
                    onChange={handleInputChange}
                    placeholder="Ej: Asma"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Medicamentos</label>
                  <input
                    type="text"
                    name="medicamentos"
                    value={formData.medicamentos}
                    onChange={handleInputChange}
                    placeholder="Ej: Salbutamol"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Nombre de contacto de emergencia</label>
                  <input
                    type="text"
                    name="contactoEmergenciaNombre"
                    value={formData.contactoEmergenciaNombre}
                    onChange={handleInputChange}
                    placeholder="Ej: María Gómez"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Teléfono de emergencia</label>
                  <input
                    type="text"
                    name="contactoEmergenciaTelefono"
                    value={formData.contactoEmergenciaTelefono}
                    onChange={handleInputChange}
                    placeholder="Ej: 5512345678"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>
              </div>
            </div>
          )}
           {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="text-lg font-bold text-gray-800 mb-1">Tutor Legal</h3>
              <p className="text-xs text-gray-500 mb-8">Datos del tutor o responsable legal (opcional)</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="group md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                    Nombre completo del tutor
                  </label>
                  <input
                    type="text"
                    name="tutorNombreCompleto"
                    value={formData.tutorNombreCompleto}
                    onChange={handleInputChange}
                    placeholder="Ej: Laura Hernández Pérez"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Parentesco</label>
                  <input
                    type="text"
                    name="tutorParentesco"
                    value={formData.tutorParentesco}
                    onChange={handleInputChange}
                    placeholder="Ej: Madre"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Teléfono</label>
                  <input
                    type="text"
                    name="tutorTelefono"
                    value={formData.tutorTelefono}
                    onChange={handleInputChange}
                    placeholder="Ej: 5587654321"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-semibold text-gray-800">Correo electrónico</label>
                  <input
                    type="email"
                    name="tutorEmail"
                    value={formData.tutorEmail}
                    onChange={handleInputChange}
                    placeholder="Ej: tutor@email.com"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>

                <div className="group md:col-span-2">
                  <label className="text-sm font-semibold text-gray-800">Dirección</label>
                  <input
                    type="text"
                    name="tutorDireccion"
                    value={formData.tutorDireccion}
                    onChange={handleInputChange}
                    placeholder="Ej: Calle 12 #45, Col. Centro"
                    className="w-full mt-2 bg-transparent border-0 border-b-2 border-gray-100 pb-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:border-[#08677a] transition-colors outline-none"
                  />
                </div>
              </div>
            </div>
          )}
           {currentStep === 4 && (
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
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer de la Tarjeta (Botones de Navegación) */}
        <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-white hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} /> Anterior
          </button>

          {currentStep < STEPS.length ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ffb041] text-[#08677a] text-sm font-bold shadow-sm shadow-orange-500/20 hover:bg-[#e69b35] transition-all"
            >
              Siguiente <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#08677a] text-white text-sm font-bold shadow-md shadow-teal-900/20 hover:bg-teal-800 transition-all"
            >
              {submitting ? "Guardando..." : "Finalizar Registro"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}