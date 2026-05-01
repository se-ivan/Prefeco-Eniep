-- Migration: add_cintas_resultados
-- Adds optional enum column cinta_taekwondo to resultados without dropping data.

BEGIN;

-- Create enum type if it does not already exist
DO $$
BEGIN
  IF to_regtype('public."CintaTaekwondo"') IS NULL THEN
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
END$$;

-- Add the nullable column to the resultados table (no default, preserves existing rows)
ALTER TABLE resultados
  ADD COLUMN IF NOT EXISTS cinta_taekwondo "CintaTaekwondo";

COMMIT;
