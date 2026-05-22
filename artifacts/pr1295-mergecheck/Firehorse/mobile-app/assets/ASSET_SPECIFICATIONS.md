# 🎨 Firehorse Mobile - Asset Specifications

**Complete guide for creating all required assets**

---

## 📱 App Icon (512x512)

### Specifications
- **Size**: 512 x 512 pixels
- **Format**: PNG with transparency
- **File**: `assets/icon.png`
- **Color Space**: sRGB

### Design
```
Background: Swedish Blue (#005293)
Foreground: White + Swedish Yellow

Layout:
┌─────────────────┐
│                 │
│   DWS          │  ← White, Bold, 72px
│     6          │  ← Swedish Yellow (#FECC00), Bold, 72px
│                 │
│   🔥           │  ← Fire emoji or flame icon, 64px
│                 │
└─────────────────┘

Border: 2px Nordic Green (#00A651) accent
Corners: Rounded (48px radius)
Shadow: Subtle drop shadow
```

### Tools
- **Figma**: https://figma.com
- **Canva**: https://canva.com
- **Photoshop**: Professional option
- **GIMP**: Free alternative

### Export Settings
```
Format: PNG-24
Transparency: Yes
Resolution: 72 DPI
Color Profile: sRGB IEC61966-2.1
```

---

## 🔄 Adaptive Icon (1024x1024)

### Specifications
- **Size**: 1024 x 1024 pixels
- **Safe Zone**: 432 x 432 pixels (center)
- **Format**: PNG with transparency
- **File**: `assets/adaptive-icon.png`

### Design
```
Full Canvas: 1024x1024
Safe Zone: 432x432 (centered)

┌─────────────────────────┐
│                         │
│   ┌───────────────┐    │
│   │               │    │
│   │   DWS 6       │    │ ← Content in safe zone
│   │   🔥          │    │
│   │               │    │
│   └───────────────┘    │
│                         │
└─────────────────────────┘

Note: Android will mask this into various shapes
(circle, squircle, rounded square)
```

### Background Color
```
Solid color: Swedish Blue (#005293)
(Used when icon is masked)
```

---

## 🌊 Splash Screen (1284x2778)

### Specifications
- **Size**: 1284 x 2778 pixels (iPhone 13 Pro Max)
- **Format**: PNG
- **File**: `assets/splash.png`

### Design
```
Background: Swedish Blue gradient
  Top: #005293
  Bottom: #002868

Center Content:
┌─────────────────────────┐
│                         │
│                         │
│      [DWS 6 Logo]      │ ← 200x200px, white
│                         │
│   Firehorse Mobile      │ ← 48px, white, bold
│                         │
│   Nordic Construction   │ ← 24px, white, light
│      Excellence         │
│                         │
│   🇸🇪 🇳🇴 🇫🇮 🇩🇰        │ ← Flags, 48px each
│                         │
│                         │
└─────────────────────────┘
```

---

## 📸 Screenshots (1080x1920) - 8 Required

### 1. Home Screen
**File**: `store-listing/screenshots/01-home.png`

**Caption**: "Nordic Construction Excellence - 70% automation, 540% ROI"

**Design**:
- Show full home screen
- Highlight: Welcome card with stats
- Highlight: 4 Quick Action buttons
- Add text overlay (top): "70% Automation | €53k Savings"

### 2. Worksite Diary
**File**: `store-listing/screenshots/02-diary.png`

**Caption**: "Auto-fill from edge nodes - weather, temperature, workers"

**Design**:
- Show diary screen with auto-fill section
- Highlight: Weather, temperature, workers (with checkmarks)
- Add text overlay: "Auto-Fill from Edge Nodes"

### 3. Inspection Screen
**File**: `store-listing/screenshots/03-inspection.png`

**Caption**: "AI-powered defect detection with 95% accuracy"

**Design**:
- Show inspection with hero features
- Highlight: AI defect detection feature
- Add text overlay: "95% AI Accuracy"

### 4. Carbon Report
**File**: `store-listing/screenshots/04-carbon.png`

**Caption**: "Real-time EN 15978 carbon tracking - Fit for 55 compliant"

**Design**:
- Show carbon report with budget bar
- Highlight: 87% budget used, warning alert
- Add text overlay: "Fit for 55 Compliant"

### 5. Dashboard
**File**: `store-listing/screenshots/05-dashboard.png`

**Caption**: "DWS IQ 6 real-time KPIs and project overview"

**Design**:
- Show dashboard with 4 KPI cards
- Highlight: SPI, CPI, Projects, At Risk
- Add text overlay: "Real-Time Intelligence"

### 6. Hamburger Menu
**File**: `store-listing/screenshots/06-menu.png`

**Caption**: "Clean Nordic design with SAP-style interface"

**Design**:
- Show open drawer menu
- Highlight: DWS 6 logo, menu structure
- Add text overlay: "Nordic Design"

### 7. Settings
**File**: `store-listing/screenshots/07-settings.png`

**Caption**: "Multi-language support: Finnish, Swedish, Norwegian, Danish, English"

