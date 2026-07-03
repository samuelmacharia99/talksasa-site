# Coolify deployment

## The `ENOTEMPTY` / `chokidar` error

If you see:

```
ENOTEMPTY: directory not empty, rename '/app/node_modules/chokidar' -> ...
```

Coolify is running `npm install` on **container start** over a **persisted** `node_modules` folder from a previous failed or partial install.

**Fix:** use the repo `Dockerfile` so dependencies are installed at **build time**, and the running container only executes `npm start`.

---

## Recommended Coolify settings

1. **Build pack:** `Dockerfile` (not Nixpacks Node auto-detect)
2. **Start command:** leave empty (Dockerfile `CMD` handles it) — do **not** use `npm install && npm start`
3. **Persistent storage:** mount only `/app/data` for the SQLite database  
   Do **not** persist `/app/node_modules` or `/app/.next`
4. **Port:** `3000`

### Environment variables

Copy from `.env.example`, especially:

```bash
DATABASE_PATH=/app/data/talksasa.db
LEADS_ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
BILLING_API_TOKEN=...
NEXT_PUBLIC_SITE_URL=https://talksasa.com
```

---

## One-time recovery (if already broken)

In Coolify → your service → **Terminal**, or SSH to the host:

```bash
rm -rf /app/node_modules /app/.next
```

Then **Redeploy** with the Dockerfile build pack.

---

## If you must use Nixpacks

This repo includes `nixpacks.toml` which runs `rm -rf node_modules` before `npm ci`. Still prefer the Dockerfile for production.
