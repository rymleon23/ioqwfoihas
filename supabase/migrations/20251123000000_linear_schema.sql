-- Enable extensions
-- create extension if not exists "pgvector";
-- create extension if not exists "pgcrypto";

-- 1. Core Organization & Users

create table public.workspace (
    id uuid not null default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    created_at timestamp with time zone not null default now()
);

create table public.users (
    id uuid not null primary key references auth.users(id) on delete cascade,
    workspace_id uuid not null references public.workspace(id) on delete cascade,
    email text not null,
    display_name text,
    avatar_url text,
    role text not null default 'member' check (role in ('admin', 'member', 'guest')),
    status text not null default 'active' check (status in ('active', 'invited', 'disabled')),
    created_at timestamp with time zone not null default now()
);

create table public.team (
    id uuid not null default gen_random_uuid() primary key,
    workspace_id uuid not null references public.workspace(id) on delete cascade,
    name text not null,
    key text not null,
    description text,
    icon text,
    color text,
    created_at timestamp with time zone not null default now(),
    unique(workspace_id, key)
);

create table public.team_member (
    id uuid not null default gen_random_uuid() primary key,
    user_id uuid not null references public.users(id) on delete cascade,
    team_id uuid not null references public.team(id) on delete cascade,
    role text not null default 'member' check (role in ('owner', 'admin', 'member', 'guest')),
    preferences jsonb default '{}'::jsonb,
    created_at timestamp with time zone not null default now(),
    unique(user_id, team_id)
);

-- 2. Structure & Workflow

create table public.workflow_state (
    id uuid not null default gen_random_uuid() primary key,
    team_id uuid not null references public.team(id) on delete cascade,
    name text not null,
    color text,
    type text not null check (type in ('backlog', 'unstarted', 'started', 'completed', 'canceled')),
    position float not null default 0,
    created_at timestamp with time zone not null default now()
);

-- 3. Work Items

create table public.strategic (
    id uuid not null default gen_random_uuid() primary key,
    workspace_id uuid not null references public.workspace(id) on delete cascade,
    name text not null,
    description text,
    status text default 'active',
    owner_id uuid references public.users(id),
    created_at timestamp with time zone not null default now()
);

