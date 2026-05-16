<#
.SYNOPSIS
    DGX Spark Deploy — SSH Push & Start (PowerShell version)

.DESCRIPTION
    Deploys DWS IQ services to DGX Spark (Acer Veriton GN100).
    Primary 24/7 runtime. GitHub Actions as failover.

.PARAMETER Command
    Action to perform: Deploy, Status, Restart, Stop, Logs, Pull, Models, SshConfig, Help

.EXAMPLE
    .\Deploy-DgxSpark.ps1                  # Full deploy
    .\Deploy-DgxSpark.ps1 -Status          # Check status
    .\Deploy-DgxSpark.ps1 -Models          # Pull Ollama models
    .\Deploy-DgxSpark.ps1 -SshConfig       # Show SSH config
    .\Deploy-DgxSpark.ps1 -Restart         # Restart services
    .\Deploy-DgxSpark.ps1 -Logs            # Tail logs
    .\Deploy-DgxSpark.ps1 -Stop            # Stop (activates GHA failover)

.NOTES
    Code-Version: 1.0.0
    Date: 2026-03-29
    Owner: Lifetime Oy
#>

[CmdletBinding(DefaultParameterSetName = 'Deploy')]
param(
    [Parameter(ParameterSetName = 'Status')]
    [switch]$Status,

    [Parameter(ParameterSetName = 'Restart')]
    [switch]$Restart,

    [Parameter(ParameterSetName = 'Stop')]
    [switch]$Stop,

    [Parameter(ParameterSetName = 'Logs')]
    [switch]$Logs,

    [Parameter(ParameterSetName = 'Pull')]
    [switch]$Pull,

    [Parameter(ParameterSetName = 'Models')]
    [switch]$Models,

    [Parameter(ParameterSetName = 'ModelsCleanup')]
    [switch]$ModelsCleanup,

    [Parameter(ParameterSetName = 'SshConfig')]
    [switch]$SshConfig,

    [Parameter(ParameterSetName = 'Help')]
    [switch]$Help
)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
$DgxUser   = if ($env:DGX_SPARK_USER)   { $env:DGX_SPARK_USER }   else { 'admin100' }
$DgxIp     = if ($env:DGX_SPARK_IP)     { $env:DGX_SPARK_IP }     else { '192.168.101.113' }
$DgxPort   = if ($env:DGX_SPARK_SSH_PORT){ $env:DGX_SPARK_SSH_PORT } else { '22' }
$RepoDir   = if ($env:DGX_SPARK_REPO)   { $env:DGX_SPARK_REPO }   else { '/home/admin100/dws6' }
$Branch    = if ($env:DGX_SPARK_BRANCH)  { $env:DGX_SPARK_BRANCH } else { 'main' }
$SshTarget = "${DgxUser}@${DgxIp}"
$SshOpts   = @('-o', 'ConnectTimeout=10', '-o', 'ServerAliveInterval=60', '-p', $DgxPort)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
function Write-DGX  { param([string]$Msg) Write-Host "[DGX] $Msg" -ForegroundColor Green }
function Write-Warn { param([string]$Msg) Write-Host "[DGX] $Msg" -ForegroundColor Yellow }
function Write-Err  { param([string]$Msg) Write-Host "[DGX] $Msg" -ForegroundColor Red }

function Invoke-SshCommand {
    param([string]$Command)

    $retries = 3
    $delay   = 2

    for ($i = 1; $i -le $retries; $i++) {
        try {
            $result = & ssh @SshOpts $SshTarget $Command 2>&1
            if ($LASTEXITCODE -eq 0) {
                $result | Write-Output
                return $true
            }
        } catch {
            # SSH binary not found or other error
        }

        if ($i -lt $retries) {
            Write-Warn "SSH attempt $i failed, retrying in ${delay}s..."
            Start-Sleep -Seconds $delay
            $delay *= 2
        }
    }

    Write-Err "SSH failed after $retries attempts"
    return $false
}

# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------
function Invoke-DgxStatus {
    Write-DGX "Checking DGX Spark status..."
    Invoke-SshCommand @"
echo '=== System ==='
uname -a
echo ''
echo '=== Memory ==='
free -h
echo ''
echo '=== Disk ==='
df -h / | tail -1
echo ''
echo '=== Docker Containers ==='
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' 2>/dev/null || echo 'Docker not running'
echo ''
echo '=== Ollama Models ==='
ollama list 2>/dev/null || echo 'Ollama not running'
echo ''
echo '=== Heartbeat ==='
curl -s http://localhost:9999/health 2>/dev/null || echo 'Heartbeat not running'
"@
}

