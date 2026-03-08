"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarDays,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Esquema de validación ───────────────────────────────────────────────────
const institucionSchema = z.object({
  cct: z
    .string()
    .min(10, "La CCT debe tener al menos 10 caracteres")
    .max(15, "La CCT no puede exceder 15 caracteres"),
  nombre: z.string().min(3, "El nombre es obligatorio"),
  estado: z.string().min(2, "Selecciona un estado"),
  zonaEscolar: z.string().min(1, "La zona escolar es obligatoria"),
  urlLogo: z.string().url("URL inválida").optional().or(z.literal("")),
});

type InstitucionForm = z.infer<typeof institucionSchema>;

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

function formatDate(date: Date) {
  const str = date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function InstitucionesPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputFixedThemeClass =
    "h-11 mt-1 rounded-lg border-slate-200 bg-[#FDFDFD] text-slate-700 placeholder:text-slate-400 shadow-sm hover:border-slate-300 focus:border-teal-600 focus:ring-teal-600/20 transition-colors dark:border-slate-200 dark:bg-[#FDFDFD] dark:text-slate-700 dark:placeholder:text-slate-400 dark:hover:border-slate-300 dark:focus:border-teal-600 dark:focus:ring-teal-600/20";
  const selectFixedThemeClass =
    "h-11 mt-1 rounded-lg border-slate-200 bg-[#FDFDFD] text-slate-700 shadow-sm hover:border-slate-300 focus:border-teal-600 focus:ring-teal-600/20 transition-colors dark:border-slate-200 dark:bg-[#FDFDFD] dark:text-slate-700 dark:hover:border-slate-300 dark:focus:border-teal-600 dark:focus:ring-teal-600/20";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InstitucionForm>({
    resolver: zodResolver(institucionSchema),
    defaultValues: {
      cct: "",
      nombre: "",
      estado: "",
      zonaEscolar: "",
      urlLogo: "",
    },
  });

  const estadoVal = watch("estado");

  const clearLogoSelection = () => {
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview(null);
    setLogoFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      clearLogoSelection();
      return;
    }

    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setLogoPreview(previewUrl);
    setLogoFileName(selectedFile.name);
  };

  // ── Registrar institución ──
  const onSubmit = async (data: InstitucionForm) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/instituciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Error al registrar");
      }

      toast.success("Institución registrada exitosamente");
      reset();
      clearLogoSelection();
      router.push("/dashboard/instituciones");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al registrar institución"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      {/* ── Contenido Principal ── */}
      <main className="mx-auto max-w-4xl px-4 py-2 sm:px-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-8 sm:p-10 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ── Título Tarjeta ── */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800">
                Registro de Institución
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Completa los datos del plantel
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              
              {/* Nombre de Institución */}
              <div className="space-y-1.5">
                <Label htmlFor="nombre" className="text-[13px] font-semibold text-slate-700">
                  Nombre de la Institución <span className="text-slate-400 font-normal">*</span>
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Escuela Preparatoria Federal"
                  className={inputFixedThemeClass}
                  {...register("nombre")}
                />
                {errors.nombre && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* CCT */}
              <div className="space-y-1.5">
                <Label htmlFor="cct" className="text-[13px] font-semibold text-slate-700">
                  CCT (Clave de Centro de Trabajo) <span className="text-slate-400 font-normal">*</span>
                </Label>
                <Input
                  id="cct"
                  placeholder="Ej: 09DPR1234A"
                  maxLength={15}
                  className={inputFixedThemeClass}
                  {...register("cct", {
                    onChange: (e) => {
                      e.target.value = e.target.value.toUpperCase();
                    },
                  })}
                />
                {errors.cct && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.cct.message}
                  </p>
                )}
              </div>

              {/* Zona Escolar */}
              <div className="space-y-1.5">
                <Label htmlFor="zonaEscolar" className="text-[13px] font-semibold text-slate-700">
                  Zona Escolar <span className="text-slate-400 font-normal">*</span>
                </Label>
                <Input
                  id="zonaEscolar"
                  placeholder="Ej: Zona 01"
                  className={inputFixedThemeClass}
                  {...register("zonaEscolar")}
                />
                {errors.zonaEscolar && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.zonaEscolar.message}
                  </p>
                )}
              </div>

              {/* Estado */}
              <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-slate-700">
                  Estado <span className="text-slate-400 font-normal">*</span>
                </Label>
                <Select
                  value={estadoVal || ""}
                  onValueChange={(v) => setValue("estado", v)}
                >
                  <SelectTrigger className={selectFixedThemeClass}>
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent className="border-slate-200 bg-[#FDFDFD] text-slate-700">
                    {estadosMexico.map((e) => (
                      <SelectItem
                        key={e}
                        value={e}
                        className="text-slate-700 focus:bg-slate-100 focus:text-slate-700"
                      >
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.estado && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.estado.message}
                  </p>
                )}
              </div>

              {/* URL Logo */}
              <div className="space-y-1.5 sm:col-span-2 mt-2">
                <Label htmlFor="logo" className="text-[13px] font-semibold text-slate-700">
                  Logo de la Institución <span className="text-slate-400 font-normal">(Opcional)</span>
                </Label>
                <div className="mt-1 flex items-center justify-center w-full">
                  <label htmlFor="logo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50/50 hover:bg-slate-50 hover:border-teal-400 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 mb-2 text-slate-400" />
                      <p className="mb-1 text-sm text-slate-500"><span className="font-semibold text-teal-600">Haz clic para subir</span></p>
                      <p className="text-xs text-slate-400">SVG, PNG, JPG</p>
                    </div>
                    <Input
                      id="logo"
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple={false}
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
                {logoFileName && (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-500">Archivo seleccionado: {logoFileName}</p>
                    <button
                      type="button"
                      className="h-7 px-2 text-xs text-slate-600 hover:text-red-600 transition-all duration-300 cursor-pointer "
                      onClick={clearLogoSelection}
                    >
                      Quitar imagen
                    </button>
                  </div>
                )}
                {logoPreview && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-[#FDFDFD] p-2">
                    <img
                      src={logoPreview}
                      alt="Vista previa del logo"
                      className="h-28 w-full rounded object-contain"
                    />
                  </div>
                )}
                {/* Nota: Para manejar el archivo necesitas agregar lógica específica de subida de archivos (ej. Cloudinary, Uploadthing, AWS S3, etc). Este diseño visualmente cumple el formato. */}
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="mt-10 flex items-center justify-end border-t border-slate-100 pt-6">
              <Button
                type="submit"
                disabled={submitting}
                className="h-10 rounded-lg bg-[#FFA52D] px-6 text-sm font-semibold text-white hover:bg-[#FFA52D]/80 focus:ring-2 focus:ring-[#FFA52D]/80 focus:ring-offset-2 transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando
                  </>
                ) : (
                  <>
                    Registrar
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main> 
    </div>
  );
}
