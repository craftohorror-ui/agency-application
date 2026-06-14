-- ============================================================
-- Migration: 00006_multi_tenant_agencies.sql
-- Description: Implement Multi-Tenant Agency Isolation (CORRECTED)
-- ============================================================

-- ------------------------------------------------------------
-- 1. Create agencies table
-- ------------------------------------------------------------
create table if not exists agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. Add agency_id to all core and child tables
-- ------------------------------------------------------------
alter table profiles add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table leads add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table clients add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table projects add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table files add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table invoices add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table tasks add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table conversations add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table activities add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table proposals add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table contracts add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table notifications add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table audit_logs add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table automation_rules add column if not exists agency_id uuid references agencies(id) on delete cascade;

-- Child tables
alter table proposal_items add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table contract_versions add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table project_members add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table milestones add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table deliverables add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table invoice_items add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table payments add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table time_entries add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table conversation_participants add column if not exists agency_id uuid references agencies(id) on delete cascade;
alter table messages add column if not exists agency_id uuid references agencies(id) on delete cascade;

-- ------------------------------------------------------------
-- 3. Create helper function for RLS
-- ------------------------------------------------------------
create or replace function public.current_agency_id() returns uuid
language sql stable security definer set search_path = public as
$$ select agency_id from profiles where id = auth.uid() limit 1 $$;

-- ------------------------------------------------------------
-- 4. Set default values for automatic isolation on INSERT
-- ------------------------------------------------------------
alter table leads alter column agency_id set default public.current_agency_id();
alter table clients alter column agency_id set default public.current_agency_id();
alter table projects alter column agency_id set default public.current_agency_id();
alter table files alter column agency_id set default public.current_agency_id();
alter table invoices alter column agency_id set default public.current_agency_id();
alter table tasks alter column agency_id set default public.current_agency_id();
alter table conversations alter column agency_id set default public.current_agency_id();
alter table activities alter column agency_id set default public.current_agency_id();
alter table proposals alter column agency_id set default public.current_agency_id();
alter table contracts alter column agency_id set default public.current_agency_id();
alter table notifications alter column agency_id set default public.current_agency_id();
alter table audit_logs alter column agency_id set default public.current_agency_id();
alter table automation_rules alter column agency_id set default public.current_agency_id();

-- Child tables defaults
alter table proposal_items alter column agency_id set default public.current_agency_id();
alter table contract_versions alter column agency_id set default public.current_agency_id();
alter table project_members alter column agency_id set default public.current_agency_id();
alter table milestones alter column agency_id set default public.current_agency_id();
alter table deliverables alter column agency_id set default public.current_agency_id();
alter table invoice_items alter column agency_id set default public.current_agency_id();
alter table payments alter column agency_id set default public.current_agency_id();
alter table time_entries alter column agency_id set default public.current_agency_id();
alter table conversation_participants alter column agency_id set default public.current_agency_id();
alter table messages alter column agency_id set default public.current_agency_id();

-- ------------------------------------------------------------
-- 5. Migrate existing data (Idempotent)
-- ------------------------------------------------------------
do $$
declare v_agency uuid;
begin
  -- Only create a default agency and assign orphaned rows if there's any data to assign.
  if (select count(*) from profiles) > 0 and (select count(*) from agencies) = 0 then
    insert into agencies (name) values ('Default Agency') returning id into v_agency;
    
    update profiles set agency_id = v_agency where agency_id is null;
    update leads set agency_id = v_agency where agency_id is null;
    update clients set agency_id = v_agency where agency_id is null;
    update projects set agency_id = v_agency where agency_id is null;
    update files set agency_id = v_agency where agency_id is null;
    update invoices set agency_id = v_agency where agency_id is null;
    update tasks set agency_id = v_agency where agency_id is null;
    update conversations set agency_id = v_agency where agency_id is null;
    update activities set agency_id = v_agency where agency_id is null;
    update proposals set agency_id = v_agency where agency_id is null;
    update contracts set agency_id = v_agency where agency_id is null;
    update notifications set agency_id = v_agency where agency_id is null;
    update audit_logs set agency_id = v_agency where agency_id is null;
    update automation_rules set agency_id = v_agency where agency_id is null;

    update proposal_items set agency_id = v_agency where agency_id is null;
    update contract_versions set agency_id = v_agency where agency_id is null;
    update project_members set agency_id = v_agency where agency_id is null;
    update milestones set agency_id = v_agency where agency_id is null;
    update deliverables set agency_id = v_agency where agency_id is null;
    update invoice_items set agency_id = v_agency where agency_id is null;
    update payments set agency_id = v_agency where agency_id is null;
    update time_entries set agency_id = v_agency where agency_id is null;
    update conversation_participants set agency_id = v_agency where agency_id is null;
    update messages set agency_id = v_agency where agency_id is null;
  end if;
