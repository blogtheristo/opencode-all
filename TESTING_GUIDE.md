# 🧪 Authentication Testing Guide

**Complete testing instructions for Free Tier Authentication**

---

## 📋 Test Overview

This guide walks you through testing the complete authentication system for both DWS IQ Dashboard and OneLifetime Community.

### What You'll Test
✅ Login pages load correctly  
✅ Authentication flow works  
✅ Token generation and verification  
✅ Dashboard access control  
✅ Logout functionality  
✅ Error handling  
✅ Rate limiting  
✅ Token refresh  

**Estimated Time:** 30-45 minutes

---

## 🚀 Phase 1: Frontend Testing (No Backend Required)

### Test 1.1: Login Page Loads
```
Steps:
1. Open browser to https://dws10.com/dashboard/login/
2. Verify page loads correctly
3. Verify dark theme is applied
4. Verify form fields are visible
   - Email input
   - Password input
   - Remember me checkbox
   - Sign In button
   - Forgot password link
   - Social login buttons (Google, Microsoft)
```

**Expected Result:** ✅ Clean, professional login page with all fields visible

---

### Test 1.2: Community Login Page
```
Steps:
1. Open browser to https://onelifetime.world/community-login/
2. Verify page loads correctly
3. Verify OneLifetime branding (logo, colors)
4. Verify social buttons (Google, LinkedIn)
5. Verify benefits section shows
```

**Expected Result:** ✅ Community-themed login with OneLifetime branding

---

### Test 1.3: Dashboard Page Structure
```
Steps:
1. Open browser to https://dws10.com/dashboard/
2. Verify page has all sections:
   - Welcome message
   - Quick stats (8 industries, latency, etc.)
   - "Show Me How" tutorials section
   - Industry showcase
   - Logout button (top right)
3. Verify dark theme is consistent
```

**Expected Result:** ✅ Dashboard loads with all components visible

---

### Test 1.4: Form Validation
```
Steps:
1. Go to login page
2. Leave email empty, click Sign In
   → Should show validation error
3. Enter invalid email "notanemail", click Sign In
   → Should show validation error
4. Enter email, leave password empty, click Sign In
   → Should show validation error
5. Enter both fields correctly
   → Should submit form
```

**Expected Result:** ✅ Form validates all fields before submission

---

### Test 1.5: Mobile Responsiveness
```
Steps:
1. Open login page on desktop (browser width: 1920px)
   → Verify layout is wide and readable
2. Resize browser to 768px (tablet)
   → Verify layout adapts
3. Resize browser to 375px (mobile)
   → Verify login form is full width
   → Verify buttons are large enough to tap
   → Verify text is readable
4. Test on actual mobile device if possible
```

**Expected Result:** ✅ Page looks good on all screen sizes

---

## 🔌 Phase 2: Backend Testing (Local)

### Test 2.1: Start Backend Server

**Using Docker Compose (Recommended):**
```bash
cd D:\Proton\My\ files\2026\Repos2026\dws6
docker-compose up -d
```

Wait for output:
```
postgres-1  | database system is ready to accept connections
redis-1     | Ready to accept connections
auth-backend-1  | ✓ Server running on http://localhost:3001
```

**Or with npm:**
```bash
npm install
npm run dev
```

Wait for:
```
✓ Server running on http://localhost:3001
```

---

### Test 2.2: Health Check

```bash
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-15T10:00:00.000Z",
  "service": "DWS IQ Auth Backend",
  "version": "1.0.0"
}
```

**Result:** ✅ Backend is running and healthy

---

### Test 2.3: Login Endpoint - Valid Credentials

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@dws-iq.local",
    "password": "password123",
    "rememberMe": false,
    "communityMode": false
  }'
```

**Expected Response:**
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

**Result:** ✅ Login successful, JWT tokens generated

---

### Test 2.4: Login Endpoint - Invalid Password

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@dws-iq.local",
    "password": "wrongpassword",
    "rememberMe": false,
    "communityMode": false
  }'
```

**Expected Response (HTTP 401):**
```json
{
  "error": "Login failed",
  "message": "Invalid email or password"
}
```

**Result:** ✅ Invalid credentials rejected

---

