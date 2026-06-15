-- Safe, Live-Schema-Compliant RLS Update for Unread Message State

-- Drop any existing UPDATE policy to prevent duplicates
DROP POLICY IF EXISTS cp_update ON conversation_participants;

-- Create the UPDATE policy so users can persist their read state
CREATE POLICY cp_update ON conversation_participants 
FOR UPDATE 
USING (
  agency_id = public.current_agency_id() AND 
  profile_id = auth.uid()
);
