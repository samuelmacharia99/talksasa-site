# Deploy TalkSasa on a VPS (talksasa.com)

This guide walks you through deploying the TalkSasa Next.js app on a **VPS** using your **zip file**, with the domain **talksasa.com**.

---

## What you need

- A **VPS** (Ubuntu 22.04 or 20.04, or Debian 11/12) with SSH access
- The **project zip file** on your PC (e.g. `new-talksasa.zip` or `talksasa.zip`)
- **talksasa.com** pointed to your VPS IP (see Step 1)

---

## Step 1: Point the domain to your VPS

1. In your domain registrar (where you bought talksasa.com), open **DNS** settings.
2. Add or edit **A** records:
   - **Name:** `@` (or leave blank) → **Value:** your VPS public IP  
   - **Name:** `www` → **Value:** same VPS public IP  
3. Save and wait 5–30 minutes (up to 48 hours in rare cases).  
   Check: `ping talksasa.com` from your PC — it should show your VPS IP.

---

## Step 2: Connect to your VPS

From your PC (PowerShell, CMD, or Terminal):

```bash
ssh root@YOUR_VPS_IP
# or: ssh youruser@YOUR_VPS_IP
```

Replace `YOUR_VPS_IP` with the real IP (e.g. `ssh root@203.0.113.50`).

---

## Step 3: Install Node.js 20 and Nginx

Run these on the VPS (Ubuntu/Debian):

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Check
node -v   # v20.x.x
npm -v