end $$;

-- ------------------------------------------------------------
-- 6. Enforce NOT NULL for agency_id safely
-- ------------------------------------------------------------
do $$
begin
  -- We only enforce NOT NULL if no nulls remain. The previous DO block guarantees
  -- nulls are removed ONLY IF there was at least one profile. If a table has orphaned
  -- rows but no profiles exist, setting NOT NULL would crash. To be 100% safe, we 
  -- delete completely orphaned rows (impossible to attribute) before enforcing constraints.
  
  delete from leads where agency_id is null;
  delete from clients where agency_id is null;
  delete from projects where agency_id is null;
  delete from files where agency_id is null;
  delete from invoices where agency_id is null;
  delete from tasks where agency_id is null;
  delete from conversations where agency_id is null;
  delete from activities where agency_id is null;
  delete from proposals where agency_id is null;
  delete from contracts where agency_id is null;
  delete from notifications where agency_id is null;
  delete from audit_logs where agency_id is null;
  delete from automation_rules where agency_id is null;

  delete from proposal_items where agency_id is null;
  delete from contract_versions where agency_id is null;
  delete from project_members where agency_id is null;
  delete from milestones where agency_id is null;
  delete from deliverables where agency_id is null;
  delete from invoice_items where agency_id is null;
  delete from payments where agency_id is null;
  delete from time_entries where agency_id is null;
  delete from conversation_participants where agency_id is null;
  delete from messages where agency_id is null;
end $$;

alter table profiles alter column agency_id set not null;
alter table leads alter column agency_id set not null;
alter table clients alter column agency_id set not null;
alter table projects alter column agency_id set not null;
alter table files alter column agency_id set not null;
alter table invoices alter column agency_id set not null;
alter table tasks alter column agency_id set not null;
alter table conversations alter column agency_id set not null;
alter table activities alter column agency_id set not null;
alter table proposals alter column agency_id set not null;
alter table contracts alter column agency_id set not null;
alter table notifications alter column agency_id set not null;
alter table audit_logs alter column agency_id set not null;
alter table automation_rules alter column agency_id set not null;

alter table proposal_items alter column agency_id set not null;
alter table contract_versions alter column agency_id set not null;
alter table project_members alter column agency_id set not null;
alter table milestones alter column agency_id set not null;
alter table deliverables alter column agency_id set not null;
alter table invoice_items alter column agency_id set not null;
alter table payments alter column agency_id set not null;
alter table time_entries alter column agency_id set not null;
alter table conversation_participants alter column agency_id set not null;
alter table messages alter column agency_id set not null;

-- ------------------------------------------------------------
-- 7. Update handle_new_user() trigger function
-- ------------------------------------------------------------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare 
  v_role user_role;
  v_agency uuid;
begin
  -- If user signed up independently (no agency_id in metadata), they are a new Owner.
  -- If user was invited, they will have agency_id in their metadata.
  if new.raw_user_meta_data->>'agency_id' is null then 
    v_role := 'owner';
    insert into agencies (name) values (coalesce(new.raw_user_meta_data->>'full_name', 'My') || ' Agency') returning id into v_agency;
  else 
    v_role := coalesce((new.raw_user_meta_data->>'role')::user_role, 'member');
    v_agency := (new.raw_user_meta_data->>'agency_id')::uuid;
  end if;
  
  insert into profiles (id, email, full_name, role, agency_id)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''), v_role, v_agency);
  
  return new;
end $$;

-- ------------------------------------------------------------
-- 8. Rewrite RLS Policies for Staff-Facing Tables
-- ------------------------------------------------------------

