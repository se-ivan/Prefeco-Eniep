-- AlterTable
ALTER TABLE "public"."categorias" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."disciplinas" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "categorias_deleted_at_idx" ON "public"."categorias"("deleted_at");

-- CreateIndex
CREATE INDEX "disciplinas_deleted_at_idx" ON "public"."disciplinas"("deleted_at");
