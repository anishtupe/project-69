-- ============================================================
-- Influde AI — Initial Database Schema & Row Level Security
-- Migration: 20261011000000_initial_schema.sql
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ── 1. PROFILES TABLE ────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('creator', 'brand')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── 2. CREATORS TABLE ────────────────────────────────────────
create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  handle text not null default '',
  name text not null default '',
  avatar text,
  bio text,
  is_verified boolean not null default false,
  niches text[] not null default '{}',
  location text,
  languages text[] not null default '{}',
  profile_strength integer not null default 0,
  total_followers bigint not null default 0,
  avg_engagement_rate numeric(5,2) not null default 0,
  avg_reach bigint not null default 0,
  posts_per_week numeric(4,1) not null default 0,
  total_earned numeric(12,2) not null default 0,
  rate_reel numeric(10,2) not null default 0,
  rate_story numeric(10,2) not null default 0,
  rate_post numeric(10,2) not null default 0,
  rate_youtube_video numeric(10,2) not null default 0,
  rate_tiktok numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_creators_handle on public.creators(handle);
create index if not exists idx_creators_niches on public.creators using gin(niches);
create index if not exists idx_creators_total_followers on public.creators(total_followers desc);

-- ── 3. CREATOR PLATFORMS TABLE ───────────────────────────────
create table if not exists public.creator_platforms (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'youtube', 'tiktok', 'twitter', 'linkedin')),
  handle text not null default '',
  followers bigint not null default 0,
  engagement_rate numeric(5,2) not null default 0,
  avg_reach bigint not null default 0,
  connected boolean not null default false,
  created_at timestamptz not null default now(),
  unique (creator_id, platform)
);

create index if not exists idx_creator_platforms_creator on public.creator_platforms(creator_id);

-- ── 4. CREATOR AUDIENCE TABLE ────────────────────────────────
create table if not exists public.creator_audience (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade unique,
  age_ranges jsonb not null default '[]'::jsonb,
  gender_split jsonb not null default '{"male": 0, "female": 0, "other": 0}'::jsonb,
  top_cities jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── 5. CREATOR POSTS TABLE ───────────────────────────────────
create table if not exists public.creator_posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'youtube', 'tiktok', 'twitter', 'linkedin')),
  thumbnail text,
  post_type text,
  likes integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0,
  saves integer not null default 0,
  reach bigint not null default 0,
  engagement_rate numeric(5,2) not null default 0,
  posted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_creator_posts_creator on public.creator_posts(creator_id);

-- ── 6. CREATOR PAST CAMPAIGNS TABLE ──────────────────────────
create table if not exists public.creator_past_campaigns (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.creators(id) on delete cascade,
  brand_name text not null,
  brand_logo text,
  campaign_name text not null,
  deliverables text,
  completed_at timestamptz,
  rating numeric(3,2),
  created_at timestamptz not null default now()
);

create index if not exists idx_creator_past_campaigns_creator on public.creator_past_campaigns(creator_id);

-- ── 7. BRANDS TABLE ──────────────────────────────────────────
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade unique,
  name text not null default '',
  logo text,
  industry text,
  website text,
  description text,
  total_campaigns integer not null default 0,
  total_spend numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_brands_user on public.brands(user_id);

-- ── 8. CAMPAIGNS TABLE ───────────────────────────────────────
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  name text not null,
  objective text check (objective in ('awareness', 'conversions', 'ugc', 'event')),
  status text not null default 'draft' check (status in ('draft', 'active', 'review', 'completed', 'cancelled')),
  platforms text[] not null default '{}',
  niches text[] not null default '{}',
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  target_age_min integer,
  target_age_max integer,
  target_gender text not null default 'all',
  target_locations text[] not null default '{}',
  target_languages text[] not null default '{}',
  start_date timestamptz,
  end_date timestamptz,
  brief text,
  dos text[] not null default '{}',
  donts text[] not null default '{}',
  applicant_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_campaigns_brand on public.campaigns(brand_id);
create index if not exists idx_campaigns_status on public.campaigns(status);
create index if not exists idx_campaigns_niches on public.campaigns using gin(niches);
create index if not exists idx_campaigns_platforms on public.campaigns using gin(platforms);

-- ── 9. CAMPAIGN DELIVERABLES TABLE ───────────────────────────
create table if not exists public.campaign_deliverables (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  type text not null check (type in ('reel', 'story', 'post', 'youtube_video', 'tiktok', 'tweet')),
  quantity integer not null default 1,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_campaign_deliverables_campaign on public.campaign_deliverables(campaign_id);

-- ── 10. APPLICATIONS TABLE ───────────────────────────────────
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  pitch text,
  proposed_rate numeric(10,2),
  portfolio_links text[] not null default '{}',
  status text not null default 'applied' check (status in ('applied', 'shortlisted', 'negotiating', 'hired', 'rejected')),
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, creator_id)
);

