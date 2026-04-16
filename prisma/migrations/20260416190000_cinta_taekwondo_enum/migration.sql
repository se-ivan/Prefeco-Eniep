-- Convert inscripciones.cinta_taekwondo from text to enum without deleting data.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'CintaTaekwondo'
  ) THEN
    CREATE TYPE "CintaTaekwondo" AS ENUM (
      'CINTA_BLANCA',
      'CINTA_AMARILLA',
      'CINTA_NARANJA',
      'CINTA_VERDE',
      'CINTA_AZUL',
      'CINTA_ROJA',
      'CINTA_NEGRA',
      'CINTA_ROJINEGRA'
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'inscripciones'
      AND column_name = 'cinta_taekwondo'
      AND udt_name <> 'CintaTaekwondo'
  ) THEN
    ALTER TABLE "inscripciones"
    ALTER COLUMN "cinta_taekwondo"
    TYPE "CintaTaekwondo"
    USING (
      CASE
        WHEN "cinta_taekwondo" IS NULL THEN NULL
        WHEN UPPER(TRIM("cinta_taekwondo")) IN ('BLANCA', 'CINTA BLANCA', 'CINTA_BLANCA') THEN 'CINTA_BLANCA'
        WHEN UPPER(TRIM("cinta_taekwondo")) IN ('AMARILLA', 'CINTA AMARILLA', 'CINTA_AMARILLA') THEN 'CINTA_AMARILLA'
        WHEN UPPER(TRIM("cinta_taekwondo")) IN ('NARANJA', 'CINTA NARANJA', 'CINTA_NARANJA') THEN 'CINTA_NARANJA'
        WHEN UPPER(TRIM("cinta_taekwondo")) IN ('VERDE', 'CINTA VERDE', 'CINTA_VERDE') THEN 'CINTA_VERDE'
        WHEN UPPER(TRIM("cinta_taekwondo")) IN ('AZUL', 'CINTA AZUL', 'CINTA_AZUL') THEN 'CINTA_AZUL'
        WHEN UPPER(TRIM("cinta_taekwondo")) IN ('ROJA', 'CINTA ROJA', 'CINTA_ROJA') THEN 'CINTA_ROJA'
        WHEN UPPER(TRIM("cinta_taekwondo")) IN ('NEGRA', 'CINTA NEGRA', 'CINTA_NEGRA') THEN 'CINTA_NEGRA'
        WHEN UPPER(TRIM("cinta_taekwondo")) IN ('ROJINEGRA', 'CINTA ROJINEGRA', 'CINTA_ROJINEGRA') THEN 'CINTA_ROJINEGRA'
        ELSE NULL
      END
    )::"CintaTaekwondo";
  END IF;
END
$$;
