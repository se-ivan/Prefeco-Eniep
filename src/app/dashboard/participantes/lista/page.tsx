"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Edit3, Loader2, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

type Genero = "MASCULINO" | "FEMENINO" | "OTRO";
type Estatus = "ACTIVO" | "INACTIVO";

type Institucion = {
  id: number;
  nombre: string;
};

type Tutor = {
  id: number;
  nombreCompleto: string;
  parentesco: string;
  telefono: string;
  email: string | null;
  direccion: string | null;
} | null;

type Participante = {
  id: number;
  institucionId: number;
  curp: string;
  matricula: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  genero: Genero;
  estatus: Estatus;
  alergias: string | null;
  tipoSangre: string | null;
  padecimientos: string | null;
  medicamentos: string | null;
  contactoEmergenciaNombre: string | null;
  contactoEmergenciaTelefono: string | null;
  docCurp: boolean;
  docComprobanteEstudios: boolean;
  docCartaResponsiva: boolean;
  docCertificadoMedico: boolean;
  docIneTutor: boolean;
  institucion: {
    id: number;
    nombre: string;
  };
  tutor: Tutor;
};

type EditForm = {
  institucionId: string;
  curp: string;
  matricula: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  genero: Genero | "";
  estatus: Estatus;
  alergias: string;
  tipoSangre: string;
  padecimientos: string;
  medicamentos: string;
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
  docCurp: boolean;
  docComprobanteEstudios: boolean;
  docCartaResponsiva: boolean;
  docCertificadoMedico: boolean;
  docIneTutor: boolean;
  tutorNombreCompleto: string;
  tutorParentesco: string;
  tutorTelefono: string;
  tutorEmail: string;
  tutorDireccion: string;
};

const initialEditForm: EditForm = {
  institucionId: "",
  curp: "",
  matricula: "",
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  fechaNacimiento: "",
  genero: "",
  estatus: "ACTIVO",
  alergias: "",
  tipoSangre: "",
  padecimientos: "",
  medicamentos: "",
  contactoEmergenciaNombre: "",
  contactoEmergenciaTelefono: "",
  docCurp: false,
  docComprobanteEstudios: false,
  docCartaResponsiva: false,
  docCertificadoMedico: false,
  docIneTutor: false,
  tutorNombreCompleto: "",
  tutorParentesco: "",
  tutorTelefono: "",
  tutorEmail: "",
  tutorDireccion: "",
};

