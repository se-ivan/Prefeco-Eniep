"use client";

import { useEffect, useState } from "react";

type Tipo = "DEPORTIVA" | "CULTURAL" | "CIVICA" | "ACADEMICA" | "EXHIBICION" | "EMBAJADORA_NACIONAL";
type Modalidad = "EQUIPO" | "INDIVIDUAL";
type Rama = "VARONIL" | "FEMENIL" | "UNICA" | "MIXTO";

type Categoria = {
	id: number;
	nombre: string;
	deletedAt?: Date | null;
};

type DisciplinaEditable = {
	id: number;
	nombre: string;
	tipo?: string | null;
	rama?: string | null;
	modalidad: "EQUIPO" | "INDIVIDUAL";
	minIntegrantes?: number | null;
	maxIntegrantes?: number | null;
	maxParticipantesPorEscuela?: number | null;
	categorias?: Categoria[];
	deletedAt?: Date | null;
};

type Props = {
	open: boolean;
	disciplina: DisciplinaEditable | null;
	onClose: () => void;
	onSaved?: () => Promise<void> | void;
};

export default function DisciplinaModalEditar({ open, disciplina, onClose, onSaved }: Props) {
	const [nombre, setNombre] = useState("");
	const [tipo, setTipo] = useState<Tipo>("DEPORTIVA");
	const [rama, setRama] = useState<Rama>("UNICA");
	const [modalidad, setModalidad] = useState<Modalidad>("EQUIPO");
	const [minIntegrantes, setMinIntegrantes] = useState<number>(1);
	const [maxIntegrantes, setMaxIntegrantes] = useState<number>(5);
	const [maxParticipantesPorEscuela, setMaxParticipantesPorEscuela] = useState<number>(1);

	const [categoriaInput, setCategoriaInput] = useState("");
	const [categorias, setCategorias] = useState<string[]>([]);

	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!open || !disciplina) return;
		setNombre(disciplina.nombre ?? "");
		setTipo((disciplina.tipo as Tipo) ?? "DEPORTIVA");
		setRama((disciplina.rama as Rama) ?? "UNICA");
		setModalidad(disciplina.modalidad ?? "EQUIPO");
		setMinIntegrantes(disciplina.minIntegrantes ?? 1);
		setMaxIntegrantes(disciplina.maxIntegrantes ?? 5);
		setMaxParticipantesPorEscuela(disciplina.maxParticipantesPorEscuela ?? 1);
		setCategorias((disciplina.categorias ?? []).map((c) => c.nombre));
		setCategoriaInput("");
		setError(null);
	}, [open, disciplina]);

	if (!open || !disciplina) return null;
	const disciplinaId = disciplina.id;

	function agregarCategoria() {
		const v = categoriaInput.trim();
		if (!v) return;
		const exists = categorias.some((c) => c.toLowerCase() === v.toLowerCase());
		if (exists) {
			setError("La categoría ya existe en la lista");
			return;
		}
		setCategorias((prev) => [...prev, v]);
		setCategoriaInput("");
		setError(null);
	}

	function quitarCategoria(index: number) {
		setCategorias((prev) => prev.filter((_, i) => i !== index));
	}

	function validaCliente() {
		if (!nombre.trim()) return "El nombre es obligatorio";
		if (!categorias.length) return "Debes mantener al menos una categoría";

		if (modalidad === "EQUIPO") {
			if (!Number.isInteger(minIntegrantes) || !Number.isInteger(maxIntegrantes)) {
				return "Min y max integrantes deben ser enteros";
			}
			if (minIntegrantes <= 0 || maxIntegrantes <= 0) {
				return "Min y max integrantes deben ser mayores que 0";
			}
			if (minIntegrantes > maxIntegrantes) {
				return "Min integrantes no puede ser mayor que max integrantes";
			}
			return null;
		}

		if (!Number.isInteger(maxParticipantesPorEscuela) || maxParticipantesPorEscuela <= 0) {
			return "Max participantes por escuela debe ser entero mayor a 0";
		}

		return null;
	}

	async function handleSave(e?: React.FormEvent) {
		e?.preventDefault();
		setError(null);

		const validationError = validaCliente();
		if (validationError) {
			setError(validationError);
			return;
		}

		setSaving(true);
		try {
			const payload: any = {
				nombre: nombre.trim(),
				tipo,
				rama,
				modalidad,
				categorias,
				minIntegrantes: modalidad === "EQUIPO" ? minIntegrantes : null,
				maxIntegrantes: modalidad === "EQUIPO" ? maxIntegrantes : null,
				maxParticipantesPorEscuela: modalidad === "INDIVIDUAL" ? maxParticipantesPorEscuela : null,
			};

			const res = await fetch(`/api/disciplinas/${disciplinaId}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const json = await res.json().catch(() => null);
			if (!res.ok) {
				throw new Error(json?.error || `HTTP ${res.status}`);
			}

			if (onSaved) await onSaved();
			onClose();
		} catch (err: any) {
			setError(err?.message || "Error al guardar la disciplina");
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete() {
		const ok = confirm("¿Borrar disciplina? Se hará borrado lógico y ya no será visible en el sistema.");
		if (!ok) return;

		setDeleting(true);
		setError(null);
		try {
			const res = await fetch(`/api/disciplinas/${disciplinaId}`, {
				method: "DELETE",
			});
			const json = await res.json().catch(() => null);
			if (!res.ok) {
				throw new Error(json?.error || `HTTP ${res.status}`);
			}

			if (onSaved) await onSaved();
			onClose();
		} catch (err: any) {
			setError(err?.message || "Error al borrar la disciplina");
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />

			<form
				onSubmit={handleSave}
				className="relative z-10 bg-white w-full max-w-2xl rounded-lg shadow p-6"
			>
				<header className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-semibold">Editar disciplina</h3>
					<button type="button" onClick={onClose} className="text-sm text-slate-600">Cerrar</button>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					<div className="md:col-span-2">
						<label className="block text-sm mb-1">Nombre</label>
						<input
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							className="w-full border rounded p-2"
							required
						/>
					</div>

					<div>
						<label className="block text-sm mb-1">Tipo</label>
						<select
							value={tipo}
							onChange={(e) => setTipo(e.target.value as Tipo)}
							className="w-full border rounded p-2"
						>
							<option value="DEPORTIVA">Deportiva</option>
							<option value="CULTURAL">Cultural</option>
							<option value="CIVICA">Cívica</option>
							<option value="ACADEMICA">Académica</option>
							<option value="EXHIBICION">Exhibición</option>
							<option value="EMBAJADORA_NACIONAL">Embajadora Nacional</option>
						</select>
					</div>

					<div>
						<label className="block text-sm mb-1">Rama</label>
						<select value={rama} onChange={(e) => setRama(e.target.value as Rama)} className="w-full border rounded p-2">
							<option value="VARONIL">Varonil</option>
							<option value="FEMENIL">Femenil</option>
							<option value="UNICA">Única</option>
							<option value="MIXTO">Mixto</option>
						</select>
					</div>

					<div>
						<label className="block text-sm mb-1">Modalidad</label>
						<select value={modalidad} onChange={(e) => setModalidad(e.target.value as Modalidad)} className="w-full border rounded p-2">
							<option value="EQUIPO">Equipo</option>
							<option value="INDIVIDUAL">Individual</option>
						</select>
					</div>

					{modalidad === "EQUIPO" && (
						<>
							<div>
								<label className="block text-sm mb-1">Min integrantes</label>
								<input
									type="number"
									min={1}
									value={minIntegrantes}
									onChange={(e) => setMinIntegrantes(Number(e.target.value))}
									className="w-full border rounded p-2"
								/>
							</div>
							<div>
								<label className="block text-sm mb-1">Max integrantes</label>
								<input
									type="number"
									min={1}
									value={maxIntegrantes}
									onChange={(e) => setMaxIntegrantes(Number(e.target.value))}
									className="w-full border rounded p-2"
								/>
							</div>
						</>
					)}

					{modalidad === "INDIVIDUAL" && (
						<div className="md:col-span-2">
							<label className="block text-sm mb-1">Max participantes por escuela</label>
							<input
								type="number"
								min={1}
								value={maxParticipantesPorEscuela}
								onChange={(e) => setMaxParticipantesPorEscuela(Number(e.target.value))}
								className="w-full border rounded p-2"
							/>
						</div>
					)}

					<div className="md:col-span-2">
						<label className="block text-sm mb-1">Categorías</label>
						<div className="flex gap-2 mb-2">
							<input
								className="flex-1 border rounded p-2"
								value={categoriaInput}
								onChange={(e) => setCategoriaInput(e.target.value)}
								placeholder="Nombre de categoría"
							/>
							<button
								type="button"
								onClick={agregarCategoria}
								className="px-3 py-2 bg-amber-500 text-white rounded"
							>
								+ Agregar
							</button>
						</div>

						<div className="flex flex-wrap gap-2">
							{categorias.map((cat, idx) => (
								<div key={`${cat}-${idx}`} className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded">
									<span className="text-sm">{cat}</span>
									<button
										type="button"
										onClick={() => quitarCategoria(idx)}
										className="text-xs text-red-600"
									>
										x
									</button>
								</div>
							))}
						</div>
					</div>
				</div>

				{error && <div className="text-sm text-red-600 mt-3">{error}</div>}

				<div className="mt-5 flex items-center justify-between gap-2">
					<button
						type="button"
						onClick={handleDelete}
						disabled={deleting || saving}
						className="px-3 py-2 border border-red-200 text-red-700 rounded hover:bg-red-50 disabled:opacity-50"
					>
						{deleting ? "Borrando..." : "Borrar"}
					</button>

					<div className="flex gap-2">
						<button type="button" onClick={onClose} className="px-3 py-2 border rounded">Cancelar</button>
						<button
							type="submit"
							disabled={saving || deleting}
							className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
						>
							{saving ? "Guardando..." : "Guardar"}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
