-- ============================================================
-- Migration: 00015_agency_settings.sql
-- Description: Implement Agency Profile & Brand Settings System
-- ============================================================

-- ------------------------------------------------------------
-- 1. Extend Agencies Table with Branding & Legal Data
-- ------------------------------------------------------------
alter table agencies add column if not exists logo_url text;
alter table agencies add column if not exists logo_dark_url text;
alter table agencies add column if not exists tagline text;

-- Branding
alter table agencies add column if not exists primary_color text;
alter table agencies add column if not exists secondary_color text;
alter table agencies add column if not exists accent_color text;

-- Agency Information
alter table agencies add column if not exists legal_name text;
alter table agencies add column if not exists registration_number text;
alter table agencies add column if not exists tax_id text;

-- Social Links
alter table agencies add column if not exists website text;
alter table agencies add column if not exists linkedin_url text;
alter table agencies add column if not exists instagram_url text;
alter table agencies add column if not exists facebook_url text;

-- Document Branding Defaults
alter table agencies add column if not exists default_proposal_footer text;
alter table agencies add column if not exists default_contract_footer text;
alter table agencies add column if not exists default_invoice_footer text;

-- Legal 
alter table agencies add column if not exists terms_and_conditions text;
alter table agencies add column if not exists privacy_policy text;

-- Extra Settings
alter table agencies add column if not exists email_signature text;
alter table agencies add column if not exists timezone text default 'UTC';
alter table agencies add column if not exists default_currency text default 'USD';
alter table agencies add column if not exists default_legal_disclaimer text;

-- ------------------------------------------------------------
-- 2. Extend Profiles Table
-- ------------------------------------------------------------
alter table profiles add column if not exists phone text;
alter table profiles add column if not exists bio text;

-- ------------------------------------------------------------
-- 3. Add Branding Snapshots to Documents
-- ------------------------------------------------------------
alter table proposals add column if not exists branding_snapshot jsonb;
alter table contracts add column if not exists branding_snapshot jsonb;
alter table invoices add column if not exists branding_snapshot jsonb;

-- ------------------------------------------------------------
-- 4. Execute Data Backfill (Option B) for Immutable History
-- ------------------------------------------------------------
do $$
begin
  -- Safely verify proposals.agency_id exists before backfilling
  if exists (select 1 from information_schema.columns where table_name = 'proposals' and column_name = 'agency_id') then
    update proposals p 
    set branding_snapshot = jsonb_build_object(
      'agency_name', coalesce((select name from agencies a where a.id = p.agency_id), 'Default Agency'),
      'logo_url', null,
      'primary_color', '#0f172a',
      'secondary_color', '#334155'
    ) 
    where branding_snapshot is null;
  end if;

  -- Safely verify contracts.agency_id exists before backfilling
  if exists (select 1 from information_schema.columns where table_name = 'contracts' and column_name = 'agency_id') then
    update contracts c 
    set branding_snapshot = jsonb_build_object(
      'agency_name', coalesce((select name from agencies a where a.id = c.agency_id), 'Default Agency'),
      'logo_url', null,
      'primary_color', '#0f172a',
      'secondary_color', '#334155'
    ) 
    where branding_snapshot is null;
  end if;

  -- Safely verify invoices.agency_id exists before backfilling
  if exists (select 1 from information_schema.columns where table_name = 'invoices' and column_name = 'agency_id') then
    update invoices i 
    set branding_snapshot = jsonb_build_object(
      'agency_name', coalesce((select name from agencies a where a.id = i.agency_id), 'Default Agency'),
      'logo_url', null,
      'primary_color', '#0f172a',
      'secondary_color', '#334155'
    ) 
    where branding_snapshot is null;
  end if;
end $$;

-- ------------------------------------------------------------
-- 5. Storage Buckets & Policies
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
values (
  'branding', 
  'branding', 
  true, 
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
) on conflict (id) do update set 
  public = true, 
  file_size_limit = 5242880, 
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
values (
  'avatars', 
  'avatars', 
  false, 
  2097152, -- 2MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
) on conflict (id) do update set 
  public = false, 
  file_size_limit = 2097152, 
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp'];

