#!/bin/bash

# TalkSasa Deployment Script
# This script pulls the latest changes from GitHub, installs dependencies,
# builds the Next.js app, and restarts the PM2 process on the live server.

set -e  # Exit on any error

# Configuration
PROJECT_DIR="${PROJECT_DIR:-/var/www/talksasa}"
GITHUB_REPO="https://github.com/samuelmacharia99/talksasa-site.git"
BRANCH="${BRANCH:-main}"
PM2_APP_NAME="talksasa"
LOG_FILE="/var/log/talksasa-deploy.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[${TIMESTAMP}]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    if ! command -v git &> /dev/null; then
        error "Git is not installed"
    fi

    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
    fi

    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
    fi

    if ! command -v pm2 &> /dev/null; then
        error "PM2 is not installed globally"
    fi

    log "Node.js version: $(node -v)"
    log "npm version: $(npm -v)"

    success "All prerequisites met"
}

# Check if directory exists
check_directory() {
    if [ ! -d "$PROJECT_DIR" ]; then
        error "Project directory does not exist: $PROJECT_DIR"
    fi
    log "Project directory verified: $PROJECT_DIR"
}

# Pull latest changes from GitHub
pull_changes() {
    log "Pulling latest changes from GitHub (branch: $BRANCH)..."

    cd "$PROJECT_DIR"

    # Stash any local changes
    if [ -n "$(git status --porcelain)" ]; then
        warning "Local changes detected, stashing them..."
        git stash
    fi

    # Fetch and pull
    git fetch origin "$BRANCH" || error "Failed to fetch from GitHub"
    git checkout "$BRANCH" || error "Failed to checkout branch $BRANCH"
    git reset --hard "origin/$BRANCH" || error "Failed to reset to origin/$BRANCH"

    local COMMIT_HASH=$(git rev-parse --short HEAD)
    local COMMIT_MSG=$(git log -1 --pretty=%B)
    log "Pulled commit: $COMMIT_HASH"
    log "Commit message: $COMMIT_MSG"

    success "Latest changes pulled from GitHub"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."

    cd "$PROJECT_DIR"
    rm -rf node_modules
    npm ci || error "Failed to install dependencies"

    success "Dependencies installed"
}

# Build the application
build_app() {
    log "Building Next.js application..."

    cd "$PROJECT_DIR"
    npm run build || error "Build failed"

    success "Application built successfully"
}

# Restart PM2 process
restart_app() {
    log "Restarting PM2 process..."

    # Check if app is running
    if pm2 list | grep -q "$PM2_APP_NAME"; then
        log "App is running, restarting..."
        pm2 restart "$PM2_APP_NAME" || error "Failed to restart PM2 app"
    else
        warning "App is not running in PM2, starting it now..."
        cd "$PROJECT_DIR"
        pm2 start npm --name "$PM2_APP_NAME" -- start || error "Failed to start PM2 app"
    fi

    # Give it a moment to restart
    sleep 2

    # Check status
    if pm2 status | grep -q "$PM2_APP_NAME"; then
        success "PM2 app is running"
    else
        error "Failed to verify PM2 app is running"
    fi
}

# Health check (optional)
health_check() {
    log "Performing health check..."

    # Try app health endpoint (no database required)
    for i in {1..5}; do
        if curl -sf http://localhost:3000/api/health >/dev/null 2>&1; then
            log "Server is responding on port 3000"
            success "Health check passed"
            return 0
        fi
        if nc -z localhost 3000 &>/dev/null; then
            log "Server is responding on port 3000"
            success "Health check passed"
            return 0
        fi
        if [ $i -lt 5 ]; then
            log "Attempt $i/5: Waiting for server to be ready..."
            sleep 2
        fi
    done

    warning "Health check could not connect to port 3000 (this may be normal if behind proxy)"
}

# Save PM2 process list
save_pm2() {
    log "Saving PM2 process list..."
    pm2 save || warning "Failed to save PM2 process list"
    success "PM2 process list saved"
}

# Main deployment flow
main() {
    echo ""
    echo "=================================="
    echo "TalkSasa Deployment Script"
    echo "=================================="
    echo ""

    log "Starting deployment process..."

    check_prerequisites
    check_directory
    pull_changes
    install_dependencies
    build_app
    restart_app
    save_pm2
    health_check

    echo ""
    echo "=================================="
    success "Deployment completed successfully!"
    echo "=================================="
    echo ""
    log "Site should be live at https://talksasa.com"
    echo ""
}

# Run main function
main "$@"
