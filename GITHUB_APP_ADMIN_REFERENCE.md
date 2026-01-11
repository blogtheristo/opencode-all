# 🔐 GITHUB APP INTEGRATION - ADMIN REFERENCE

**Version:** 1.0  
**Date:** 03.01.2026  
**Status:** ✅ ACTIVE  

---

## 📊 QUICK REFERENCE

### GitHub App Details
- **App Name:** DWS6-MCP
- **Owner:** blogtheristo
- **Webhook URL:** https://dws6.com/webhooks/github
- **Status:** ✅ Active on 2 repositories

### Installed Repositories
✅ blogtheristo/dws6  
✅ blogtheristo/onelifetime-world  
⏳ blogtheristo/dws10 (pending)

### Supported Domains
- dws10.com
- dws6.com
- onelifetime.world

---

## 🔐 SECURITY

### Credentials Location
- `.env.local` (root) - NEVER commit
- `Admin/secrets/` - Backup storage

### Files
```
.env.local
├── GITHUB_APP_ID
├── GITHUB_APP_PRIVATE_KEY (RSA 2048-bit)
├── GITHUB_APP_WEBHOOK_SECRET
└── GITHUB_WEBHOOK_PORT=3001
```

### Permissions
- Contents: Read & write
- Pull requests: Read & write
- Issues: Read & write
- Workflows: Read & write

---

## 🚀 OPERATIONS

### Start Webhook Handler
```bash
node github-webhook-handler.js
```

### Health Check
```bash
curl http://localhost:3001/webhooks/github/health
```

### View Configuration
```bash
curl http://localhost:3001/webhooks/github/config
```

---

## 🔒 MAINTENANCE

### Quarterly (Every 90 Days)
- [ ] Rotate webhook secret
- [ ] Review permissions
- [ ] Security audit

### Annually
- [ ] Regenerate private key
- [ ] Comprehensive security review

---

## 🆘 INCIDENT RESPONSE

### If Private Key Compromised
1. Revoke in GitHub immediately
2. Generate new private key
3. Update `.env.local`
4. Restart webhook handler

### If Webhook Secret Compromised
1. Generate new secret in GitHub
2. Update `.env.local`
3. Restart webhook handler

---

## 📚 DOCUMENTATION

**Full Security Manual:**  
`Admin/Security/GITHUB_APP_SECURITY_ADMIN.md`

**Setup Guides:**
- `GITHUB_API_OAUTH_SSL_SETUP.md`
- `GITHUB_WEBHOOK_SETUP.md`
- `ARGUS_CODE_REVIEW_SETUP.md`

---

**Security Level:** HIGH  
**Access:** Administrator Only  
**Next Review:** 03.04.2026
