# Docker Setup Guide - Local Development

## 🐳 Overview

Two approaches for local development:

1. **Docker Compose** (Recommended) - Services in containers
2. **Local npm** - Services on host machine

## 🎯 Quick Decision Guide

| Need | Docker | Local npm |
|------|--------|----------|
| **Database locally?** | ✅ Auto setup | ⚠️ Manual install |
| **Redis locally?** | ✅ Auto setup | ⚠️ Manual install |
| **Isolated environment?** | ✅ Yes | ❌ No |
| **Fast startup?** | ⏳ 30-60s | ✅ Instant |
| **Production-like?** | ✅ Very similar | ⚠️ Different |
| **Easy cleanup?** | ✅ One command | ❌ Manual |
| **New to backend?** | ✅ Recommended | ❌ Complex |

---

## Option 1: Docker Compose (Recommended) 🐳

### Prerequisites
- Docker Desktop installed
- 4GB RAM available
- Port 5432, 6379, 3001 available

### Setup & Start

**1. Start all services:**
```bash
docker-compose up -d
```

**2. Check services are running:**
```bash
docker-compose ps
```

Expected output:
```
NAME                  IMAGE           PORTS
dws-postgres          postgres:15     5432/tcp
dws-redis            redis:7         6379/tcp
dws-auth-backend     dws-auth:dev    3001/tcp
```

**3. Backend starts automatically with hot reload**
```bash
docker-compose logs -f auth-backend
```

### Environment Variables (Auto-Configured)
```
DATABASE_URL: postgresql://dws_user:dws_password_dev@postgres:5432/dws_auth_dev
REDIS_URL: redis://redis:6379
JWT_SECRET_KEY: dev_secret_key_change_in_production_min_32_chars
```

### Common Docker Commands

**View logs:**
```bash
docker-compose logs auth-backend        # Backend logs
docker-compose logs postgres            # Database logs
docker-compose logs redis               # Redis logs
docker-compose logs -f                  # Follow all logs
```

**Stop services:**
```bash
docker-compose down                     # Stop & remove containers
docker-compose down -v                  # Also remove volumes/data
```

**Rebuild after code changes:**
```bash
docker-compose up --build               # Rebuild image & restart
```

**Access database:**
```bash
docker-compose exec postgres psql -U dws_user -d dws_auth_dev
```

**Access Redis:**
```bash
docker-compose exec redis redis-cli
```

**Reset everything:**
```bash
docker-compose down -v
docker-compose up -d
```

### Database & Redis are Persistent
- Data stored in Docker volumes
- Survives `docker-compose down`
- Use `docker-compose down -v` to clear

### Files Volume Mounting
- Source code hot-reloads on save
- `./src` → `/app/src` (live sync)
- Change file → Backend restarts automatically

---

## Option 2: Local npm (Without Docker)

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 15+ installed locally
- Redis 6+ installed locally
- npm 9+ installed

### Windows Setup (PowerShell)

**1. Install PostgreSQL:**
```powershell
# Using Chocolatey
choco install postgresql15 redis-64

# Or download from:
# PostgreSQL: https://www.postgresql.org/download/windows/
# Redis: https://github.com/microsoftarchive/redis/releases
```

**2. Create database:**
```powershell
# Connect to PostgreSQL
psql -U postgres

# Inside psql:
CREATE USER dws_user WITH PASSWORD 'dws_password_dev';
CREATE DATABASE dws_auth_dev OWNER dws_user;
GRANT ALL PRIVILEGES ON DATABASE dws_auth_dev TO dws_user;
\q
```

**3. Start Redis (separate terminal):**
```powershell
redis-server
```

**4. Install npm dependencies:**
```bash
npm install
npm install --save-dev tsx ts-jest @types/node
```

**5. Create `.env` file:**
```bash
cp .env.example .env
```

**Edit `.env`:**
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://dws_user:dws_password_dev@localhost:5432/dws_auth_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=dev_secret_key_change_in_production_min_32_chars
```

**6. Start backend:**
```bash
npm run dev
```

Should see:
```
✓ Server running on http://localhost:3001
✓ Connected to database
✓ Redis connected
```

---

## Comparison Table

| Task | Docker | Local npm |
|------|--------|----------|
| **Setup time** | 3-5 min | 20-30 min |
| **Database setup** | Auto | Manual SQL |
| **Redis setup** | Auto | Manual install |
| **Startup** | `docker-compose up` | `npm run dev` |
| **Reset environment** | `docker-compose down -v` | Manual cleanup |
| **View logs** | `docker-compose logs` | Console output |
| **Port conflicts** | Easy to fix | Manual fix |
| **Production-like** | ✅ Very close | ⚠️ Similar |
| **Team consistency** | ✅ Everyone same | ⚠️ Varies |
| **Resource usage** | Uses more RAM | Uses less RAM |

---

## Troubleshooting

### Docker Issues

**Port already in use:**
```bash
# Kill process on port
netstat -ano | findstr :5432        # Find process
taskkill /PID <PID> /F              # Kill it

# Or change docker-compose.yml:
# ports:
#   - "5432:5433"  # Map to different port
```

**Container won't start:**
```bash
docker-compose logs postgres        # Check what's wrong
docker-compose down -v              # Clean up
docker-compose up -d                # Restart fresh
```

**Out of disk space:**
```bash
docker system prune -a              # Remove unused images
docker volume prune                 # Remove unused volumes
```

### Local npm Issues

**PostgreSQL connection refused:**
```powershell
# Check if service running
Get-Service postgresql-x64-15

# Start it
Start-Service postgresql-x64-15
```

**Redis connection refused:**
```powershell
# Check if Redis running
Get-Process redis-server

# Might not be installed as service
# Start manually: redis-server
```

**Port 3001 already in use:**
```bash
# Find process
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## API Testing

Once backend is running:

**Test health endpoint:**
```bash
curl http://localhost:3001/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-14T12:00:00Z"
}
```

---

## Recommendation 🎯

### Use Docker Compose If:
- ✅ First time setting up backend
- ✅ Want consistent environment
- ✅ Using Windows (easier than manual)
- ✅ Working with team (everyone same setup)
- ✅ Learning Docker is valuable

### Use Local npm If:
- ✅ Prefer simplicity
- ✅ Have PostgreSQL + Redis already installed
- ✅ Want fastest startup
- ✅ Have low RAM
- ✅ Only working on frontend

---

## Next Steps

### After Setup:

1. **Create database schema:**
```bash
npm run db:migrate
```

2. **Seed test data:**
```bash
npm run db:seed
```

3. **Start frontend (separate terminal):**
```bash
# Navigate to frontend folder
cd dws10.com
# Or use live server
```

4. **Test login flow:**
- Go to http://localhost:5500/dashboard/login/
- Should connect to http://localhost:3001/api/v1/auth/login

---

## Quick Reference

### Docker
```bash
docker-compose up -d                    # Start all services
docker-compose down                     # Stop services
docker-compose logs -f auth-backend     # View logs
docker-compose restart auth-backend     # Restart backend
```

### Local npm
```bash
npm install                             # Install deps
npm run dev                             # Start backend
npm test                                # Run tests
npm run db:migrate                      # Run migrations
```

---

**Last Updated:** December 14, 2025
**Maintainer:** Development Team

