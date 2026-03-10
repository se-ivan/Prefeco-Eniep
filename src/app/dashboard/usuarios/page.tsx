"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Loader2, Plus, Save, Search, ShieldCheck, UserCog, X } from "lucide-react";
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "RESPONSABLE_INSTITUCION" as "ADMIN" | "RESPONSABLE_INSTITUCION",
    institucionId: "",
  });

  const [editData, setEditData] = useState({
    role: "RESPONSABLE_INSTITUCION" as "ADMIN" | "RESPONSABLE_INSTITUCION",
    institucionId: "",
  });

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const joined = `${u.name} ${u.email} ${u.institucion?.nombre ?? ""}`.toLowerCase();
      return joined.includes(q);
    });
  }, [users, searchTerm]);

  const responsables = users.filter((u) => u.role === "RESPONSABLE_INSTITUCION").length;

  const openEditModal = (user: UserItem) => {
    setSelectedUser(user);
    setEditData({
      role: user.role,
      institucionId: user.institucionId ? String(user.institucionId) : "",
    });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    if (saving) return;
    setIsEditOpen(false);
    setSelectedUser(null);
  };

  const closeCreateModal = () => {
    if (creating) return;
    setIsCreateOpen(false);
  };

  async function saveUser() {
    if (!selectedUser) return;

    if (editData.role === "RESPONSABLE_INSTITUCION" && !editData.institucionId) {
      toast.error("Debes seleccionar una institución para el encargado");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: editData.role,
          institucionId: editData.role === "RESPONSABLE_INSTITUCION" ? Number(editData.institucionId) : null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `Error ${res.status}`);
      }

      toast.success("Usuario actualizado");
      closeEditModal();
      await mutate();
    } catch (error: any) {
      toast.error(error?.message || "No se pudo actualizar el usuario");
    } finally {
      setSaving(false);
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
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "RESPONSABLE_INSTITUCION",
        institucionId: "",
      });
      closeCreateModal();
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
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Encargados de Institución</h1>
          <p className="text-sm text-gray-500 mt-1">Administra roles y alcance por plantel con control centralizado.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#08677a] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          Nuevo encargado
        </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Usuarios totales" value={String(users.length)} />
        <StatCard title="Encargados activos" value={String(responsables)} />
        <StatCard title="Instituciones" value={String(instituciones.length)} />
      </section>

      <div className="relative max-w-lg">
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
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">{u.name}</div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {u.institucion ? `${u.institucion.nombre} (${u.institucion.cct})` : "Sin institución"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEditModal(u)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:border-[#08677a] hover:text-[#08677a]"
                    >
                      <UserCog className="h-3.5 w-3.5" />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
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

      {isCreateOpen && (
        <ModalShell title="Registrar nuevo usuario" onClose={closeCreateModal}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FieldInput value={newUser.name} onChange={(v) => setNewUser((p) => ({ ...p, name: v }))} placeholder="Nombre completo" />
            <FieldInput value={newUser.email} onChange={(v) => setNewUser((p) => ({ ...p, email: v }))} placeholder="correo@dominio.com" type="email" />
            <FieldInput value={newUser.password} onChange={(v) => setNewUser((p) => ({ ...p, password: v }))} placeholder="Contraseña temporal" type="password" />
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
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={closeCreateModal} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700">Cancelar</button>
            <button
              onClick={createUser}
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-lg bg-[#08677a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Crear usuario
            </button>
          </div>
        </ModalShell>
      )}

      {isEditOpen && selectedUser && (
        <ModalShell title={`Editar usuario: ${selectedUser.name}`} onClose={closeEditModal}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50">{selectedUser.email}</div>
            <select
              value={editData.role}
              onChange={(e) => {
                const role = e.target.value as "ADMIN" | "RESPONSABLE_INSTITUCION";
                setEditData((p) => ({ ...p, role, institucionId: role === "ADMIN" ? "" : p.institucionId }));
              }}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="RESPONSABLE_INSTITUCION">RESPONSABLE_INSTITUCION</option>
            </select>
            <select
              value={editData.institucionId}
              disabled={editData.role !== "RESPONSABLE_INSTITUCION"}
              onChange={(e) => setEditData((p) => ({ ...p, institucionId: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-60 md:col-span-2"
            >
              <option value="">Selecciona una institución</option>
              {instituciones.map((i) => (
                <option key={i.id} value={i.id}>{i.nombre} ({i.cct})</option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={closeEditModal} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700">Cancelar</button>
            <button
              onClick={saveUser}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#08677a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Guardar cambios
            </button>
          </div>
        </ModalShell>
      )}
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-bold text-gray-800 mt-1">{value}</div>
    </div>
  );
}

function RoleBadge({ role }: { role: "ADMIN" | "RESPONSABLE_INSTITUCION" }) {
  if (role === "ADMIN") {
    return <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700">ADMIN</span>;
  }

  return (
    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
      RESPONSABLE_INSTITUCION
    </span>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FieldInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
    />
  );
}
