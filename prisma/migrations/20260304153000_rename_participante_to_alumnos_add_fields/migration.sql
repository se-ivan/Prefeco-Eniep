-- Rename table Participante -> alumnos
ALTER TABLE "public"."Participante" RENAME TO "alumnos";

-- Add new alumno fields
ALTER TABLE "public"."alumnos"
ADD COLUMN "clave" TEXT,
ADD COLUMN "estado" TEXT,
ADD COLUMN "semestre" INTEGER;

-- Rename FK column in inscripciones and rewire foreign key
ALTER TABLE "public"."inscripciones"
DROP CONSTRAINT "inscripciones_id_participante_fkey";

ALTER TABLE "public"."inscripciones"
RENAME COLUMN "id_participante" TO "id_alumno";

ALTER TABLE "public"."inscripciones"
ADD CONSTRAINT "inscripciones_id_alumno_fkey"
FOREIGN KEY ("id_alumno") REFERENCES "public"."alumnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