# Install Nginx and PM2
sudo apt install -y nginx
sudo npm install -g pm2
```

---

## Step 4: Upload the zip and extract it

**Important:** The zip must be on the VPS **before** you run the unzip commands below. If you see `unzip: cannot find or open /tmp/new-talksasa.zip`, upload the file first (Option A or B), then run the VPS commands.

**Option A – Upload zip from your PC (recommended)**

On your **PC**, open a terminal in the folder where your zip is and run (use your actual zip filename and VPS IP):

```bash
scp /path/to/your-file.zip root@YOUR_VPS_IP:/tmp/
```

Examples:
- Zip named `talksasa.zip` in current folder: `scp new-talksasa.zip root@YOUR_VPS_IP:/tmp/`
- Zip on Windows in `Downloads`: `scp C:\Users\YourName\Downloads\new-talksasa.zip root@YOUR_VPS_IP:/tmp/` (in PowerShell or WSL)

**On the VPS** – after the zip is uploaded:

```bash
# See the exact filename (often .zip is lowercase)
ls -la /tmp/*.zip

# Create /var/www and extract (replace THE-ACTUAL-NAME.zip with what you saw above)
sudo mkdir -p /var/www
cd /var/www
sudo unzip /tmp/THE-ACTUAL-NAME.zip -d talksasa
sudo chown -R $USER:$USER /var/www/talksasa
cd /var/www/talksasa
```

Example if the file is `new-talksasa.zip`:
`sudo unzip /tmp/new-talksasa.zip -d talksasa`

**If you only see a single folder** (e.g. `new-talksasa`) when you `ls` inside `/var/www/talksasa`, move its contents up so `package.json` and `app/` are directly in `/var/www/talksasa`:

```bash
cd /var/www/talksasa
# Move all files and hidden files from new-talksasa up one level
mv new-talksasa/* .
mv new-talksasa/.* . 2>/dev/null || true
# Remove the empty folder
rmdir new-talksasa
# Confirm: you should see app, package.json, etc.
ls -la
```

**Option B – Upload via SFTP**

Use FileZilla, WinSCP, or another SFTP client:

1. Connect to `YOUR_VPS_IP` with your SSH user/password or key.
2. Upload the zip to `/tmp/` on the VPS.
3. On the VPS run the same `unzip` and `chown` commands as in Option A.

---

## Step 5: Install dependencies and build

On the VPS:

```bash
cd /var/www/talksasa

# Install dependencies (production only)
npm ci

# Optional: set env vars before build
# export NEXT_PUBLIC_GA_MEASUREMENT_ID=G-xxxx
# export NEXT_PUBLIC_FORMSPREE_ID=xxxx

# Build the app
npm run build
```

If the build fails with “out of memory”, add swap or use a larger VPS; 1 GB RAM can be tight for `npm run build`.

---

## Step 6: Run the app with PM2

```bash
cd /var/www/talksasa

# Start the app
pm2 start npm --name "talksasa" -- start

# Save process list and enable startup on reboot
pm2 save
pm2 startup
# Run the command it prints (usually with sudo)

# Check
pm2 status
pm2 logs talksasa --lines 20
```

The app will listen on **port 3000**. Next we expose it via Nginx for talksasa.com.

---

## Step 7: Nginx reverse proxy for talksasa.com

Create a Nginx config:

```bash
sudo nano /etc/nginx/sites-available/talksasa.com
```

Paste this (replace `YOUR_VPS_IP` with your real IP if you use it for a default server):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name talksasa.com www.talksasa.com;

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
}
```

Save (Ctrl+O, Enter, Ctrl+X). Then enable the site and test:

```bash
sudo ln -sf /etc/nginx/sites-available/talksasa.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Open **http://talksasa.com** in your browser. You should see the site (HTTPS comes in the next step).

---

## Step 8: SSL (HTTPS) with Let’s Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d talksasa.com -d www.talksasa.com
```

Follow the prompts (email, agree to terms). Certbot will adjust Nginx for HTTPS.

Test: **https://talksasa.com**

Renewal is automatic. Check with:

```bash
sudo certbot renew --dry-run
```

---

## Step 9: Firewall (optional but recommended)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

Leave SSH (22) and Nginx (80/443) open; you do **not** need to open port 3000 to the internet.

---

## Environment variables (optional)

To set analytics or form IDs:

```bash
nano /var/www/talksasa/.env.production
```

Add (example):

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXX
NEXT_PUBLIC_FORMSPREE_ID=your_id
NEXT_PUBLIC_SITE_URL=https://talksasa.com
```

Save, then restart the app:

```bash
pm2 restart talksasa
```

---

## Updating the site (after you change the zip)

1. Upload the new zip to the VPS (e.g. to `/tmp/talksasa-new.zip`).
2. On the VPS:

```bash
cd /var/www/talksasa
pm2 stop talksasa
# Backup current (optional)
# cp -r . ../talksasa-backup
# Replace with new build
rm -rf .next node_modules
unzip -o /tmp/talksasa-new.zip -d /tmp/talksasa-new
cp -r /tmp/talksasa-new/* . 
# If zip has one root folder, copy from there:
# cp -r /tmp/talksasa-new/new-talksasa/* .
npm ci
npm run build
pm2 start talksasa
```

Or keep a copy of the project and only replace source + run `npm ci` and `npm run build`, then `pm2 restart talksasa`.

---

## Troubleshooting

| Problem | What to do |
|--------|------------|
| **502 Bad Gateway** | App not running: `pm2 status` → `pm2 start talksasa` or `pm2 restart talksasa`. Check `pm2 logs talksasa`. |
| **Connection refused** | Port 3000: `ss -tlnp \| grep 3000`. If nothing, start app with `pm2 start npm --name "talksasa" -- start` from `/var/www/talksasa`. |
| **talksasa.com doesn’t load** | DNS: `ping talksasa.com`. Nginx: `sudo nginx -t`, `sudo systemctl status nginx`. |
| **Build fails (memory)** | Add swap: `sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`. Or use a VPS with more RAM. |
| **Wrong domain / redirect** | In `.env.production` set `NEXT_PUBLIC_SITE_URL=https://talksasa.com` and restart with `pm2 restart talksasa`. |

---

## Quick checklist

- [ ] DNS: talksasa.com and www point to VPS IP  
- [ ] Zip uploaded and extracted under `/var/www/talksasa`  
- [ ] `npm ci` and `npm run build` completed  
- [ ] PM2 running: `pm2 status` shows “talksasa” online  
- [ ] Nginx config for talksasa.com proxy to 127.0.0.1:3000  
- [ ] Certbot SSL for talksasa.com and www.talksasa.com  
- [ ] https://talksasa.com loads the site  

---

*Guide for Next.js 14 app, domain talksasa.com, zip-based deploy on a VPS.*
