#!/usr/bin/env python3
"""
Script to perform security fix branch operations
"""

import os
import subprocess
import sys

os.chdir('F:\\2026\\Repos2026\\dws6')

def run_cmd(cmd, description=""):
    """Run a command and return result"""
    print(f"\n{'='*60}")
    if description:
        print(f"Running: {description}")
    print(f"Command: {' '.join(cmd)}")
    print('='*60)

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr, file=sys.stderr)
        return result.returncode == 0, result.stdout
    except subprocess.TimeoutExpired:
        print("ERROR: Command timed out after 60 seconds")
        return False, ""
    except Exception as e:
        print(f"ERROR: {e}")
        return False, ""

# Step 1: Create branch
print("\n" + "="*60)
print("STEP 1: Creating security fix branch")
print("="*60)
run_cmd(['git', 'checkout', '-b', 'fix/security-vulnerabilities-feb2026'],
        "Create branch")

# Step 2: Stage files
print("\n" + "="*60)
print("STEP 2: Staging modified files")
print("="*60)

files_to_stage = [
    'package-lock.json',
    'dws6.com/dashboard/firehorse/v10-react/package-lock.json',
    'dws6.com/tools/content-pipeline/package-lock.json',
    'landing-pages/dws6-com/tools/content-pipeline/package-lock.json',
    'cli/package-lock.json',
    'Firehorse/mobile-app/package.json',
    'Firehorse/mobile-app/package-lock.json',
    'mobile-dashboard/package.json',
    'mobile-dashboard/package-lock.json',
]

for file in files_to_stage:
    success, _ = run_cmd(['git', 'add', file], f"Stage {file}")
    if not success:
        print(f"Warning: Could not stage {file}")

# Step 3: Check status
print("\n" + "="*60)
print("STEP 3: Checking git status")
print("="*60)
run_cmd(['git', 'status', '--short'], "Short status")

# Step 4: Check diff stats
print("\n" + "="*60)
print("STEP 4: Checking staged changes")
print("="*60)
run_cmd(['git', 'diff', '--cached', '--stat'], "Diff stats")

# Step 5: Commit
print("\n" + "="*60)
print("STEP 5: Committing changes")
print("="*60)

commit_msg = """fix: resolve npm dependency security vulnerabilities

- Fix qs (GHSA-w7fw-mjwx-w883) and rollup (GHSA-mw96-cpmx-2vgc) in root
- Fix minimatch ReDoS, rollup path traversal, ajv ReDoS in v10-react dashboard
- Fix same vulnerabilities in content-pipeline packages
- Create cli/package-lock.json (0 vulnerabilities)
- Add npm overrides for tar, send, cacache in mobile apps (expo 50/49 transitive deps)
- Fix expo-securestore typo -> expo-secure-store in mobile-dashboard
- Create mobile-dashboard/package-lock.json

Note: tar/send in mobile apps require expo 50->55 upgrade for full remediation.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"""

run_cmd(['git', 'commit', '-m', commit_msg], "Commit changes")

# Step 6: Push
print("\n" + "="*60)
print("STEP 6: Pushing to remote")
print("="*60)
run_cmd(['git', 'push', '-u', 'origin', 'fix/security-vulnerabilities-feb2026'],
        "Push to remote")

print("\n" + "="*60)
print("COMPLETED")
print("="*60)
