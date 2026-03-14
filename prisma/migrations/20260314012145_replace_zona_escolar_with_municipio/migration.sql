/*
  Warnings:

  - You are about to drop the column `zona_escolar` on the `instituciones` table. All the data in the column will be lost.
  - Added the required column `municipio` to the `instituciones` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."instituciones" DROP COLUMN "zona_escolar",
ADD COLUMN     "municipio" TEXT NOT NULL;
