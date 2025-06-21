-- Enable row level security and policies
alter table stories enable row level security;
alter table nodes enable row level security;
alter table actions enable row level security;
alter table revisions enable row level security;

drop policy if exists "Users can read" on stories;
create policy "Users can read" on stories
  for select using (auth.uid() = user_id);