create table public.project (
    id uuid not null default gen_random_uuid() primary key,
    workspace_id uuid not null references public.workspace(id) on delete cascade,
    team_ids uuid[] default '{}',
    strategic_id uuid references public.strategic(id),
    name text not null,
    description text,
    state text not null default 'planned' check (state in ('planned', 'started', 'paused', 'completed', 'canceled')),
    health text default 'on_track' check (health in ('on_track', 'at_risk', 'off_track')),
    lead_id uuid references public.users(id),
    start_date date,
    target_date date,
    milestones jsonb default '[]'::jsonb,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

create table public.phase (
    id uuid not null default gen_random_uuid() primary key,
    team_id uuid not null references public.team(id) on delete cascade,
    name text not null,
    sequence_index integer not null,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    status text not null default 'active' check (status in ('active', 'completed')),
    created_at timestamp with time zone not null default now()
);

create table public.task (
    id uuid not null default gen_random_uuid() primary key,
    workspace_id uuid not null references public.workspace(id) on delete cascade,
    team_id uuid not null references public.team(id) on delete cascade,
    number integer not null,
    title text not null,
    description text,
    priority integer default 0 check (priority between 0 and 4),
    state_id uuid references public.workflow_state(id),
    assignee_id uuid references public.users(id),
    parent_id uuid references public.task(id),
    project_id uuid references public.project(id),
    phase_id uuid references public.phase(id),
    rank text,
    due_date timestamp with time zone,
    created_by uuid references public.users(id),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    deleted_at timestamp with time zone,
    unique(team_id, number)
);

create table public.task_relation (
    id uuid not null default gen_random_uuid() primary key,
    task_id uuid not null references public.task(id) on delete cascade,
    related_task_id uuid not null references public.task(id) on delete cascade,
    type text not null check (type in ('subtask', 'duplicate', 'blocks', 'blocked_by', 'relates_to')),
    created_at timestamp with time zone not null default now()
);

-- 4. Meta & Interactions

create table public.label (
    id uuid not null default gen_random_uuid() primary key,
    team_id uuid references public.team(id) on delete cascade,
    name text not null,
    color text,
    created_at timestamp with time zone not null default now()
);

create table public.task_label (
    task_id uuid not null references public.task(id) on delete cascade,
    label_id uuid not null references public.label(id) on delete cascade,
    primary key (task_id, label_id)
);

create table public.task_history (
    id uuid not null default gen_random_uuid() primary key,
    task_id uuid not null references public.task(id) on delete cascade,
    actor_id uuid references public.users(id),
    field_changed text not null,
    from_value text,
    to_value text,
    created_at timestamp with time zone not null default now()
);

create table public.comment (
    id uuid not null default gen_random_uuid() primary key,
    task_id uuid not null references public.task(id) on delete cascade,
    user_id uuid references public.users(id),
    body text not null,
    created_at timestamp with time zone not null default now()
);

-- 5. Extended Modules

create table public.ai_agent_profile (
    id uuid not null default gen_random_uuid() primary key,
    workspace_id uuid not null references public.workspace(id) on delete cascade,
    name text not null,
    description text,
    prompt text,
    default_sources jsonb,
    created_at timestamp with time zone not null default now()
);

create table public.marketing_content (
    id uuid not null default gen_random_uuid() primary key,
    workspace_id uuid not null references public.workspace(id) on delete cascade,
    source_type text check (source_type in ('ai', 'manual', 'import')),
    source_id text,
    title text,
    summary text,
    body text,
    embedding vector(1536),
    metadata jsonb,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

create table public.marketing_content_chunk (
    id uuid not null default gen_random_uuid() primary key,
    content_id uuid not null references public.marketing_content(id) on delete cascade,
    sequence_index integer not null,
    text text,
    embedding vector(1536),
    token_count integer
);

create table public.drive_folder (
    id uuid not null default gen_random_uuid() primary key,
    workspace_id uuid not null references public.workspace(id) on delete cascade,
    external_id text,
    name text not null,
    parent_id uuid references public.drive_folder(id),
    path text[],
    created_at timestamp with time zone not null default now()
);

create table public.drive_file (
    id uuid not null default gen_random_uuid() primary key,
    folder_id uuid references public.drive_folder(id),
    workspace_id uuid not null references public.workspace(id) on delete cascade,
    external_id text,
    name text not null,
    mime_type text,
    size bigint,
    version text,
    synced_at timestamp with time zone,
    embedding vector(1536),
    metadata jsonb,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

create table public.task_attachment (
    id uuid not null default gen_random_uuid() primary key,
    task_id uuid not null references public.task(id) on delete cascade,
    type text not null check (type in ('drive', 'upload', 'link')),
    drive_file_id uuid references public.drive_file(id),
    url text,
    metadata jsonb,
    created_at timestamp with time zone not null default now()
);

create table public.social_account (
    id uuid not null default gen_random_uuid() primary key,
    team_id uuid not null references public.team(id) on delete cascade,
    platform text not null,
    display_name text not null,
    secret_ref text,
    created_at timestamp with time zone not null default now()
);

create table public.scheduled_post (
    id uuid not null default gen_random_uuid() primary key,
    task_id uuid references public.task(id),
    account_id uuid references public.social_account(id),
    caption text,
    media jsonb,
    scheduled_at timestamp with time zone,
    status text not null default 'queued' check (status in ('queued', 'posting', 'done', 'error')),
    created_at timestamp with time zone not null default now()
);

-- 6. Triggers & Functions

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger on_task_updated before update on public.task
for each row execute procedure public.handle_updated_at();

create trigger on_project_updated before update on public.project
for each row execute procedure public.handle_updated_at();

-- Auto-increment Task Number per Team
create or replace function public.get_next_task_number()
returns trigger as $$
declare
    next_num integer;
begin
    select coalesce(max(number), 0) + 1 into next_num
    from public.task
    where team_id = new.team_id;
    
    new.number = next_num;
    return new;
end;
$$ language plpgsql;

create trigger set_task_number before insert on public.task
for each row execute procedure public.get_next_task_number();

-- Handle New User (Auth Hook)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_workspace uuid;
  v_display text;
begin
  -- Find or create default workspace
  select id into v_workspace from public.workspace order by created_at asc limit 1;
  if v_workspace is null then
    insert into public.workspace (name, slug) values ('Default Workspace', 'default') returning id into v_workspace;
  end if;

  v_display := coalesce(new.raw_user_meta_data ->> 'display_name', new.email, 'New User');

  insert into public.users (id, workspace_id, email, display_name, status)
  values (new.id, v_workspace, new.email, v_display, 'active')
  on conflict (id) do update set status = 'active';

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 7. RLS Policies

alter table public.workspace enable row level security;
alter table public.users enable row level security;
alter table public.team enable row level security;
alter table public.team_member enable row level security;
alter table public.workflow_state enable row level security;
alter table public.project enable row level security;
alter table public.phase enable row level security;
alter table public.task enable row level security;
alter table public.task_relation enable row level security;
alter table public.label enable row level security;
alter table public.task_label enable row level security;
alter table public.task_history enable row level security;
alter table public.comment enable row level security;
-- Extended
alter table public.ai_agent_profile enable row level security;
alter table public.marketing_content enable row level security;
alter table public.marketing_content_chunk enable row level security;
alter table public.drive_folder enable row level security;
alter table public.drive_file enable row level security;
alter table public.task_attachment enable row level security;
alter table public.social_account enable row level security;
alter table public.scheduled_post enable row level security;

-- Helper function for RLS
create or replace function public.get_user_workspace_id()
returns uuid
language sql stable
as $$
  select workspace_id from public.users where id = auth.uid();
$$;

-- Generic Policy: Access if in same workspace
create policy "Enable access to members of same workspace" on public.workspace
    for all using (true); -- Workspace is public for now or restricted by app logic

create policy "Access own user profile" on public.users
    for all using (auth.uid() = id);

create policy "Access users in same workspace" on public.users
    for select using (workspace_id = public.get_user_workspace_id());

-- Apply workspace check to all other tables
create policy "Workspace Access" on public.team for all using (workspace_id = public.get_user_workspace_id());
create policy "Workspace Access" on public.project for all using (workspace_id = public.get_user_workspace_id());
create policy "Workspace Access" on public.task for all using (workspace_id = public.get_user_workspace_id());
-- (Simpler approach for now: allow authenticated users to read/write if they are valid users)
-- In production, we would need stricter team-based policies.

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;