function toDateInput(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function ListaParticipantesPage() {
  const [items, setItems] = useState<Participante[]>([]);
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Participante | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(initialEditForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [resParticipantes, resInstituciones] = await Promise.all([
        fetch("/api/participantes"),
        fetch("/api/instituciones"),
      ]);

      if (!resParticipantes.ok || !resInstituciones.ok) {
        throw new Error("Error al cargar datos");
      }

      const [dataParticipantes, dataInstituciones] = await Promise.all([
        resParticipantes.json(),
        resInstituciones.json(),
      ]);

      setItems(dataParticipantes);
      setInstituciones(dataInstituciones);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron cargar participantes");
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
        item.matricula.toLowerCase().includes(value) ||
        item.curp.toLowerCase().includes(value) ||
        item.institucion.nombre.toLowerCase().includes(value)
      );
    });
  }, [items, searchTerm]);

  const openEditModal = (item: Participante) => {
    setEditingItem(item);
    setEditForm({
      institucionId: String(item.institucionId),
      curp: item.curp,
      matricula: item.matricula,
      nombres: item.nombres,
      apellidoPaterno: item.apellidoPaterno,
      apellidoMaterno: item.apellidoMaterno,
      fechaNacimiento: toDateInput(item.fechaNacimiento),
      genero: item.genero,
      estatus: item.estatus,
      alergias: item.alergias ?? "",
      tipoSangre: item.tipoSangre ?? "",
      padecimientos: item.padecimientos ?? "",
      medicamentos: item.medicamentos ?? "",
      contactoEmergenciaNombre: item.contactoEmergenciaNombre ?? "",
      contactoEmergenciaTelefono: item.contactoEmergenciaTelefono ?? "",
      docCurp: item.docCurp,
      docComprobanteEstudios: item.docComprobanteEstudios,
      docCartaResponsiva: item.docCartaResponsiva,
      docCertificadoMedico: item.docCertificadoMedico,
      docIneTutor: item.docIneTutor,
      tutorNombreCompleto: item.tutor?.nombreCompleto ?? "",
      tutorParentesco: item.tutor?.parentesco ?? "",
      tutorTelefono: item.tutor?.telefono ?? "",
      tutorEmail: item.tutor?.email ?? "",
      tutorDireccion: item.tutor?.direccion ?? "",
    });
  };

  const closeEditModal = () => {
    if (saving) return;
    setEditingItem(null);
    setEditForm(initialEditForm);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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
      !editForm.matricula.trim() ||
      !editForm.nombres.trim() ||
      !editForm.apellidoPaterno.trim() ||
      !editForm.apellidoMaterno.trim() ||
      !editForm.fechaNacimiento ||
      !editForm.genero
    ) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    const hasTutorData =
      !!editForm.tutorNombreCompleto.trim() ||
      !!editForm.tutorParentesco.trim() ||
      !!editForm.tutorTelefono.trim() ||
      !!editForm.tutorEmail.trim() ||
      !!editForm.tutorDireccion.trim();

    if (hasTutorData) {
      if (!editForm.tutorNombreCompleto.trim() || !editForm.tutorParentesco.trim() || !editForm.tutorTelefono.trim()) {
        toast.error("Tutor incompleto: nombre, parentesco y teléfono son obligatorios");
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        institucionId: Number(editForm.institucionId),
        curp: editForm.curp,
        matricula: editForm.matricula,
        nombres: editForm.nombres,
        apellidoPaterno: editForm.apellidoPaterno,
        apellidoMaterno: editForm.apellidoMaterno,
        fechaNacimiento: editForm.fechaNacimiento,
        genero: editForm.genero,
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
        docIneTutor: editForm.docIneTutor,
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
        throw new Error(body?.error || "No se pudo actualizar");
      }

      toast.success("Participante actualizado");
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
          <h1 className="text-2xl font-bold text-gray-800">Participantes</h1>
          <p className="text-sm text-gray-500">Listado y edición de alumnos registrados</p>
        </div>
        <Link
          href="/dashboard/participantes"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#08677a] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          <UserPlus size={16} />
          Registrar participante
        </Link>
      </div>

      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, matrícula, CURP o institución"
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#08677a]"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-gray-500">
            <Loader2 className="animate-spin" size={18} />
            Cargando participantes...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No se encontraron registros.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Matrícula</th>
                  <th className="px-4 py-3">CURP</th>
                  <th className="px-4 py-3">Institución</th>
                  <th className="px-4 py-3">Género</th>
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
                    <td className="px-4 py-3 text-gray-600">{item.matricula}</td>
                    <td className="px-4 py-3 text-gray-600">{item.curp}</td>
                    <td className="px-4 py-3 text-gray-600">{item.institucion.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{item.genero}</td>
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
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Editar participante</h2>
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
              <Field label="Matrícula *" name="matricula" value={editForm.matricula} onChange={handleEditInputChange} />
              <Field label="CURP *" name="curp" value={editForm.curp} onChange={handleEditInputChange} />
              <Field label="Fecha nacimiento *" name="fechaNacimiento" type="date" value={editForm.fechaNacimiento} onChange={handleEditInputChange} />

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Género *</label>
                <select
                  name="genero"
                  value={editForm.genero}
                  onChange={handleEditInputChange}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  <option value="">Selecciona</option>
                  <option value="MASCULINO">MASCULINO</option>
                  <option value="FEMENINO">FEMENINO</option>
                  <option value="OTRO">OTRO</option>
                </select>
              </div>

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

              <Field label="Contacto emergencia" name="contactoEmergenciaNombre" value={editForm.contactoEmergenciaNombre} onChange={handleEditInputChange} />
              <Field label="Tel. emergencia" name="contactoEmergenciaTelefono" value={editForm.contactoEmergenciaTelefono} onChange={handleEditInputChange} />
              <Field label="Tipo de sangre" name="tipoSangre" value={editForm.tipoSangre} onChange={handleEditInputChange} />
              <Field label="Alergias" name="alergias" value={editForm.alergias} onChange={handleEditInputChange} />
              <TextAreaField label="Padecimientos" name="padecimientos" value={editForm.padecimientos} onChange={handleEditInputChange} />
              <TextAreaField label="Medicamentos" name="medicamentos" value={editForm.medicamentos} onChange={handleEditInputChange} />

              <div className="md:col-span-2 mt-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Tutor legal (opcional)</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Nombre completo" name="tutorNombreCompleto" value={editForm.tutorNombreCompleto} onChange={handleEditInputChange} />
                  <Field label="Parentesco" name="tutorParentesco" value={editForm.tutorParentesco} onChange={handleEditInputChange} />
                  <Field label="Teléfono" name="tutorTelefono" value={editForm.tutorTelefono} onChange={handleEditInputChange} />
                  <Field label="Email" name="tutorEmail" value={editForm.tutorEmail} onChange={handleEditInputChange} />
                  <div className="md:col-span-2">
                    <TextAreaField
                      label="Dirección"
                      name="tutorDireccion"
                      value={editForm.tutorDireccion}
                      onChange={handleEditInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <CheckField label="CURP" name="docCurp" checked={editForm.docCurp} onChange={handleEditCheckboxChange} />
                <CheckField
                  label="Comprobante estudios"
                  name="docComprobanteEstudios"
                  checked={editForm.docComprobanteEstudios}
                  onChange={handleEditCheckboxChange}
                />
                <CheckField
                  label="Carta responsiva"
                  name="docCartaResponsiva"
                  checked={editForm.docCartaResponsiva}
                  onChange={handleEditCheckboxChange}
                />
                <CheckField
                  label="Certificado médico"
                  name="docCertificadoMedico"
                  checked={editForm.docCertificadoMedico}
                  onChange={handleEditCheckboxChange}
                />
                <CheckField label="INE tutor" name="docIneTutor" checked={editForm.docIneTutor} onChange={handleEditCheckboxChange} />
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
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
      />
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-600">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
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
