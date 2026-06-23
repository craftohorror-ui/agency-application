-- =========================================================================
-- 00023_enable_realtime_reactions.sql
-- Enables real-time sync for message reactions
-- =========================================================================

-- Safely add message_reactions to the supabase_realtime publication
DO $$
BEGIN
  -- Check if the table is already in the publication
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'message_reactions'
  ) THEN
    -- If it doesn't exist, execute the ALTER PUBLICATION command safely
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE message_reactions;';
  END IF;
END$$;
