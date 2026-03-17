export type TipoDisciplina =
  | "ACADEMICA"
  | "CIVICA"
  | "CULTURAL"
  | "DEPORTIVA"
  | "EXHIBICION"
  | "EMBAJADORA_NACIONAL";

const DISCIPLINAS_BASE_POR_TIPO: Record<TipoDisciplina, readonly string[]> = {
  ACADEMICA: ["BIOLOGIA", "FISICA", "QUIMICA", "ESPAÑOL", "MATEMATICAS", "FILOSOFIA", "INGLES"],
  CIVICA: ["BANDA DE GUERRA", "ESCOLTA DE BANDERA"],
  CULTURAL: ["AJEDREZ", "ARTES PLASTICAS", "CANTO", "CANZA FOLCLORICA", "DECLAMACION", "ORATORIA", "RONDALLA", "DANZA MODERNA"],
  DEPORTIVA: ["BASQUETBOL", "PORRISTAS", "TAEKWONDO", "ATLETISMO", "VOLEIBOL", "FUTBOL"],
  EXHIBICION: ["CARRERA DE BOTARGAS"],
  EMBAJADORA_NACIONAL: ["EMBAJADORA NACIONAL"],
};

export function getDisciplinasBaseByTipo(tipo: TipoDisciplina | ""): readonly string[] {
  if (!tipo) return [];
  return DISCIPLINAS_BASE_POR_TIPO[tipo];
}

export function isValidDisciplinaBase(disciplinaBase: unknown, tipo: TipoDisciplina | ""): boolean {
  if (typeof disciplinaBase !== "string" || !tipo) return false;
  return getDisciplinasBaseByTipo(tipo).includes(disciplinaBase.trim());
}
