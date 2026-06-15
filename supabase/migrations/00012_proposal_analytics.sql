-- Migration: 00012_proposal_analytics.sql

-- 1. Proposal Public Links
create table proposal_public_links (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals(id) on delete cascade,
  agency_id uuid not null references agencies(id) on delete cascade,
  token text not null unique,
  name text,
  is_active boolean not null default true,
  expires_at timestamptz,
  last_accessed_at timestamptz,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index proposal_public_links_token_idx on proposal_public_links(token);
create index proposal_public_links_proposal_id_idx on proposal_public_links(proposal_id);
create index proposal_public_links_agency_id_idx on proposal_public_links(agency_id);

alter table proposal_public_links enable row level security;
create policy "Staff can view their agency's links" on proposal_public_links 
  for select using (agency_id = public.current_agency_id());
create policy "Staff can insert links for their agency" on proposal_public_links 
  for insert with check (agency_id = public.current_agency_id());
create policy "Staff can update their agency's links" on proposal_public_links 
  for update using (agency_id = public.current_agency_id());
create policy "Staff can delete their agency's links" on proposal_public_links 
  for delete using (agency_id = public.current_agency_id());


-- 2. Proposal Sessions
create table proposal_sessions (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references proposal_public_links(id) on delete cascade,
  proposal_id uuid not null references proposals(id) on delete cascade,
  agency_id uuid not null references agencies(id) on delete cascade,
  viewer_ip_hash text not null,
  viewer_user_agent text,
  device_type text check (device_type in ('desktop', 'mobile', 'tablet', 'unknown')),
  duration_seconds integer not null default 0,
  started_at timestamptz not null default now(),
  last_active_at timestamptz not null default now()
);

create index proposal_sessions_link_id_idx on proposal_sessions(link_id);
create index proposal_sessions_proposal_id_idx on proposal_sessions(proposal_id);
create index proposal_sessions_agency_id_idx on proposal_sessions(agency_id);

alter table proposal_sessions enable row level security;
create policy "Staff can view their agency's sessions" on proposal_sessions 
  for select using (agency_id = public.current_agency_id());
-- Note: Session writes (insert/update) will be handled server-side via service_role to avoid exposing public DB access.


-- 3. Proposal Events
create table proposal_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references proposal_sessions(id) on delete cascade,
  agency_id uuid not null references agencies(id) on delete cascade,
  event_type text not null,
  event_data jsonb,
  created_at timestamptz not null default now()
);

create index proposal_events_session_id_idx on proposal_events(session_id);
create index proposal_events_agency_id_idx on proposal_events(agency_id);

alter table proposal_events enable row level security;
create policy "Staff can view their agency's events" on proposal_events 
  for select using (agency_id = public.current_agency_id());
-- Note: Event writes will also be handled server-side via service_role.
