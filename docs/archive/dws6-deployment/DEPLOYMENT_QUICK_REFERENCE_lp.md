# 🚀 DWS6.com Deployment - Quick Reference

**One-page guide with all the links and info you need**

---

## 📍 Important Links

### Cloudflare
- **Dashboard**: https://dash.cloudflare.com/
- **Workers & Pages**: https://dash.cloudflare.com/ → Workers & Pages
- **Upload Method**: Workers & Pages → Create → Pages → Upload assets

### Supabase
- **Project Dashboard**: https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz
- **Auth Settings**: https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz/settings/auth
- **API Keys**: https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz/settings/api

---

## 📋 Deployment Steps

### 1. Upload to Cloudflare (5 min)
1. Go to: https://dash.cloudflare.com/
2. Workers & Pages → Create → Pages → Upload assets
3. Project name: `dws6-platform`
4. Upload entire `dws6.com` folder
5. Click "Deploy"

### 2. Add Domain (2 min)
1. In project → Custom domains → Set up custom domain
2. Enter: `dws6.com`
3. Wait for SSL (2-5 min)

### 3. Configure Supabase (3 min)
1. Site URL: `https://dws6.com`
2. Add 11 redirect URLs (see below)

---

## 🔗 Supabase Redirect URLs

**Copy these into Supabase Auth Settings → Redirect URLs:**

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

---

## 🧪 Test URLs

After deployment, verify these work:

- ✅ https://dws6.com (homepage)
- ✅ https://dws6.com/login/ (login portal)
- ✅ https://dws6.com/login/dws-iq-mobile/ (mobile login)
- ✅ https://dws6.com/dashboard/v9/ (V9 dashboard)

---

## 📁 Files to Upload

**Location**: `D:\Proton\My files\2026\Repos2026\dws6\dws6.com\`

**Include everything in this folder**:
- index.html
- login/ (all subfolders)
- dashboard/ (all subfolders)
- shared/ (config, js, css)
- demo/
- auth-debug/

---

## 💰 Cost

- **Cloudflare Pages**: $0/month
- **Supabase**: $0/month (up to 50K users)
- **Total**: **$0/month** 🎉

---

## 🎯 User Types (11 Total)

1. DWS IQ Mobile - `/login/dws-iq-mobile/`
2. Store Manager - `/login/store/`
3. DWS IQ Standard - `/login/dws-iq/`
4. OneLifetime - `/login/onelifetime/`
5. Lifetime Model - `/login/lifetime-model/`
6. Enterprise Client - `/login/enterprise/`
7. Enterprise Model - `/login/enterprise-model/`
8. Back Office - `/login/backoffice/`
9. API Developer - `/login/api/`
10. MCP Hub - `/login/mcp-hub/`
11. WatsonX - `/login/watsonx/`

---

## 🔧 Troubleshooting

### "Can't find domain"
→ Add dws6.com to Cloudflare first

### "SSL pending"
→ Wait 5-10 minutes, it's automatic

### "Login redirect fails"
→ Check all 11 URLs added to Supabase

### "Authentication error"
→ Verify Site URL is `https://dws6.com`

---

## ✅ Success Checklist

- [ ] Site live at https://dws6.com
- [ ] SSL certificate active (🔒 in browser)
- [ ] Homepage loads correctly
- [ ] Login portal shows 11 options
- [ ] Can access login pages
- [ ] Supabase configured
- [ ] Mobile responsive

---

## 📞 Support Links

- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Supabase Docs**: https://supabase.com/docs/guides/auth
- **Project README**: See `dws6.com/README.md`

---

**Time to Deploy**: 10 minutes  
**Difficulty**: Easy 🟢  
**Cost**: FREE 🎉

---

**Quick Start**: Go to https://dash.cloudflare.com/ and upload the `dws6.com` folder!
