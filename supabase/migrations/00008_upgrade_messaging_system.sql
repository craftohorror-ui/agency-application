-- =========================================================================
-- 00008_upgrade_messaging_system.sql (REDESIGN)
-- Safe, Live-Schema-Compliant Messaging Architecture Update
-- =========================================================================

-- 1. Ensure Enums exist safely
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'conversation_type') THEN
    CREATE TYPE conversation_type AS ENUM ('internal', 'client', 'group', 'private');
  ELSE
    ALTER TYPE conversation_type ADD VALUE IF NOT EXISTS 'group';
    ALTER TYPE conversation_type ADD VALUE IF NOT EXISTS 'private';
  END IF;
END$$;

-- 2. Safely extend existing tables
-- CONVERSATIONS
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_default boolean NOT NULL DEFAULT false;

-- CONVERSATION PARTICIPANTS
ALTER TABLE conversation_participants ADD COLUMN IF NOT EXISTS last_read_message_id uuid REFERENCES messages(id) ON DELETE SET NULL;

-- PROFILES (Presence)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS presence_status text NOT NULL DEFAULT 'offline' CHECK (presence_status IN ('online', 'away', 'offline'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen timestamptz NOT NULL DEFAULT now();

-- MESSAGES (Voice/File support via existing topic/extension architecture)
ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_path text;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS duration integer DEFAULT 0;

-- 3. Safely create indexes for existing tables
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_default_group_per_agency ON conversations(agency_id) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_conversation_participants_profile ON conversation_participants(profile_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at);

-- 4. Create new Message Reactions table (as requested by User)
CREATE TABLE IF NOT EXISTS message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

CREATE INDEX IF NOT EXISTS idx_message_reactions_message ON message_reactions(message_id);

-- 5. Enable RLS on new table
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;

-- 6. Add RLS Policies for Reactions
DROP POLICY IF EXISTS reactions_select ON message_reactions;
DROP POLICY IF EXISTS reactions_insert ON message_reactions;
DROP POLICY IF EXISTS reactions_delete ON message_reactions;

CREATE POLICY reactions_select ON message_reactions FOR SELECT USING (agency_id = public.current_agency_id());
CREATE POLICY reactions_insert ON message_reactions FOR INSERT WITH CHECK (agency_id = public.current_agency_id() AND user_id = auth.uid());
CREATE POLICY reactions_delete ON message_reactions FOR DELETE USING (agency_id = public.current_agency_id() AND user_id = auth.uid());

-- 7. Safe Data Backfill (Creates 'General' group only if it doesn't exist)
DO $$
DECLARE
  ag record;
  new_conv_id uuid;
  u record;
BEGIN
  FOR ag IN SELECT id, name FROM agencies LOOP
    SELECT id INTO new_conv_id FROM conversations WHERE agency_id = ag.id AND is_default = true LIMIT 1;
    
    IF new_conv_id IS NULL THEN
      INSERT INTO conversations (agency_id, type, title, is_default)
      VALUES (ag.id, 'group', ag.name || ' Team', true)
      RETURNING id INTO new_conv_id;
    END IF;

    -- NOTE: Providing `agency_id` here satisfies the NOT NULL constraint on conversation_participants
    FOR u IN SELECT id FROM profiles WHERE agency_id = ag.id LOOP
      INSERT INTO conversation_participants (agency_id, conversation_id, profile_id)
      VALUES (ag.id, new_conv_id, u.id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END$$;

-- 8. Create the Unread View
CREATE OR REPLACE VIEW agency_conversations_with_unreads AS
SELECT 
  c.id,
  c.agency_id,
  c.type,
  c.title,
  c.is_default,
  c.created_at,
  cp.profile_id AS participant_id,
  (
    SELECT COUNT(*) 
    FROM messages m
    WHERE m.conversation_id = c.id
    AND m.created_at > COALESCE(
      (SELECT created_at FROM messages WHERE id = cp.last_read_message_id),
      '1970-01-01'::timestamptz
    )
  ) AS unread_count,
  (
    SELECT body 
    FROM messages m 
    WHERE m.conversation_id = c.id 
    ORDER BY created_at DESC 
    LIMIT 1
  ) AS last_message_body,
  (
    SELECT created_at 
    FROM messages m 
    WHERE m.conversation_id = c.id 
    ORDER BY created_at DESC 
    LIMIT 1
  ) AS last_message_created_at,
  (
    SELECT json_agg(json_build_object(
      'profile_id', p.id,
      'full_name', p.full_name,
      'avatar_url', p.avatar_url,
      'role', p.role,
      'presence_status', p.presence_status,
      'last_seen', p.last_seen
    ))
    FROM conversation_participants cp_inner
    JOIN profiles p ON p.id = cp_inner.profile_id
    WHERE cp_inner.conversation_id = c.id
  ) AS participants
FROM conversations c
JOIN conversation_participants cp ON cp.conversation_id = c.id;
