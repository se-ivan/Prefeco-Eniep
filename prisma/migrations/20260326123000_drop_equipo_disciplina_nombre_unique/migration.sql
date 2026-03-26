-- Allow same team name in the same discipline when used in different categories.
-- This drops the previous global unique constraint on (id_disciplina, nombre_equipo).
ALTER TABLE "equipos"
DROP CONSTRAINT IF EXISTS "equipos_id_disciplina_nombre_equipo_key";

DROP INDEX IF EXISTS "equipos_id_disciplina_nombre_equipo_key";
