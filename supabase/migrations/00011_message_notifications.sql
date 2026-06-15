-- Migration: 00011_message_notifications
-- Purpose: Implement isolated messaging notification system

create table if not exists message_notifications (
    id uuid primary key default uuid_generate_v4(),
    agency_id uuid not null references public.agencies(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    actor_id uuid not null references public.profiles(id) on delete cascade,
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    message_id uuid not null references public.messages(id) on delete cascade,
    type text not null check (type in ('message', 'reply', 'reaction', 'mention')),
    title text not null,
    body text not null,
    is_read boolean not null default false,
    created_at timestamptz not null default now()
);

-- Indexes for fast retrieval and realtime filtering
create index if not exists message_notifications_user_id_idx on message_notifications(user_id);
create index if not exists message_notifications_is_read_idx on message_notifications(is_read);
create index if not exists message_notifications_created_at_idx on message_notifications(created_at desc);

-- Enable RLS
alter table message_notifications enable row level security;

-- Policies

-- Users can read their own notifications
create policy message_notifications_read on message_notifications 
    for select using (
        agency_id = public.current_agency_id() and 
        user_id = auth.uid()
    );

-- Users can update their own notifications (e.g., mark as read)
create policy message_notifications_update on message_notifications 
    for update using (
        agency_id = public.current_agency_id() and 
        user_id = auth.uid()
    );

-- Users can delete their own notifications
create policy message_notifications_delete on message_notifications 
    for delete using (
        agency_id = public.current_agency_id() and 
        user_id = auth.uid()
    );

-- Users can insert notifications for others in their agency (required for server actions)
-- but they must be the actor
create policy message_notifications_insert on message_notifications 
    for insert with check (
        agency_id = public.current_agency_id() and 
        actor_id = auth.uid()
    );

-- Add to realtime publication
alter publication supabase_realtime add table message_notifications;
