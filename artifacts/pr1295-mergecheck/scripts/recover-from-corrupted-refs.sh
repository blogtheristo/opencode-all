#!/bin/bash

# Git Corruption Recovery Script
# Version: 1.0
# Date: January 11, 2026
# Purpose: Automate recovery from corrupted git refs

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/blogtheristo/dws6.git"
BACKUP_DIR="dws6-backup-$(date +%Y%m%d-%H%M%S)"
CLEAN_DIR="dws6-clean"

echo -e "${GREEN}=== DWS6 Git Corruption Recovery Script ===${NC}"
echo ""

# Function to check if we're in a git repo
check_git_repo() {
    if [ ! -d ".git" ]; then
        echo -e "${RED}Error: Not in a git repository${NC}"
        echo "Please run this script from your dws6 repository directory"
        exit 1
    fi
}

# Function to backup current state
backup_current_state() {
    echo -e "${YELLOW}Step 1: Backing up current repository state...${NC}"
    
    # Create backup bundle
    if git bundle create "../${BACKUP_DIR}.bundle" --all 2>/dev/null; then
        echo -e "${GREEN}✓ Created backup bundle: ../${BACKUP_DIR}.bundle${NC}"
    else
        echo -e "${YELLOW}⚠ Could not create bundle (expected with corruption)${NC}"
    fi
    
    # Save ref logs
    mkdir -p "../${BACKUP_DIR}"
    cp -r .git/logs "../${BACKUP_DIR}/" 2>/dev/null || true
    
    # Save current commit info
    git log --all --oneline -100 > "../${BACKUP_DIR}/recent-commits.txt" 2>/dev/null || true
    
    echo -e "${GREEN}✓ Backup saved to: ../${BACKUP_DIR}/${NC}"
    echo ""
}

# Function to list remote branches
list_remote_branches() {
    echo -e "${YELLOW}Step 2: Checking remote branches on GitHub...${NC}"
    
    git ls-remote --heads origin | while read sha ref; do
        branch=$(echo "$ref" | sed 's|refs/heads/||')
        echo "  - $branch ($sha)"
    done
    echo ""
}

# Function to find your recent commits
find_recent_commits() {
    echo -e "${YELLOW}Step 3: Finding your recent commits...${NC}"
    
    # Try to find commits from various sources
    echo "Recent commits from all branches:"
    git log --all --since="7 days ago" --oneline --decorate 2>/dev/null || \
        echo "  (Unable to read some refs due to corruption)"
    echo ""
}

# Function to clone fresh copy
clone_fresh() {
    echo -e "${YELLOW}Step 4: Cloning fresh repository...${NC}"
    
    # Store the parent directory as absolute path
    PARENT_DIR=$(cd .. && pwd)
    cd "$PARENT_DIR"
    
    if [ -d "$CLEAN_DIR" ]; then
        echo -e "${RED}Error: Directory $CLEAN_DIR already exists${NC}"
        echo "Please remove it first or choose a different name"
        exit 1
    fi
    
    echo "Cloning from $REPO_URL..."
    git clone "$REPO_URL" "$CLEAN_DIR"
    cd "$CLEAN_DIR"
    
    echo -e "${GREEN}✓ Fresh clone created in ${PARENT_DIR}/${CLEAN_DIR}/${NC}"
    echo ""
}

# Function to list available branches for cherry-picking
list_cherrypick_candidates() {
    echo -e "${YELLOW}Step 5: Available branches for recovery:${NC}"
    
    git branch -r | grep -v HEAD | while read remote_branch; do
        branch=$(echo "$remote_branch" | sed 's|origin/||')
        commit_count=$(git rev-list --count "origin/main...$remote_branch" 2>/dev/null || echo "?")
        last_commit=$(git log -1 --format="%h %s" "$remote_branch" 2>/dev/null || echo "N/A")
        echo ""
        echo "Branch: $branch"
        echo "  Commits ahead of main: $commit_count"
        echo "  Last commit: $last_commit"
    done
    echo ""
}

# Function to create recovery branch
create_recovery_branch() {
    local source_branches=$1
    
    echo -e "${YELLOW}Step 6: Creating recovery branch...${NC}"
    
    git checkout -b feature/corruption-recovery main
    
    for branch in $source_branches; do
        echo "Merging origin/$branch..."
        if git merge "origin/$branch" --no-edit; then
            echo -e "${GREEN}✓ Merged $branch${NC}"
        else
            echo -e "${RED}✗ Conflict merging $branch${NC}"
            echo "Please resolve conflicts manually and run:"
            echo "  git merge --continue"
            return 1
        fi
    done
    
    echo -e "${GREEN}✓ Recovery branch created${NC}"
    echo ""
}

# Function to provide manual instructions
provide_manual_instructions() {
    # Get absolute path to clean directory
    PARENT_DIR=$(cd .. && pwd)
    CLEAN_PATH="${PARENT_DIR}/${CLEAN_DIR}"
    
    echo -e "${GREEN}=== Manual Recovery Instructions ===${NC}"
    echo ""
    echo "Your fresh repository is now in: ${CLEAN_PATH}"
    echo ""
    echo "Branches available on GitHub:"
    git branch -r | grep -v HEAD
    echo ""
    echo "To recover your work, you can:"
    echo ""
    echo "1. Check out the branch with your work:"
    echo "   cd \"${CLEAN_PATH}\""
    echo "   git checkout agent-1-7-10-launch"
    echo "   # or"
    echo "   git checkout feature/investor-progress-report-and-google-partnership"
    echo ""
    echo "2. Create a new branch combining multiple branches:"
    echo "   git checkout -b feature/merged-work main"
    echo "   git merge origin/agent-1-7-10-launch"
    echo "   git merge origin/feature/investor-progress-report-and-google-partnership"
    echo ""
    echo "3. Cherry-pick specific commits:"
    echo "   git checkout -b feature/cherry-picked main"
    echo "   git cherry-pick <commit-sha>"
    echo ""
    echo "4. Push your consolidated work:"
    echo "   git push -u origin feature/merged-work"
    echo ""
    echo "See GIT_CORRUPTION_RECOVERY.md for more details."
    echo ""
}

# Main execution
main() {
    echo "This script will help you recover from git corruption."
    echo ""
    echo -e "${YELLOW}WARNING: This will create a fresh clone in ../${CLEAN_DIR}${NC}"
    echo "Your current directory will be backed up but not modified."
    echo ""
    read -p "Continue? (y/n) " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Recovery cancelled."
        exit 0
    fi
    
    check_git_repo
    backup_current_state
    list_remote_branches
    find_recent_commits
    clone_fresh
    list_cherrypick_candidates
    provide_manual_instructions
    
    # Get absolute path for final message
    PARENT_DIR=$(cd .. && pwd)
    CLEAN_PATH="${PARENT_DIR}/${CLEAN_DIR}"
    
    echo -e "${GREEN}=== Recovery Complete ===${NC}"
    echo ""
    echo "Next steps:"
    echo "1. cd \"${CLEAN_PATH}\""
    echo "2. Review available branches"
    echo "3. Create your recovery branch"
    echo "4. Push to GitHub"
    echo ""
}

# Run main function
main "$@"
