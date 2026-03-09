-- Add RBAC columns to Better Auth user table
ALTER TABLE "user"
ADD COLUMN "role" TEXT NOT NULL DEFAULT 'ADMIN',
ADD COLUMN "institucion_id" INTEGER;

-- Link responsible users to an institution
ALTER TABLE "user"
ADD CONSTRAINT "user_institucion_id_fkey"
FOREIGN KEY ("institucion_id") REFERENCES "instituciones"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "user_institucion_id_idx" ON "user"("institucion_id");

-- Backfill existing users as ADMIN explicitly
UPDATE "user"
SET "role" = 'ADMIN'
WHERE "role" IS NULL OR "role" = '';