function Invoke-DgxPull {
    Write-DGX "Pulling latest code on DGX Spark..."
    Invoke-SshCommand "cd $RepoDir && git fetch origin $Branch && git checkout $Branch && git pull origin $Branch"
}

function Invoke-DgxDeploy {
    Write-DGX "Deploying to DGX Spark ($SshTarget)..."

    # 1. Test SSH
    Write-DGX "Testing SSH connection..."
    if (-not (Invoke-SshCommand "echo 'SSH OK'")) {
        Write-Err "Cannot reach DGX Spark at $SshTarget"
        return
    }

    # 2. Pull
    Invoke-DgxPull

    # 3. Install deps
    Write-DGX "Installing dependencies..."
    Invoke-SshCommand "cd $RepoDir && npm ci --omit=dev"

    # 4. Check .env
    Invoke-SshCommand @"
cd $RepoDir/infrastructure/dgx-spark
if [ ! -f .env ]; then
  echo 'WARNING: No .env file in infrastructure/dgx-spark/'
  echo 'Copy from main repo: cp $RepoDir/.env $RepoDir/infrastructure/dgx-spark/.env'
fi
"@

    # 5. Build and start
    Write-DGX "Building and starting services..."
    Invoke-SshCommand @"
cd $RepoDir/infrastructure/dgx-spark && \
docker compose build --pull && \
docker compose up -d && \
echo '' && \
echo '=== Running Containers ===' && \
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
"@

    # 6. Health checks
    Write-DGX "Waiting for health checks..."
    Start-Sleep -Seconds 5
    Invoke-SshCommand @"
echo '=== Backend ===' && \
curl -sf http://localhost:8080/health 2>/dev/null && echo '' || echo 'Backend: starting...'
echo '=== Cron ===' && \
curl -sf http://localhost:8081/health 2>/dev/null && echo '' || echo 'Cron: starting...'
echo '=== Heartbeat ===' && \
curl -sf http://localhost:9999/health 2>/dev/null && echo '' || echo 'Heartbeat: starting...'
"@

    Write-DGX "Deploy complete! DGX Spark is primary runtime."
    Write-DGX "Heartbeat: http://${DgxIp}:9999/health"
    Write-DGX "Backend:   http://${DgxIp}:8080/health"
    Write-DGX "Cron:      http://${DgxIp}:8081/status"
}

function Invoke-DgxRestart {
    Write-DGX "Restarting DGX Spark services..."
    Invoke-SshCommand @"
cd $RepoDir/infrastructure/dgx-spark && \
docker compose restart && \
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
"@
}

function Invoke-DgxLogs {
    Write-DGX "Tailing DGX Spark logs (Ctrl+C to stop)..."
    & ssh @SshOpts $SshTarget "cd $RepoDir/infrastructure/dgx-spark && docker compose logs --tail=50 -f"
}

function Invoke-DgxStop {
    Write-DGX "Stopping DGX Spark services..."
    Invoke-SshCommand "cd $RepoDir/infrastructure/dgx-spark && docker compose down"
    Write-Warn "Services stopped. GitHub Actions failover is now active."
}

function Invoke-DgxModels {
    Write-DGX "Pulling required Ollama models on DGX Spark..."
    Invoke-SshCommand @"
echo 'Pulling nemotron-3-super (may take a while — ~87GB)...'
ollama pull nemotron-3-super
echo ''
echo 'Pulling qwen3-coder:30b...'
ollama pull qwen3-coder:30b
echo ''
echo 'Available models:'
ollama list
"@
}

