# TalkSasa – Deployment Guide (DirectAdmin + CloudLinux)

This guide helps you deploy the TalkSasa Next.js application on a **DirectAdmin** server running **CloudLinux**.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Build the Application](#build-the-application)
3. [Deployment Options](#deployment-options)
4. [Option A: Node.js + PM2 + Reverse Proxy (Recommended)](#option-a-nodejs--pm2--reverse-proxy-recommended)
5. [Option B: Static Export (if applicable)](#option-b-static-export-if-applicable)
6. [Environment Variables](#environment-variables)
7. [SSL / HTTPS](#ssl--https)
8. [DirectAdmin Setup](#directadmin-setup)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js**: 18.x or 20.x (required for Next.js 14). CloudLinux often has Node via **Softaculous** or **CLN (CloudLinux Node.js)**.
- **npm**: Comes with Node.js.
- **PM2** (optional but recommended): For keeping the Node app running.
- **DirectAdmin** access: SSH or terminal access to your account.

### Check Node.js version

```bash
node -v   # Should be v18.x or v20.x
npm -v
```

If Node.js is not installed, use **DirectAdmin → Extra Features → Setup Node.js** (if available) or install via CloudLinux Node.js selector / your host’s instructions.

---

## Build the Application

On your **local machine** or a **build server**:

```bash
# Clone or upload the project, then:
cd /path/to/new-talksasa

# Install dependencies
npm ci

# Set production env vars (see Environment Variables below)
# Then build
npm run build
```

Or build **on the server** after uploading the project (e.g. via Git or SFTP):

```bash
cd ~/domains/yourdomain.com/private/new-talksasa   # or your actual path
npm ci
npm run build
```

Build output is in the `.next` folder. You need the **entire project** on the server (including `node_modules`, `.next`, `package.json`, `app/`, `components/`, `public/`, etc.), not only the `.next` folder.

---

## Deployment Options

| Method | Best for | Notes |
|--------|----------|--------|
| **Node + PM2 + reverse proxy** | Full Next.js (SSR, API routes, dynamic) | Recommended; app runs as Node process. |
| **Static export** | Fully static site | Only if you convert the app to static export (no API routes, no SSR). |

This app uses **API routes** (`/api/contact`) and **dynamic features**, so **Option A** is the right approach.

---

## Option A: Node.js + PM2 + Reverse Proxy (Recommended)

### 1. Upload or clone the project

- Upload the built project (including `node_modules`, `.next`, `public`, `package.json`, etc.) to your DirectAdmin user directory, e.g.  
  `~/domains/yourdomain.com/private/talksasa/`  
  or use **Git**:

```bash
cd ~/domains/yourdomain.com/private
git clone <your-repo-url> talksasa
cd talksasa
npm ci
npm run build
```

### 2. Install PM2 (if not installed)

```bash
npm install -g pm2
# or
sudo npm install -g pm2
```

### 3. Start the app with PM2

```bash
cd ~/domains/yourdomain.com/private/talksasa   # your actual path
pm2 start npm --name "talksasa" -- start
pm2 save
pm2 startup   # follow the command it prints to enable startup on boot
```

Or use an **ecosystem file** `ecosystem.config.cjs` in the project root:

```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'talksasa',
      cwd: '/home/youruser/domains/yourdomain.com/private/talksasa',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: { NODE_ENV: 'production' },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};
```

Then:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 4. Reverse proxy in DirectAdmin (Apache or Nginx)

Your Next.js app will listen on **port 3000** by default. DirectAdmin usually uses **Apache** (with mod_proxy) or **Nginx**. You must proxy requests from the main domain to `http://127.0.0.1:3000`.

#### If DirectAdmin uses Apache

- **Custom HTTPD config** (e.g. in DirectAdmin: **Custom HTTPD configuration** for the domain):

```apache
# Enable proxy (if not already in main config)
ProxyPreserveHost On
ProxyPass / http://127.0.0.1:3000/
ProxyPassReverse / http://127.0.0.1:3000/
```

- If you use **Let’s Encrypt**, put the above inside the **VirtualHost** that has `SSLEngine on` as well, so HTTPS is proxied to Node.

#### If DirectAdmin uses Nginx

- In **Custom Nginx configuration** for the domain:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

Apply or restart the web server from DirectAdmin (or `systemctl restart httpd` / `nginx`).

### 5. Port and firewall

- Ensure nothing else uses port **3000**, or change the port when starting Next.js, e.g.  
  `PORT=3001 npm start`  
  and proxy to `127.0.0.1:3001` in Apache/Nginx.
- If you use a firewall, you usually **do not** need to open 3000 to the internet; only the web server (80/443) needs to reach localhost.

---

## Option B: Static Export (if applicable)

This project uses **API routes** and **dynamic behavior**, so a full static export is not possible without removing or replacing those features. If you later create a static-only version:

```bash
# In next.config.mjs add: output: 'export'
npm run build
# Upload the contents of the 'out' folder to public_html via DirectAdmin File Manager or FTP.
```

For the **current** TalkSasa app, use **Option A**.

---

## Environment Variables

Create a `.env.production` (or set vars in the shell / PM2 ecosystem file) on the **server**:

```bash
# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXX

# Optional: Contact form (FormSpree fallback)
NEXT_PUBLIC_FORMSPREE_ID=your_formspree_id
```

- Do **not** commit `.env.production` with secrets to the repo.
- Restart the app after changing env vars:  
  `pm2 restart talksasa`

---

## SSL / HTTPS

1. In **DirectAdmin**: **SSL Certificates** → request or assign a certificate (e.g. Let’s Encrypt) for your domain.
2. Ensure the **reverse proxy** (Apache or Nginx) is applied to the **HTTPS** vhost so that `https://yourdomain.com` proxies to `http://127.0.0.1:3000`.
3. In the app, links and redirects should use `https`; Next.js respects `X-Forwarded-Proto` when set by the proxy.

---

## DirectAdmin Setup

1. **Domain**: Point the domain (or subdomain) to this server; in DirectAdmin create the domain/subdomain.
2. **Document root**: For the Node + proxy setup, the “document root” is effectively ignored for `/`; the proxy sends all traffic to Next.js. You can leave the default or point it to an empty folder if you don’t serve static files from Apache/Nginx.
3. **PHP**: Not required for running the Next.js app; Node serves the app.
4. **Cron (optional)**: If you add any cron jobs (e.g. cache cleanup), use DirectAdmin **Cron Jobs** and call your scripts or `pm2 restart talksasa` if needed.

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| 502 Bad Gateway | PM2 running? `pm2 list` → `pm2 restart talksasa`. Port 3000 in use? `lsof -i :3000` or `ss -tlnp \| grep 3000`. |
| 503 / Connection refused | Firewall blocking localhost 3000? Proxy config points to `127.0.0.1:3000`? |
| Blank page / wrong content | Proxy passing correct `Host` and `X-Forwarded-Proto`? Clear browser cache; check `pm2 logs talksasa`. |
| Build fails on server | Node version: `node -v` (18+). Run `npm ci` and `npm run build`; check disk space and memory. |
| High memory | Reduce PM2 instances to 1; consider `max_memory_restart` in ecosystem file. |

### Useful commands

```bash
pm2 list
pm2 logs talksasa
pm2 restart talksasa
pm2 stop talksasa
```

---

## Quick checklist

- [ ] Node.js 18+ installed
- [ ] Project uploaded/cloned and `npm ci` run
- [ ] `.env.production` (or env vars) set
- [ ] `npm run build` completed
- [ ] PM2 started and `pm2 save` + `pm2 startup` done
- [ ] Reverse proxy (Apache or Nginx) points domain to `127.0.0.1:3000`
- [ ] SSL enabled and proxy applied for HTTPS
- [ ] Test: `https://yourdomain.com` loads the app and `/api/contact` works if used

---

*Last updated for Next.js 14 and DirectAdmin on CloudLinux.*