**Design**:
- Show settings with language selection
- Highlight: 5 language options with flags
- Add text overlay: "5 Languages"

### 8. Offline Mode
**File**: `store-listing/screenshots/08-offline.png`

**Caption**: "Work offline, sync automatically when online"

**Design**:
- Show sync status card
- Highlight: "Synced" badge, offline toggle
- Add text overlay: "Offline-First"

### Screenshot Template
```css
/* Overlay Design */
Background: Semi-transparent gradient
  Top: rgba(0, 82, 147, 0.9)
  Bottom: transparent

Text:
  Font: System Bold
  Size: 36px
  Color: White
  Position: Top center
  Shadow: 2px drop shadow
```

---

## 🎬 Feature Graphic (1024x500)

### Specifications
- **Size**: 1024 x 500 pixels
- **Format**: PNG or JPG
- **File**: `store-listing/feature-graphic.png`

### Design
```
Background: Swedish Blue gradient (#005293 → #002868)

Layout:
┌────────────────────────────────────────────────┐
│                                                │
│  [DWS 6]  Firehorse Mobile                    │
│   Logo                                         │
│  120x120   Nordic Construction Excellence     │
│                                                │
│  70% Automation | Fit for 55 | 540% ROI       │
│                                                │
│  🇸🇪 🇳🇴 🇫🇮 🇩🇰                                │
│                                                │
└────────────────────────────────────────────────┘

Left: DWS 6 logo (120x120)
Center: Title (48px bold) + Subtitle (24px)
Bottom: Stats (20px) + Flags (32px each)
```

---

## 🎥 Promo Video (30 seconds)

### Specifications
- **Duration**: 30 seconds
- **Resolution**: 1920 x 1080 (Full HD)
- **Format**: MP4 (H.264)
- **File Size**: Max 100 MB
- **Aspect Ratio**: 16:9

### Storyboard

#### [0-3s] Opening
```
Scene: Logo animation
- DWS 6 logo fades in
- "Firehorse Mobile" text appears
- Background: Swedish Blue gradient

Audio: Upbeat Nordic music starts
Voiceover: "Introducing Firehorse Mobile"
```

#### [3-8s] Problem
```
Scene: Split screen showing manual vs. automated
- Left: Person with paperwork (frustrated)
- Right: Person with phone (smiling)

Text Overlay: "70% Automation"
Voiceover: "Stop wasting 35 hours per month on manual reporting"
```

#### [8-13s] Solution - Diary
```
Scene: Phone screen recording
- Show worksite diary
- Auto-fill animation (weather, temperature, workers)

Text Overlay: "Auto-Fill from Edge Nodes"
Voiceover: "Automatic data from IoT sensors"
```

#### [13-18s] Solution - AI
```
Scene: Phone screen recording
- Show inspection screen
- AI detecting defects in photo

Text Overlay: "95% AI Accuracy"
Voiceover: "AI-powered defect detection"
```

#### [18-23s] Solution - Carbon
```
Scene: Phone screen recording
- Show carbon report
- Budget bar filling up, alert appears

Text Overlay: "Fit for 55 Compliant"
Voiceover: "Real-time carbon tracking for EU compliance"
```

#### [23-28s] Results
```
Scene: Stats animation
- €53k savings
- 540% ROI
- 35 hours saved

Text Overlay: "Proven Results"
Voiceover: "€53,000 savings per project"
```

#### [28-30s] CTA
```
Scene: Download screen
- Google Play Store badge
- QR code
- Nordic flags

Text Overlay: "Download Now"
Voiceover: "Download Firehorse Mobile today"
```

### Production Tools
- **Screen Recording**: Android Studio Emulator + OBS
- **Editing**: Adobe Premiere Pro / Final Cut Pro / DaVinci Resolve
- **Animation**: After Effects / Canva Video
- **Voiceover**: Professional voice actor (Fiverr/Upwork)
- **Music**: Epidemic Sound / Artlist

---

## 📐 Design System

### Colors
```css
/* Primary */
--swedish-blue: #005293;
--norwegian-blue: #002868;
--swedish-yellow: #FECC00;

/* Secondary */
--nordic-green: #00A651;
--norwegian-red: #BA0C2F;

/* Neutrals */
--white: #FFFFFF;
--background: #F5F7FA;
--text: #1A1A1A;
```

### Typography
```css
/* Headings */
font-family: System, -apple-system, BlinkMacSystemFont;
font-weight: 700;
font-size: 24-48px;

/* Body */
font-family: System;
font-weight: 400;
font-size: 14-16px;

/* Captions */
font-family: System;
font-weight: 500;
font-size: 11-13px;
```

### Logo Usage
```
DWS 6 Logo:
- Always use white on blue background
- Or blue on white background
- Never distort or skew
- Minimum size: 48x48px
- Clear space: 16px around logo
```

---

## 🛠️ Asset Creation Workflow

### Step 1: Set Up Tools
```bash
# Install design tools
# Figma (free): https://figma.com
# Canva (free): https://canva.com
# GIMP (free): https://gimp.org

# Or use online tools
# Photopea (free Photoshop): https://photopea.com
```

