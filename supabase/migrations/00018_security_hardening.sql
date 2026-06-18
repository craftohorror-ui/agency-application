-- Migration 00018: Security Hardening (RLS & Storage)

-- ============================================================
-- 1. Messaging Security (conversation_participants)
-- Fix: Prevent members from adding themselves to private conversations
-- ============================================================
DROP POLICY IF EXISTS cp_write ON conversation_participants;

CREATE POLICY cp_write ON conversation_participants FOR INSERT WITH CHECK (
  agency_id = public.current_agency_id() AND is_staff() AND (
    is_admin() OR
    EXISTS (SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.profile_id = auth.uid()) OR
    NOT EXISTS (SELECT 1 FROM conversation_participants cp WHERE cp.conversation_id = conversation_id)
  )
);

-- ============================================================
-- 2. Files Security (public.files)
-- Fix: Project-level visibility must match assertProjectAccess()
-- ============================================================
DROP POLICY IF EXISTS files_agency ON files;

CREATE POLICY files_member_read ON files FOR SELECT USING (
  agency_id = public.current_agency_id() AND is_staff() AND (
    is_admin() OR project_id IS NULL OR 
    EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = files.project_id AND pm.profile_id = auth.uid())
  )
);

CREATE POLICY files_member_write ON files FOR INSERT WITH CHECK (
  agency_id = public.current_agency_id() AND is_staff() AND (
    is_admin() OR project_id IS NULL OR 
    EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = files.project_id AND pm.profile_id = auth.uid())
  )
);

CREATE POLICY files_member_update ON files FOR UPDATE USING (
  agency_id = public.current_agency_id() AND is_staff() AND (
    is_admin() OR project_id IS NULL OR 
    EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = files.project_id AND pm.profile_id = auth.uid())
  )
);

CREATE POLICY files_member_delete ON files FOR DELETE USING (
  agency_id = public.current_agency_id() AND is_staff() AND (
    is_admin() OR project_id IS NULL OR 
    EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = files.project_id AND pm.profile_id = auth.uid())
  )
);

-- ============================================================
-- 3. Invoice Security (public.invoices)
-- Fix: Members only see invoices from assigned projects.
-- ============================================================
DROP POLICY IF EXISTS "invoices_member_read" ON invoices;

CREATE POLICY "invoices_member_read" ON invoices FOR SELECT USING (
  is_staff() AND agency_id = public.current_agency_id() AND (
    is_admin() OR project_id IS NULL OR
    EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = invoices.project_id AND pm.profile_id = auth.uid())
  )
);

-- ============================================================
-- 4. Storage Security (storage.objects)
-- Fix: Drop overly permissive policy and create bucket-specific logic
-- ============================================================
DROP POLICY IF EXISTS storage_staff_agency ON storage.objects;

-- 4.1 Avatars Bucket
-- Anyone can view avatars, but only owners can manage them
CREATE POLICY storage_avatars_read ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY storage_avatars_manage ON storage.objects FOR ALL USING (bucket_id = 'avatars' AND owner = auth.uid());

-- 4.2 Branding Bucket
-- Public read access, admin write access
CREATE POLICY storage_branding_read ON storage.objects FOR SELECT USING (bucket_id = 'branding');
CREATE POLICY storage_branding_manage ON storage.objects FOR ALL USING (bucket_id = 'branding' AND is_admin());

-- 4.3 Files Bucket
-- Members can only read/write files belonging to projects they are assigned to
CREATE POLICY storage_files_read ON storage.objects FOR SELECT USING (
  bucket_id = 'files' AND (
    is_admin() OR 
    owner = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.files f 
      WHERE f.storage_path = name 
      AND (f.project_id IS NULL OR EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = f.project_id AND pm.profile_id = auth.uid()))
    )
  )
);

CREATE POLICY storage_files_manage ON storage.objects FOR ALL USING (
  bucket_id = 'files' AND (
    is_admin() OR owner = auth.uid()
  )
);
