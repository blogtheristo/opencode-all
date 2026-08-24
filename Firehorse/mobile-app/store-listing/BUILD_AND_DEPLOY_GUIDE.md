# 🚀 Firehorse Mobile - Build & Deploy Guide

**Complete guide to publishing on Google Play Store**

---

## 📋 Prerequisites

### 1. Tools Required
```bash
# Node.js 18+
node --version

# Expo CLI
npm install -g expo-cli

# EAS CLI
npm install -g eas-cli

# Android Studio (for testing)
# Download from: https://developer.android.com/studio
```

### 2. Accounts Required
- ✅ Expo account (expo.dev)
- ✅ Google Play Console account ($25 one-time fee)
- ✅ Google Cloud account (for services)

---

## 🔧 Step 1: Initial Setup

### Install Dependencies
```bash
cd Firehorse/mobile-app
npm install
```

### Login to Expo
```bash
eas login
```

### Configure Project
```bash
eas build:configure
```

---

## 🎨 Step 2: Create Assets

### App Icon (512x512)
Create `assets/icon.png`:
- Size: 512x512 pixels
- Format: PNG with transparency
- Design: DWS 6 logo on Swedish Blue background

### Adaptive Icon (1024x1024)
Create `assets/adaptive-icon.png`:
- Size: 1024x1024 pixels
- Safe zone: 432x432 pixels in center
- Format: PNG with transparency

