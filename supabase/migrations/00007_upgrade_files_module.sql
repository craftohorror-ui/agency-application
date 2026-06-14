-- ============================================================
-- Migration: 00007_upgrade_files_module.sql
-- Description: Upgrade files module to support custom display names
-- ============================================================

-- Add display_name column
ALTER TABLE files ADD COLUMN display_name text;

-- Backfill display_name with existing original filenames (idempotent)
UPDATE files SET display_name = name WHERE display_name IS NULL;

-- Make display_name NOT NULL for future uploads
ALTER TABLE files ALTER COLUMN display_name SET NOT NULL;
