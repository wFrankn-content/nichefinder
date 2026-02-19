-- NicheScout — Supabase Schema
-- Run this in your Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/<your-project>/sql/new

-- ============================================================
-- SEARCHES
-- ============================================================
create table if not exists searches (
  id          uuid primary key default gen_random_uuid(),
  keyword     text not null,
  created_at  timestamptz not null default now()
);

-- Index for history queries sorted by date
create index if not exists searches_created_at_idx on searches (created_at desc);

-- ============================================================
-- VIDEOS
-- ============================================================
create table if not exists videos (
  id            uuid primary key default gen_random_uuid(),
  search_id     uuid not null references searches(id) on delete cascade,
  youtube_id    text not null,
  title         text not null,
  view_count    bigint not null default 0,
  like_count    bigint not null default 0,
  comment_count bigint not null default 0,
  tags          text[] not null default '{}',
  channel_name  text not null,
  published_at  timestamptz not null,
  duration      text,
  thumbnail_url text,
  created_at    timestamptz not null default now()
);

-- Index for fetching videos by search
create index if not exists videos_search_id_idx on videos (search_id);
-- Prevent duplicate videos within the same search
create unique index if not exists videos_search_youtube_unique on videos (search_id, youtube_id);

-- ============================================================
-- GENERATED PROMPTS
-- ============================================================
create table if not exists generated_prompts (
  id          uuid primary key default gen_random_uuid(),
  search_id   uuid not null references searches(id) on delete cascade,
  prompt_text text not null,
  created_at  timestamptz not null default now()
);

create index if not exists generated_prompts_search_id_idx on generated_prompts (search_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- Disable RLS for now (single-user app). Enable if you add auth.
-- ============================================================
alter table searches disable row level security;
alter table videos disable row level security;
alter table generated_prompts disable row level security;