### Test 2.5: Login Endpoint - Invalid Email

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "password123"
  }'
```

**Expected Response (HTTP 401):**
```json
{
  "error": "Login failed",
  "message": "Invalid email or password"
}
```

**Result:** ✅ Non-existent user rejected

---

### Test 2.6: Rate Limiting

```bash
# Run this 5 times in a row to trigger rate limit
for i in {1..6}; do
  echo "Attempt $i:"
  curl -X POST http://localhost:3001/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "wrongpassword"
    }'
  echo ""
done
```

**Expected Result on attempt 6:**
```json
{
  "error": "Too many login attempts",
  "message": "Please try again in 14 minutes",
  "retryAfter": 840
}
```

**Result:** ✅ Rate limiting prevents brute force attacks

---

### Test 2.7: Token Verification

**Copy the token from Test 2.3 and use it:**

```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_001",
    "email": "demo@dws-iq.local",
    "firstName": "Demo",
    "lastName": "User"
  }
}
```

**Result:** ✅ Token is valid and user data is retrieved

---

### Test 2.8: Token Refresh

**Use the refresh token from Test 2.3:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

**Expected Response:**
```json
{
  "message": "Token refreshed",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

**Result:** ✅ Refresh token generates new access token

---

### Test 2.9: Invalid Token

```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Response (HTTP 401):**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

**Result:** ✅ Invalid tokens are rejected

---

### Test 2.10: Missing Authorization Header

```bash
curl -X GET http://localhost:3001/api/v1/auth/me
```

**Expected Response (HTTP 401):**
```json
{
  "error": "Unauthorized",
  "message": "No authentication token provided"
}
```

**Result:** ✅ Missing auth header is rejected

---

## 🔐 Phase 3: Security Testing

### Test 3.1: Password Security Check

```bash
# Try empty password
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@dws-iq.local",
    "password": ""
  }'
```

**Expected:** Validation error

**Result:** ✅ Empty passwords rejected

---

### Test 3.2: Email Format Validation

```bash
# Try invalid email format
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "notanemail",
    "password": "password123"
  }'
