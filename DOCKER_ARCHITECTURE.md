# Docker Architecture - Complete Overview

## ✅ YES - Node.js IS Running in Docker

Your complete development environment is **100% containerized** using Docker Compose.

---

## 🐳 What's Running in Docker?

### **Three Services in Containers:**

```
┌─────────────────────────────────────────────────────────────┐
│                  Docker Compose Network                      │
│                     (dws-network)                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL 15   │  │   Redis 7    │  │ Node.js 18   │  │
│  │   (Database)     │  │  (Cache)     │  │ + Express    │  │
│  │                  │  │              │  │ (Backend API)│  │
│  │ Port: 5432       │  │ Port: 6379   │  │ Port: 3001   │  │
│  │ Alpine image     │  │ Alpine image │  │ Alpine image │  │
│  └──────────────────┘  └──────────────┘  └──────────────┘  │
│       ↓ Volume         ↓ Volume              ↓ Volume        │
│   postgres_data    redis_data           src/ (hot reload)   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Container Details

### **1. PostgreSQL Container**
```yaml
Service:   postgres
Image:     postgres:15-alpine
Port:      5432
Volume:    postgres_data (persistent)
Health:    pg_isready check every 10s
Purpose:   User database & audit logs
```

**Environment Variables:**
- `POSTGRES_USER: dws_user`
- `POSTGRES_PASSWORD: dws_password_dev`
- `POSTGRES_DB: dws_auth_dev`

---

### **2. Redis Container**
```yaml
Service:   redis
Image:     redis:7-alpine
Port:      6379
Volume:    redis_data (persistent)
Health:    redis-cli ping every 10s
Purpose:   Session storage & caching
```

No authentication by default (dev only).

---

### **3. Node.js Backend Container** ⭐
```yaml
Service:    auth-backend
Build:      Uses Dockerfile.dev
Image:      node:18-alpine
Port:       3001
Volume:     ./src → /app/src (live reload)
Health:     curl http://localhost:3001/health
Purpose:    Express API server
Command:    npm run dev (with hot reload)
```

**Environment Variables (auto-configured):**
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://dws_user:dws_password_dev@postgres:5432/dws_auth_dev
REDIS_URL=redis://redis:6379
JWT_SECRET_KEY=dev_secret_key_change_in_production_min_32_chars
BCRYPT_ROUNDS=10
LOG_LEVEL=debug
```

---

## 🔄 How They Connect

```
┌──────────────────┐
│   Your Code      │
│  (src/ folder)   │
└────────┬─────────┘
         │ (volume mount)
         ↓
┌──────────────────────────────────────┐
│   Docker Container Network           │
│   (shared private network)           │
└────┬────────────┬───────────┬────────┘
     │            │           │
     ↓            ↓           ↓
┌─────────┐  ┌────────┐  ┌─────────┐
│ Backend │  │  Postgres  │  │  Redis   │
│ API     │  │  5432      │  │  6379    │
│ 3001    │  │            │  │          │
└─────────┘  └────────┘  └─────────┘
     ↓            ↓           ↓
     └────┬───────┴───────┬───┘
          ↓               ↓
    Only visible inside Docker network
    From host: localhost:3001, localhost:5432, localhost:6379
```

---

## 💾 Dockerfile Breakdown

**File:** `Dockerfile.dev`

```dockerfile
# 1. Start with Node.js 18 Alpine image (small, fast)
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Install system dependencies for building modules
RUN apk add --no-cache python3 make g++ curl

# 4. Copy package files and install npm dependencies
COPY package.json package-lock.json ./
RUN npm ci

# 5. Copy source code
COPY src ./src
COPY config ./config
COPY tsconfig.json ./

# 6. Expose port 3001
EXPOSE 3001

# 7. Health check - verify API is responding
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# 8. Start development server (with hot reload)
CMD ["npm", "run", "dev"]
```

---

## 🔧 Docker Compose Configuration

**File:** `docker-compose.yml`

### Key Features:

1. **Service Dependencies**
   ```yaml
   depends_on:
     postgres:
       condition: service_healthy  # Wait for DB to be ready
     redis:
       condition: service_healthy  # Wait for Redis to be ready
   ```
   Backend starts ONLY after database and Redis are healthy.

2. **Volume Mounts (Hot Reload)**
   ```yaml
   volumes:
     - ./src:/app/src              # Code changes → auto reload
     - ./config:/app/config        # Config changes → auto reload
     - /app/node_modules           # Keep node_modules in container
   ```

