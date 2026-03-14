ALTER TABLE "user"
ADD COLUMN "displayUsername" TEXT;

UPDATE "user"
SET "displayUsername" = COALESCE(username, SPLIT_PART(email, '@', 1))
WHERE "displayUsername" IS NULL;
