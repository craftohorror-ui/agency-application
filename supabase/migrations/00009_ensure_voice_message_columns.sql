-- 00009_ensure_voice_message_columns.sql
-- Safely ensures the required columns for Voice Messages exist on the messages table.

ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_path text;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS duration integer DEFAULT 0;