### Splash Screen (1284x2778)
Create `assets/splash.png`:
- Size: 1284x2778 pixels (iPhone 13 Pro Max)
- Background: Swedish Blue (#005293)
- Logo: DWS 6 centered
- Text: "Firehorse Mobile" below logo

### Screenshots (1080x1920) - 8 required
Create in `store-listing/screenshots/`:
1. `01-home.png` - Home screen
2. `02-diary.png` - Worksite diary
3. `03-inspection.png` - Inspection screen
4. `04-carbon.png` - Carbon report
5. `05-dashboard.png` - DWS IQ 6 dashboard
6. `06-menu.png` - Hamburger menu
7. `07-settings.png` - Settings screen
8. `08-offline.png` - Offline mode

### Feature Graphic (1024x500)
Create `store-listing/feature-graphic.png`:
- Size: 1024x500 pixels
- Design: See GOOGLE_PLAY_STORE_LISTING.md

---

## 🔑 Step 3: Generate Signing Key

### Create Keystore
```bash
# Generate Android keystore
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore firehorse-release.keystore \
  -alias firehorse-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Enter password (SAVE THIS!)
# Enter details:
# - First and Last Name: Lifetime Oy
# - Organizational Unit: DWS IQ 6
# - Organization: Lifetime Oy
# - City: Helsinki
# - State: Uusimaa
# - Country Code: FI
```

### Store Credentials Securely
```bash
# Create credentials file (DO NOT COMMIT!)
cat > credentials.json << EOF
{
  "android": {
    "keystore": {
      "keystorePath": "firehorse-release.keystore",
      "keystorePassword": "YOUR_PASSWORD",
      "keyAlias": "firehorse-key",
      "keyPassword": "YOUR_PASSWORD"
    }
  }
}
EOF

# Add to .gitignore
echo "credentials.json" >> .gitignore
echo "*.keystore" >> .gitignore
```

---

## 🏗️ Step 4: Build Production APK/AAB

### Build AAB (for Google Play)
```bash
# Build Android App Bundle (recommended)
eas build --platform android --profile production

# This will:
# 1. Upload code to Expo servers
# 2. Build on Expo infrastructure
# 3. Generate signed AAB file
# 4. Download link provided when complete
```

### Build APK (for testing)
```bash
# Build APK for direct installation
eas build --platform android --profile preview

# Use this for:
# - Internal testing
# - Beta testers
# - Demo purposes
```

### Local Build (optional)
```bash
# Build locally (requires Android SDK)
eas build --platform android --local
```

---

## 📱 Step 5: Test the Build

### Install APK on Device
```bash
# Via ADB
adb install firehorse-mobile.apk

# Or send APK to device and install manually
```

### Test Checklist
- [ ] App launches successfully
- [ ] All screens load correctly
- [ ] Navigation works (hamburger menu)
- [ ] Nordic colors display correctly
- [ ] DWS 6 logo visible
- [ ] Offline mode works
- [ ] Camera permission works
- [ ] Location permission works
- [ ] No crashes or errors

---

## 🏪 Step 6: Google Play Console Setup

### Create App
1. Go to https://play.google.com/console
2. Click "Create app"
3. Fill in details:
   - App name: Firehorse Mobile
   - Default language: English (UK)
   - App or game: App
   - Free or paid: Free
   - Developer Program Policies: Accept

### Store Listing
1. Go to "Store presence" → "Main store listing"
2. Fill in:
   - App name: Firehorse Mobile
   - Short description: (from GOOGLE_PLAY_STORE_LISTING.md)
   - Full description: (from GOOGLE_PLAY_STORE_LISTING.md)
   - App icon: Upload 512x512 PNG
   - Feature graphic: Upload 1024x500 PNG
   - Screenshots: Upload 8 images (1080x1920)

### App Content
1. Privacy policy: https://dws6.com/privacy
2. App access: All features available
3. Ads: No ads
4. Content rating: PEGI 3 / Everyone
5. Target audience: Business professionals
6. News app: No

### Pricing & Distribution
1. Countries: Select Nordic + Europe
2. Pricing: Free
3. Content guidelines: Accept
4. US export laws: Accept

---

## 📤 Step 7: Upload Build

### Upload AAB
1. Go to "Release" → "Production"
2. Click "Create new release"
3. Upload AAB file
4. Release name: "1.0.0 - Nordic Construction Excellence"
5. Release notes: (from GOOGLE_PLAY_STORE_LISTING.md)

### Internal Testing (Recommended First)
```bash
# Submit to internal testing track
eas submit --platform android --track internal

# Or manually:
# 1. Go to "Release" → "Testing" → "Internal testing"
# 2. Upload AAB
# 3. Add testers (email addresses)
# 4. Send test link
```

---

## 🧪 Step 8: Beta Testing

### Create Beta Track
1. Go to "Testing" → "Closed testing"
2. Create track: "Beta"
3. Upload AAB
4. Add testers (email list or Google Group)

### Beta Testing Checklist
- [ ] 10+ testers recruited
- [ ] Test for 1-2 weeks
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Update version if needed

---

## 🚀 Step 9: Production Release

### Final Checks
- [ ] All store listing complete
- [ ] Screenshots uploaded (8 images)
- [ ] Feature graphic uploaded
- [ ] App icon uploaded
- [ ] Privacy policy live
- [ ] Terms of service live
- [ ] Beta testing complete
- [ ] No critical bugs
- [ ] Content rating received

### Submit for Review
1. Go to "Release" → "Production"
2. Click "Create new release"
3. Upload final AAB
4. Review release:
   - Release name: 1.0.0
   - Release notes: Final version
   - Rollout: 100% (or staged)
5. Click "Review release"
6. Click "Start rollout to Production"

### Review Process
- **Timeline**: 1-7 days (usually 1-3 days)
- **Status**: Check "Release" → "Production" for updates
- **Notifications**: Email when approved/rejected

---

## 📊 Step 10: Post-Launch

### Monitor
1. Go to "Statistics" for downloads
2. Check "Ratings and reviews"
3. Monitor "Crashes & ANRs"
4. Review "Pre-launch report"

### Marketing
```bash
# Generate promo links
https://play.google.com/store/apps/details?id=com.dws6.firehorse

# QR code for easy download
# Use: https://www.qr-code-generator.com/
```

### Updates
```bash
# Build new version
# 1. Update version in app.json
# 2. Build new AAB
eas build --platform android --profile production

# 3. Upload to Google Play Console
# 4. Submit for review
```

---

## 🔄 Continuous Deployment

### Automated Builds
```yaml
# .github/workflows/android-build.yml
name: Android Build

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: eas build --platform android --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

### Over-the-Air Updates (OTA)
```bash
# Publish update without app store review
eas update --branch production --message "Bug fixes"

# Users get update automatically
# Works for JS/React changes only (not native)
```

---

## 🎯 Success Metrics

### Week 1 Targets
- 100+ downloads
- 4.0+ star rating
- 10+ reviews
- 0 critical crashes

### Month 1 Targets
- 1,000+ downloads
- 4.5+ star rating
- 50+ reviews
- 10+ enterprise inquiries

### Quarter 1 Targets
- 10,000+ downloads
- 4.7+ star rating
- 200+ reviews
- 50+ enterprise customers

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check EAS status
eas build:list
```

### Upload Fails
```bash
# Check AAB size (max 150 MB)
ls -lh *.aab

# Verify signing
jarsigner -verify -verbose -certs firehorse-mobile.aab
```

### Review Rejected
Common reasons:
1. Privacy policy missing/incorrect
2. Permissions not justified
3. Content rating incorrect
4. Crashes during testing
5. Misleading screenshots

Fix and resubmit.

---

## 📞 Support

### Expo Support
- Docs: https://docs.expo.dev
- Forums: https://forums.expo.dev
- Discord: https://chat.expo.dev

### Google Play Support
- Help: https://support.google.com/googleplay/android-developer
- Policy: https://play.google.com/about/developer-content-policy/

### DWS6 Team
- Email: support@dws6.com
- Docs: https://docs.dws6.com

---

## ✅ Final Checklist

### Pre-Launch
- [ ] Code complete and tested
- [ ] Assets created (icon, splash, screenshots)
- [ ] Store listing written
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Google Play Console set up
- [ ] Signing key generated and secured
- [ ] Production AAB built
- [ ] Beta testing complete

### Launch Day
- [ ] AAB uploaded to production
- [ ] Release notes finalized
- [ ] Submitted for review
- [ ] Marketing materials ready
- [ ] Support channels ready
- [ ] Monitoring set up

### Post-Launch
- [ ] Monitor downloads and ratings
- [ ] Respond to reviews
- [ ] Fix critical bugs immediately
- [ ] Plan v1.1 features
- [ ] Collect user feedback

---

**Status**: ✅ **READY TO DEPLOY**

**Estimated Timeline**:
- Assets creation: 1 day
- Testing: 2-3 days
- Google Play review: 1-7 days
- **Total: 4-11 days to live**

---

**Date**: December 30, 2025  
**Version**: 1.0.0  
**Status**: ✅ DEPLOYMENT READY

---

**🎉 Good luck with your launch! 🚀**
