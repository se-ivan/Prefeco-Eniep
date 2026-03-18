"use client";

import { useState } from "react";
import useSWR from "swr";
import { Loader2, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadInstitucionDocumentToFirebase } from "@/lib/document-upload";

type Cuenta = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "RESPONSABLE_INSTITUCION";
  institucion: {
    id: number;
    nombre: string;
    cct: string;
    avalPresidenciaUrl?: string | null;
    liberacionAdeudosUrl?: string | null;
  } | null;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Error ${res.status}`);
  }
  return res.json();
};

export default function InstitucionDocumentosPage() {
  const { data, isLoading, mutate } = useSWR<Cuenta>("/api/cuenta", fetcher);

  const [avalPresidenciaUrl, setAvalPresidenciaUrl] = useState("");
  const [liberacionAdeudosUrl, setLiberacionAdeudosUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"aval" | "adeudos" | null>(null);

  const hasInstitucion = !!data?.institucion;

  const uploadDoc = async (
    file: File,
    type: "aval" | "adeudos"
  ) => {
    setUploading(type);
    try {
      const category = type === "aval" ? "aval-presidencia" : "liberacion-adeudos";
      const { url } = await uploadInstitucionDocumentToFirebase(file, category);

      if (type === "aval") {
        setAvalPresidenciaUrl(url);
      } else {
        setLiberacionAdeudosUrl(url);
      }

      toast.success("Documento subido correctamente");
    } catch (error: any) {
      toast.error(error?.message || "No se pudo subir el documento");
    } finally {
      setUploading(null);
    }
  };

  const saveChanges = async () => {
    if (!hasInstitucion) {
      toast.error("Tu cuenta no tiene institución asignada");
      return;
    }

    if (!avalPresidenciaUrl && !liberacionAdeudosUrl) {
      toast.error("Sube al menos un documento para guardar cambios");
      return;
    }

    setSaving(true);
    try {
      const payload: {
        avalPresidenciaUrl?: string;
        liberacionAdeudosUrl?: string;
      } = {};

      if (avalPresidenciaUrl) payload.avalPresidenciaUrl = avalPresidenciaUrl;
      if (liberacionAdeudosUrl) payload.liberacionAdeudosUrl = liberacionAdeudosUrl;

      const res = await fetch("/api/cuenta", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Error ${res.status}`);
      }

      toast.success("Documentos institucionales actualizados");
      setAvalPresidenciaUrl("");
      setLiberacionAdeudosUrl("");
      await mutate();
    } catch (error: any) {
      toast.error(error?.message || "No se pudieron guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando documentos institucionales...
      </div>
    );
  }

  return (
    <main className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Documentos Institucionales</h1>
        <p className="text-sm text-gray-500 mt-1">
          Modifica y vuelve a subir los documentos oficiales vinculados a tu institución.
        </p>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 space-y-5">
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
          Institución: {data?.institucion ? `${data.institucion.nombre} (${data.institucion.cct})` : "Sin institución asignada"}
        </div>

        <DocumentUploader
          label="Aval de la presidencia nacional"
          currentUrl={data?.institucion?.avalPresidenciaUrl || null}
          isUploading={uploading === "aval"}
          onFileSelected={(file) => uploadDoc(file, "aval")}
        />

        <DocumentUploader
          label="Liberación de adeudos (recibo 2026)"
          currentUrl={data?.institucion?.liberacionAdeudosUrl || null}
          isUploading={uploading === "adeudos"}
          onFileSelected={(file) => uploadDoc(file, "adeudos")}
        />

        <div className="flex justify-end">
          <button
            onClick={saveChanges}
            disabled={saving || uploading !== null || !hasInstitucion}
            className="inline-flex items-center gap-2 rounded-lg bg-[#08677a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar documentos
          </button>
        </div>
      </section>
    </main>
  );
}

function DocumentUploader({
  label,
  currentUrl,
  isUploading,
  onFileSelected,
}: {
  label: string;
  currentUrl: string | null;
  isUploading: boolean;
  onFileSelected: (file: File) => void;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-gray-100 p-4">
      <p className="text-sm font-semibold text-gray-800">{label}</p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {isUploading ? "Subiendo..." : "Seleccionar archivo"}
          <input
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              onFileSelected(file);
              e.target.value = "";
            }}
          />
        </label>

        {currentUrl ? (
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-[#08677a] hover:underline"
          >
            Ver documento actual
          </a>
        ) : (
          <span className="text-xs text-gray-500">No hay documento cargado actualmente</span>
        )}
      </div>
    </div>
  );
}