-- DROP ALL EXISTING POLICIES
drop policy if exists profiles_select on profiles;
drop policy if exists profiles_update_self on profiles;
drop policy if exists profiles_owner_all on profiles;
drop policy if exists leads_staff on leads;
drop policy if exists clients_staff on clients;
drop policy if exists activities_staff on activities;
drop policy if exists proposals_staff on proposals;
drop policy if exists proposal_items_staff on proposal_items;
drop policy if exists contracts_staff on contracts;
drop policy if exists contract_versions_staff on contract_versions;
drop policy if exists projects_admin on projects;
drop policy if exists projects_member_read on projects;
drop policy if exists project_members_read on project_members;
drop policy if exists project_members_admin on project_members;
drop policy if exists milestones_staff on milestones;
drop policy if exists tasks_staff on tasks;
drop policy if exists "tasks_admin" on tasks;
drop policy if exists "tasks_member_read" on tasks;
drop policy if exists "tasks_member_write" on tasks;
drop policy if exists "tasks_member_insert" on tasks;
drop policy if exists files_staff on files;
drop policy if exists deliverables_staff on deliverables;
drop policy if exists "invoices_admin" on invoices;
drop policy if exists "invoices_owner_all" on invoices;
drop policy if exists "invoices_member_read" on invoices;
drop policy if exists "invoices_member_insert" on invoices;
drop policy if exists "invoices_member_update" on invoices;
drop policy if exists "invoice_items_admin" on invoice_items;
drop policy if exists "invoice_items_owner_all" on invoice_items;
drop policy if exists "invoice_items_member_read" on invoice_items;
drop policy if exists "invoice_items_member_insert" on invoice_items;
drop policy if exists "invoice_items_member_update" on invoice_items;
drop policy if exists "invoice_items_member_delete" on invoice_items;
drop policy if exists payments_admin on payments;
drop policy if exists time_entries_self on time_entries;
drop policy if exists time_entries_admin on time_entries;
drop policy if exists conversations_participant on conversations;
drop policy if exists conversations_staff_create on conversations;
drop policy if exists cp_read on conversation_participants;
drop policy if exists cp_write on conversation_participants;
drop policy if exists messages_read on messages;
drop policy if exists messages_send on messages;
drop policy if exists notifications_self on notifications;
drop policy if exists "audit_logs_owner_read" on audit_logs;
drop policy if exists automation_rules_owner on automation_rules;
drop policy if exists automation_rules_read on automation_rules;
drop policy if exists storage_staff_all on storage.objects;

-- RECREATE WITH ISOLATION
create policy profiles_select on profiles for select using (agency_id = public.current_agency_id());
create policy profiles_update_self on profiles for update using (id = auth.uid() and agency_id = public.current_agency_id());
create policy profiles_owner_all on profiles for all using (current_user_role() = 'owner' and agency_id = public.current_agency_id());

create policy leads_agency on leads for all using (agency_id = public.current_agency_id() and is_staff());
create policy clients_agency on clients for all using (agency_id = public.current_agency_id() and is_staff());
create policy activities_agency on activities for all using (agency_id = public.current_agency_id() and is_staff());
create policy proposals_agency on proposals for all using (agency_id = public.current_agency_id() and is_staff());
create policy proposal_items_agency on proposal_items for all using (agency_id = public.current_agency_id() and is_staff());
create policy contracts_agency on contracts for all using (agency_id = public.current_agency_id() and is_staff());
create policy contract_versions_agency on contract_versions for all using (agency_id = public.current_agency_id() and is_staff());
create policy automation_rules_agency_owner on automation_rules for all using (current_user_role() = 'owner' and agency_id = public.current_agency_id());
create policy automation_rules_agency_read on automation_rules for select using (is_staff() and agency_id = public.current_agency_id());

create policy projects_admin on projects for all using (is_admin() and agency_id = public.current_agency_id());
create policy projects_member_read on projects for select using (is_staff() and agency_id = public.current_agency_id() and exists (select 1 from project_members m where m.project_id = id and m.profile_id = auth.uid()));

