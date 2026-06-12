-- ============================================================
-- Migration 00002: Role Simplification & Audit Logs
-- ============================================================

-- 1. Create audit_logs table
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

alter table audit_logs enable row level security;
create policy "audit_logs_owner_read" on audit_logs for select using (current_user_role() = 'owner');

-- 2. Modify tasks RLS (Members only see tasks they are assigned to, or tasks in their assigned projects)
drop policy if exists "tasks_staff" on tasks;

create policy "tasks_admin" on tasks for all 
  using (current_user_role() = 'owner') 
  with check (current_user_role() = 'owner');

create policy "tasks_member_read" on tasks for select using (
  is_staff() and (
    assignee_id = auth.uid() or 
    exists (select 1 from project_members pm where pm.project_id = tasks.project_id and pm.profile_id = auth.uid())
  )
);

create policy "tasks_member_write" on tasks for update using (
  is_staff() and (
    assignee_id = auth.uid() or 
    exists (select 1 from project_members pm where pm.project_id = tasks.project_id and pm.profile_id = auth.uid())
  )
);

create policy "tasks_member_insert" on tasks for insert with check (
  is_staff() and (
    exists (select 1 from project_members pm where pm.project_id = project_id and pm.profile_id = auth.uid())
  )
);

-- 3. Modify invoices RLS (Members can view, create, update, but NOT delete)
drop policy if exists "invoices_admin" on invoices;
drop policy if exists "invoice_items_admin" on invoice_items;

-- Invoices
create policy "invoices_owner_all" on invoices for all 
  using (current_user_role() = 'owner') 
  with check (current_user_role() = 'owner');

create policy "invoices_member_read" on invoices for select using (is_staff());
create policy "invoices_member_insert" on invoices for insert with check (is_staff());
create policy "invoices_member_update" on invoices for update using (is_staff());

-- Invoice Items
create policy "invoice_items_owner_all" on invoice_items for all 
  using (current_user_role() = 'owner') 
  with check (current_user_role() = 'owner');

create policy "invoice_items_member_read" on invoice_items for select using (is_staff());
create policy "invoice_items_member_insert" on invoice_items for insert with check (is_staff());
create policy "invoice_items_member_update" on invoice_items for update using (is_staff());
create policy "invoice_items_member_delete" on invoice_items for delete using (is_staff());

-- Note: We allow members to delete invoice *items* (lines on an invoice) when they are updating it, 
-- but they cannot delete the parent `invoices` row.
