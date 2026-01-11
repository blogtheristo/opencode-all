# 🚀 Firehorse Mobile - Android Emulator Guide (Windows 11)

**Complete guide to running Firehorse Mobile on Windows 11**

---

## 📋 Prerequisites

### 1. System Requirements
- **OS**: Windows 11 (or Windows 10)
- **CPU**: Intel i5+ or AMD Ryzen 5+ (with virtualization support)
- **RAM**: 8 GB minimum (16 GB recommended)
- **Disk**: 10 GB free space (SSD recommended)
- **Virtualization**: Enabled in BIOS

### 2. Check Virtualization
```powershell
# Run in PowerShell
systeminfo | findstr /C:"Virtualization"

# Should show:
# Hyper-V Requirements: A hypervisor has been detected
```

**If not enabled:**
1. Restart → Enter BIOS/UEFI (usually F2, F10, or Del)
2. Find "Intel VT-x" or "AMD-V"
3. Enable
4. Save and reboot

---

## 🛠️ Installation

### Step 1: Install Android Studio

1. **Download**:
   - Go to: https://developer.android.com/studio
   - Click "Download Android Studio"
   - Accept terms

2. **Install**:
   - Run installer
   - Choose "Standard" installation
   - Install all components:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device
     - Performance (Intel HAXM or AMD Hypervisor)

3. **First Launch**:
   - Open Android Studio
   - Complete setup wizard
   - Download required SDK components

**Installation Size**: ~3 GB  
**Time**: 10-15 minutes

---

### Step 2: Install Node.js & Expo

```bash
# 1. Download Node.js 18+
# https://nodejs.org/

# 2. Install Expo CLI
npm install -g expo-cli

# 3. Install EAS CLI
npm install -g eas-cli

# 4. Verify installation
node --version
expo --version
```

---

### Step 3: Create Virtual Device (AVD)

1. **Open AVD Manager**:
   ```
   Android Studio → Tools → AVD Manager
   ```

2. **Create Device**:
   ```
   Click "Create Virtual Device"
   ```

3. **Select Hardware**:
   ```
   Category: Phone
   Device: Pixel 6
   Screen: 6.4" 1080 x 2400 (FHD+)
   Click "Next"
   ```

4. **Select System Image**:
   ```
   Release Name: Tiramisu (Android 13)
   API Level: 33
   ABI: x86_64
   Click "Download" (if not downloaded)
   Click "Next"
   ```

5. **Configure AVD**:
   ```
   AVD Name: Pixel_6_API_33
   Startup orientation: Portrait
   
   Advanced Settings:
   - RAM: 2048 MB (or more if you have 16GB+)
   - Internal Storage: 2048 MB
   - SD Card: 512 MB
   - Graphics: Hardware - GLES 2.0
   
   Click "Finish"
   ```

---

## 🚀 Running Firehorse Mobile

### Method 1: Expo Development Build (Recommended)

```bash
# 1. Navigate to project
cd "D:\Proton\My files\2026\Repos2026\dws6\Firehorse\mobile-app"

# 2. Install dependencies
npm install

# 3. Start emulator (from Android Studio AVD Manager)
# Click the Play button next to Pixel_6_API_33

# 4. Start Expo
expo start

# 5. Press 'a' to open on Android
# Or scan QR code with Expo Go app
```

**First run**: Installs Expo Go on emulator automatically  
**Reload**: Press 'r' in terminal or shake device (Ctrl+M)

---

### Method 2: Production APK

```bash
# 1. Build APK
eas build --profile preview --platform android

# 2. Download APK when ready
# (Link provided in terminal)

# 3. Install on emulator
adb install firehorse-mobile.apk

# 4. Launch app
# Find "Firehorse Mobile" in app drawer
```

---

## 🎮 Emulator Controls

### Keyboard Shortcuts
```
Ctrl + M          - Open developer menu
R                 - Reload app
Ctrl + Shift + R  - Reload with cache clear
Ctrl + D          - Open debug menu
```

### Emulator Toolbar
```
Power            - Lock/unlock screen
Volume Up/Down   - Volume controls
Rotate           - Rotate device
Back             - Android back button
Home             - Android home button
Overview         - Recent apps
```

### Developer Options
```
Settings → About Phone → Tap "Build Number" 7 times
Settings → System → Developer Options
- USB Debugging: ON
- Show taps: ON (helpful for demos)
- Pointer location: ON (if needed)
```

---

## 🔧 Troubleshooting

### Emulator Won't Start

**Problem**: "HAXM is not installed"
```bash
# Solution: Install Intel HAXM
# Android Studio → SDK Manager → SDK Tools
# Check "Intel x86 Emulator Accelerator (HAXM)"
# Click "Apply"
```

**Problem**: "VT-x is disabled"
```bash
# Solution: Enable in BIOS
# Restart → BIOS → Enable Intel VT-x or AMD-V
```

**Problem**: Emulator is slow
```bash
# Solution 1: Increase RAM
# AVD Manager → Edit → Advanced → RAM: 4096 MB

# Solution 2: Use Hardware Graphics
# AVD Manager → Edit → Graphics: Hardware - GLES 2.0

# Solution 3: Close other apps
# Emulator needs resources
```

