/*
  Warnings:

  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'RESPONSABLE_INSTITUCION');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."TipoDisciplina" ADD VALUE 'ACADEMICA';
ALTER TYPE "public"."TipoDisciplina" ADD VALUE 'EXHIBICION';

-- DropIndex
DROP INDEX "public"."user_institucion_id_idx";

-- AlterTable
ALTER TABLE "public"."Participante" ADD COLUMN     "doc_acta_nacimiento_url" TEXT,
ADD COLUMN     "doc_carta_responsiva_tutor_url" TEXT,
ADD COLUMN     "doc_credencial_url" TEXT,
ADD COLUMN     "doc_historial_medico_url" TEXT;

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "role",
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'ADMIN';
