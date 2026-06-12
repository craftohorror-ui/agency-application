-- Performance: Add missing indexes for junction tables where the second key is queried
create index if not exists idx_project_members_profile on project_members(profile_id);
create index if not exists idx_cp_profile on conversation_participants(profile_id);

-- Security: Prevent privilege escalation on hourly_rate for self-updates
create or replace function public.protect_profile_columns() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (new.role is distinct from old.role or new.is_suspended is distinct from old.is_suspended or new.hourly_rate is distinct from old.hourly_rate)
     and current_user_role() is distinct from 'owner' then
    raise exception 'Only the agency owner can change roles, suspension status, or hourly rates';
  end if;
  return new;
end $$;
