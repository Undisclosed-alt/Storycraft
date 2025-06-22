#!/bin/bash
set -euo pipefail

# This script provisions a Supabase project and applies migrations.
# Requires the Supabase CLI to be installed and authenticated.

if [ -z "${SUPABASE_PROJECT_ID:-}" ]; then
  echo "SUPABASE_PROJECT_ID environment variable is required" >&2
  exit 1
fi

# Link to the project
supabase link --project-ref "$SUPABASE_PROJECT_ID"

# Apply migrations
supabase db push

# Create storage bucket for images
supabase storage buckets create images --public || true

echo "Supabase provisioning complete"
