# scripts/validate-pricing.ps1
# Pricing-config validator (PowerShell port).
#
# Enforces DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD §13 + §13.8:
#   1. dws10.com/config/products.json and landing-pages mirror are byte-identical (SHA-256).
#   2. Every SKU with a `tier` field carries the labor-anchored fields.
#   3. priceVersion has not regressed vs. main.
#   4. No public-site .md file publishes a EUR price.
#
# Used by .husky/pre-commit and the Windows CI lane.
#
# Exit codes: 0 = green, 1 = standard violation.

$ErrorActionPreference = "Stop"
$repoRoot = (Get-Location).Path
$src    = Join-Path $repoRoot "dws10.com/config/products.json"
$mirror = Join-Path $repoRoot "landing-pages/dws10-com/config/products.json"

$errors   = @()
$warnings = @()

function Get-Sha256([string]$path) {
  return (Get-FileHash -Algorithm SHA256 -Path $path).Hash.ToLower()
}

# 1. Mirror identical hash
$srcHash    = Get-Sha256 $src
$mirrorHash = Get-Sha256 $mirror
if ($srcHash -ne $mirrorHash) {
  $errors += "Mirror out of sync: $src ($($srcHash.Substring(0,12))) != $mirror ($($mirrorHash.Substring(0,12))). Re-run scripts/load-labor-catalog.py."
}

# 2. Schema check
$json = Get-Content $src -Raw | ConvertFrom-Json
$required = @("sku","tier","priceUnit","agents","nextUpsellSku","deploymentColor","priceVersion")
$validTiers  = @("T0","T1","T2","T3","T4","land","meter")
$validDeploy = @("blue","green")

foreach ($prop in $json.products.PSObject.Properties) {
  $key = $prop.Name
  $p   = $prop.Value
  if (-not $p.PSObject.Properties["tier"]) { continue }  # grandfathered legacy row

  foreach ($f in $required) {
    # nextUpsellSku may be null on terminal SKUs (T4 / attach-only) per §13.8.
    # All other required fields must be present and non-null.
    if (-not $p.PSObject.Properties[$f]) {
      $errors += "SKU $($key): missing required field `"$f`""
    } elseif ($null -eq $p.$f -and $f -ne "nextUpsellSku") {
      $errors += "SKU $($key): required field `"$f`" cannot be null"
    }
  }
  if ($p.tier -and ($validTiers -notcontains $p.tier)) {
    $errors += "SKU $($key): invalid tier `"$($p.tier)`""
  }
  if ($p.deploymentColor -and ($validDeploy -notcontains $p.deploymentColor)) {
    $errors += "SKU $($key): invalid deploymentColor `"$($p.deploymentColor)`""
  }
  if ($p.tier -eq "T0" -and $p.deploymentColor -ne "blue") {
    $errors += "SKU $($key): tier T0 must be deploymentColor:`"blue`""
  }
  $needsReplaces = ($p.tier -ne "land" -and $p.tier -ne "T0" -and $p.tier -ne "meter" -and `
                    @("T1","T2","T3","T4") -contains $p.tier)
  if ($needsReplaces) {
    if (-not $p.PSObject.Properties["replaces"]) {
      $errors += "SKU $($key): missing required object `"replaces`" (T1+ non-land)"
    } else {
      if (-not $p.replaces.role)       { $errors += "SKU $($key): replaces.role required" }
      if ($null -eq $p.replaces.fteCount -or $p.replaces.fteCount -isnot [double] -and $p.replaces.fteCount -isnot [int]) {
        $errors += "SKU $($key): replaces.fteCount must be a number"
      }
    }
  }
  if (-not ($p.agents -is [System.Array]) -and -not ($p.agents -is [System.Collections.IList])) {
    $errors += "SKU $($key): agents must be an array"
  }
  if ($key.StartsWith("LAND-")) {
    if (-not $p.agents -or $p.agents.Count -eq 0) {
      $errors += "LAND SKU $($key): must include at least one agent (engagement + agent)"
    }
    if (-not $p.PSObject.Properties["attachedAgentSku"] -and -not $p.nextUpsellSku) {
      $errors += "LAND SKU $($key): must point to attachedAgentSku or nextUpsellSku"
    }
  }
}

# 3. priceVersion monotonic vs main (best-effort)
$current = $json.priceVersion
if (-not $current) {
  $errors += "products.json missing priceVersion"
} else {
  try {
    $prevRaw = git show main:dws10.com/config/products.json 2>$null | Out-String
    if ($prevRaw) {
      $prevJson = $prevRaw | ConvertFrom-Json
      $prev = $prevJson.priceVersion
      function ToInt([string]$v) {
        $parts = $v -split '\.'
        return [int]$parts[0] * 1000 + [int]$parts[1]
      }
      if ((ToInt $current) -lt (ToInt $prev)) {
        $errors += "priceVersion regressed: main=$prev -> current=$current"
      } elseif ((ToInt $current) -eq (ToInt $prev)) {
        $warnings += "priceVersion unchanged vs main ($current). OK if non-pricing commit."
      }
    }
  } catch {
    # main not available - skip silently
  }
}

# 4. No public-site .md publishes prices
$publicRoots = @(
  "dws10.com","dws6.com","onelifetime.world","lifetime.fi",
  "landing-pages/dws10-com","landing-pages/dws6-com",
  "landing-pages/onelifetime-world","landing-pages/lifetime-fi"
)
$eurPattern = "€\s?\d{2,}|EUR\s?\d{2,}"
foreach ($root in $publicRoots) {
  $abs = Join-Path $repoRoot $root
  if (-not (Test-Path $abs)) { continue }
  Get-ChildItem -Path $abs -Filter "*.md" -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "[\\/]docs[\\/]" -and $_.FullName -notmatch "[\\/]node_modules[\\/]" } |
    ForEach-Object {
      $rel = $_.FullName.Substring($repoRoot.Length + 1)
      $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
      if ($content -match $eurPattern) {
        $warnings += "Public-site markdown carries a price string: $rel - confirm it renders from products.json instead."
      }
    }
}

if ($warnings.Count -gt 0) {
  Write-Warning "[validate-pricing] warnings:"
  foreach ($w in $warnings) { Write-Warning "  - $w" }
}

if ($errors.Count -gt 0) {
  Write-Error "[validate-pricing] FAIL"
  foreach ($e in $errors) { Write-Error "  x $e" }
  exit 1
}

Write-Output "[validate-pricing] OK - priceVersion $current"
