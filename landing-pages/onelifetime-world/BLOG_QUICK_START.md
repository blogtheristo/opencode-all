# Blog System - Quick Start Guide

## 🚀 Get Your Blog Running in 15 Minutes

### Prerequisites
- Supabase account (free): [supabase.com](https://supabase.com)
- Node.js installed (for import script)

---

## Step 1: Create Supabase Project (3 min)

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Fill in:
   - **Name**: `onelifetime-blog`
   - **Database Password**: (generate strong password)
   - **Region**: `Europe (Frankfurt)` or `Europe (London)` (for GDPR)
3. Click **Create Project** → Wait ~2 minutes

---

## Step 2: Get Your Credentials (1 min)

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values:

```bash
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 3: Create Database Tables (2 min)

1. Go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `onelifetime.world/lib/blog-supabase.ts`
4. Copy the entire `BLOG_SCHEMA` constant (lines 300-500+)
5. Paste into SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. ✅ You should see "Success. No rows returned"

**Verify**: Go to **Table Editor** → You should see 3 tables:
- `blog_posts`
- `blog_categories`
- `blog_tags`

---

## Step 4: Import Your Blog Posts (5 min)

### A. Set Environment Variables

**Windows (PowerShell)**:
```powershell
$env:SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
$env:SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Mac/Linux (Terminal)**:
```bash
export SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
export SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### B. Install Dependencies

```bash
cd onelifetime.world
npm install gray-matter @supabase/supabase-js ts-node @types/node
```

### C. Run Import Script

```bash
npx ts-node scripts/import-blog-posts.ts
```

**Expected Output**:
```
🚀 Starting blog post import...
📂 Reading blog posts from: ...
📄 Found 767 markdown files
✅ Imported: Blog the mention
✅ Imported: Climate change third edition
...
📊 Import Summary:
✅ Successfully imported: 767
⏭️  Skipped (already exists): 0
❌ Errors: 0
```

---

## Step 5: Configure Frontend (2 min)

### A. Update Blog Index Page

Open `onelifetime.world/blog/index-dynamic.html`

Find lines ~120-121:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Replace with your credentials:
```javascript
const SUPABASE_URL = 'https://xxxxxxxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### B. Update Blog Post Page

Open `onelifetime.world/blog/post.html`

Find lines ~180-181:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Replace with your credentials (same as above).

---

## Step 6: Test Locally (2 min)

### Option A: Simple HTTP Server (Python)

```bash
cd onelifetime.world
python -m http.server 8000
```

Open: http://localhost:8000/blog/index-dynamic.html

### Option B: Node.js HTTP Server

```bash
npm install -g http-server
cd onelifetime.world
http-server -p 8000
```

Open: http://localhost:8000/blog/index-dynamic.html

### Option C: VS Code Live Server

1. Install "Live Server" extension
2. Right-click `index-dynamic.html`
3. Select "Open with Live Server"

---

## Step 7: Deploy to Production (1 min)

### Option A: Rename File (Simplest)

```bash
cd onelifetime.world/blog
mv index.html index-old.html
mv index-dynamic.html index.html
```

### Option B: Update Your Server Config

Point `/blog/` to serve `index-dynamic.html`

### Option C: Create Redirect

In `index.html`:
```html
<meta http-equiv="refresh" content="0; url=index-dynamic.html">
```

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Database tables created (3 tables visible)
- [ ] 767 blog posts imported
- [ ] Frontend credentials updated
- [ ] Blog index page loads without errors
- [ ] Search works
- [ ] Individual blog posts load
- [ ] View count increments

---

## 🎉 You're Done!

Your blog is now running with:
- ✅ 767 imported blog posts
- ✅ Full-text search
- ✅ Tag and category filtering
- ✅ View count tracking
- ✅ Mobile-responsive design
- ✅ Dark theme
- ✅ SEO-optimized

---

## 🔧 Troubleshooting

### "Unable to load blog posts"

**Check 1**: Browser Console (F12)
- Look for errors
- Verify Supabase URL and key are correct

**Check 2**: Supabase Dashboard
- Go to **Table Editor** → `blog_posts`
- Verify posts exist
- Check `status` column (should be 'published')

**Check 3**: Network Tab (F12)
- Look for failed requests
- Check response status codes

### "Posts imported but not showing"

**Solution**: Check post status
```sql
-- Run in Supabase SQL Editor
UPDATE blog_posts SET status = 'published' WHERE status = 'draft';
```

### "Import script fails"

**Common Issues**:
1. Wrong service key (use service_role, not anon key)
2. File path incorrect (check `Admin/Sites-Archive/...`)
3. Permissions issue (run with elevated permissions)

---

## 📚 Next Steps

### Immediate
1. Test all functionality
2. Check SEO (meta tags, descriptions)
3. Monitor performance (Supabase dashboard)

### Short-term
- Add admin interface for creating new posts
- Set up automated backups
- Configure custom domain
- Add Google Analytics

### Long-term
- Implement comments system
- Add RSS feed
- Create newsletter signup
- Add related posts feature

---

## 📞 Support

**Need Help?**
- Email: risto@lifetime.fi
- Documentation: See `BLOG_SUPABASE_SETUP.md`
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)

---

**Total Time**: ~15 minutes  
**Difficulty**: Easy  
**Cost**: $0 (Supabase free tier)  
**Result**: Production-ready blog with 767 posts! 🎉