create policy project_members_read on project_members for select using (agency_id = public.current_agency_id() and is_staff());
create policy project_members_admin on project_members for all using (agency_id = public.current_agency_id() and is_admin());
create policy milestones_agency on milestones for all using (agency_id = public.current_agency_id() and is_staff());
create policy deliverables_agency on deliverables for all using (agency_id = public.current_agency_id() and is_staff());

create policy "tasks_admin" on tasks for all using (current_user_role() = 'owner' and agency_id = public.current_agency_id());
create policy "tasks_member_read" on tasks for select using (
  is_staff() and agency_id = public.current_agency_id() and (
    assignee_id = auth.uid() or 
    exists (select 1 from project_members pm where pm.project_id = tasks.project_id and pm.profile_id = auth.uid())
  )
);
create policy "tasks_member_write" on tasks for update using (
  is_staff() and agency_id = public.current_agency_id() and (
    assignee_id = auth.uid() or 
    exists (select 1 from project_members pm where pm.project_id = tasks.project_id and pm.profile_id = auth.uid())
  )
);
create policy "tasks_member_insert" on tasks for insert with check (
  is_staff() and agency_id = public.current_agency_id() and 
  exists (select 1 from project_members pm where pm.project_id = project_id and pm.profile_id = auth.uid())
);

create policy files_agency on files for all using (agency_id = public.current_agency_id() and is_staff());

create policy "invoices_owner_all" on invoices for all using (current_user_role() = 'owner' and agency_id = public.current_agency_id());
create policy "invoices_member_read" on invoices for select using (is_staff() and agency_id = public.current_agency_id());
create policy "invoices_member_insert" on invoices for insert with check (is_staff() and agency_id = public.current_agency_id());
create policy "invoices_member_update" on invoices for update using (is_staff() and agency_id = public.current_agency_id());

create policy "invoice_items_owner_all" on invoice_items for all using (current_user_role() = 'owner' and agency_id = public.current_agency_id());
create policy "invoice_items_member_read" on invoice_items for select using (is_staff() and agency_id = public.current_agency_id());
create policy "invoice_items_member_insert" on invoice_items for insert with check (is_staff() and agency_id = public.current_agency_id());
create policy "invoice_items_member_update" on invoice_items for update using (is_staff() and agency_id = public.current_agency_id());
create policy "invoice_items_member_delete" on invoice_items for delete using (is_staff() and agency_id = public.current_agency_id());

create policy payments_agency on payments for all using (agency_id = public.current_agency_id() and is_admin());

create policy time_entries_self on time_entries for all using (profile_id = auth.uid() and agency_id = public.current_agency_id());
create policy time_entries_admin on time_entries for select using (is_admin() and agency_id = public.current_agency_id());

create policy conversations_participant on conversations for select using (
  agency_id = public.current_agency_id() and 
  exists (select 1 from conversation_participants cp where cp.conversation_id = id and cp.profile_id = auth.uid())
);
create policy conversations_staff_create on conversations for insert with check (is_staff() and agency_id = public.current_agency_id());

create policy cp_read on conversation_participants for select using (agency_id = public.current_agency_id() and (profile_id = auth.uid() or is_staff()));
create policy cp_write on conversation_participants for insert with check (agency_id = public.current_agency_id() and is_staff());

create policy messages_read on messages for select using (
  agency_id = public.current_agency_id() and 
  exists (select 1 from conversation_participants cp where cp.conversation_id = messages.conversation_id and cp.profile_id = auth.uid())
);
create policy messages_send on messages for insert with check (
  agency_id = public.current_agency_id() and 
  sender_id = auth.uid() and 
  exists (select 1 from conversation_participants cp where cp.conversation_id = messages.conversation_id and cp.profile_id = auth.uid())
);

create policy notifications_self on notifications for all using (profile_id = auth.uid() and agency_id = public.current_agency_id());
create policy "audit_logs_owner_read" on audit_logs for select using (current_user_role() = 'owner' and agency_id = public.current_agency_id());

-- Storage objects tenant isolation (by verifying the object owner's agency)
create policy storage_staff_agency on storage.objects for all using (
  is_staff() and exists (
    select 1 from public.profiles p 
    where p.id = storage.objects.owner 
    and p.agency_id = public.current_agency_id()
  )
) with check (
  is_staff()
);
