# 📦 Android Studio D: Drive Installation Guide

**Complete guide for installing Android Studio on D: drive (Windows 11)**

---

## 🎯 Why Install on D: Drive?

**Space Requirements**:
- Android Studio: ~2 GB
- Android SDK: ~8 GB
- Virtual Devices (AVD): ~4 GB per device
- **Total**: ~15-20 GB

**Benefits**:
- ✅ Save C: drive space
- ✅ Better organization
- ✅ Easier backup
- ✅ Faster SSD performance (if D: is SSD)

---

## 🚀 Method 1: Fresh Installation (Recommended)

### Step 1: Download Android Studio

```
1. Go to: https://developer.android.com/studio
2. Click "Download Android Studio"
3. Save to: D:\Downloads\
```

### Step 2: Custom Installation

**IMPORTANT**: Choose "Custom" NOT "Standard"!

```
1. Run installer
2. Choose installation type: CUSTOM ✅
3. Installation Location:
   D:\Android\Android Studio

4. Android SDK Location:
   D:\Android\SDK

5. Android Virtual Device Location:
   D:\Android\.android\avd

6. Install components:
   ✅ Android SDK
   ✅ Android SDK Platform
   ✅ Performance (Intel HAXM or AMD)
   ✅ Android Virtual Device
```

### Step 3: Set Environment Variables

**Run PowerShell as Administrator:**

```powershell
# Set ANDROID_HOME
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "D:\Android\SDK", "User")

# Set ANDROID_SDK_ROOT
[System.Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", "D:\Android\SDK", "User")

# Set ANDROID_AVD_HOME
[System.Environment]::SetEnvironmentVariable("ANDROID_AVD_HOME", "D:\Android\.android\avd", "User")

# Add to PATH
$path = [System.Environment]::GetEnvironmentVariable("Path", "User")
$newPath = "$path;D:\Android\SDK\platform-tools;D:\Android\SDK\emulator"
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")
```

### Step 4: Verify Installation

```powershell
# Restart PowerShell, then:
echo $env:ANDROID_HOME
# Should show: D:\Android\SDK

adb version
# Should show ADB version
```

---

## 🔄 Method 2: Move Existing Installation

**If you already installed on C: drive:**

### Option A: Use PowerShell Script (Automatic)

```powershell
# 1. Run PowerShell as Administrator
# 2. Navigate to script
cd "D:\Proton\My files\2026\Repos2026\dws6\Firehorse\mobile-app"

# 3. Run script
.\INSTALL_ANDROID_STUDIO_D_DRIVE.ps1
```

### Option B: Manual Move

**Step 1: Close Android Studio**

**Step 2: Move SDK**
```powershell
# Move SDK
Move-Item "C:\Users\risto\AppData\Local\Android\Sdk" "D:\Android\SDK"

# Create symbolic link
New-Item -ItemType SymbolicLink -Path "C:\Users\risto\AppData\Local\Android\Sdk" -Target "D:\Android\SDK"
```

**Step 3: Move AVD**
```powershell
# Move AVD
Move-Item "C:\Users\risto\.android" "D:\Android\.android"

# Create symbolic link
New-Item -ItemType SymbolicLink -Path "C:\Users\risto\.android" -Target "D:\Android\.android"
```

**Step 4: Update Environment Variables**
```powershell
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "D:\Android\SDK", "User")
[System.Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", "D:\Android\SDK", "User")
```

**Step 5: Update Android Studio Config**
```
1. Open Android Studio
2. File → Settings → Appearance & Behavior → System Settings → Android SDK
3. SDK Location: D:\Android\SDK
4. Click "Apply"
```

---

## 📁 Final Directory Structure

```
D:\
├── Android\
│   ├── Android Studio\              # Program files (~2 GB)
│   │   ├── bin\
│   │   ├── lib\
│   │   └── plugins\
│   │
│   ├── SDK\                          # Android SDK (~8 GB)
│   │   ├── build-tools\
│   │   ├── emulator\
│   │   ├── platform-tools\
│   │   │   ├── adb.exe
│   │   │   └── fastboot.exe
│   │   ├── platforms\
│   │   │   └── android-33\
│   │   ├── system-images\
│   │   │   └── android-33\
│   │   │       └── google_apis\
│   │   │           └── x86_64\
│   │   └── tools\
│   │
│   └── .android\                     # AVD & configs (~4 GB per device)
│       ├── avd\
│       │   └── Pixel_6_API_33.avd\  # Virtual device
│       ├── adb_usb.ini
│       └── debug.keystore
│
└── Proton\
    └── My files\
        └── 2026\
            └── Repos2026\
                └── dws6\
                    └── Firehorse\
                        └── mobile-app\
```

