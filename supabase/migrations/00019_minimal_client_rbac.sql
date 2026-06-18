-- Migration 00019: Minimal Client RBAC

-- 1. Add owner_id to clients
ALTER TABLE clients
  ADD COLUMN owner_id uuid REFERENCES profiles(id) ON DELETE SET NULL;

-- 2. Backfill owner_id from leads
UPDATE clients
SET owner_id = leads.owner_id
FROM leads
WHERE clients.lead_id = leads.id
  AND leads.owner_id IS NOT NULL;

-- 3. Create an index for RLS performance
CREATE INDEX idx_clients_owner ON clients(owner_id);

-- 4. Replace global RLS with RBAC
DROP POLICY IF EXISTS clients_agency ON clients;

CREATE POLICY clients_member_read ON clients FOR SELECT USING (
  agency_id = public.current_agency_id() AND is_staff() AND (
    is_admin() OR owner_id = auth.uid()
  )
);

CREATE POLICY clients_member_insert ON clients FOR INSERT WITH CHECK (
  agency_id = public.current_agency_id() AND is_staff() AND (
    is_admin() OR owner_id = auth.uid()
  )
);

CREATE POLICY clients_member_update ON clients FOR UPDATE USING (
  agency_id = public.current_agency_id() AND is_staff() AND (
    is_admin() OR owner_id = auth.uid()
  )
);

CREATE POLICY clients_member_delete ON clients FOR DELETE USING (
  agency_id = public.current_agency_id() AND is_staff() AND is_admin()
);
