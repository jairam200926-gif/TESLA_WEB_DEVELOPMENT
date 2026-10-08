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

## Deployment

The project includes `render.yaml` for a Render Static Site deployment. It builds the Vite application into `dist` and uses a rewrite rule for client-side routes.
