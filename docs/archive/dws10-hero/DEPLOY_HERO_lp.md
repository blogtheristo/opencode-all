# €500K Campaign Hero Section - Deployment Guide

**Version:** 1.0  
**Last Updated:** December 26, 2025  
**Status:** Active  
**Classification:** Public - Deployment Instructions  
**Applies To:** Development Team, DevOps  
**Repository:** [blogtheristo/dws6](https://github.com/blogtheristo/dws6)  
**Live Site:** https://dws10.com

---

## 🎉 What's Done

✅ **Hero section added** to `index.html` (at the very top)
✅ **Folder structure created**: `public/videos/`
✅ **HTML paths updated** to use `public/videos/`
✅ **Professional design** with responsive layout
✅ **All text exactly as specified**:
   - H1: "Making you one of the heroes of construction."
   - Three bold italic lines
   - Supporting text
   - CTA: "DWS IQ 6 - get fit for 55. Now."
   - Two action buttons

## ⚠️ What You Need to Do

### STEP 1: Add Video Files (2 minutes)

You need to add 3 files to: `D:\Proton\My files\2026\Repos2026\dws6\dws10.com\public\videos\`

**Required files:**
1. `gemini_generated_video_EA97318F.mp4` (2.2MB)
2. `gemini_generated_video_EA97318F.webm` (1.2MB) 
3. `construction-poster.jpg` (307KB)

**Where to get them:**
- These were provided by Claude in the earlier chat conversation
- Download them from the chat
- OR use the original video you uploaded and I'll optimize it

**How to add:**

**Option A: File Explorer (Easiest)**
1. Download the 3 files
2. Open File Explorer
3. Go to: `D:\Proton\My files\2026\Repos2026\dws6\dws10.com\public\videos\`
4. Copy/paste the files there

**Option B: PowerShell**
```powershell
# If files are in Downloads:
copy "C:\Users\risto\Downloads\gemini_generated_video_EA97318F.*" "D:\Proton\My files\2026\Repos2026\dws6\dws10.com\public\videos\"
copy "C:\Users\risto\Downloads\construction-poster.jpg" "D:\Proton\My files\2026\Repos2026\dws6\dws10.com\public\videos\"
```

### STEP 2: Test Locally (1 minute)

```powershell
# Open in browser
start "D:\Proton\My files\2026\Repos2026\dws6\dws10.com\index.html"
```

**What you should see:**
- Hero section at the very top
- Big headline: "Making you one of the heroes of construction."
- Three bold italic statements
- Video playing (or placeholder if files not added yet)
- "DWS IQ 6 - get fit for 55. Now." in gold
- Two buttons: "Start Your Transformation" + "See How It Works"

### STEP 3: Deploy to Production (5 minutes)

```powershell
cd "D:\Proton\My files\2026\Repos2026\dws6"

# Add all changes
git add dws10.com/

# Commit with message
git commit -m "feat: launch €500k construction heroes campaign with video hero section"

# Push to GitHub
git push origin main
```

**Wait 2-3 minutes** → Cloudflare auto-deploys → Live at **https://dws10.com** 🚀

## 🎯 What It Looks Like

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   Making you one of the heroes of construction  │ ← H1 (huge)
│                                                 │
│   Automation. Better automation.                │ ← Bold italic
│   Reports. Better reports.                      │ ← Bold italic
│   Dashboards. Bloody better dashboards.         │ ← Bold italic
│                                                 │
│   We built DWS IQ 6 and Firehorse for real...  │
│                                                 │
│   ┌───────────────────────────────────────┐    │
│   │                                       │    │
│   │    [8-second video playing]           │    │ ← Video
│   │                                       │    │
│   └───────────────────────────────────────┘    │
│                                                 │
│   DWS IQ 6 - get fit for 55. Now.              │ ← Gold text
│                                                 │
│   [Start Your Transformation] [See How It Works]│ ← Buttons
│                                                 │
└─────────────────────────────────────────────────┘
```

## 📱 Responsive Design

- **Desktop**: Full-width hero with large video
- **Tablet**: Scaled down, still prominent
- **Mobile**: Stacked layout, video full-width

## 🔧 Technical Details

**Video Settings:**
- Autoplay: Yes (muted, so browsers allow it)
- Loop: Yes (plays continuously)
- Muted: Yes (required for autoplay)
- Formats: WebM (modern browsers) + MP4 (fallback)
- Poster: Shows thumbnail while loading

**Performance:**
- Video optimized: 60-80% smaller than original
- Lazy loading: Video loads after page content
- Mobile-optimized: Responsive sizing

## ❓ Troubleshooting

**Video doesn't show:**
- Check files are in `public/videos/` folder
- Check file names match exactly (case-sensitive)
- Open browser console (F12) → Check for errors

**Hero section not at top:**
- Clear browser cache (Ctrl+Shift+R)
- Check `index.html` line 727 - hero should be first section

**Buttons don't work:**
- "Start Your Transformation" → Opens Google Calendar booking
- "See How It Works" → Scrolls to fleet carousel

## 💰 Campaign Value

- **Investment**: €1,470 technical (0.29% of €500k budget)
- **Expected ROI**: 1,700% (59 customers × €161k LTV)
- **Target Revenue**: €9.5M
- **Break-even**: Month 5 (3.1 customers)

## 📞 Need Help?

If video files are missing or you need help:
1. Check the earlier chat messages for download links
2. OR tell me where your original video is and I'll optimize it
3. OR I can create a placeholder until you have the video

## 🚀 Status

- [x] HTML structure created
- [x] Folder structure created  
- [x] Paths configured
- [x] Design implemented
- [ ] **Video files added** ← YOU NEED TO DO THIS
- [ ] Tested locally
- [ ] Deployed to production

---

**Once you add the 3 video files, you're ready to deploy!** 🎉

Your €500K campaign will be live at https://dws10.com in under 5 minutes.

---

## Document Changelog

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Dec 26, 2025 | Initial creation; Complete deployment guide; Applied DWS document standards | Claude AI |

---

**License:** Proprietary - Lifetime Oy  
**Maintained by:** Lifetime Oy Development Team  
**Related Documents:** See `README.md` for overview, `HERO_DEPLOYMENT_STATUS.md` for current status