create index if not exists idx_applications_campaign on public.applications(campaign_id);
create index if not exists idx_applications_creator on public.applications(creator_id);

-- ── 11. SAVED CREATORS TABLE ─────────────────────────────────
create table if not exists public.saved_creators (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (brand_id, creator_id)
);

create index if not exists idx_saved_creators_brand on public.saved_creators(brand_id);

-- ── 12. CONVERSATIONS TABLE ──────────────────────────────────
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  creator_id uuid not null references public.creators(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  last_message text,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_conversations_brand on public.conversations(brand_id);
create index if not exists idx_conversations_creator on public.conversations(creator_id);

-- ── 13. MESSAGES TABLE ───────────────────────────────────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null check (sender_role in ('creator', 'brand')),
  content text not null,
  read boolean not null default false,
  sent_at timestamptz not null default now()
);

create index if not exists idx_messages_conversation on public.messages(conversation_id);
create index if not exists idx_messages_sent_at on public.messages(sent_at asc);

-- ============================================================
-- ATOMIC AUTH SIGNUP TRIGGER (Profiles + Role Row Creation)
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  user_role text;
begin
  -- Extract role from metadata, defaulting to 'creator'
  user_role := coalesce(new.raw_user_meta_data->>'role', 'creator');
  if user_role not in ('creator', 'brand') then
    user_role := 'creator';
  end if;

  -- 1. Insert Profile
  insert into public.profiles (id, email, role)
  values (new.id, coalesce(new.email, ''), user_role)
  on conflict (id) do update set email = excluded.email, role = excluded.role;

  -- 2. Insert corresponding role placeholder record
  if user_role = 'creator' then
    insert into public.creators (user_id, name, handle)
    values (new.id, '', '')
    on conflict (user_id) do nothing;

    -- Ensure audience container exists
    insert into public.creator_audience (creator_id)
    select id from public.creators where user_id = new.id
    on conflict (creator_id) do nothing;
  elsif user_role = 'brand' then
    insert into public.brands (user_id, name)
    values (new.id, '')
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

-- Trigger on auth.users after insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger to update campaign applicant_count automatically
create or replace function public.update_campaign_applicant_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if (TG_OP = 'INSERT') then
    update public.campaigns
    set applicant_count = applicant_count + 1
    where id = new.campaign_id;
  elsif (TG_OP = 'DELETE') then
    update public.campaigns
    set applicant_count = greatest(0, applicant_count - 1)
    where id = old.campaign_id;
  end if;
  return null;
end;
$$;

drop trigger if exists on_application_count_change on public.applications;
create trigger on_application_count_change
  after insert or delete on public.applications
  for each row execute procedure public.update_campaign_applicant_count();

-- Trigger to update conversation last_message
create or replace function public.handle_new_message()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.conversations
  set last_message = new.content,
      last_message_at = new.sent_at
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists on_new_message on public.messages;
create trigger on_new_message
  after insert on public.messages
  for each row execute procedure public.handle_new_message();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

alter table public.profiles enable row level security;
alter table public.creators enable row level security;
alter table public.creator_platforms enable row level security;
alter table public.creator_audience enable row level security;
alter table public.creator_posts enable row level security;
alter table public.creator_past_campaigns enable row level security;
alter table public.brands enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_deliverables enable row level security;
alter table public.applications enable row level security;
alter table public.saved_creators enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- ── Profiles Policies ────────────────────────────────────────
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- ── Creators Policies ────────────────────────────────────────
create policy "Creators are viewable by authenticated users"
  on public.creators for select
  to authenticated
  using (true);

create policy "Creators can update their own profile"
  on public.creators for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Creators can insert their own profile"
  on public.creators for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ── Creator Sub-tables Policies ──────────────────────────────
create policy "Creator platforms are viewable by authenticated users"
  on public.creator_platforms for select
  to authenticated
  using (true);

create policy "Creators can manage their platforms"
  on public.creator_platforms for all
  to authenticated
  using (creator_id in (select id from public.creators where user_id = auth.uid()));

create policy "Creator audience is viewable by authenticated users"
  on public.creator_audience for select
  to authenticated
  using (true);

create policy "Creators can manage their audience"
  on public.creator_audience for all
  to authenticated
  using (creator_id in (select id from public.creators where user_id = auth.uid()));

create policy "Creator posts are viewable by authenticated users"
  on public.creator_posts for select
  to authenticated
  using (true);

create policy "Creators can manage their posts"
  on public.creator_posts for all
  to authenticated
  using (creator_id in (select id from public.creators where user_id = auth.uid()));

create policy "Creator past campaigns are viewable by authenticated users"
  on public.creator_past_campaigns for select
  to authenticated
  using (true);

