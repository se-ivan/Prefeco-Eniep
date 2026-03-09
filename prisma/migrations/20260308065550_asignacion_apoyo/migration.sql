-- CreateEnum
CREATE TYPE "public"."Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

-- CreateEnum
CREATE TYPE "public"."Estatus" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "public"."TipoDisciplina" AS ENUM ('DEPORTIVA', 'CULTURAL', 'CIVICA');

-- CreateEnum
CREATE TYPE "public"."Modalidad" AS ENUM ('INDIVIDUAL', 'EQUIPO');

-- CreateEnum
CREATE TYPE "public"."Rama" AS ENUM ('VARONIL', 'FEMENIL', 'UNICA', 'MIXTO');

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
    "rama" "public"."Rama" NOT NULL,
    "modalidad" "public"."Modalidad" NOT NULL,
    "min_integrantes" INTEGER,
    "max_integrantes" INTEGER,
    "max_participantes_por_escuela" INTEGER,

    CONSTRAINT "disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categorias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "disciplinaId" INTEGER NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."equipos" (
    "id" SERIAL NOT NULL,
    "id_disciplina" INTEGER NOT NULL,
    "id_institucion" INTEGER NOT NULL,
    "nombre_equipo" TEXT NOT NULL,
    "folio_registro" TEXT,

    CONSTRAINT "equipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."inscripciones" (
    "id" SERIAL NOT NULL,
    "id_participante" INTEGER NOT NULL,
    "id_disciplina" INTEGER NOT NULL,
    "id_equipo" INTEGER,
    "id_categoria" INTEGER NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."personal_apoyo" (
    "id" SERIAL NOT NULL,
    "institucionId" INTEGER NOT NULL,
    "curp" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidoPaterno" TEXT NOT NULL,
    "apellidoMaterno" TEXT NOT NULL,
    "puesto" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "contacto_emergencia_nombre" TEXT,
    "contacto_emergencia_telefono" TEXT,
    "doc_curp" BOOLEAN NOT NULL DEFAULT false,
    "doc_identificacion_oficial" BOOLEAN NOT NULL DEFAULT false,
    "doc_comprobante_domicilio" BOOLEAN NOT NULL DEFAULT false,
    "doc_carta_antecedentes" BOOLEAN NOT NULL DEFAULT false,
    "estatus" "public"."Estatus" NOT NULL,

    CONSTRAINT "personal_apoyo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asignacion_apoyo" (
    "id" SERIAL NOT NULL,
    "id_personal" INTEGER NOT NULL,
    "id_disciplina" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "rol" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asignacion_apoyo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "equipos_id_disciplina_nombre_equipo_key" ON "public"."equipos"("id_disciplina", "nombre_equipo");

-- AddForeignKey
ALTER TABLE "public"."Participante" ADD CONSTRAINT "Participante_institucionId_fkey" FOREIGN KEY ("institucionId") REFERENCES "public"."instituciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Participante" ADD CONSTRAINT "Participante_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "public"."tutores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categorias" ADD CONSTRAINT "categorias_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "public"."disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."equipos" ADD CONSTRAINT "equipos_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "public"."disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."equipos" ADD CONSTRAINT "equipos_id_institucion_fkey" FOREIGN KEY ("id_institucion") REFERENCES "public"."instituciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inscripciones" ADD CONSTRAINT "inscripciones_id_participante_fkey" FOREIGN KEY ("id_participante") REFERENCES "public"."Participante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inscripciones" ADD CONSTRAINT "inscripciones_id_equipo_fkey" FOREIGN KEY ("id_equipo") REFERENCES "public"."equipos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inscripciones" ADD CONSTRAINT "inscripciones_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "public"."disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inscripciones" ADD CONSTRAINT "inscripciones_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "public"."categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."personal_apoyo" ADD CONSTRAINT "personal_apoyo_institucionId_fkey" FOREIGN KEY ("institucionId") REFERENCES "public"."instituciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asignacion_apoyo" ADD CONSTRAINT "asignacion_apoyo_id_personal_fkey" FOREIGN KEY ("id_personal") REFERENCES "public"."personal_apoyo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asignacion_apoyo" ADD CONSTRAINT "asignacion_apoyo_id_disciplina_fkey" FOREIGN KEY ("id_disciplina") REFERENCES "public"."disciplinas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."asignacion_apoyo" ADD CONSTRAINT "asignacion_apoyo_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "public"."categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
