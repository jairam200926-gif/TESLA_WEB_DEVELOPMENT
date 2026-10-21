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

The `/admin` route uses Supabase Auth passkeys for face/device unlock. In the Supabase dashboard, enable passkeys under **Authentication → Passkeys** and configure the relying-party ID and allowed HTTPS origin to match the deployed site. Under **Authentication → URL Configuration**, allow the deployed `/admin` URL as a redirect. Create the admin user under **Authentication → Users** and disable public sign-ups. On first setup, sign in to that existing account with the emailed link and register a passkey; subsequent admin access uses the passkey prompt (Face ID, Windows Hello, Touch ID, or another device authenticator). The **Lock** button signs out.

Passkeys prove identity to Supabase, but the current portfolio dashboard stores its editable portfolio data in browser local storage. Protecting shared/private admin data also requires storing it in Supabase and enforcing admin-only Row Level Security policies.

## Deployment

The project includes `render.yaml` for a Render Static Site deployment. It builds the Vite application into `dist` and uses a rewrite rule for client-side routes.
