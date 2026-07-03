# Coolify deployment — TalkSasa

## You are here because the container keeps restarting

Logs like `ENOTEMPTY ... chokidar` mean Coolify runs **`npm install` on every container start** over a broken `node_modules` folder. The container crashes, restarts, runs `npm install` again — infinite loop.

**Do not run `npm install` in the terminal while the service is running.** Stop the service first (see below).

---

## Fix (15 minutes) — follow in order

### Step 1 — Stop the service

Coolify → your app → **Stop** (top right).

Wait until status is **stopped** (not "restarting").

### Step 2 — Remove bad persistent storage

Coolify → **Configuration** → **Persistent Storage** (or **Storages**).

Delete any volume mounted to:

- `/app`
- `/app/node_modules`
- `/app/.next`

Keep **only** this mount (add it if missing):

| Path in container | Purpose |
|-------------------|---------|
| `/app/data` | SQLite leads database |

### Step 3 — Switch to Dockerfile build

Coolify → **Configuration** → **Build**:

| Setting | Value |
|---------|--------|
| **Build Pack** | `Dockerfile` |
| **Dockerfile location** | `/Dockerfile` |
| **Install Command** | *(leave empty)* |
| **Build Command** | *(leave empty)* |
| **Base Directory** | `/` |

### Step 4 — Fix start command

Coolify → **Configuration** → **General** (or **Start**):

| Setting | Value |
|---------|--------|
| **Start Command** | *(leave empty)* |

If Coolify requires a value, use exactly:

```bash
npm start
```

**Never use:** `npm install`, `npm install && npm start`, or `npm ci && npm start` at runtime.

### Step 5 — Port

**Ports Exposes:** `3000`

### Step 6 — Environment variables

```bash
NODE_ENV=production
DATABASE_PATH=/app/data/talksasa.db
NEXT_PUBLIC_SITE_URL=https://talksasa.com
BILLING_API_BASE_URL=https://servers.talksasa.com/api/v1/public
BILLING_API_TOKEN=your_token
LEADS_ADMIN_PASSWORD=your_strong_password
ADMIN_SESSION_SECRET=random-32-char-string
IP_HASH_SALT=random-string
```

Add analytics vars from `.env.example` if needed.

### Step 7 — Deploy

Click **Deploy**. The image builds `node_modules` + `.next` **inside the image**, not on your volume.

---

## If you cannot use Dockerfile (Nixpacks fallback)

Coolify → **Build Pack:** `Nixpacks`

| Setting | Value |
|---------|--------|
| **Install Command** | `sh scripts/coolify-build.sh` |
| **Build Command** | *(empty — install script already builds)* |
| **Start Command** | `sh scripts/coolify-start.sh` |

Still remove persistent storage on `/app/node_modules` (Step 2).

---

## Manual recovery (service stopped)

Only when the service is **stopped**:

```bash
cd /app
rm -rf node_modules .next
npm ci
npm run build
npm start
```

If `npm ci` is killed with **exit 137**, the server ran out of RAM. Use the **Dockerfile** build pack (build runs with more memory) or add swap on the host.

---

## Verify success

After deploy, logs should show:

```
▲ Next.js 14.x
- Local: http://0.0.0.0:3000
✓ Ready
```

**Not** `npm install` or `ENOTEMPTY`.

Test: `https://your-domain.com` and `https://your-domain.com/admin/leads`

---

## Checklist

- [ ] Service **stopped** before changing storage
- [ ] No volume on `/app/node_modules`
- [ ] Build pack = **Dockerfile**
- [ ] Start command empty or `npm start` only
- [ ] Volume only on `/app/data`
- [ ] Redeployed after git push includes `Dockerfile`
