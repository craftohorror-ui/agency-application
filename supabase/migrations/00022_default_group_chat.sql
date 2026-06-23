-- =========================================================================
-- 00022_default_group_chat.sql
-- Autonomous initialization and backfill of default agency Team Chats
-- =========================================================================

-- 1. Trigger Function: Auto-create default group chat when a new agency is created
CREATE OR REPLACE FUNCTION public.auto_create_default_group_chat()
RETURNS trigger AS $$
BEGIN
  -- Insert a default group chat if one doesn't exist
  INSERT INTO conversations (agency_id, type, title, is_default)
  SELECT NEW.id, 'group', NEW.name || ' Team', true
  WHERE NOT EXISTS (
    SELECT 1 FROM conversations 
    WHERE agency_id = NEW.id AND is_default = true
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to agencies table
DROP TRIGGER IF EXISTS trg_auto_create_default_group_chat ON agencies;
CREATE TRIGGER trg_auto_create_default_group_chat
  AFTER INSERT ON agencies
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_default_group_chat();


-- 2. Trigger Function: Auto-join default group chat when a new profile is created
CREATE OR REPLACE FUNCTION public.auto_join_default_group_chat()
RETURNS trigger AS $$
DECLARE
  v_conv_id uuid;
BEGIN
  -- Find the default group chat for the agency
  SELECT id INTO v_conv_id 
  FROM conversations 
  WHERE agency_id = NEW.agency_id AND is_default = true 
  LIMIT 1;

  -- Insert participant if the conversation exists
  IF v_conv_id IS NOT NULL THEN
    INSERT INTO conversation_participants (agency_id, conversation_id, profile_id)
    VALUES (NEW.agency_id, v_conv_id, NEW.id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to profiles table
DROP TRIGGER IF EXISTS trg_auto_join_default_group_chat ON profiles;
CREATE TRIGGER trg_auto_join_default_group_chat
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_join_default_group_chat();


-- 3. Idempotent Backfill: Repair existing agencies and profiles
DO $$
DECLARE
  ag record;
  new_conv_id uuid;
  u record;
BEGIN
  FOR ag IN SELECT id, name FROM agencies LOOP
    -- Check if a default conversation already exists for this agency
    SELECT id INTO new_conv_id 
    FROM conversations 
    WHERE agency_id = ag.id AND is_default = true 
    LIMIT 1;
    
    -- If it doesn't exist, create it
    IF new_conv_id IS NULL THEN
      INSERT INTO conversations (agency_id, type, title, is_default)
      VALUES (ag.id, 'group', ag.name || ' Team', true)
      RETURNING id INTO new_conv_id;
    END IF;

    -- Ensure all existing profiles in this agency are participants
    FOR u IN SELECT id FROM profiles WHERE agency_id = ag.id LOOP
      INSERT INTO conversation_participants (agency_id, conversation_id, profile_id)
      VALUES (ag.id, new_conv_id, u.id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END$$;
