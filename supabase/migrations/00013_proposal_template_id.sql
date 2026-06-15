-- ============================================================
-- Migration: Add template_id to proposals
-- ============================================================

-- Add the column with a default to automatically backfill all existing rows
ALTER TABLE public.proposals
ADD COLUMN template_id text NOT NULL DEFAULT 'modern-agency';
