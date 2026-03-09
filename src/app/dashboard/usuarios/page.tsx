"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Loader2, ShieldCheck, Search, Save } from "lucide-react";
import { toast } from "sonner";

type Institucion = {
  id: number;
  nombre: string;
  cct: string;
};

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "RESPONSABLE_INSTITUCION";
  institucionId: number | null;
  institucion: Institucion | null;
  createdAt: string;
};

type Scope = {
  role: "ADMIN" | "RESPONSABLE_INSTITUCION";
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Error ${res.status}`);
  }
  return res.json();
};

export default function UsuariosPage() {
  const { data: scope, isLoading: loadingScope } = useSWR<Scope>("/api/me", fetcher);
  const isAdmin = scope?.role === "ADMIN";

  const { data: users = [], isLoading, mutate } = useSWR<UserItem[]>(isAdmin ? "/api/usuarios" : null, fetcher);
  const { data: instituciones = [] } = useSWR<Institucion[]>(isAdmin ? "/api/instituciones" : null, fetcher);

  const [searchTerm, setSearchTerm] = useState("");
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "RESPONSABLE_INSTITUCION" as "ADMIN" | "RESPONSABLE_INSTITUCION",
    institucionId: "",
  });
  const [drafts, setDrafts] = useState<Record<string, { role: "ADMIN" | "RESPONSABLE_INSTITUCION"; institucionId: string }>>({});

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      `${u.name} ${u.email}`.toLowerCase().includes(q) ||
      (u.institucion?.nombre ?? "").toLowerCase().includes(q)
    );
  }, [users, searchTerm]);

  function getDraft(user: UserItem) {
    return (
      drafts[user.id] ?? {
        role: user.role,
        institucionId: user.institucionId ? String(user.institucionId) : "",
      }
    );
  }

  function setDraft(user: UserItem, patch: Partial<{ role: "ADMIN" | "RESPONSABLE_INSTITUCION"; institucionId: string }>) {
    const current = getDraft(user);
    setDrafts((prev) => ({
      ...prev,
      [user.id]: {
        role: patch.role ?? current.role,
        institucionId: patch.institucionId ?? current.institucionId,
      },
    }));
  }

  async function saveUser(user: UserItem) {
    const draft = getDraft(user);

    if (draft.role === "RESPONSABLE_INSTITUCION" && !draft.institucionId) {
      toast.error("Debes seleccionar una institución para el responsable");
      return;
    }

    setSavingUserId(user.id);
    try {
      const res = await fetch("/api/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          role: draft.role,
          institucionId: draft.role === "RESPONSABLE_INSTITUCION" ? Number(draft.institucionId) : null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Error ${res.status}`);
      }

      toast.success("Usuario actualizado");
      await mutate();
    } catch (error: any) {
      toast.error(error?.message || "No se pudo actualizar el usuario");
    } finally {
      setSavingUserId(null);
    }
  }

  async function createUser() {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      toast.error("Nombre, correo y contraseña son obligatorios");
      return;
    }

    if (newUser.role === "RESPONSABLE_INSTITUCION" && !newUser.institucionId) {
      toast.error("Selecciona una institución para el encargado");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUser.name.trim(),
          email: newUser.email.trim().toLowerCase(),
          password: newUser.password,
          role: newUser.role,
          institucionId: newUser.role === "RESPONSABLE_INSTITUCION" ? Number(newUser.institucionId) : null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Error ${res.status}`);
      }

      toast.success("Usuario creado y asignado correctamente");
      setNewUser({ name: "", email: "", password: "", role: "RESPONSABLE_INSTITUCION", institucionId: "" });
      await mutate();
    } catch (error: any) {
      toast.error(error?.message || "No se pudo crear el usuario");
    } finally {
      setCreating(false);
    }
  }

  if (loadingScope) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando permisos...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
        Solo administradores pueden gestionar encargados de institución.
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Registro de Encargados de Institución</h1>
        <p className="text-sm text-gray-500 mt-1">Asigna rol y alcance por institución a usuarios existentes.</p>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-4 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">Crear nuevo usuario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={newUser.name}
            onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))}
            placeholder="Nombre completo"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            value={newUser.email}
            onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
            placeholder="correo@dominio.com"
            type="email"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <input
            value={newUser.password}
            onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))}
            placeholder="Contraseña temporal"
            type="password"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <select
            value={newUser.role}
            onChange={(e) => {
              const role = e.target.value as "ADMIN" | "RESPONSABLE_INSTITUCION";
              setNewUser((p) => ({ ...p, role, institucionId: role === "ADMIN" ? "" : p.institucionId }));
            }}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="RESPONSABLE_INSTITUCION">RESPONSABLE_INSTITUCION</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <select
            value={newUser.institucionId}
            disabled={newUser.role !== "RESPONSABLE_INSTITUCION"}
            onChange={(e) => setNewUser((p) => ({ ...p, institucionId: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-60"
          >
            <option value="">Selecciona una institución</option>
            {instituciones.map((i) => (
              <option key={i.id} value={i.id}>{i.nombre} ({i.cct})</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={createUser}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-lg bg-[#08677a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Crear usuario
          </button>
        </div>
      </section>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, correo o institución"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#08677a]"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando usuarios...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No hay usuarios para mostrar.</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Institución</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => {
                const d = getDraft(u);
                return (
                  <tr key={u.id}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">{u.name}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={d.role}
                        onChange={(e) => {
                          const role = e.target.value as "ADMIN" | "RESPONSABLE_INSTITUCION";
                          setDraft(u, {
                            role,
                            institucionId: role === "ADMIN" ? "" : d.institucionId,
                          });
                        }}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="RESPONSABLE_INSTITUCION">RESPONSABLE_INSTITUCION</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={d.institucionId}
                        disabled={d.role !== "RESPONSABLE_INSTITUCION"}
                        onChange={(e) => setDraft(u, { institucionId: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-60"
                      >
                        <option value="">Selecciona una institución</option>
                        {instituciones.map((i) => (
                          <option key={i.id} value={i.id}>{i.nombre} ({i.cct})</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => saveUser(u)}
                        disabled={savingUserId === u.id}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#08677a] px-3 py-2 text-xs font-semibold text-white disabled:opacity-70"
                      >
                        {savingUserId === u.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        Guardar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="h-4 w-4" />
          Política aplicada
        </div>
        <p className="mt-1 text-xs">
          Los responsables solo podrán operar participantes y personal de apoyo de su institución asignada.
        </p>
      </div>
    </main>
  );
}
