# Authentication Quick Start Guide

**Free Tier Authentication Ready!**

---

## 🚀 Getting Started

### 1. Start the Backend Server

Using Docker Compose (Recommended):
```bash
docker-compose up -d
```

Or locally with npm:
```bash
npm install
npm run dev
```

The backend will start on `http://localhost:3001`

### 2. Test Login Endpoints

#### Demo Credentials
```
Email: demo@dws-iq.local
Password: password123
```

Or for community:
```
Email: test@onelifetime.world
Password: password123
```

#### Test Login with cURL
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@dws-iq.local",
    "password": "password123",
    "rememberMe": true,
    "communityMode": false
  }'
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "user": {
    "id": "user_001",
    "email": "demo@dws-iq.local",
    "firstName": "Demo",
    "lastName": "User",
    "emailVerified": true,
    "mfaEnabled": false,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### 3. Access Dashboard

1. Open browser to `https://dws10.com/dashboard/login/`
2. Enter demo credentials
3. Click "Sign In"
4. You'll be redirected to `/dashboard/` (dashboard page)

---

## 📋 API Endpoint Tests

### Test Health Check
```bash
curl http://localhost:3001/health
```

### Test Refresh Token
```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token_here"
  }'
```

### Test Get Current User
```bash
curl http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer your_access_token_here"
```

### Test Logout
```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -H "Authorization: Bearer your_access_token_here"
```

---

## 🔧 Environment Variables

Create a `.env` file:

```bash
# Server
NODE_ENV=development
PORT=3001

# JWT
JWT_SECRET_KEY=dev_secret_key_change_in_production_min_32_chars
JWT_REFRESH_SECRET=dev_refresh_secret_key_change_in_production_min_32_chars
BCRYPT_ROUNDS=10

# Database (for future use)
DATABASE_URL=postgresql://dws_user:dws_password_dev@postgres:5432/dws_auth_dev

# Redis (for future use)
REDIS_URL=redis://redis:6379

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,https://dws10.com,https://onelifetime.world

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

---

## 🧪 Manual Testing Checklist

### Login Tests
- [ ] Login with valid credentials
- [ ] See JWT token in response
- [ ] Redirect to dashboard
- [ ] Login with invalid password (see error)
- [ ] Login with non-existent email (see error)
- [ ] Rate limit after 5 failed attempts
- [ ] "Remember Me" stores refresh token

### Dashboard Tests
- [ ] Access dashboard after login
- [ ] See user name and info
- [ ] See "Show Me How" tutorials
- [ ] See quick stats
- [ ] Click logout button
- [ ] Redirects back to login

### Community Tests
- [ ] Login at `/community-login/`
- [ ] Different branding (OneLifetime logo)
- [ ] Same backend authentication
- [ ] Same user account

### Token Tests
- [ ] Access token expires after 24 hours
- [ ] Refresh token extends session to 7 days
- [ ] Invalid token returns 401 error
- [ ] Expired token can be refreshed

---

## 📊 Database Schema (Coming in Phase 2)

When connecting to PostgreSQL:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email_verified BOOLEAN DEFAULT FALSE,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  refresh_token VARCHAR(500) UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100),
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_refresh_token ON sessions(refresh_token);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
```

---

## 🐛 Troubleshooting

### "Invalid email or password" error
- Check demo credentials are correct
- Verify backend is running on localhost:3001
- Check CORS is enabled

### Token validation fails
- Verify JWT_SECRET_KEY matches between requests
- Check token hasn't expired (24 hour limit)
- Ensure Authorization header format: `Bearer token_here`

### Rate limiting issue
- Wait 15 minutes before retrying login
- Or use different email address to test

### CORS errors
- Add your domain to CORS_ORIGIN in `.env`
- For local testing: `http://localhost:3000`
- For production: `https://dws10.com,https://onelifetime.world`

### Database connection errors (Phase 2)
- Ensure PostgreSQL is running
- Verify DATABASE_URL is correct
- Check database user has proper permissions

---

## 📚 Additional Resources

- **API Documentation:** `AUTH_IMPLEMENTATION.md`
- **Security Guide:** `AUTHENTICATION_SECURITY_GDPR_PLAN.md`
- **Docker Setup:** `DOCKER_SETUP_GUIDE.md`
- **Login Page:** `dws10.com/dashboard/login/index.html`
- **Community Login:** `onelifetime.world/community-login/index.html`
- **Dashboard:** `dws10.com/dashboard/index.html`

---

## ✅ Next Steps

1. ✅ Free tier authentication ready
2. ⏳ Test with login pages
3. ⏳ Add Login buttons to navigation
4. ⏳ Connect to PostgreSQL database (Phase 2)
5. ⏳ Add email verification (Phase 2)
6. ⏳ Add social login (Phase 3)
7. ⏳ Add MFA support (Phase 3)

---

**Ready to test?** Start the backend and visit `/dws10.com/dashboard/login/` 🚀

