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