-- ------------------------------------------------------------
-- 6. FIX EXISTING RLS CONFLICT
-- ------------------------------------------------------------
-- The legacy 'storage_staff_agency' policy on storage.objects 
-- was accidentally applied to ALL buckets. We must scope it to 
-- 'files' so it doesn't bypass our new branding/avatar restrictions.
drop policy if exists "storage_staff_agency" on storage.objects;
create policy "storage_staff_agency" on storage.objects for all using (
  bucket_id = 'files' and is_staff() and exists (
    select 1 from public.profiles p 
    where p.id = storage.objects.owner 
    and p.agency_id = public.current_agency_id()
  )
) with check (
  bucket_id = 'files' and is_staff()
);

-- Branding RLS
drop policy if exists "branding_public_read" on storage.objects;
drop policy if exists "branding_owner_insert" on storage.objects;
drop policy if exists "branding_owner_update" on storage.objects;

create policy "branding_public_read" on storage.objects for select using (bucket_id = 'branding');
create policy "branding_owner_insert" on storage.objects for insert with check (
  bucket_id = 'branding' and public.current_user_role() = 'owner'
);
create policy "branding_owner_update" on storage.objects for update using (
  bucket_id = 'branding' and public.current_user_role() = 'owner'
);

-- Avatars RLS
drop policy if exists "avatars_staff_read" on storage.objects;
drop policy if exists "avatars_self_insert" on storage.objects;
drop policy if exists "avatars_self_update" on storage.objects;

create policy "avatars_staff_read" on storage.objects for select using (
  bucket_id = 'avatars' and public.is_staff()
);
create policy "avatars_self_insert" on storage.objects for insert with check (
  bucket_id = 'avatars' and auth.uid() = owner
);
create policy "avatars_self_update" on storage.objects for update using (
  bucket_id = 'avatars' and auth.uid() = owner
);

-- ============================================================
-- ROLLBACK PLAN (DO NOT EXECUTE UNLESS REVERTING)
-- ============================================================
/*
-- 1. Revert RLS Fix
drop policy if exists "storage_staff_agency" on storage.objects;
create policy "storage_staff_agency" on storage.objects for all using (
  is_staff() and exists (
    select 1 from public.profiles p 
    where p.id = storage.objects.owner 
    and p.agency_id = public.current_agency_id()
  )
) with check (
  is_staff()
);

-- 2. Drop Buckets & Policies
drop policy if exists "branding_public_read" on storage.objects;
drop policy if exists "branding_owner_insert" on storage.objects;
drop policy if exists "branding_owner_update" on storage.objects;
drop policy if exists "avatars_staff_read" on storage.objects;
drop policy if exists "avatars_self_insert" on storage.objects;
drop policy if exists "avatars_self_update" on storage.objects;
delete from storage.buckets where id in ('branding', 'avatars');

-- 3. Drop Snapshot Columns
alter table proposals drop column if exists branding_snapshot;
alter table contracts drop column if exists branding_snapshot;
alter table invoices drop column if exists branding_snapshot;

-- 4. Drop Profiles Columns
alter table profiles drop column if exists phone;
alter table profiles drop column if exists bio;

-- 5. Drop Agencies Columns
alter table agencies drop column if exists logo_url,
drop column if exists logo_dark_url,
drop column if exists tagline,
drop column if exists primary_color,
drop column if exists secondary_color,
drop column if exists accent_color,
drop column if exists legal_name,
drop column if exists registration_number,
drop column if exists tax_id,
drop column if exists website,
drop column if exists linkedin_url,
drop column if exists instagram_url,
drop column if exists facebook_url,
drop column if exists default_proposal_footer,
drop column if exists default_contract_footer,
drop column if exists default_invoice_footer,
drop column if exists terms_and_conditions,
drop column if exists privacy_policy,
drop column if exists email_signature,
drop column if exists timezone,
drop column if exists default_currency,
drop column if exists default_legal_disclaimer;
*/
