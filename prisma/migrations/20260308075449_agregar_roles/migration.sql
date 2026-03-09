-- CreateEnum
CREATE TYPE "public"."TipoUsuario" AS ENUM ('admin', 'institucion', 'user');

-- AlterTable
ALTER TABLE "public"."session" ADD COLUMN     "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "banExpires" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN DEFAULT false,
ADD COLUMN     "role" "public"."TipoUsuario" DEFAULT 'user';

-- CreateIndex
CREATE INDEX "account_user_id_idx" ON "public"."account"("user_id");

-- CreateIndex
CREATE INDEX "session_user_id_idx" ON "public"."session"("user_id");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "public"."verification"("identifier");
