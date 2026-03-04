# DWS6.com Deployment Options - FREE Solutions

**Current Status**: Local files ready, not yet deployed  
**Goal**: Deploy to dws6.com with zero or minimal cost  
**Date**: December 28, 2025

---

## 🚨 Important: Supabase Custom Domains

**Supabase custom domains cost $10/month** (Pro Plan add-on)

**Our Strategy**: Use **free hosting** for dws6.com frontend, connect to Supabase backend

---

## 🎯 Recommended: FREE Hosting Options

### Option 1: Cloudflare Pages (BEST - 100% FREE)

**Cost**: $0/month  
**Custom Domain**: FREE  
**SSL**: FREE (automatic)  
**Bandwidth**: Unlimited  
**Build Time**: Unlimited

#### Setup Steps:

1. **Create Cloudflare Account** (free)
   - Visit: https://dash.cloudflare.com/sign-up

2. **Add Your Domain to Cloudflare**
   - Add dws6.com to Cloudflare
   - Update nameservers at your domain registrar
   - Wait for DNS propagation (5-30 min)

3. **Deploy via Wrangler CLI**
   ```bash
   # Install Wrangler
   npm install -g wrangler
   
   # Login
   wrangler login
   
   # Deploy
   cd "D:\Proton\My files\2026\Repos2026\dws6\dws6.com"
   wrangler pages deploy . --project-name=dws6
   ```

4. **Configure Custom Domain**
   - In Cloudflare Pages dashboard
   - Add custom domain: dws6.com
   - DNS records added automatically
   - SSL certificate issued automatically

**Pros**:
- ✅ Completely free
- ✅ Unlimited bandwidth
- ✅ Global CDN
- ✅ Automatic SSL
- ✅ Fast deployment
- ✅ Custom domain included

**Cons**:
- Requires Cloudflare nameservers

---

### Option 2: Netlify (FREE)

**Cost**: $0/month  
**Custom Domain**: FREE  
**SSL**: FREE (automatic)  
**Bandwidth**: 100GB/month  
**Build Minutes**: 300/month

#### Setup Steps:

1. **Create Netlify Account** (free)
   - Visit: https://app.netlify.com/signup

2. **Deploy via CLI**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login
   netlify login
   
   # Deploy
   cd "D:\Proton\My files\2026\Repos2026\dws6\dws6.com"
   netlify deploy --prod
   ```

3. **Add Custom Domain**
   - In Netlify dashboard → Domain settings
   - Add custom domain: dws6.com
   - Update DNS at your registrar (or use Netlify DNS)
   - SSL certificate issued automatically

**Pros**:
- ✅ Free tier generous
- ✅ Easy to use
- ✅ Great documentation
- ✅ Automatic SSL

**Cons**:
- 100GB bandwidth limit (should be enough)

---

### Option 3: Vercel (FREE)

**Cost**: $0/month  
**Custom Domain**: FREE  
**SSL**: FREE (automatic)  
**Bandwidth**: 100GB/month  
**Build Time**: 6000 minutes/month

#### Setup Steps:

1. **Create Vercel Account** (free)
   - Visit: https://vercel.com/signup

2. **Deploy via CLI**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   cd "D:\Proton\My files\2026\Repos2026\dws6\dws6.com"
   vercel --prod
   ```

3. **Add Custom Domain**
   - In Vercel dashboard → Settings → Domains
   - Add domain: dws6.com
   - Update DNS records at your registrar
   - SSL certificate issued automatically

**Pros**:
- ✅ Excellent performance
- ✅ Great developer experience
- ✅ Automatic SSL

**Cons**:
- 100GB bandwidth limit

---

## 📊 Comparison Table

| Feature | Cloudflare Pages | Netlify | Vercel |
|---------|-----------------|---------|--------|
| **Cost** | $0 | $0 | $0 |
| **Custom Domain** | ✅ FREE | ✅ FREE | ✅ FREE |
| **SSL** | ✅ Auto | ✅ Auto | ✅ Auto |
| **Bandwidth** | ∞ Unlimited | 100GB | 100GB |
| **Build Time** | ∞ Unlimited | 300 min | 6000 min |
| **CDN** | ✅ Global | ✅ Global | ✅ Global |
| **Setup** | Easy | Easy | Easy |

**Recommendation**: **Cloudflare Pages** (unlimited everything)

---

## 🚀 Quick Deploy Guide (Cloudflare Pages)

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

### Step 3: Deploy

```bash
cd "D:\Proton\My files\2026\Repos2026\dws6\dws6.com"
wrangler pages deploy . --project-name=dws6
```