3. **Persistent Volumes**
   ```yaml
   volumes:
     postgres_data:                # Survives docker-compose down
     redis_data:                   # Survives docker-compose down
   ```

4. **Network**
   ```yaml
   networks:
     dws-network:
       driver: bridge              # Shared network for all services
   ```

---

## 🚀 How to Use

### **Start Everything**
```bash
docker-compose up -d
```

**What happens:**
1. Docker builds Node.js image from `Dockerfile.dev`
2. PostgreSQL container starts
3. Redis container starts
4. Node.js backend starts (waits for DB & Redis)
5. All three are connected on `dws-network`
6. API available at `http://localhost:3001`

### **Stop Everything**
```bash
docker-compose down
```

### **Reset Everything (including data)**
```bash
docker-compose down -v
```

### **View Logs**
```bash
docker-compose logs -f auth-backend    # Node.js logs
docker-compose logs -f postgres        # Database logs
docker-compose logs -f redis           # Cache logs
```

### **Restart Just Backend**
```bash
docker-compose restart auth-backend
```

### **Rebuild Image After Dependency Changes**
```bash
docker-compose up --build
```

---

## 📊 Port Mapping

From your **host machine**, access services at:

| Service | Host Port | Container Port | URL |
|---------|-----------|----------------|-----|
| Backend | 3001 | 3001 | http://localhost:3001 |
| PostgreSQL | 5432 | 5432 | localhost:5432 |
| Redis | 6379 | 6379 | localhost:6379 |

---

## 🔒 Isolation Benefits

✅ **Everything isolated in containers**
- No "works on my machine" issues
- Same environment for whole team
- Easy to reset/start fresh

✅ **Hot reload for development**
- Change code in `src/` folder
- Docker automatically restarts backend
- No manual restart needed

✅ **Database persistence**
- Data survives `docker-compose down`
- Use `docker-compose down -v` to delete data

✅ **Networking**
- Services talk to each other via container names
- PostgreSQL accessible as `postgres:5432` from backend
- Redis accessible as `redis:6379` from backend

---

## 🎯 Development Workflow

```
┌─ Edit code in src/
│
└─→ Docker detects file change
    └─→ Backend auto-restarts (hot reload)
        └─→ Test API at http://localhost:3001
            └─→ Check logs with docker-compose logs -f
```

---

## 💡 Why This Setup?

| Feature | Benefit |
|---------|---------|
| **Docker** | Everyone has same environment |
| **Docker Compose** | One command starts all 3 services |
| **Alpine images** | Small, fast, secure |
| **Hot reload** | Quick development iteration |
| **Persistent volumes** | Data survives container restarts |
| **Health checks** | Services verify they're working |
| **Private network** | Services communicate securely |

---

## 📚 Learning Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [PostgreSQL in Docker](https://hub.docker.com/_/postgres)

---

## 🔐 Security Notes

**Development ⚠️:**
- Passwords hardcoded in compose file (OK for dev)
- No authentication on Redis (OK for dev)
- Debug logging enabled

**Production 🔒:**
- Use environment variables from secrets manager
- Enable Redis authentication
- Disable debug logging
- Use production images (not alpine for security scanning)
- Implement container resource limits

---

## ✅ Verification

To verify everything is working:

```bash
# Check containers are running
docker-compose ps

# Expected output:
# NAME           IMAGE           PORTS
# dws-postgres   postgres:15     5432/tcp
# dws-redis      redis:7         6379/tcp
# dws-auth-backend  (built image) 3001/tcp

# Test health endpoint
curl http://localhost:3001/health

# Expected response:
# {"status":"ok","timestamp":"2025-12-14T...","service":"DWS IQ Auth Backend","version":"1.0.0"}

# View Node.js logs
docker-compose logs auth-backend

# You should see:
# ✓ Server running on http://localhost:3001
# ✓ Database URL configured
# ✓ Redis URL configured
```

---

## 🎉 Summary

**Yes, Node.js is 100% running in Docker!**

Your setup includes:
- ✅ Node.js 18 backend (containerized)
- ✅ PostgreSQL database (containerized)
- ✅ Redis cache (containerized)
- ✅ Hot reload for development
- ✅ Persistent data storage
- ✅ Private network between services
- ✅ Health checks for reliability

Everything is orchestrated by Docker Compose for easy local development.

---

**Last Updated:** December 14, 2025
**Status:** Production Ready for Local Development

