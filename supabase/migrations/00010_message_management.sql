-- =========================================================================
-- 00010_message_management.sql
-- Safe, Live-Schema-Compliant Messaging Enhancements (Reply, Edit, Delete)
-- =========================================================================

-- 1. Extend Messages Table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS edited_at timestamptz;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_deleted boolean DEFAULT false;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reply_to_message_id uuid REFERENCES messages(id) ON DELETE SET NULL;

-- 2. Add Messages UPDATE Policy
-- Only the sender can update their own message (enforced further by server actions for 15/30m limits)
DROP POLICY IF EXISTS messages_update ON messages;
CREATE POLICY messages_update ON messages 
FOR UPDATE 
USING (
  agency_id = public.current_agency_id() AND 
  sender_id = auth.uid()
);