---

## 🔧 Troubleshooting

### Problem: "ANDROID_HOME not found"

**Solution:**
```powershell
# Check current value
echo $env:ANDROID_HOME

# If empty, set it
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "D:\Android\SDK", "User")

# Restart PowerShell
```

### Problem: "adb not found"

**Solution:**
```powershell
# Add to PATH
$path = [System.Environment]::GetEnvironmentVariable("Path", "User")
$newPath = "$path;D:\Android\SDK\platform-tools"
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")

# Restart PowerShell
adb version
```

### Problem: "Emulator won't start"

**Solution 1: Check AVD location**
```
Android Studio → Tools → AVD Manager → Settings (gear icon)
AVD Location: D:\Android\.android\avd
```

**Solution 2: Recreate AVD**
```
AVD Manager → Delete old device → Create new device
```

### Problem: "Insufficient disk space"

**Check space:**
```powershell
Get-PSDrive D | Select-Object Used,Free
```

**Minimum required**: 20 GB free on D:

---

## ✅ Verification Checklist

After installation, verify:

```powershell
# 1. Android Studio installed
Test-Path "D:\Android\Android Studio\bin\studio64.exe"
# Should return: True

# 2. SDK installed
Test-Path "D:\Android\SDK\platform-tools\adb.exe"
# Should return: True

# 3. Environment variables set
echo $env:ANDROID_HOME
# Should show: D:\Android\SDK

# 4. ADB works
adb version
# Should show version number

# 5. Emulator works
emulator -list-avds
# Should list your virtual devices
```

---

## 🚀 Running Firehorse Mobile

**Once everything is set up:**

```bash
# 1. Navigate to project
cd "D:\Proton\My files\2026\Repos2026\dws6\Firehorse\mobile-app"

# 2. Install dependencies
npm install

# 3. Start emulator (from Android Studio)
# AVD Manager → Click Play button

# 4. Start Expo
expo start

# 5. Press 'a' to run on Android
```

---

## 💾 Disk Space Management

### Current Usage
```powershell
# Check Android Studio size
Get-ChildItem "D:\Android" -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name="Size(GB)";Expression={[math]::Round($_.Sum / 1GB, 2)}}
```

### Clean Up Space

**Remove unused SDK versions:**
```
Android Studio → SDK Manager → SDK Platforms
Uncheck old Android versions (keep only API 33)
```

**Remove unused system images:**
```
Android Studio → SDK Manager → SDK Tools
Keep only what you need
```

**Delete old AVDs:**
```
AVD Manager → Delete unused virtual devices
```

---

## 📊 Performance Tips

### 1. Use SSD for D: Drive
- Much faster than HDD
- Emulator runs 3-5x faster

### 2. Allocate More RAM to AVD
```
AVD Manager → Edit → Advanced Settings
RAM: 4096 MB (if you have 16GB+ system RAM)
```

### 3. Enable Hardware Graphics
```
AVD Manager → Edit → Graphics
Select: Hardware - GLES 2.0
```

### 4. Use Quick Boot
```
AVD Manager → Edit → Advanced Settings
Boot option: Quick Boot
```

---

## 🎯 Summary

### Installation Steps
1. ✅ Download Android Studio
2. ✅ Choose CUSTOM installation
3. ✅ Set paths to D:\Android\
4. ✅ Set environment variables
5. ✅ Create virtual device
6. ✅ Run Firehorse Mobile

### Key Paths
```
Android Studio: D:\Android\Android Studio
SDK:           D:\Android\SDK
AVD:           D:\Android\.android\avd
Project:       D:\Proton\My files\2026\Repos2026\dws6\Firehorse\mobile-app
```

### Space Required
```
Minimum: 15 GB
Recommended: 20+ GB
```

---

## 📞 Support

**If you encounter issues:**
1. Check this guide's troubleshooting section
2. Run the PowerShell script: `INSTALL_ANDROID_STUDIO_D_DRIVE.ps1`
3. Contact: support@dws6.com

---

**Date**: December 30, 2025  
**Version**: 1.0.0  
**Platform**: Windows 11
