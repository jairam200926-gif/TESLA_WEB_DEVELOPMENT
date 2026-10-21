# Jai RG — Portfolio

Personal React and Vite portfolio for Jai RG.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Environment variables

Create a local `.env` file from `.env.example` and provide the public Supabase configuration:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The `.env` file is ignored by Git.

The `/admin` route uses Supabase email/password authentication. In **Authentication → Users**, create the administrator account with a password; keep public sign-ups disabled so only accounts you add can access the dashboard. Enable email/password sign-in in the Supabase authentication providers. Sign in at `/admin` with that account; the **Lock** button signs out, and refreshing the page automatically signs out the current browser session.

The current portfolio dashboard stores editable portfolio content and inquiries in browser local storage. Supabase sign-in protects the admin route, but shared/private data must be stored in Supabase and protected with admin-only Row Level Security policies.

The admin dashboard reads project requests from `public.project_inquiries`. In Supabase SQL Editor, grant authenticated users select access only for the admin email (replace the address with the email used for the admin account), and ensure there is no broader public `SELECT` policy:

```sql
grant select on public.project_inquiries to authenticated;

create policy "Admin can read project inquiries"
  on public.project_inquiries
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'your-admin-email@example.com');
```

The project inquiry form can continue using its separate public `INSERT` policy; do not allow public `SELECT` access to client inquiries.

## Deployment

The project includes `render.yaml` for a Render Static Site deployment. It builds the Vite application into `dist` and uses a rewrite rule for client-side routes.
