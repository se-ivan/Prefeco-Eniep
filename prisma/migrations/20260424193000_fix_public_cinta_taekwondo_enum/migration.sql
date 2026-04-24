-- Ensure enum exists in public schema and inscripciones.cinta_taekwondo uses it.
-- Safe for production: no reset, idempotent checks, preserves existing data.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'CintaTaekwondo'
  ) THEN
    CREATE TYPE public."CintaTaekwondo" AS ENUM (
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
      AND NOT (udt_schema = 'public' AND udt_name = 'CintaTaekwondo')
  ) THEN
    ALTER TABLE public.inscripciones
    ALTER COLUMN cinta_taekwondo
    TYPE public."CintaTaekwondo"
    USING (
      CASE
        WHEN cinta_taekwondo IS NULL THEN NULL
        WHEN UPPER(TRIM(cinta_taekwondo::text)) IN ('BLANCA', 'CINTA BLANCA', 'CINTA_BLANCA') THEN 'CINTA_BLANCA'
        WHEN UPPER(TRIM(cinta_taekwondo::text)) IN ('AMARILLA', 'CINTA AMARILLA', 'CINTA_AMARILLA') THEN 'CINTA_AMARILLA'
        WHEN UPPER(TRIM(cinta_taekwondo::text)) IN ('NARANJA', 'CINTA NARANJA', 'CINTA_NARANJA') THEN 'CINTA_NARANJA'
        WHEN UPPER(TRIM(cinta_taekwondo::text)) IN ('VERDE', 'CINTA VERDE', 'CINTA_VERDE') THEN 'CINTA_VERDE'
        WHEN UPPER(TRIM(cinta_taekwondo::text)) IN ('AZUL', 'CINTA AZUL', 'CINTA_AZUL') THEN 'CINTA_AZUL'
        WHEN UPPER(TRIM(cinta_taekwondo::text)) IN ('ROJA', 'CINTA ROJA', 'CINTA_ROJA') THEN 'CINTA_ROJA'
        WHEN UPPER(TRIM(cinta_taekwondo::text)) IN ('NEGRA', 'CINTA NEGRA', 'CINTA_NEGRA') THEN 'CINTA_NEGRA'
        WHEN UPPER(TRIM(cinta_taekwondo::text)) IN ('ROJINEGRA', 'CINTA ROJINEGRA', 'CINTA_ROJINEGRA') THEN 'CINTA_ROJINEGRA'
        ELSE NULL
      END
    )::public."CintaTaekwondo";
  END IF;
END
$$;
