-- AlterEnum
ALTER TYPE "public"."TipoDisciplina" ADD VALUE 'EMBAJADORA NACIONAL';

-- AlterTable
ALTER TABLE "public"."disciplinas" ADD COLUMN     "disciplinaBase" TEXT;

-- CreateTable
CREATE TABLE "public"."Bitacora" (
    "id" SERIAL NOT NULL,
    "accion" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "institucionId" INTEGER,
    "usuarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bitacora_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Bitacora" ADD CONSTRAINT "Bitacora_institucionId_fkey" FOREIGN KEY ("institucionId") REFERENCES "public"."instituciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bitacora" ADD CONSTRAINT "Bitacora_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
