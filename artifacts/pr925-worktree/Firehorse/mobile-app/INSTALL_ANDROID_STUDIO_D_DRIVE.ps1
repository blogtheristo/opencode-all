# Android Studio Installation Script for D: Drive
# Run this in PowerShell as Administrator

Write-Host "🚀 Android Studio D: Drive Installation Script" -ForegroundColor Green
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  Please run this script as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell → Run as Administrator" -ForegroundColor Yellow
    pause
    exit
}

# Create directories on D: drive
Write-Host "📁 Creating directories on D: drive..." -ForegroundColor Cyan
$androidRoot = "D:\Android"
$sdkPath = "$androidRoot\SDK"
$avdPath = "$androidRoot\.android"

New-Item -ItemType Directory -Force -Path $androidRoot | Out-Null
New-Item -ItemType Directory -Force -Path $sdkPath | Out-Null
New-Item -ItemType Directory -Force -Path $avdPath | Out-Null
New-Item -ItemType Directory -Force -Path "$avdPath\avd" | Out-Null

Write-Host "✅ Directories created:" -ForegroundColor Green
Write-Host "   - $androidRoot"
Write-Host "   - $sdkPath"
Write-Host "   - $avdPath"
Write-Host ""

# Check if Android Studio is already installed on C:
$cSdkPath = "$env:LOCALAPPDATA\Android\Sdk"
$cAvdPath = "$env:USERPROFILE\.android"

if (Test-Path $cSdkPath) {
    Write-Host "📦 Found existing Android SDK on C: drive" -ForegroundColor Yellow
    Write-Host "Do you want to move it to D: drive? (Y/N)" -ForegroundColor Yellow
    $response = Read-Host
    
    if ($response -eq "Y" -or $response -eq "y") {
        Write-Host "🔄 Moving Android SDK from C: to D:..." -ForegroundColor Cyan
        
        # Move SDK
        if (Test-Path $cSdkPath) {
            Write-Host "   Moving SDK (this may take a few minutes)..."
            Copy-Item -Path "$cSdkPath\*" -Destination $sdkPath -Recurse -Force
            Write-Host "   ✅ SDK moved"
        }
        
        # Move AVD
        if (Test-Path $cAvdPath) {
            Write-Host "   Moving AVD..."
            Copy-Item -Path "$cAvdPath\*" -Destination $avdPath -Recurse -Force
            Write-Host "   ✅ AVD moved"
        }
        
        # Create symbolic links
        Write-Host "🔗 Creating symbolic links..." -ForegroundColor Cyan
        
        if (Test-Path $cSdkPath) {
            Remove-Item -Path $cSdkPath -Recurse -Force
        }
        New-Item -ItemType SymbolicLink -Path $cSdkPath -Target $sdkPath -Force | Out-Null
        Write-Host "   ✅ SDK symbolic link created"
        
        if (Test-Path $cAvdPath) {
            Remove-Item -Path $cAvdPath -Recurse -Force
        }
        New-Item -ItemType SymbolicLink -Path $cAvdPath -Target $avdPath -Force | Out-Null
        Write-Host "   ✅ AVD symbolic link created"
        
        Write-Host ""
        Write-Host "✅ Migration complete!" -ForegroundColor Green
    }
}

# Set environment variables
Write-Host "🔧 Setting environment variables..." -ForegroundColor Cyan
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdkPath, "User")
[System.Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $sdkPath, "User")
[System.Environment]::SetEnvironmentVariable("ANDROID_AVD_HOME", "$avdPath\avd", "User")

# Add to PATH
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
$newPaths = @(
    "$sdkPath\platform-tools",
    "$sdkPath\emulator",
    "$sdkPath\tools",
    "$sdkPath\tools\bin"
)

foreach ($newPath in $newPaths) {
    if ($currentPath -notlike "*$newPath*") {
        $currentPath = "$currentPath;$newPath"
    }
}
[System.Environment]::SetEnvironmentVariable("Path", $currentPath, "User")

Write-Host "✅ Environment variables set:" -ForegroundColor Green
Write-Host "   ANDROID_HOME = $sdkPath"
Write-Host "   ANDROID_SDK_ROOT = $sdkPath"
Write-Host "   ANDROID_AVD_HOME = $avdPath\avd"
Write-Host ""

# Instructions
Write-Host "📝 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Download Android Studio:" -ForegroundColor White
Write-Host "   https://developer.android.com/studio" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. During installation, choose CUSTOM installation" -ForegroundColor White
Write-Host "   - Installation Location: D:\Android\Android Studio" -ForegroundColor Cyan
Write-Host "   - SDK Location: $sdkPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. After installation, open Android Studio:" -ForegroundColor White
Write-Host "   File → Settings → Appearance & Behavior → System Settings → Android SDK" -ForegroundColor Cyan
Write-Host "   Verify SDK Location: $sdkPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Create Virtual Device:" -ForegroundColor White
Write-Host "   Tools → AVD Manager → Create Virtual Device → Pixel 6" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. Run Firehorse Mobile:" -ForegroundColor White
Write-Host "   cd Firehorse\mobile-app" -ForegroundColor Cyan
Write-Host "   npm install" -ForegroundColor Cyan
Write-Host "   expo start" -ForegroundColor Cyan
Write-Host "   Press 'a' to run on Android" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Setup complete! You can now install Android Studio to D: drive." -ForegroundColor Green
Write-Host ""

# Disk space check
Write-Host "💾 Disk Space:" -ForegroundColor Yellow
$dDrive = Get-PSDrive D
$freeSpaceGB = [math]::Round($dDrive.Free / 1GB, 2)
Write-Host "   D: drive free space: $freeSpaceGB GB" -ForegroundColor Cyan
if ($freeSpaceGB -lt 20) {
    Write-Host "   ⚠️  Warning: Less than 20 GB free. Recommended: 20+ GB" -ForegroundColor Red
} else {
    Write-Host "   ✅ Sufficient space available" -ForegroundColor Green
}
Write-Host ""

pause