```

**Expected:** Validation error

**Result:** ✅ Invalid email formats rejected

---

### Test 3.3: CORS Protection

**From browser console, try to login from a different domain:**

```javascript
fetch('http://localhost:3001/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'demo@dws-iq.local',
    password: 'password123'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

**Expected:** CORS error or blocked request (depending on browser)

**Result:** ✅ CORS prevents unauthorized cross-origin requests

---

### Test 3.4: Secure Cookie (Remember Me)

```bash
# Login with rememberMe: true
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@dws-iq.local",
    "password": "password123",
    "rememberMe": true
  }' \
  -v 2>&1 | grep -i "set-cookie"
```

**Expected:** Cookie header with refreshToken (httpOnly)

**Result:** ✅ Secure cookies are set properly

---

## 🎯 Phase 4: Integration Testing

### Test 4.1: Frontend to Backend Login Flow

**Steps:**
1. Start backend: `docker-compose up -d` or `npm run dev`
2. Open https://dws10.com/dashboard/login/ in browser
3. Open browser DevTools (F12)
4. Go to Network tab
5. Enter demo credentials:
   - Email: `demo@dws-iq.local`
   - Password: `password123`
6. Click "Sign In"

**Expected:**
- ✅ Network request to `/api/v1/auth/login` (POST)
- ✅ Response status: 200
- ✅ Response includes token
- ✅ Page redirects to `/dashboard/`
- ✅ Dashboard loads successfully

**Result:** ✅ Complete login flow works

---

### Test 4.2: Dashboard Access Without Login

**Steps:**
1. Open https://dws10.com/dashboard/ (without logging in)
2. Verify redirect to login page

**Expected:** Redirected to `/dashboard/login/`

**Result:** ✅ Dashboard is protected

---

### Test 4.3: Logout Flow

**Steps:**
1. Login successfully (from Test 4.1)
2. On dashboard, find logout button (top right)
3. Click logout button
4. Verify redirect to login page
5. Try to access dashboard again
   → Should redirect to login

**Expected:** Successfully logged out, session cleared

**Result:** ✅ Logout works correctly

---

### Test 4.4: Remember Me Functionality

**Steps:**
1. Login with "Remember me" checked
2. Close browser completely
3. Reopen browser to dashboard
4. Check if still logged in

**Expected:** Should still be logged in (token in cookie)

**Result:** ✅ Remember me keeps user logged in

---

### Test 4.5: Community Login Integration

**Steps:**
1. Open https://onelifetime.world/community-login/
2. Enter credentials (test@onelifetime.world / password123)
3. Verify different branding (OneLifetime logo)
4. Verify it uses same backend
5. Verify same user data returned

**Expected:** Community login works with unified backend

**Result:** ✅ Community login is integrated

---

## 📊 Test Results Summary

### Checklist

#### Frontend Tests
- [ ] Login page loads correctly
- [ ] Community login page loads
- [ ] Dashboard loads
- [ ] Form validation works
- [ ] Mobile responsive
- [ ] Dark theme consistent

#### Backend Tests (API)
- [ ] Health check works
- [ ] Login with valid credentials succeeds
- [ ] Login with invalid credentials fails
- [ ] Rate limiting works
- [ ] Token verification works
- [ ] Token refresh works
- [ ] Invalid token rejected
- [ ] Missing auth header rejected

#### Security Tests
- [ ] Password validation enforced
- [ ] Email format validated
- [ ] CORS protection active
- [ ] Secure cookies set
- [ ] Rate limiting prevents brute force
- [ ] No sensitive info in error messages

#### Integration Tests
- [ ] Frontend to backend login flow works
- [ ] Dashboard access control works
- [ ] Logout clears session
- [ ] Remember me functionality works
- [ ] Community login integrated

---

## 🐛 Troubleshooting

### Backend Won't Start

**Problem:** `docker-compose up -d` fails

**Solution:**
```bash
# Check if Docker is running
docker ps

# If not, start Docker and try again
docker-compose up -d

# Or use npm instead
npm install
npm run dev
```

---

### CORS Error

**Problem:** Browser shows CORS error

**Solution:**
1. Make sure backend is running on localhost:3001
2. Check CORS_ORIGIN in .env includes your domain
3. Try with `http://localhost:3000` first
4. Check browser console for exact error

---

### Invalid Token Error

**Problem:** "Invalid or expired token"

**Solution:**
1. Token expires after 24 hours
2. Use refresh token to get new token
3. Ensure token format is: `Bearer token_here`
4. Check token wasn't modified

---

### Rate Limit Triggered

**Problem:** "Too many login attempts"

**Solution:**
1. Wait 15 minutes before retrying
2. Use different email address to test
3. Restart backend to reset rate limit counters
4. Check RATE_LIMIT_WINDOW_MS in .env

---

### Database Connection Error

**Problem:** "Connection refused" for PostgreSQL

**Solution:**
1. PostgreSQL setup is for Phase 2
2. For now, demo users work without database
3. Docker Compose starts PostgreSQL automatically
4. Verify with: `docker ps`

---

## 📈 Performance Testing

### Page Load Time
- Login page: < 2 seconds
- Dashboard: < 3 seconds
- Expected: Very fast (static HTML)

**Test:**
```javascript
// In browser console
console.time('page-load');
// Page already loaded, so:
console.log('Page load: ' + performance.navigation.timing);
```

---

### API Response Time
- Login: < 500ms (demo mode)
- Token verification: < 100ms
- Refresh token: < 200ms

**Test:**
```bash
time curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@dws-iq.local","password":"password123"}'
```

---

## ✅ Sign-Off

After completing all tests, you can confirm:

- ✅ Frontend pages work correctly
- ✅ Backend API is functional
- ✅ Authentication flow is secure
- ✅ Error handling is appropriate
- ✅ Rate limiting prevents attacks
- ✅ System is production-ready

**Status:** Ready for deployment! 🚀

---

## 📞 Support

If you encounter issues:

1. Check `AUTH_QUICK_START.md` for common issues
2. Review `AUTH_IMPLEMENTATION.md` for API details
3. Check backend logs: `docker logs dws-auth-backend`
4. Test with curl before using frontend

---

**Test Date:** _______________  
**Tester Name:** _______________  
**Result:** _______________

---

**Last Updated:** December 15, 2025  
**Version:** 1.0.0

