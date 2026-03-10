"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { KeyRound, Loader2, Save, UserCog } from "lucide-react";
import { toast } from "sonner";

type Cuenta = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "RESPONSABLE_INSTITUCION";
  institucion: { id: number; nombre: string; cct: string } | null;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Error ${res.status}`);
  }
  return res.json();
};

export default function ConfiguracionPage() {
  const { data, isLoading, mutate } = useSWR<Cuenta>("/api/cuenta", fetcher);

  const [name, setName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (data?.name) setName(data.name);
  }, [data?.name]);

  const saveProfile = async () => {
    if (!name.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    setSavingProfile(true);
    try {
      const res = await fetch("/api/cuenta", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Error ${res.status}`);
      }

      toast.success("Información de cuenta actualizada");
      await mutate();
    } catch (error: any) {
      toast.error(error?.message || "No se pudo actualizar la cuenta");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Completa todos los campos de contraseña");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("La confirmación no coincide");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/cuenta/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Error ${res.status}`);
      }

      toast.success("Contraseña actualizada");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error?.message || "No se pudo cambiar la contraseña");
    } finally {
      setSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando configuración...
      </div>
    );
  }

  return (
    <main className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Configuración de cuenta</h1>
        <p className="text-sm text-gray-500 mt-1">Actualiza tu información personal y tu contraseña.</p>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <UserCog className="h-4 w-4" />
          Información de la cuenta
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Nombre" value={name} onChange={setName} />
          <Field label="Correo" value={data?.email ?? ""} onChange={() => {}} disabled />
          <Field label="Rol" value={data?.role ?? ""} onChange={() => {}} disabled />
          <Field
            label="Institución"
            value={data?.institucion ? `${data.institucion.nombre} (${data.institucion.cct})` : "Sin institución"}
            onChange={() => {}}
            disabled
          />
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          La institución y el rol no se pueden modificar desde esta pantalla.
        </div>

        <div className="flex justify-end">
          <button
            onClick={saveProfile}
            disabled={savingProfile}
            className="inline-flex items-center gap-2 rounded-lg bg-[#08677a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
          >
            {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar cambios
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
        <div className="flex items-center gap-2 text-gray-800 font-semibold">
          <KeyRound className="h-4 w-4" />
          Cambiar contraseña
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Contraseña actual" value={currentPassword} onChange={setCurrentPassword} type="password" />
          <div />
          <Field label="Nueva contraseña" value={newPassword} onChange={setNewPassword} type="password" />
          <Field label="Confirmar nueva contraseña" value={confirmPassword} onChange={setConfirmPassword} type="password" />
        </div>

        <div className="flex justify-end">
          <button
            onClick={changePassword}
            disabled={savingPassword}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
          >
            {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Actualizar contraseña
          </button>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs text-gray-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        type={type}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-500"
      />
    </label>
  );
}