create policy "Creators can manage past campaigns"
  on public.creator_past_campaigns for all
  to authenticated
  using (creator_id in (select id from public.creators where user_id = auth.uid()));

-- ── Brands Policies ──────────────────────────────────────────
create policy "Brands are viewable by authenticated users"
  on public.brands for select
  to authenticated
  using (true);

create policy "Brands can update their own profile"
  on public.brands for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Brands can insert their own profile"
  on public.brands for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ── Campaigns Policies ───────────────────────────────────────
create policy "Active campaigns are viewable by authenticated users"
  on public.campaigns for select
  to authenticated
  using (
    status != 'draft'
    or brand_id in (select id from public.brands where user_id = auth.uid())
  );

create policy "Brands can insert their own campaigns"
  on public.campaigns for insert
  to authenticated
  with check (brand_id in (select id from public.brands where user_id = auth.uid()));

create policy "Brands can update their own campaigns"
  on public.campaigns for update
  to authenticated
  using (brand_id in (select id from public.brands where user_id = auth.uid()));

create policy "Brands can delete their own campaigns"
  on public.campaigns for delete
  to authenticated
  using (brand_id in (select id from public.brands where user_id = auth.uid()));

-- ── Campaign Deliverables Policies ───────────────────────────
create policy "Campaign deliverables viewable with campaign"
  on public.campaign_deliverables for select
  to authenticated
  using (
    campaign_id in (
      select id from public.campaigns
      where status != 'draft'
      or brand_id in (select id from public.brands where user_id = auth.uid())
    )
  );

create policy "Brands can manage campaign deliverables"
  on public.campaign_deliverables for all
  to authenticated
  using (
    campaign_id in (
      select c.id from public.campaigns c
      join public.brands b on c.brand_id = b.id
      where b.user_id = auth.uid()
    )
  );

-- ── Applications Policies ────────────────────────────────────
create policy "Creators and Brands can view relevant applications"
  on public.applications for select
  to authenticated
  using (
    creator_id in (select id from public.creators where user_id = auth.uid())
    or campaign_id in (
      select c.id from public.campaigns c
      join public.brands b on c.brand_id = b.id
      where b.user_id = auth.uid()
    )
  );

create policy "Creators can apply to campaigns"
  on public.applications for insert
  to authenticated
  with check (creator_id in (select id from public.creators where user_id = auth.uid()));

create policy "Creators can update their pending application"
  on public.applications for update
  to authenticated
  using (
    creator_id in (select id from public.creators where user_id = auth.uid())
    and status = 'applied'
  );

create policy "Brands can update application status"
  on public.applications for update
  to authenticated
  using (
    campaign_id in (
      select c.id from public.campaigns c
      join public.brands b on c.brand_id = b.id
      where b.user_id = auth.uid()
    )
  );

-- ── Saved Creators Policies ──────────────────────────────────
create policy "Brands can manage saved creators"
  on public.saved_creators for all
  to authenticated
  using (brand_id in (select id from public.brands where user_id = auth.uid()));

-- ── Conversations Policies ───────────────────────────────────
create policy "Participants can view their conversations"
  on public.conversations for select
  to authenticated
  using (
    brand_id in (select id from public.brands where user_id = auth.uid())
    or creator_id in (select id from public.creators where user_id = auth.uid())
  );

create policy "Participants can create conversations"
  on public.conversations for insert
  to authenticated
  with check (
    brand_id in (select id from public.brands where user_id = auth.uid())
    or creator_id in (select id from public.creators where user_id = auth.uid())
  );

-- ── Messages Policies ────────────────────────────────────────
create policy "Participants can view messages"
  on public.messages for select
  to authenticated
  using (
    conversation_id in (
      select id from public.conversations
      where brand_id in (select id from public.brands where user_id = auth.uid())
      or creator_id in (select id from public.creators where user_id = auth.uid())
    )
  );

create policy "Participants can send messages"
  on public.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and conversation_id in (
      select id from public.conversations
      where brand_id in (select id from public.brands where user_id = auth.uid())
      or creator_id in (select id from public.creators where user_id = auth.uid())
    )
  );

create policy "Participants can mark messages as read"
  on public.messages for update
  to authenticated
  using (
    conversation_id in (
      select id from public.conversations
      where brand_id in (select id from public.brands where user_id = auth.uid())
      or creator_id in (select id from public.creators where user_id = auth.uid())
    )
  );

-- ============================================================
-- STORAGE & REALTIME SETUP
-- ============================================================

-- Realtime Setup
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
alter table public.messages replica identity full;
alter table public.conversations replica identity full;

-- Storage Bucket for Avatars & Attachments
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Public avatar bucket access"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

create policy "Users can update their own avatars"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);
