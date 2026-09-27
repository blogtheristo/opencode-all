# Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=gpt-5.6-sol Agent=copilot Date=2026-09-27
# Audit trail: git log -- scripts/install-learning-hub.ps1
[CmdletBinding()]
param(
    [ValidateSet("admin", "investor", "partner", "customer")]
    [string]$Role
)

$ErrorActionPreference = "Stop"
$SourceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$VersionFile = Join-Path $SourceRoot "VERSION.json"
$ChecksumFile = Join-Path $SourceRoot "checksums.sha256"

if (-not (Test-Path -LiteralPath $VersionFile -PathType Leaf)) { throw "VERSION.json is missing from the role pack." }
if (-not (Test-Path -LiteralPath $ChecksumFile -PathType Leaf)) { throw "checksums.sha256 is missing from the role pack." }

$VersionInfo = Get-Content -LiteralPath $VersionFile -Raw | ConvertFrom-Json
$PackRole = [string]$VersionInfo.role
$PackVersion = [string]$VersionInfo.packVersion
$AllowedRoles = @("admin", "investor", "partner", "customer")
if ($AllowedRoles -notcontains $PackRole) { throw "VERSION.json contains an unknown audience role." }
if ($Role -and $Role -ne $PackRole) { throw "Requested role '$Role' does not match pack role '$PackRole'." }
if ($PackVersion -notmatch '^\d{4}\.\d{2}\.\d{2}$') { throw "VERSION.json contains an invalid pack version." }

foreach ($Line in (Get-Content -LiteralPath $ChecksumFile)) {
    if ($Line -notmatch '^([a-f0-9]{64})  (.+)$') { throw "Invalid checksum entry: $Line" }
    $Expected = $Matches[1]
    $RelativePath = $Matches[2]
    if ([System.IO.Path]::IsPathRooted($RelativePath) -or $RelativePath -match '(^|[\\/])\.\.([\\/]|$)') { throw "Unsafe checksum path: $RelativePath" }
    $Candidate = Join-Path $SourceRoot ($RelativePath -replace '/', [System.IO.Path]::DirectorySeparatorChar)
    if (-not (Test-Path -LiteralPath $Candidate -PathType Leaf)) { throw "Pack file is missing: $RelativePath" }
    $Actual = (Get-FileHash -LiteralPath $Candidate -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($Actual -ne $Expected) { throw "Checksum verification failed: $RelativePath" }
}

$InstallBase = Join-Path $env:LOCALAPPDATA "Lifetime Oy\DWS6 Learning Hub\$PackRole"
$Target = Join-Path $InstallBase $PackVersion
$Staging = Join-Path $InstallBase (".staging-" + [guid]::NewGuid().ToString("N"))
$Backup = "$Target.previous"
$ReplacedExisting = $false
$Promoted = $false
New-Item -ItemType Directory -Path $InstallBase -Force | Out-Null

try {
    Copy-Item -LiteralPath $SourceRoot -Destination $Staging -Recurse
    if (Test-Path -LiteralPath $Backup) { Remove-Item -LiteralPath $Backup -Recurse -Force }
    if (Test-Path -LiteralPath $Target) {
        Move-Item -LiteralPath $Target -Destination $Backup
        $ReplacedExisting = $true
    }
    Move-Item -LiteralPath $Staging -Destination $Target
    $Promoted = $true

    $Programs = [Environment]::GetFolderPath("Programs")
    $ShortcutDirectory = Join-Path $Programs "DWS6 Learning Hub"
    New-Item -ItemType Directory -Path $ShortcutDirectory -Force | Out-Null
    $ShortcutPath = Join-Path $ShortcutDirectory ("DWS6 Learning Hub - " + $PackRole + ".lnk")
    $Shell = New-Object -ComObject WScript.Shell
    $Shortcut = $Shell.CreateShortcut($ShortcutPath)
    $Shortcut.TargetPath = Join-Path $Target "index.html"
    $Shortcut.WorkingDirectory = $Target
    $Shortcut.Description = "DWS6 Learning Hub ($PackRole, $PackVersion)"
    $Shortcut.Save()

    if (Test-Path -LiteralPath $Backup) { Remove-Item -LiteralPath $Backup -Recurse -Force }
    Write-Host "Installed DWS6 Learning Hub '$PackRole' version $PackVersion to $Target"
}
catch {
    if (Test-Path -LiteralPath $Staging) { Remove-Item -LiteralPath $Staging -Recurse -Force }
    if ($Promoted -and (Test-Path -LiteralPath $Target)) { Remove-Item -LiteralPath $Target -Recurse -Force }
    if ($ReplacedExisting -and (Test-Path -LiteralPath $Backup)) { Move-Item -LiteralPath $Backup -Destination $Target }
    throw
}
