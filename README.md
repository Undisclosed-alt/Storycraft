# Storycraft

This repo contains the Storycraft branching gamebook editor and mobile app.

## Packages
- `editor-web` – React-based web editor built with Vite
- `mobile-app` – Expo React Native shell for reading stories
- `shared-types` – Shared TypeScript interfaces

To install dependencies run `pnpm install`.

EAS configuration (`eas.json`) lives at the repository root. When running
`eas build` in CI the working directory is `packages/mobile-app`, but the CLI
will automatically detect the root config.

Supabase migrations are located in `supabase/migrations`.

## Continuous Deployment

GitHub Actions builds the packages and can deploy previews. Mobile builds run
through **Expo EAS** while the web editor deploys to **Vercel**. Provide the
following repository secrets:

- `EXPO_TOKEN` – Expo token for `eas build`.
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` – Vercel deployment
  credentials.
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  `SUPABASE_PROJECT_ID`, `SUPABASE_STORAGE_URL` – Supabase configuration.

## Supabase Setup

Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and create a
project. After setting the `SUPABASE_PROJECT_ID` environment variable run:

```bash
./supabase/provision.sh
```

This links the project, applies migrations, and ensures a public `images`
storage bucket exists.

The repository is configured to use the demo Supabase project:

- **Project ID:** `pcfjkrdpdzwcvwupueen`
- **Anon key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZmprcmRwZHp3Y3Z3dXB1ZWVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNDYyOTgsImV4cCI6MjA2NTkyMjI5OH0.qewakeOsCilrSD18_O9pnev9RQ0K_3wN85UzzbMnMNM`
- **Service role key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZmprcmRwZHp3Y3Z3dXB1ZWVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM0NjI5OCwiZXhwIjoyMDY1OTIyMjk4fQ.bxAMafBmogAyTGKFUXWySWp2YqR7AQYzfXVoYdZCI7M`
- **Storage URL:** `https://pcfjkrdpdzwcvwupueen.supabase.co/storage/v1/object/public/images`

These values also appear in `.env.example` so local development matches the demo instance.

## Running the Editor Locally

1. Copy `.env.example` to `.env` and keep the Supabase variables or replace them with your own project credentials.
2. Install dependencies with `pnpm install`.
3. Start the development server:

```bash
pnpm --filter editor-web dev
```

The editor will be available at http://localhost:5173.

## Running the Editor on Vercel

Use `packages/editor-web` as the Vercel project root. Configure the environment
variables from `.env.example` (`VERCEL_TOKEN`, `VERCEL_ORG_ID`,
`VERCEL_PROJECT_ID`, `VITE_SUPABASE_*`) in the Vercel dashboard before
deploying.

Example commands with the Vercel CLI:

```bash
cd packages/editor-web
npx vercel dev          # local preview
npx vercel --prod       # deploy to production
```

Connecting the GitHub repository to Vercel can automate deployments.

## Contributing to Migrations

Create new SQL migration files using the Supabase CLI:

```bash
supabase migration new <name>
# edit the file under supabase/migrations
SUPABASE_PROJECT_ID=<your id> ./supabase/provision.sh
```

This links your project and applies the migrations.

## Publishing Stories

In the editor choose **Export Story**. The JSON file is uploaded to the `exports` bucket and a public URL is displayed. Use this URL in the mobile app or share it to let others read your story.

