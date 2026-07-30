# Supabase cloud sync setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_cloud_sync.sql` in the SQL editor.
3. In Authentication > URL Configuration, add:
   - `https://hazu-sudo.github.io/gdnh/`
   - the local development URL when needed.
4. Copy `.env.example` to `.env.local`.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
6. Build and deploy the application.

Only the publishable/anon key belongs in the browser build. Never add a service-role key.
Row-level security policies restrict bookmarks, settings, attachment metadata, and private
storage objects to `auth.uid()`.
