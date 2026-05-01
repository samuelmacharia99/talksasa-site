# Using the Deploy Script

The `deploy.sh` script automates the deployment of updates from GitHub to your live server.

## Initial Setup on the VPS

### 1. Upload the script to your server

Copy the script to your VPS (assuming your project is in `/var/www/talksasa`):

```bash
scp deploy.sh root@YOUR_VPS_IP:/var/www/talksasa/
```

Or if you've already cloned the project from GitHub, the script will be included automatically.

### 2. Make the script executable

```bash
ssh root@YOUR_VPS_IP
cd /var/www/talksasa
chmod +x deploy.sh
```

### 3. (Optional) Create a deployment logs directory

```bash
sudo mkdir -p /var/log
sudo touch /var/log/talksasa-deploy.log
sudo chown $USER:$USER /var/log/talksasa-deploy.log
```

---

## Deploying Updates

### From the VPS (SSH)

When you push updates to GitHub and want to deploy them to your live server:

```bash
ssh root@YOUR_VPS_IP
cd /var/www/talksasa
./deploy.sh
```

### What the script does:

1. ✅ Checks that all prerequisites (git, node, npm, pm2) are installed
2. ✅ Pulls the latest code from the `main` branch on GitHub
3. ✅ Installs/updates dependencies with `npm ci`
4. ✅ Builds the Next.js application with `npm run build`
5. ✅ Restarts the PM2 process (or starts it if not running)
6. ✅ Verifies the app is responding on port 3000
7. ✅ Saves the PM2 process list for persistence

### Expected output:

```
==================================
TalkSasa Deployment Script
==================================

[2026-05-01 14:30:45] Checking prerequisites...
[SUCCESS] All prerequisites met
[2026-05-01 14:30:45] Pulling latest changes from GitHub (branch: main)...
[2026-05-01 14:30:50] Pulled commit: abc1234
[SUCCESS] Latest changes pulled from GitHub
[2026-05-01 14:30:51] Installing dependencies...
[SUCCESS] Dependencies installed
[2026-05-01 14:30:55] Building Next.js application...
[SUCCESS] Application built successfully
[2026-05-01 14:31:10] Restarting PM2 process...
[SUCCESS] PM2 app is running
[SUCCESS] Health check passed

==================================
[SUCCESS] Deployment completed successfully!
==================================

Site should be live at https://talksasa.com
```

---

## Configuration

The script uses these default values (you can override them):

```bash
PROJECT_DIR=/var/www/talksasa          # Project directory on the VPS
GITHUB_REPO=https://github.com/samuelmacharia99/talksasa-site.git
BRANCH=main                             # Git branch to deploy from
PM2_APP_NAME=talksasa                   # PM2 application name
LOG_FILE=/var/log/talksasa-deploy.log   # Deployment log file
```

### Custom deployments

To deploy from a different branch or directory:

```bash
BRANCH=staging ./deploy.sh
PROJECT_DIR=/var/www/talksasa-staging ./deploy.sh
```

---

## Monitoring Deployments

### View deployment logs

```bash
tail -f /var/log/talksasa-deploy.log
```

### Check PM2 status

```bash
pm2 status
pm2 logs talksasa
```

### Manually check the site

```bash
curl http://localhost:3000
curl https://talksasa.com  # via Nginx proxy
```

---

## Troubleshooting

### Script fails with "git: command not found"

Git is not installed. Install it:

```bash
sudo apt install git
```

### Script fails with "PM2 not found"

PM2 is not installed globally:

```bash
sudo npm install -g pm2
pm2 startup
pm2 save
```

### Build fails with "out of memory"

Your VPS doesn't have enough memory. Either:
- Upgrade to a larger VPS
- Add swap space:

```bash
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### App won't start after deployment

Check the logs:

```bash
pm2 logs talksasa
```

Common issues:
- Port 3000 is in use: `lsof -i :3000`
- Node version too old: `node -v` (should be 18+)
- Missing environment variables: Check `.env.production`

### Site shows "502 Bad Gateway"

1. Check if the app is running: `pm2 status`
2. Check if port 3000 is listening: `ss -tlnp | grep 3000`
3. Restart: `pm2 restart talksasa`
4. Check Nginx proxy config: `sudo nginx -t`

---

## Full Deployment Workflow

1. **Make changes** locally and test them
2. **Push to GitHub**: `git push origin main`
3. **Deploy to live server**: `ssh root@YOUR_VPS_IP "cd /var/www/talksasa && ./deploy.sh"`
4. **Verify**: Visit https://talksasa.com

---

## Automation (Optional)

You can set up a cron job to auto-deploy on a schedule, or use GitHub Actions/webhooks for CI/CD.

### Cron job example (deploy every night at 2 AM)

```bash
crontab -e
```

Add:

```cron
0 2 * * * /var/www/talksasa/deploy.sh >> /var/log/talksasa-deploy.log 2>&1
```

### GitHub Webhooks

To trigger deployment automatically on push, you can set up a webhook or use GitHub Actions. This is an advanced topic; ask for help if you need it.

---

## Rollback

If something goes wrong, you can manually check out a previous commit:

```bash
cd /var/www/talksasa
git log --oneline              # See recent commits
git checkout COMMIT_HASH       # Revert to a specific commit
npm run build
pm2 restart talksasa
```

Or keep backups before each deploy by uncommenting the backup line in the script.

---

**Need help?** Check the logs: `tail -f /var/log/talksasa-deploy.log`
