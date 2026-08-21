# Installation Fixes for DGX Environment

## Python Path Issues

### Problem
When running opencode from the dws6 directory, users encountered "Executable not found in $PATH: python" errors.

### Root Cause
The system had Python installed at `/usr/bin/python3` but opencode was looking for a `python` executable in the PATH, and the virtual environment's Python symlinks were pointing to the system Python instead of the venv's own executables.

### Solution
1. Created a symlink in user directory to make python executable available:
   ```bash
   ln -sf /usr/bin/python3 /home/admin100/bin/python
   ```

2. Updated PATH in `~/.bashrc` to include user bin directory:
   ```bash
   export PATH="/home/admin100/bin:$PATH"
   ```

3. Properly reinitialized virtual environment in dws6 directory:
   ```bash
   cd /home/admin100/dws6
   rm -rf .venv
   python3 -m venv .venv --upgrade-deps
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

## MCP Server Issues

### Problem
The `dws-gateway-local` MCP server failed with Python executable not found errors.

### Solution
1. Ensured virtual environment was properly configured with required Python packages:
   ```bash
   pip install --break-system-packages mcp-server fastmcp supabase httpx
   ```

2. Verified Python execution works in virtual environment:
   ```bash
   source .venv/bin/activate
   python3 mcp-servers/cloud-run-gateway/server.py --transport stdio
   ```

## Worktree Agents

### Problem
Worktree agents were not working correctly.

### Solution
1. Ensured proper directory permissions and access
2. Verified Python environment is correctly set up in all contexts
3. Confirmed MCP servers start with correct environment variables

## Installation Checklist

1. Ensure Python 3.12+ is available
2. Create symlink for python executable: `ln -sf /usr/bin/python3 /home/admin100/bin/python`
3. Update PATH: Add `/home/admin100/bin` to PATH
4. Reinitialize virtual env in dws6: `python3 -m venv .venv --upgrade-deps`
5. Install required packages: `pip install --break-system-packages mcp-server fastmcp supabase httpx`
6. Verify environment: `source .venv/bin/activate && python3 --version`

## Testing

After applying these fixes:
1. Restart opencode
2. Verify Python path is correct: `which python`
3. Check MCP servers can start: `source .venv/bin/activate && python3 mcp-servers/cloud-run-gateway/server.py --transport stdio`
4. Confirm agent functionality works in the worktree environment

## Note for Developers

These fixes ensure that:
- Python executables are found in the correct PATH locations
- Virtual environments work properly with MCP servers
- Worktrees behave correctly in opencode sessions
- DGX integration works as expected