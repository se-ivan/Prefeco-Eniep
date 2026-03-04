"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Edit3, Loader2, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

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
  puesto: string;
  telefono: string;
  email: string | null;
  contactoEmergenciaNombre: string | null;
  contactoEmergenciaTelefono: string | null;
  docCurp: boolean;
  docIdentificacionOficial: boolean;
  docComprobanteDomicilio: boolean;
  docCartaAntecedentes: boolean;
  estatus: "ACTIVO" | "INACTIVO";
  institucion: {
    id: number;
    nombre: string;
  };
};

type EditForm = {
  institucionId: string;
  curp: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  puesto: string;
  telefono: string;
  email: string;
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
  docCurp: boolean;
  docIdentificacionOficial: boolean;
  docComprobanteDomicilio: boolean;
  docCartaAntecedentes: boolean;
  estatus: "ACTIVO" | "INACTIVO";
};

const initialEditForm: EditForm = {
  institucionId: "",
  curp: "",
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  puesto: "",
  telefono: "",
  email: "",
  contactoEmergenciaNombre: "",
  contactoEmergenciaTelefono: "",
  docCurp: false,
  docIdentificacionOficial: false,
  docComprobanteDomicilio: false,
  docCartaAntecedentes: false,
  estatus: "ACTIVO",
};

export default function ListaPersonalApoyoPage() {
  const [items, setItems] = useState<PersonalApoyo[]>([]);
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<PersonalApoyo | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(initialEditForm);

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
    setEditForm({
      institucionId: String(item.institucionId),
      curp: item.curp,
      nombres: item.nombres,
      apellidoPaterno: item.apellidoPaterno,
      apellidoMaterno: item.apellidoMaterno,
      puesto: item.puesto,
      telefono: item.telefono,
      email: item.email ?? "",
      contactoEmergenciaNombre: item.contactoEmergenciaNombre ?? "",
      contactoEmergenciaTelefono: item.contactoEmergenciaTelefono ?? "",
      docCurp: item.docCurp,
      docIdentificacionOficial: item.docIdentificacionOficial,
      docComprobanteDomicilio: item.docComprobanteDomicilio,
      docCartaAntecedentes: item.docCartaAntecedentes,
      estatus: item.estatus,
    });
  };

  const closeEditModal = () => {
    if (saving) return;
    setEditingItem(null);
    setEditForm(initialEditForm);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    if (!editingItem) return;

    if (
      !editForm.institucionId ||
      !editForm.curp.trim() ||
      !editForm.nombres.trim() ||
      !editForm.apellidoPaterno.trim() ||
      !editForm.apellidoMaterno.trim() ||
      !editForm.puesto.trim() ||
      !editForm.telefono.trim()
    ) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        institucionId: Number(editForm.institucionId),
        curp: editForm.curp,
        nombres: editForm.nombres,
        apellidoPaterno: editForm.apellidoPaterno,
        apellidoMaterno: editForm.apellidoMaterno,
        puesto: editForm.puesto,
        telefono: editForm.telefono,
        email: editForm.email || null,
        contactoEmergenciaNombre: editForm.contactoEmergenciaNombre || null,
        contactoEmergenciaTelefono: editForm.contactoEmergenciaTelefono || null,
        docCurp: editForm.docCurp,
        docIdentificacionOficial: editForm.docIdentificacionOficial,
        docComprobanteDomicilio: editForm.docComprobanteDomicilio,
        docCartaAntecedentes: editForm.docCartaAntecedentes,
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Personal de Apoyo</h1>
          <p className="text-sm text-gray-500">Listado y edición de registros</p>
        </div>
        <Link
          href="/dashboard/personal-apoyo"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#08677a] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          <UserPlus size={16} />
          Registrar personal
        </Link>
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
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Puesto</th>
                  <th className="px-4 py-3">Institución</th>
                  <th className="px-4 py-3">Teléfono</th>
                  <th className="px-4 py-3">Estatus</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.nombres} {item.apellidoPaterno} {item.apellidoMaterno}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.puesto}</td>
                    <td className="px-4 py-3 text-gray-600">{item.institucion.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{item.telefono}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          item.estatus === "ACTIVO"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {item.estatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEditModal(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-[#08677a] hover:text-[#08677a]"
                      >
                        <Edit3 size={14} />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Editar personal de apoyo</h2>
              <button onClick={closeEditModal} className="text-sm text-gray-500 hover:text-gray-700">
                Cerrar
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

              <Field label="Nombre(s) *" name="nombres" value={editForm.nombres} onChange={handleEditInputChange} />
              <Field label="Apellido paterno *" name="apellidoPaterno" value={editForm.apellidoPaterno} onChange={handleEditInputChange} />
              <Field label="Apellido materno *" name="apellidoMaterno" value={editForm.apellidoMaterno} onChange={handleEditInputChange} />
              <Field label="CURP *" name="curp" value={editForm.curp} onChange={handleEditInputChange} />
              <Field label="Puesto *" name="puesto" value={editForm.puesto} onChange={handleEditInputChange} />
              <Field label="Teléfono *" name="telefono" value={editForm.telefono} onChange={handleEditInputChange} />
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

              <div className="md:col-span-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <CheckField
                  label="CURP"
                  name="docCurp"
                  checked={editForm.docCurp}
                  onChange={handleEditCheckboxChange}
                />
                <CheckField
                  label="Identificación oficial"
                  name="docIdentificacionOficial"
                  checked={editForm.docIdentificacionOficial}
                  onChange={handleEditCheckboxChange}
                />
                <CheckField
                  label="Comprobante domicilio"
                  name="docComprobanteDomicilio"
                  checked={editForm.docComprobanteDomicilio}
                  onChange={handleEditCheckboxChange}
                />
                <CheckField
                  label="Carta antecedentes"
                  name="docCartaAntecedentes"
                  checked={editForm.docCartaAntecedentes}
                  onChange={handleEditCheckboxChange}
                />
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
                disabled={saving}
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
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
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
