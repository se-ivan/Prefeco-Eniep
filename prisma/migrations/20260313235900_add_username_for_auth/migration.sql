ALTER TABLE "user"
ADD COLUMN "username" TEXT;

WITH base_username AS (
	SELECT
		id,
		LOWER(
			REGEXP_REPLACE(
				COALESCE(NULLIF(SPLIT_PART(email, '@', 1), ''), 'user'),
				'[^a-z0-9_]+',
				'_',
				'g'
			)
		) AS raw_username
	FROM "user"
), normalized_username AS (
	SELECT
		id,
		COALESCE(NULLIF(TRIM(BOTH '_' FROM REGEXP_REPLACE(raw_username, '_+', '_', 'g')), ''), 'user') AS base_username
	FROM base_username
), ranked_username AS (
	SELECT
		id,
		base_username,
		ROW_NUMBER() OVER (PARTITION BY base_username ORDER BY id) AS occurrence
	FROM normalized_username
)
UPDATE "user" u
SET username = CASE
	WHEN r.occurrence = 1 THEN r.base_username
	ELSE r.base_username || '_' || r.occurrence::TEXT
END
FROM ranked_username r
WHERE u.id = r.id;

CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