---

### Expo Won't Connect

**Problem**: "Unable to connect to Metro"
```bash
# Solution 1: Check firewall
# Allow Node.js through Windows Firewall

# Solution 2: Use tunnel
expo start --tunnel

# Solution 3: Restart everything
# Close emulator, stop expo, restart both
```

**Problem**: "Expo Go not installed"
```bash
# Solution: Install manually
adb install expo-go.apk
# Download from: https://expo.dev/go
```

---

### App Crashes

**Problem**: App crashes on startup
```bash
# Solution 1: Clear cache
expo start -c

# Solution 2: Reinstall
adb uninstall com.dws6.firehorse
expo start

# Solution 3: Check logs
adb logcat | findstr "Firehorse"
```

---

## 📱 Alternative: Windows Subsystem for Android

**Native Windows 11 integration**

### Install WSA
```bash
# 1. Open Microsoft Store
# Search "Windows Subsystem for Android"
# Click "Install"

# 2. Enable Developer Mode
# Settings → For Developers → Developer Mode: ON

# 3. Connect ADB
adb connect 127.0.0.1:58526

# 4. Install APK
adb install firehorse-mobile.apk
```

**Pros**:
- ✅ Native Windows integration
- ✅ Fast performance
- ✅ Easy to use

**Cons**:
- ⚠️ No Google Play Services
- ⚠️ Limited device profiles

---

## 🎯 Performance Tips

### 1. Optimize Emulator
```
AVD Manager → Edit → Advanced Settings:
- Boot option: Quick Boot
- Multi-Core CPU: 4 cores
- RAM: 4096 MB (if you have 16GB+)
- Graphics: Hardware - GLES 2.0
```

### 2. Optimize Windows
```
# Disable unnecessary services
# Close Chrome/Edge (memory hog)
# Use SSD for Android SDK
# Keep Windows updated
```

### 3. Optimize Expo
```bash
# Use production mode
expo start --no-dev --minify

# Disable remote debugging
# (unless needed)
```

---

## 📊 Comparison: Emulator Options

| Feature | Android Studio | WSA | BlueStacks |
|---------|---------------|-----|------------|
| **Performance** | Good | Excellent | Excellent |
| **Google Play** | Yes | No | Yes |
| **Development** | Excellent | Good | Poor |
| **Free** | Yes | Yes | Yes (with ads) |
| **RAM Usage** | 2-4 GB | 1-2 GB | 2-3 GB |
| **Setup Time** | 15 min | 5 min | 10 min |

**Recommendation**: Android Studio for development, WSA for testing

---

## 🚀 Quick Start Script

Save as `run-emulator.bat`:

```batch
@echo off
echo Starting Firehorse Mobile Emulator...
echo.

REM Start emulator
echo [1/3] Starting Android Emulator...
start "" "C:\Users\%USERNAME%\AppData\Local\Android\Sdk\emulator\emulator.exe" -avd Pixel_6_API_33

REM Wait for emulator to boot
echo [2/3] Waiting for emulator to boot (30 seconds)...
timeout /t 30 /nobreak

REM Start Expo
echo [3/3] Starting Expo...
cd /d "D:\Proton\My files\2026\Repos2026\dws6\Firehorse\mobile-app"
call npm start

pause
```

**Usage**:
1. Save file to desktop
2. Double-click to run
3. Wait for emulator and Expo to start
4. Press 'a' to launch app

---

## 📞 Support

### Resources
- **Android Studio**: https://developer.android.com/studio/run/emulator
- **Expo**: https://docs.expo.dev/workflow/android-studio-emulator/
- **Troubleshooting**: https://docs.expo.dev/troubleshooting/

### Contact
- **Email**: support@dws6.com
- **Docs**: https://docs.dws6.com/mobile

---

## ✅ Checklist

### Before First Run
- [ ] Virtualization enabled in BIOS
- [ ] Android Studio installed
- [ ] Node.js 18+ installed
- [ ] Expo CLI installed
- [ ] Virtual device created (Pixel 6 API 33)
- [ ] Dependencies installed (`npm install`)

### First Run
- [ ] Emulator starts successfully
- [ ] Expo connects to emulator
- [ ] App installs on emulator
- [ ] App launches without errors
- [ ] All screens load correctly
- [ ] Navigation works (hamburger menu)

### Testing
- [ ] Home screen displays
- [ ] Diary screen works
- [ ] Inspection screen works
- [ ] Carbon report loads
- [ ] Dashboard shows data
- [ ] Settings accessible
- [ ] Offline mode works
- [ ] No crashes

---

## 🎉 You're Ready!

**Emulator is set up and ready to run Firehorse Mobile!**

**Next Steps**:
1. Start emulator
2. Run `expo start`
3. Press 'a' to launch
4. Test all features
5. Take screenshots for Google Play Store

**Happy Developing! 🚀📱**

---

**Date**: December 30, 2025  
**Version**: 1.0.0  
**Platform**: Windows 11
