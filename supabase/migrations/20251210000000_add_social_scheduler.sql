-- Social Accounts Table
create table if not exists social_accounts (
  id uuid default gen_random_uuid() primary key,
  workspace_id uuid references workspace(id) on delete cascade not null,
  platform text not null check (platform in ('twitter', 'linkedin', 'facebook', 'instagram')),
  account_name text not null,
  account_handle text,
  access_token text, -- Encrypted in real app
  refresh_token text,
  token_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Scheduled Posts Table
create table if not exists scheduled_posts (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references task(id) on delete set null,
  social_account_id uuid references social_accounts(id) on delete cascade not null,
  content text not null,
  media_urls text[],
  scheduled_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'published', 'failed', 'canceled')),
  published_at timestamptz,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS Policies
alter table social_accounts enable row level security;
alter table scheduled_posts enable row level security;

create policy "Users can view social accounts in their workspace"
  on social_accounts for select
  using (
    exists (
      select 1 from team_member
      where team_member.user_id = auth.uid()
      and team_member.workspace_id = social_accounts.workspace_id
    )
  );

create policy "Users can manage social accounts in their workspace"
  on social_accounts for all
  using (
    exists (
      select 1 from team_member
      where team_member.user_id = auth.uid()
      and team_member.workspace_id = social_accounts.workspace_id
      and team_member.role in ('owner', 'admin')
    )
  );

create policy "Users can view scheduled posts in their workspace"
  on scheduled_posts for select
  using (
    exists (
      select 1 from social_accounts
      join team_member on team_member.workspace_id = social_accounts.workspace_id
      where social_accounts.id = scheduled_posts.social_account_id
      and team_member.user_id = auth.uid()
    )
  );

create policy "Users can manage scheduled posts in their workspace"
  on scheduled_posts for all
  using (
    exists (
      select 1 from social_accounts
      join team_member on team_member.workspace_id = social_accounts.workspace_id
      where social_accounts.id = scheduled_posts.social_account_id
      and team_member.user_id = auth.uid()
    )
  );
