# DWS6.com Multi-Login Platform

**A unified authentication portal serving 10 distinct user types with role-based access control.**

---

## 🚀 Quick Start

### 1. Configure Supabase (5 minutes)

```bash
# 1. Get your Supabase credentials
# Visit: https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz
# Go to: Settings → API
# Copy: Project URL and anon/public key

# 2. Update configuration
# Edit: dws6.com/shared/config/supabase-config.js
# Line 10: Replace 'YOUR_SUPABASE_ANON_KEY_HERE' with your actual key
```

### 2. Configure Supabase Redirects

In Supabase dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Add **Site URL**: `https://dws6.com`
3. Add **Redirect URLs** (copy all 10):
   ```
   https://dws6.com/dashboard/dws-iq-mobile/index.html
   https://dws6.com/dashboard/store/index.html
   https://dws6.com/dashboard/dws-iq/index.html
   https://dws6.com/dashboard/onelifetime/index.html
   https://dws6.com/dashboard/lifetime-model/index.html
   https://dws6.com/dashboard/enterprise/index.html
   https://dws6.com/dashboard/enterprise-model/index.html
   https://dws6.com/dashboard/backoffice/index.html
   https://dws6.com/dashboard/api/index.html
   https://dws6.com/dashboard/mcp-hub/index.html
   ```

### 3. Create Test User

Open browser console on any login page:

```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'test@dws6.com',
  password: 'TestPassword123!',
  options: {
    data: {
      role: 'dws_iq_mobile',
      permissions: ['read', 'write']
    }
  }
});
```

### 4. Test Login

1. Visit: `dws6.com/login/portal.html`
2. Select a login type
3. Enter test credentials
4. Verify redirect to dashboard

---

## 📋 10 Login Types

| # | Login Type | Role | URL | Target Users |
|---|------------|------|-----|--------------|
| 1 | DWS IQ Mobile V7 | `dws_iq_mobile` | `/login/dws-iq-mobile/` | Field workers |
| 2 | Store Management | `store_viewer` | `/login/store/` | Store managers |
| 3 | DWS IQ 6 Platform | `dws_iq_standard` | `/login/dws-iq/` | Project managers |
| 4 | OneLifetime Community | `community_user` | `/login/onelifetime/` | Community members |
| 5 | LifetimeWorld Model | `lifetime_model` | `/login/lifetime-model/` | AI researchers |
| 6 | Enterprise Client | `enterprise_client` | `/login/enterprise/` | Enterprise customers |
| 7 | Enterprise Model | `enterprise_model` | `/login/enterprise-model/` | Enterprise AI teams |
| 8 | Back-Office Admin | `backoffice_admin` | `/login/backoffice/` | Administrators |
| 9 | API Developer Portal | `api_developer` | `/login/api/` | Developers |
| 10 | MCP Hub | `mcp_admin` | `/login/mcp-hub/` | AI orchestration |

---

## 🎯 Features

### Authentication
- ✅ Email/password login
- ✅ Google OAuth (ready)
- ✅ Password reset
- ✅ Remember me
- ✅ Session management
- ✅ Role-based access control

### Security
- ✅ JWT tokens (Supabase)
- ✅ Secure password hashing
- ✅ Rate limiting
- ✅ HTTPS ready
- ✅ CORS configuration
- ✅ Role-based authorization

### User Experience
- ✅ Consistent UI
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Success messages
- ✅ Intuitive navigation

---

## 📁 Key Files

```
dws6.com/
├── shared/
│   ├── config/supabase-config.js    # ⚙️ Configure Supabase here
│   ├── js/
│   │   ├── supabase-client.js       # Supabase initialization
│   │   ├── auth-handler.js          # Auth functions
│   │   └── role-router.js           # Role-based routing
│   └── css/auth-styles.css          # Shared styles
│
├── login/
│   ├── portal.html                  # 🏠 Start here
│   └── [10 login pages]             # Role-specific logins
│
├── dashboard/
│   └── [10 dashboard pages]         # Post-login views
│
├── SUPABASE_SETUP.md                # 📖 Detailed setup guide
├── IMPLEMENTATION_COMPLETE.md       # 📊 Implementation details
└── README_MULTI_LOGIN.md            # 📘 This file
```

---

## 🔧 Configuration

### Required
1. **Supabase Anon Key** - Update in `shared/config/supabase-config.js`
2. **Redirect URLs** - Configure in Supabase dashboard

### Optional
- Google OAuth (Supabase → Authentication → Providers)
- Custom SMTP (Supabase → Settings → Auth → SMTP)
- Email templates (Supabase → Authentication → Email Templates)

---

## 🧪 Testing

### Test All Roles

Create test users for each role:

```javascript
const roles = [
  'dws_iq_mobile', 'store_viewer', 'dws_iq_standard',
  'community_user', 'lifetime_model', 'enterprise_client',
  'enterprise_model', 'backoffice_admin', 'api_developer', 'mcp_admin'
];

for (const role of roles) {
  await supabase.auth.signUp({
    email: `test-${role}@dws6.com`,
    password: 'TestPassword123!',
    options: { data: { role, permissions: ['read', 'write'] } }
  });
}
```

### Test Role-Based Access

1. Login with `dws_iq_mobile` role
2. Try accessing `/dashboard/enterprise/`
3. Should redirect to `/dashboard/dws-iq-mobile/`
4. Verify only authorized dashboard is accessible

---

## 🐛 Common Issues

**"Invalid API key"**
→ Update `shared/config/supabase-config.js` with actual anon key

**"Redirect URL not allowed"**
→ Add dashboard URLs to Supabase redirect configuration

**Login works but redirect fails**
→ Check browser console. Verify role in user metadata

**Module not found**
→ Check file paths. Ensure all files in correct directories

---

## 📚 Documentation

- **Setup Guide**: [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md)
- **Implementation Details**: [`IMPLEMENTATION_COMPLETE.md`](IMPLEMENTATION_COMPLETE.md)
- **Supabase Docs**: https://supabase.com/docs

---

## 🎉 What's Included

- ✅ **29 files** created
- ✅ **10 login pages** with role-specific branding
- ✅ **10 dashboard pages** with authorization
- ✅ **Full authentication system** with Supabase
- ✅ **Role-based access control** for 10 user types
- ✅ **Store preview integration** with demo button
- ✅ **Comprehensive documentation**

---

## 🚀 Deployment

### Local Testing
```bash
# Serve files with any static server
python -m http.server 8080
# or
npx serve dws6.com
```

Visit: `http://localhost:8080/login/portal.html`

### Production
1. Configure Supabase credentials
2. Set up DNS (if using subdomains)
3. Configure SSL certificates
4. Deploy to web server
5. Test all login flows

---

## 📞 Support

- **Supabase**: https://supabase.com/docs
- **Discord**: https://discord.supabase.com
- **Email**: support@dws6.com

---

**Status**: ✅ Complete - Ready for Configuration  
**Last Updated**: December 28, 2025  
**Next Step**: Configure Supabase credentials
