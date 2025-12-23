# DWS6.com - Enterprise Authentication Portal

**Status:** 🟢 Active  
**Domain:** https://dws6.com  
**Purpose:** NIS2-Ready Enterprise Login & Authentication  
**Updated:** December 2025

---

## Overview

DWS6.com hosts the **secure authentication portal** for the DWS IQ platform with enterprise-grade security features:

- 🔐 **NIS2-Compliant** authentication system
- 🛡️ **Mandatory MFA** (TOTP, SMS, Email, Security Keys)
- 🔑 **Proton Key Support** for advanced encryption
- 🤖 **Watsonx Build Partnership** integration
- 🌐 **IBM ID OAuth** integration
- 📘 **Google Workspace** authentication
- 🇪🇺 **EU GDPR** compliant

---

## Folder Structure

```
dws6.com/
├── login/
│   └── index.html              # Main NIS2-ready login page
│       ├── Standard Login (Email/Password + MFA)
│       ├── Proton Key Tab
│       └── OAuth Tab (IBMid, Google, Watsonx)
│
├── dashboard/
│   ├── index.html              # Customer dashboard (after login)
│   └── login/
│       └── index.html          # Dashboard login redirect
│
├── admin/
│   └── index.html              # Admin portal (future)
│
└── README.md                   # This file
```

---

## Pages

### 1. `/login` - Main Authentication Portal

**URL:** https://dws6.com/login

**Features:**
- 📝 Standard Email/Password login
- 🔐 Mandatory MFA selection:
  - Authenticator App (TOTP) - Most secure
  - SMS 2FA - Backup method
  - Email 2FA - Easiest
  - Security Key (FIDO2/U2F) - Hardware backup
- 🔑 Proton Key authentication
- 🤖 Watsonx Build Partnership access
- 🌐 OAuth options (Google, Microsoft, Apple)

**Design:**
- IBM-style blue gradient (#0098FE)
- NIS2 compliance badges
- Build Partner indicators
- Dark theme (enterprise)

**Backend Ready:**
```
POST /api/auth/login
  - Email + password
  - MFA method selection
  - Return JWT token

POST /api/auth/mfa/verify
  - Verify MFA code

POST /api/auth/proton-key
  - Proton Key verification

POST /api/auth/oauth/{provider}
  - Google, IBM, Watsonx OAuth
```

### 2. `/dashboard` - Customer Dashboard

**URL:** https://dws6.com/dashboard

**Status:** Ready for backend integration  
**Features:**
- Show me how tutorials
- Usage analytics
- Account settings
- MFA management

### 3. `/admin` - Admin Portal

**URL:** https://dws6.com/admin

**Status:** Placeholder for future  
**Planned Features:**
- User management
- Audit logs
- System status
- Configuration

---

## Deployment

### Automatic Sync Workflow

```
You edit files in dws6.com/**
        ↓
git add dws6.com/**
git push origin main
        ↓
GitHub Actions: sync-dws6-landing-pages.yml
        ↓
Copies to landing-pages/dws6-com/**
        ↓
Cloudflare Pages auto-deploys
        ↓
Cache purge
        ↓
dws6.com live (~30 seconds)
```

### Manual Sync (if needed)

```bash
# From repository root
mkdir -p landing-pages/dws6-com
rsync -av --delete dws6.com/ landing-pages/dws6-com/
git add landing-pages/dws6-com/
git commit -m "chore: sync dws6.com to landing-pages"
git push origin main
```

---

## Maintenance

### Adding New Pages

1. **Create folder and files**
   ```bash
   mkdir -p dws6.com/new-feature/
   echo '...' > dws6.com/new-feature/index.html
   ```

2. **Commit and push**
   ```bash
   git add dws6.com/new-feature/
   git commit -m "Add new feature page"
   git push origin main
   ```

3. **Wait for auto-sync** (~30 seconds)

4. **Verify** at https://dws6.com/new-feature

### Updating Existing Pages

1. **Edit file**
   ```bash
   nano dws6.com/login/index.html
   ```

2. **Commit and push**
   ```bash
   git add dws6.com/login/
   git commit -m "Update login page"
   git push origin main
   ```

3. **Changes live in ~30 seconds**

### Testing Locally

```bash
# Open in browser
open dws6.com/login/index.html

# Or use Python server
cd dws6.com
python -m http.server 8000
# Visit http://localhost:8000/login
```

---

## Security Features

### Authentication Methods

| Method | Security Level | Setup Time | Notes |
|--------|----------------|-----------|-------|
| Password + TOTP | 🟢 High | 5 min | Best for most users |
| Password + SMS | 🟡 Medium | 3 min | Backup method |
| Password + Email | 🟡 Medium | 1 min | Easiest option |
| Security Key | 🟢 Very High | 10 min | Hardware token |
| Proton Key | 🟢 Very High | 15 min | Advanced encryption |

### Compliance

- ✅ **NIS2 Directive**: Mandatory MFA for all access
- ✅ **EU Cybersecurity Act**: Aligned with requirements
- ✅ **GDPR Article 6**: Legal basis documented
- ✅ **EU AI Act**: Compliance pathway ready
- ✅ **Data Minimization**: Minimal data collection
- ✅ **Right to Erasure**: Full account deletion available

### Security Headers

```html
<!-- Automatically applied by Cloudflare -->
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

---

## Backend Integration (When Ready)

### Required Endpoints

```javascript
// Authentication
POST /api/auth/login
POST /api/auth/mfa/verify
POST /api/auth/logout

// OAuth
POST /api/auth/oauth/google
POST /api/auth/oauth/ibm
POST /api/auth/oauth/watsonx

// Proton Key
POST /api/auth/proton-key

// Dashboard
GET /api/dashboard/user
GET /api/dashboard/usage
POST /api/dashboard/settings

// Admin (future)
GET /api/admin/users
GET /api/admin/audit-logs
POST /api/admin/system-status
```

### Frontend to Backend

The login form is ready to POST to your backend:

```javascript
function handleStandardLogin(event) {
  event.preventDefault();
  
  // Prepare data
  const data = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    mfa_method: document.querySelector('input[name="mfa"]:checked').value,
  };
  
  // POST to backend
  fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(data => {
    // Handle response: token, redirect, etc.
    localStorage.setItem('auth_token', data.token);
    window.location.href = '/dashboard';
  });
}
```

---

## Cloudflare Configuration

### DNS Records

```
Type  | Name  | Target                | Proxied
------|-------|----------------------|--------
CNAME | dws6  | dws6-com.pages.dev   | Yes (🟠)
```

### SSL/TLS

- **Encryption**: Full (strict)
- **Minimum TLS**: 1.2
- **HSTS**: Enabled (1 year)
- **Certificate**: Auto-renewal via Cloudflare

### Caching

- **HTML**: 30 min (browser), 1 hour (CDN)
- **Images**: 1 year
- **API**: Bypass (no caching)

---

## Monitoring

### Analytics

View at: https://dash.cloudflare.com

- Traffic overview
- Request counts
- Cache performance
- Status codes
- Top URLs

### Health Checks

**Manual:**
```bash
# HTTP status
curl -I https://dws6.com/login

