-- Add image_url column
alter table nodes add column if not exists image_url text;

-- Function to snapshot all nodes nightly into revisions table
create or replace function snapshot_revisions() returns void language plpgsql as $$
begin
  insert into revisions(id, story_id, data)
  select gen_random_uuid(), story_id,
    jsonb_build_object(
      'nodes', jsonb_agg(jsonb_build_object('id', id, 'text', text, 'image', coalesce(image_url, '')))
    )
  from nodes
  group by story_id;
end;
$$;

-- Schedule nightly at midnight
select cron.schedule('nightly_snapshot', '0 0 * * *', $$call snapshot_revisions()$$);
