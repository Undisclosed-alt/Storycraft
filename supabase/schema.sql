-- SQL schema for Storycraft
create table if not exists users (
  id uuid primary key,
  email text not null
);

create table if not exists stories (
  id uuid primary key,
  user_id uuid references users(id),
  title text not null
);

create table if not exists nodes (
  id uuid primary key,
  story_id uuid references stories(id),
  text text,
  image_url text
);

create table if not exists actions (
  id uuid primary key,
  node_id uuid references nodes(id),
  label text,
  target_id uuid
);

create table if not exists revisions (
  id uuid primary key,
  story_id uuid references stories(id),
  created_at timestamp default now(),
  data jsonb
);

-- Enable row level security
alter table stories enable row level security;
alter table nodes enable row level security;
alter table actions enable row level security;
alter table revisions enable row level security;

-- Example policy
drop policy if exists "Users can read" on stories;
create policy "Users can read" on stories
  for select using (auth.uid() = user_id);