# DNS resolution
nslookup dws6.com

# SSL certificate
openssl s_client -connect dws6.com:443
```

**Automated:**
- Cloudflare alerting (failures)
- GitHub Actions workflow status
- Uptime monitoring (optional)

---

## Troubleshooting

### Site not updating?

1. ✅ Edited `dws6.com/` folder? (not landing-pages)
2. ✅ Committed changes to `main` branch?
3. ✅ Check GitHub Actions: https://github.com/blogtheristo/dws6/actions
4. ✅ Clear browser cache (Ctrl+Shift+Delete)
5. ✅ Purge Cloudflare cache (Dashboard → Caching)

### HTTPS not working?

1. ✅ Wait 5-15 minutes for certificate
2. ✅ Check in incognito mode
3. ✅ Visit https://dws6.com (not http)
4. ✅ Verify Cloudflare SSL/TLS: Full (strict)

### Login not working?

1. ✅ Backend API configured?
2. ✅ CORS headers set?
3. ✅ Check browser console (F12)
4. ✅ Verify MFA method selected
5. ✅ Test with demo credentials (if available)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-15 | Initial NIS2-ready login page |
| 1.1 | 2025-12-15 | IBM styling + Watsonx integration |
| 1.2 | 2025-12-15 | Share buttons + responsive design |

---

## Related Documentation

- 📄 [DWS6 Deployment Setup](../DWS6_DEPLOYMENT_SETUP.md)
- 📄 [Cloudflare Setup Guide](../DWS6_CLOUDFLARE_SETUP.md)
- 📄 [Authentication Backend](../ADMIN_MANUAL_AUTHENTICATION.md)
- 📄 [Watsonx Integration](../WATSONX_INTEGRATION_GUIDE.md)

---

## Support & Contact

| Item | Value |
|------|-------|
| **Domain** | https://dws6.com |
| **Repository** | https://github.com/blogtheristo/dws6 |
| **Cloudflare** | https://dash.cloudflare.com |
| **Issues** | https://github.com/blogtheristo/dws6/issues |
| **Main Branch** | main |
| **Deploy From** | landing-pages/dws6-com/ |

---

**Last Updated:** December 2025  
**Maintained by:** AI Assistant + Team  
**License:** Enterprise (Lifetime Oy)