### Step 4: Add Custom Domain

1. Go to: https://dash.cloudflare.com/
2. Select your Pages project
3. Go to "Custom domains"
4. Click "Set up a custom domain"
5. Enter: dws6.com
6. Click "Continue"
7. DNS records added automatically
8. Wait 5-10 minutes for SSL

**Done!** Your site is live at https://dws6.com

---

## 🔧 Configuration After Deployment

### 1. Update Supabase URLs

Go to: https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz/settings/auth

**Site URL**: `https://dws6.com`

**Redirect URLs** (add all 11):
```
https://dws6.com/dashboard/dws-iq-mobile/
https://dws6.com/dashboard/store/
https://dws6.com/dashboard/dws-iq/
https://dws6.com/dashboard/onelifetime/
https://dws6.com/dashboard/lifetime-model/
https://dws6.com/dashboard/enterprise/
https://dws6.com/dashboard/enterprise-model/
https://dws6.com/dashboard/backoffice/
https://dws6.com/dashboard/api/
https://dws6.com/dashboard/mcp-hub/
https://dws6.com/dashboard/watsonx/
```

### 2. Update Google OAuth

Go to: https://console.cloud.google.com/apis/credentials

**Authorized JavaScript origins**:
```
https://dws6.com
```

**Authorized redirect URIs**:
```
https://kpucuwwfhuwurdxyjjtz.supabase.co/auth/v1/callback
```

### 3. Get Supabase Anon Key

1. Go to: https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz/settings/api
2. Copy the "anon" key
3. Update `dws6.com/shared/config/supabase-config.js`:
   ```javascript
   anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Your actual key
   ```
4. Redeploy

---

## 💰 Cost Breakdown

### Current Setup (FREE)

| Service | Plan | Cost | What It Provides |
|---------|------|------|------------------|
| **Cloudflare Pages** | Free | $0/mo | Hosting, CDN, SSL |
| **Supabase** | Free | $0/mo | Auth, Database (50K MAU) |
| **Domain** | Owned | ~$12/yr | dws6.com |
| **Total** | - | **$0/mo** | Full platform |

### If You Needed More (Optional)

| Service | Plan | Cost | When Needed |
|---------|------|------|-------------|
| Supabase Pro | Pro | $25/mo | > 50K MAU |
| Cloudflare Pages | Pro | $20/mo | Advanced features (not needed) |

**Current**: $0/month (completely free!)

---

## 🧪 Testing Before Deployment

### Local Testing (Already Running)

```
http://localhost:8080/login/portal.html
```

**Test checklist**:
- [ ] Login portal loads
- [ ] All 11 login pages accessible
- [ ] All 11 dashboards accessible
- [ ] Styling looks correct
- [ ] No console errors

### After Deployment Testing

```
https://dws6.com/login/portal.html
```

**Test checklist**:
- [ ] Site loads over HTTPS
- [ ] SSL certificate valid
- [ ] Login with email/password works
- [ ] Google OAuth works
- [ ] Redirects to correct dashboard
- [ ] Logout works
- [ ] All 11 user types work

---

## 📋 Deployment Checklist

### Pre-Deployment
- [x] Local files created
- [x] Local server running (http://localhost:8080)
- [ ] Supabase anon key obtained
- [ ] `supabase-config.js` updated with key
- [ ] Tested locally

### Deployment
- [ ] Choose hosting (Cloudflare Pages recommended)
- [ ] Install CLI tool
- [ ] Deploy to hosting
- [ ] Add custom domain (dws6.com)
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate

### Post-Deployment
- [ ] Update Supabase redirect URLs
- [ ] Update Google OAuth origins
- [ ] Test all 11 login flows
- [ ] Test on mobile devices
- [ ] Monitor for errors

---

## 🎯 Next Steps

**Right Now**:
1. Visit http://localhost:8080/login/portal.html to see your work locally
2. Get Supabase anon key
3. Update `supabase-config.js`
4. Test login works locally

**When Ready to Deploy**:
1. Install Wrangler: `npm install -g wrangler`
2. Deploy: `wrangler pages deploy . --project-name=dws6`
3. Add custom domain in Cloudflare dashboard
4. Update Supabase URLs

**Estimated Time**: 30 minutes total

---

## 📞 Support

- **Cloudflare Pages**: https://developers.cloudflare.com/pages/
- **Netlify**: https://docs.netlify.com/
- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs

---

**Status**: ✅ Ready to deploy (FREE hosting available)  
**Recommended**: Cloudflare Pages (unlimited bandwidth)  
**Cost**: $0/month
