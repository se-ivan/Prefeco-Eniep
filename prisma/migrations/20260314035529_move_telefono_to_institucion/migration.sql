/*
  Warnings:

  - You are about to drop the column `telefono` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."instituciones" ADD COLUMN     "telefono" TEXT;

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "telefono";
