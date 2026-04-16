export const TAEKWONDO_DISCIPLINA_BASE_ID = 20;

export const TAEKWONDO_CINTAS = [
  { value: "CINTA_BLANCA", label: "Cinta Blanca" },
  { value: "CINTA_AMARILLA", label: "Cinta Amarilla" },
  { value: "CINTA_NARANJA", label: "Cinta Naranja" },
  { value: "CINTA_VERDE", label: "Cinta Verde" },
  { value: "CINTA_AZUL", label: "Cinta Azul" },
  { value: "CINTA_ROJA", label: "Cinta Roja" },
  { value: "CINTA_NEGRA", label: "Cinta Negra" },
  { value: "CINTA_ROJINEGRA", label: "Cinta Rojinegra" },
] as const;

export type TaekwondoCinta = (typeof TAEKWONDO_CINTAS)[number]["value"];

export const TAEKWONDO_CINTA_VALUES = TAEKWONDO_CINTAS.map((c) => c.value);

const LEGACY_TO_ENUM: Record<string, TaekwondoCinta> = {
  BLANCA: "CINTA_BLANCA",
  AMARILLA: "CINTA_AMARILLA",
  NARANJA: "CINTA_NARANJA",
  VERDE: "CINTA_VERDE",
  AZUL: "CINTA_AZUL",
  ROJA: "CINTA_ROJA",
  NEGRA: "CINTA_NEGRA",
  ROJINEGRA: "CINTA_ROJINEGRA",
};

const DISPLAY_TO_ENUM: Record<string, TaekwondoCinta> = {
  "CINTA BLANCA": "CINTA_BLANCA",
  "CINTA AMARILLA": "CINTA_AMARILLA",
  "CINTA NARANJA": "CINTA_NARANJA",
  "CINTA VERDE": "CINTA_VERDE",
  "CINTA AZUL": "CINTA_AZUL",
  "CINTA ROJA": "CINTA_ROJA",
  "CINTA NEGRA": "CINTA_NEGRA",
  "CINTA ROJINEGRA": "CINTA_ROJINEGRA",
};

const LABEL_BY_VALUE: Record<TaekwondoCinta, string> = {
  CINTA_BLANCA: "Cinta Blanca",
  CINTA_AMARILLA: "Cinta Amarilla",
  CINTA_NARANJA: "Cinta Naranja",
  CINTA_VERDE: "Cinta Verde",
  CINTA_AZUL: "Cinta Azul",
  CINTA_ROJA: "Cinta Roja",
  CINTA_NEGRA: "Cinta Negra",
  CINTA_ROJINEGRA: "Cinta Rojinegra",
};

export function normalizeTaekwondoCinta(input: unknown): TaekwondoCinta | null {
  if (typeof input !== "string") return null;

  const raw = input.trim();
  if (!raw) return null;

  const upperUnderscore = raw.toUpperCase().replace(/\s+/g, "_");
  if ((TAEKWONDO_CINTA_VALUES as readonly string[]).includes(upperUnderscore)) {
    return upperUnderscore as TaekwondoCinta;
  }

  const upperSpace = raw.toUpperCase().replace(/\s+/g, " ");
  if (DISPLAY_TO_ENUM[upperSpace]) return DISPLAY_TO_ENUM[upperSpace];
  if (LEGACY_TO_ENUM[upperSpace]) return LEGACY_TO_ENUM[upperSpace];

  return null;
}

export function formatTaekwondoCintaLabel(input: unknown): string {
  const normalized = normalizeTaekwondoCinta(input);
  if (normalized) return LABEL_BY_VALUE[normalized];
  if (typeof input === "string" && input.trim()) return input.trim();
  return "Sin asignar";
}

export function isTaekwondoDisciplina(input: {
  disciplinaBaseId?: number | null;
  disciplinaBaseNombre?: string | null;
}): boolean {
  if (input.disciplinaBaseId === TAEKWONDO_DISCIPLINA_BASE_ID) return true;
  return String(input.disciplinaBaseNombre ?? "").trim().toUpperCase() === "TAEKWONDO";
}
