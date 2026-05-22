# 🚀 DWS6.com Multi-Login Platform - Quick Start Guide

**Get up and running in 5 minutes!**

---

## ⚡ Super Quick Start

```bash
# 1. Get Supabase key
Visit: https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz
Copy the "anon" key from Settings → API

# 2. Update config
Edit: dws6.com/shared/config/supabase-config.js
Replace: YOUR_SUPABASE_ANON_KEY_HERE

# 3. Start local server
cd dws6.com
python -m http.server 8080

# 4. Open browser
http://localhost:8080/login/portal.html
```

---

## 🎯 What You Get

### 10 Login Pages
1. **DWS IQ Mobile V7** - `/login/dws-iq-mobile/`
2. **Store Management** - `/login/store/`
3. **DWS IQ 6 Platform** - `/login/dws-iq/`
4. **OneLifetime Community** - `/login/onelifetime/`
5. **LifetimeWorld Model** - `/login/lifetime-model/` (Vertex AI)
6. **Enterprise Client** - `/login/enterprise/`
7. **Enterprise Model** - `/login/enterprise-model/` (Vertex AI)
8. **Back-Office Admin** - `/login/backoffice/`
9. **API Developer Portal** - `/login/api/`
10. **MCP Hub** - `/login/mcp-hub/`

### 10 Dashboards
Each login type has a corresponding dashboard at `/dashboard/{type}/`

---

## 🔑 Supabase Setup (2 minutes)

### Step 1: Get Your Key
1. Go to: https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz
2. Click "Settings" (gear icon)
3. Click "API"
4. Copy the **anon/public** key (NOT the service_role key!)

### Step 2: Update Config
Open `dws6.com/shared/config/supabase-config.js`:

```javascript
export const supabaseConfig = {
  url: 'https://kpucuwwfhuwurdxyjjtz.supabase.co',
  anonKey: 'PASTE_YOUR_KEY_HERE', // ← Paste your key here
  // ... rest of config
};
```

### Step 3: Configure Redirect URLs
1. In Supabase dashboard, go to "Authentication" → "URL Configuration"
2. Add these redirect URLs:
```
http://localhost:8080/dashboard/dws-iq-mobile/index.html
http://localhost:8080/dashboard/store/index.html
http://localhost:8080/dashboard/dws-iq/index.html
http://localhost:8080/dashboard/onelifetime/index.html
http://localhost:8080/dashboard/lifetime-model/index.html
http://localhost:8080/dashboard/enterprise/index.html
http://localhost:8080/dashboard/enterprise-model/index.html
http://localhost:8080/dashboard/backoffice/index.html
http://localhost:8080/dashboard/api/index.html
http://localhost:8080/dashboard/mcp-hub/index.html
```

---

## 🧪 Test It Out

### Create a Test User

1. Visit any login page (e.g., http://localhost:8080/login/dws-iq-mobile/)
2. Open browser console (F12)
3. Run this code:

```javascript
// Initialize Supabase (if not already done)
const supabase = window.supabase.createClient(
  'https://kpucuwwfhuwurdxyjjtz.supabase.co',
  'YOUR_ANON_KEY_HERE'
);

// Create test user
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

console.log('User created:', data);
```

4. Check your email for verification link
5. Click verification link
6. Login with `test@dws6.com` / `TestPassword123!`

---

## 🎨 Customization

### Add a New Role

1. **Update Config** (`shared/config/supabase-config.js`):
```javascript
redirectUrls: {
  // ... existing roles
  'new_role': '/dashboard/new-role/index.html'
},
roleNames: {
  // ... existing roles
  'new_role': 'New Role Name'
}
```

2. **Create Login Page** (`login/new-role/index.html`):
```javascript
const ROLE = 'new_role';
```

3. **Create Dashboard** (`dashboard/new-role/index.html`):
```javascript
await requireRole('new_role');
```

---

## 🚀 Deploy to Production

### Option 1: Cloudflare Pages (Recommended)
```bash
# Install Wrangler
npm install -g wrangler

# Deploy
cd dws6.com
wrangler pages publish . --project-name=dws6

# Done! Your site is live at: https://dws6.pages.dev
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd dws6.com
netlify deploy --dir=. --prod

# Done! Your site is live
```

### Option 3: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd dws6.com
vercel --prod

# Done! Your site is live
```

### After Deployment
1. Update Supabase redirect URLs with production URLs
2. Configure custom domain (dws6.com)
3. SSL certificates (automatic with most providers)

---

## 📊 File Structure

```
dws6.com/
├── shared/              # Shared components
│   ├── config/          # Configuration
│   ├── js/              # JavaScript modules
│   └── css/             # Styles
├── login/               # 10 login pages
├── dashboard/           # 10 dashboards
├── README.md            # Full documentation
├── SUPABASE_SETUP.md    # Detailed Supabase guide
└── QUICK_START.md       # This file
```

---

## 🔧 Troubleshooting

### "Invalid API key"
- Double-check you copied the `anon` key, not `service_role` key
- Make sure there are no extra spaces in the key

### "Redirect URL not allowed"
- Add the URL to Supabase dashboard: Authentication → URL Configuration
- Make sure the URL matches exactly (including http:// or https://)

### "User already registered"
- Use password reset flow instead
- Or try logging in instead of signing up

### Login works but dashboard shows error
- Check browser console for errors
- Verify user has correct role in metadata
- Check that dashboard file exists

---

## 📞 Need Help?

- **Full Documentation**: See `README.md`
- **Supabase Setup**: See `SUPABASE_SETUP.md`
- **Implementation Status**: See `IMPLEMENTATION_STATUS.md`
- **Support**: support@dws6.com

---

## ✅ Checklist

- [ ] Got Supabase anon key
- [ ] Updated `supabase-config.js`
- [ ] Configured redirect URLs in Supabase
- [ ] Started local server
- [ ] Created test user
- [ ] Tested login flow
- [ ] Tested dashboard access
- [ ] Tested logout
- [ ] Ready to deploy!

---

**Status**: ✅ Ready to use!  
**Time to setup**: ~5 minutes  
**Cost**: $0 (Supabase free tier)

🎉 **Happy coding!**
