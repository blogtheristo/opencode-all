# DWS6 PowerShell profile helper
# Copy or dot-source this file from your actual $PROFILE to ensure every shell
# loads the repo env vars, activates the Python virtual environment, and jumps
# into the repo root automatically.

$repoRoot = "D:\Proton\My files\2026\Repos2026\dws6"
$bootstrap = Join-Path -Path $repoRoot -ChildPath "scripts\Open-EnvTerminal.ps1"

function Start-Dws6Session {
    param(
        [switch]$NewWindow
    )

    if (-not (Test-Path -Path $bootstrap)) {
        Write-Warning "Cannot locate $bootstrap. Is the repository available?"
        return
    }

    if ($NewWindow) {
        & pwsh -NoExit -File $bootstrap
    }
    else {
        & $bootstrap -ReuseCurrentWindow
    }
}

if (Test-Path -Path $bootstrap) {
    # Load env + activate venv into the current shell on startup
    Start-Dws6Session
}
else {
    Write-Warning "DWS6 repository not found at $repoRoot. Update scripts/powershell.profile.dws6.ps1."
}
