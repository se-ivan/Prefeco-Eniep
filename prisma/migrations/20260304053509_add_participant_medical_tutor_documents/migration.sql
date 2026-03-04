-- CreateEnum
CREATE TYPE "public"."Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

-- CreateEnum
CREATE TYPE "public"."Estatus" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "public"."TipoDisciplina" AS ENUM ('DEPORTIVA', 'CULTURAL');

-- CreateEnum
CREATE TYPE "public"."Categoria" AS ENUM ('FEMENIL', 'VARONIL', 'UNICA');

-- CreateEnum
CREATE TYPE "public"."Modalidad" AS ENUM ('INDIVIDUAL', 'EQUIPO');

-- CreateTable
CREATE TABLE "public"."Participante" (
    "id" SERIAL NOT NULL,
    "institucionId" INTEGER NOT NULL,
    "tutorId" INTEGER,
    "curp" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidoPaterno" TEXT NOT NULL,
    "apellidoMaterno" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "genero" "public"."Genero" NOT NULL,
    "fotoUrl" TEXT,
    "estatus" "public"."Estatus" NOT NULL,
    "alergias" TEXT,
    "tipo_sangre" TEXT,
    "padecimientos" TEXT,
    "medicamentos" TEXT,
    "contacto_emergencia_nombre" TEXT,
    "contacto_emergencia_telefono" TEXT,
    "doc_curp" BOOLEAN NOT NULL DEFAULT false,
    "doc_comprobante_estudios" BOOLEAN NOT NULL DEFAULT false,
    "doc_carta_responsiva" BOOLEAN NOT NULL DEFAULT false,
    "doc_certificado_medico" BOOLEAN NOT NULL DEFAULT false,
    "doc_ine_tutor" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Participante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tutores" (
    "id" SERIAL NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "parentesco" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "direccion" TEXT,

    CONSTRAINT "tutores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."disciplinas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "public"."TipoDisciplina" NOT NULL,
    "categoria" "public"."Categoria" NOT NULL,
    "modalidad" "public"."Modalidad" NOT NULL,
    "min_integrantes" INTEGER NOT NULL,
    "max_integrantes" INTEGER NOT NULL,

    CONSTRAINT "disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."equipos" (
    "id" SERIAL NOT NULL,
    "id_disciplina" INTEGER NOT NULL,
    "id_institucion" INTEGER NOT NULL,
    "nombre_equipo" TEXT NOT NULL,
    "folio_registro" TEXT NOT NULL,

    CONSTRAINT "equipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inscripciones" (
    "id" SERIAL NOT NULL,
    "id_participante" INTEGER NOT NULL,
    "id_disciplina" INTEGER NOT NULL,
    "id_equipo" INTEGER NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL,
    "es_titular" BOOLEAN NOT NULL,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Participante" ADD CONSTRAINT "Participante_institucionId_fkey" FOREIGN KEY ("institucionId") REFERENCES "public"."instituciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Participante" ADD CONSTRAINT "Participante_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "public"."tutores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."equipos" ADD CONSTRAINT "equipos_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "public"."disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."equipos" ADD CONSTRAINT "equipos_id_institucion_fkey" FOREIGN KEY ("id_institucion") REFERENCES "public"."instituciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inscripciones" ADD CONSTRAINT "inscripciones_id_participante_fkey" FOREIGN KEY ("id_participante") REFERENCES "public"."Participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inscripciones" ADD CONSTRAINT "inscripciones_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "public"."equipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inscripciones" ADD CONSTRAINT "inscripciones_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "public"."disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