### Step 2: Create Icon & Splash
```
1. Open Figma/Canva
2. Create 512x512 canvas (icon)
3. Add Swedish Blue background
4. Add "DWS 6" text (white + yellow)
5. Add flame icon/emoji
6. Export as PNG

Repeat for splash screen (1284x2778)
```

### Step 3: Take Screenshots
```bash
# Option A: Use Android Emulator
1. Open Android Studio
2. Start Pixel 6 emulator (1080x2340)
3. Run app: npm run android
4. Navigate to each screen
5. Take screenshots (Ctrl+S or Camera icon)

# Option B: Use Real Device
1. Install app on Android phone
2. Navigate to each screen
3. Take screenshots (Power + Volume Down)
4. Transfer to computer via USB
```

### Step 4: Edit Screenshots
```
1. Open in Photoshop/GIMP/Photopea
2. Resize to 1080x1920 (if needed)
3. Add text overlay (see template above)
4. Add highlights/arrows if needed
5. Export as PNG
```

### Step 5: Create Feature Graphic
```
1. Create 1024x500 canvas
2. Add gradient background
3. Add DWS 6 logo (left)
4. Add title and subtitle (center)
5. Add stats and flags (bottom)
6. Export as PNG
```

### Step 6: Record Promo Video
```bash
# Record screen
1. Open Android emulator
2. Start screen recording (OBS/QuickTime)
3. Navigate through app (follow storyboard)
4. Record 30-60 seconds of footage

# Edit video
1. Import clips into editor
2. Cut to 30 seconds
3. Add text overlays
4. Add voiceover
5. Add background music
6. Export as MP4 (1920x1080, H.264)
```

---

## ✅ Asset Checklist

### Required for Google Play
- [ ] App icon (512x512)
- [ ] Adaptive icon (1024x1024)
- [ ] Feature graphic (1024x500)
- [ ] Screenshot 1: Home (1080x1920)
- [ ] Screenshot 2: Diary (1080x1920)
- [ ] Screenshot 3: Inspection (1080x1920)
- [ ] Screenshot 4: Carbon (1080x1920)
- [ ] Screenshot 5: Dashboard (1080x1920)
- [ ] Screenshot 6: Menu (1080x1920)
- [ ] Screenshot 7: Settings (1080x1920)
- [ ] Screenshot 8: Offline (1080x1920)

### Optional but Recommended
- [ ] Promo video (30s, 1920x1080)
- [ ] Splash screen (1284x2778)
- [ ] Favicon (48x48)
- [ ] Social media graphics (1200x630)

---

## 📦 File Organization

```
Firehorse/mobile-app/
├── assets/
│   ├── icon.png (512x512)
│   ├── adaptive-icon.png (1024x1024)
│   ├── splash.png (1284x2778)
│   └── favicon.png (48x48)
│
└── store-listing/
    ├── screenshots/
    │   ├── 01-home.png
    │   ├── 02-diary.png
    │   ├── 03-inspection.png
    │   ├── 04-carbon.png
    │   ├── 05-dashboard.png
    │   ├── 06-menu.png
    │   ├── 07-settings.png
    │   └── 08-offline.png
    │
    ├── feature-graphic.png
    ├── promo-video.mp4
    │
    └── social-media/
        ├── facebook-cover.png (1200x630)
        ├── twitter-header.png (1500x500)
        └── linkedin-banner.png (1584x396)
```

---

## 🎨 Quick Start Templates

### Figma Template
```
1. Go to: https://figma.com
2. Create new file
3. Import DWS 6 logo
4. Use color palette:
   - Swedish Blue: #005293
   - Swedish Yellow: #FECC00
   - Nordic Green: #00A651
5. Create frames for each asset size
6. Export all at once
```

### Canva Template
```
1. Go to: https://canva.com
2. Search "App Icon" template
3. Customize with DWS 6 branding
4. Use "Resize" to create all sizes
5. Download as PNG
```

---

## 💡 Pro Tips

### Icons
- Keep it simple (recognizable at small sizes)
- Use high contrast (visible on any background)
- Test on different devices
- Follow Material Design guidelines

### Screenshots
- Show real content (not lorem ipsum)
- Highlight key features
- Use consistent styling
- Add captions for context

### Video
- Keep it short (30s max)
- Show actual app (not mockups)
- Use professional voiceover
- Add subtitles (many watch muted)

---

## 🚀 Timeline

### Day 1: Icons & Splash
- Create app icon (2 hours)
- Create adaptive icon (1 hour)
- Create splash screen (1 hour)
- **Total: 4 hours**

### Day 2: Screenshots
- Set up emulator (30 min)
- Take 8 screenshots (1 hour)
- Edit and add overlays (2 hours)
- **Total: 3.5 hours**

### Day 3: Graphics & Video
- Create feature graphic (1 hour)
- Record promo video (2 hours)
- Edit video (2 hours)
- **Total: 5 hours**

### Total Time: 2-3 days

---

**Status**: ✅ READY TO CREATE  
**Date**: December 30, 2025  
**Version**: 1.0.0