# ---------------------------------------------------------------------------
# Ollama cleanup — DESTRUCTIVE: removes deprecated models from the Spark
# Separate from -Models on purpose. Run only after the new models
# (nemotron-3-super + qwen3-coder:30b) are verified working in production.
# Until then, the old models (llama3.3:70b + qwen2.5-coder:32b) stay on
# disk as warm rollback. The Spark's 3TB NVMe easily holds all four.
# ---------------------------------------------------------------------------
function Invoke-DgxModelsCleanup {
    Write-DGX "Ollama cleanup - DESTRUCTIVE"
    Write-Host "This will remove the deprecated Spark Brain models:" -ForegroundColor Yellow
    Write-Host "  - llama3.3:70b        (previous Primary tier, ~40GB)" -ForegroundColor Yellow
    Write-Host "  - qwen2.5-coder:32b   (previous Fast tier, ~20GB)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Verify the new models work first (curl http://192.168.101.113:11434/api/generate)." -ForegroundColor Yellow
    Write-Host "Once removed, rolling back requires re-pulling ~60GB from ollama.com." -ForegroundColor Yellow
    Write-Host ""
    $confirm = Read-Host "Type 'remove' to confirm"
    if ($confirm -ne 'remove') {
        Write-Warn "Aborted."
        return
    }
    Invoke-SshCommand @"
echo 'Removing llama3.3:70b...'
ollama rm llama3.3:70b 2>/dev/null && echo '  removed' || echo '  not present (already removed)'
echo ''
echo 'Removing qwen2.5-coder:32b...'
ollama rm qwen2.5-coder:32b 2>/dev/null && echo '  removed' || echo '  not present (already removed)'
echo ''
echo 'Remaining models:'
ollama list
echo ''
echo 'Ollama model dir disk usage:'
du -sh /usr/share/ollama/.ollama/models/ 2>/dev/null || true
"@
}

function Show-SshConfig {
    Write-DGX "SSH Config for DGX Spark"
    Write-Host ""
    Write-Host "Add to ~\.ssh\config:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Host dgx-spark"
    Write-Host "  HostName $DgxIp"
    Write-Host "  User $DgxUser"
    Write-Host "  IdentityFile ~/.ssh/id_ed25519"
    Write-Host "  ServerAliveInterval 60"
    Write-Host "  ServerAliveCountMax 3"
    Write-Host "  # Port forwards for Cursor/Cline"
    Write-Host "  LocalForward 11435 localhost:11434"
    Write-Host "  LocalForward 9998 localhost:9999"
    Write-Host "  LocalForward 8081 localhost:8081"
    Write-Host ""
    Write-Host "Then: " -NoNewline
    Write-Host "ssh dgx-spark" -ForegroundColor Green
    Write-Host ""
    Write-Host "Quick SSH tunnel (without config):" -ForegroundColor Cyan
    Write-Host "  ssh -L 11435:localhost:11434 -L 9998:localhost:9999 ${DgxUser}@${DgxIp}"
    Write-Host ""
    Write-Host "Cursor: Base URL = http://localhost:11435/v1" -ForegroundColor Cyan
    Write-Host "Heartbeat dashboard: http://localhost:9998/" -ForegroundColor Cyan
}

function Show-DgxHelp {
    Write-Host "DGX Spark Deploy - DWS IQ Primary Runtime" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  .\Deploy-DgxSpark.ps1              # Full deploy (pull, build, start)"
    Write-Host "  .\Deploy-DgxSpark.ps1 -Status      # Check system status"
    Write-Host "  .\Deploy-DgxSpark.ps1 -Restart      # Restart Docker services"
    Write-Host "  .\Deploy-DgxSpark.ps1 -Stop          # Stop (enables GHA failover)"
    Write-Host "  .\Deploy-DgxSpark.ps1 -Logs          # Tail container logs"
    Write-Host "  .\Deploy-DgxSpark.ps1 -Pull          # Git pull only"
    Write-Host "  .\Deploy-DgxSpark.ps1 -Models        # Pull Ollama models"
    Write-Host "  .\Deploy-DgxSpark.ps1 -ModelsCleanup # Remove deprecated models (DESTRUCTIVE, prompts to confirm)"
    Write-Host "  .\Deploy-DgxSpark.ps1 -SshConfig     # Show SSH config"
    Write-Host ""
    Write-Host "Environment variables:" -ForegroundColor Cyan
    Write-Host "  DGX_SPARK_USER     SSH user (default: admin100)"
    Write-Host "  DGX_SPARK_IP       IP address (default: 192.168.101.113)"
    Write-Host "  DGX_SPARK_REPO     Repo path on DGX (default: /home/admin100/dws6)"
    Write-Host "  DGX_SPARK_BRANCH   Branch to deploy (default: main)"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
if ($Help)      { Show-DgxHelp }
elseif ($Status)    { Invoke-DgxStatus }
elseif ($Restart)   { Invoke-DgxRestart }
elseif ($Stop)      { Invoke-DgxStop }
elseif ($Logs)      { Invoke-DgxLogs }
elseif ($Pull)      { Invoke-DgxPull }
elseif ($Models)    { Invoke-DgxModels }
elseif ($ModelsCleanup) { Invoke-DgxModelsCleanup }
elseif ($SshConfig) { Show-SshConfig }
else                { Invoke-DgxDeploy }
