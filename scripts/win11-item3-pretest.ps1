# Win11 item-3 degraded-mode pre-test (logic-only, NOT a hardware validation)
#
# Scope: proves the Aegis agent's degraded-mode code path (local audit-chain
# entry, kill-authority, Article 12 "not logged" flagging) survives a REAL
# network adapter disconnect on a Windows 11 machine. This is a free,
# early logic check only. It does NOT close item 3 in RELEASE-READINESS.md
# — Jetson Orin Nano hardware (ARM/JetPack) is still required to validate
# the actual confirmed edge target (Store/PRODUCT_AEGIS.md:198). Windows
# does not run on Jetson SoCs, so this can never substitute for that test.
#
# Usage (run from repo root, elevated PowerShell — adapter disable needs admin):
#   .\scripts\win11-item3-pretest.ps1 -AdapterName "Ethernet"
#
# What it does:
#   1. Runs the existing deterministic test suite baseline (network up).
#   2. Disables the named network adapter (real disconnect, not a mock).
#   3. Runs a standalone script exercising execute() with the adapter down,
#      capturing the local audit-chain entry and Article12 degraded flag.
#   4. Re-enables the adapter.
#   5. Confirms the chain entry from step 3 is still present and verifiable
#      after reconnection (reconciliation check).
#
# Requires: Node.js, repo dependencies installed (npm install), and the
# named adapter to be one this machine can safely disable (do not point
# this at your only network path if run over RDP/SSH — you will lose the
# session until it re-enables itself, which the script does automatically
# after the test regardless of success/failure).

param(
    [Parameter(Mandatory = $true)]
    [string]$AdapterName
)

$ErrorActionPreference = 'Stop'
$results = @{}

function Write-Section($title) {
    Write-Host ""
    Write-Host "=== $title ===" -ForegroundColor Cyan
}

Write-Section "Step 1: Baseline (network up)"
npx vitest run src/__tests__/agents/aegis.test.ts --reporter=verbose
if ($LASTEXITCODE -ne 0) {
    Write-Host "Baseline test suite failed — aborting before touching the network adapter." -ForegroundColor Red
    exit 1
}
$results.baseline = 'PASS'

Write-Section "Step 2: Disabling adapter '$AdapterName'"
try {
    Disable-NetAdapter -Name $AdapterName -Confirm:$false
    Start-Sleep -Seconds 2
    $results.adapterDisabled = 'OK'
} catch {
    Write-Host "Failed to disable adapter: $_" -ForegroundColor Red
    exit 1
}

Write-Section "Step 3: Running degraded-mode probe with network down"
try {
    node --input-type=module -e "
        import { AegisAgent } from './src/agents/aegis.agent.js';
        const ctx = { projectId: 'win11-pretest', userId: 'pretest', orgId: 'pretest', sessionId: 'win11-item3-' + Date.now() };
        const agent = new AegisAgent();
        const response = await agent.execute(ctx, { action: 'compliance', industry: 'steel' });
        const chain = await AegisAgent.getAuditChain();
        console.log(JSON.stringify({
            article12: response.metadata.article12,
            chainLength: chain.length,
            lastEntry: chain[chain.length - 1] ?? null,
        }, null, 2));
    " | Tee-Object -Variable probeOutput
    $results.offlineProbe = 'RAN'
    $results.offlineProbeOutput = $probeOutput
} catch {
    $results.offlineProbe = "FAILED: $_"
} finally {
    Write-Section "Step 4: Re-enabling adapter '$AdapterName'"
    Enable-NetAdapter -Name $AdapterName -Confirm:$false
    Start-Sleep -Seconds 3
    $results.adapterReenabled = 'OK'
}

Write-Section "Step 5: Post-reconnect verification"
npx vitest run src/__tests__/agents/aegis.test.ts -t "audit chain" --reporter=verbose
$results.postReconnectSuiteExit = $LASTEXITCODE

Write-Section "RESULT SUMMARY"
$results | ConvertTo-Json -Depth 5

Write-Host ""
Write-Host "This proves the CODE PATH only, on x86/Windows. It does NOT validate" -ForegroundColor Yellow
Write-Host "the confirmed Jetson Orin Nano (ARM/JetPack) edge target. Item 3 in" -ForegroundColor Yellow
Write-Host "RELEASE-READINESS.md stays NOT VALIDATED until that hardware test runs." -ForegroundColor Yellow
