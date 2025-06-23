-- Add image_url column to nodes table
alter table nodes add column if not exists image_url text;
