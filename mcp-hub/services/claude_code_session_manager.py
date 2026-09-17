"""
Claude Code Session Manager
Persists Claude Code sessions to Supabase for cross-session continuity
"""

import hashlib
from datetime import datetime, timedelta

from supabase import Client


class ClaudeCodeSessionManager:
    """Persist Claude Code sessions to Supabase for cross-session continuity"""

    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def save_session_snapshot(
        self,
        session_id: str,
        conversation_history: list[dict],
        context_files: list[str],
        architectural_decisions: list[str],
    ):
        """Save Claude Code session state to Supabase"""

        # Generate content hash for deduplication
        content_hash = hashlib.sha256(str(conversation_history).encode()).hexdigest()

        snapshot = {
            "session_id": session_id,
            "agent_type": "claude-code",
            "session_name": f"claude-code-{datetime.now().isoformat()}",
            "context_snapshot": {
                "conversation_history": conversation_history[-50:],  # Last 50 messages
                "context_files": context_files,
                "architectural_decisions": architectural_decisions,
                "content_hash": content_hash,
            },
        }

        # Upsert to Supabase
        self.supabase.table("agent_sessions").upsert(
            snapshot, on_conflict="session_id"
        ).execute()

        return {"saved": True, "session_id": session_id, "content_hash": content_hash}

    async def restore_session_context(self, session_id: str | None = None) -> dict:
        """Restore most recent Claude Code session context"""

        query = (
            self.supabase.table("agent_sessions")
            .select("*")
            .eq("agent_type", "claude-code")
        )

        if session_id:
            query = query.eq("session_id", session_id)
        else:
            # Get most recent session
            query = query.order("updated_at", desc=True).limit(1)

        response = query.execute()

        if not response.data:
            return {"context": "No previous session found"}

        session = response.data[0]
        return session["context_snapshot"]

    async def generate_claude_md_from_sessions(self, days_back: int = 7) -> str:
        """Generate CLAUDE.md from recent session history"""

        cutoff_date = (datetime.now() - timedelta(days=days_back)).isoformat()

        sessions = (
            self.supabase.table("agent_sessions")
            .select("*")
            .eq("agent_type", "claude-code")
            .gte("created_at", cutoff_date)
            .order("created_at", desc=False)
            .execute()
        )

        # Synthesize architectural decisions
        all_decisions = []
        for session in sessions.data:
            decisions = session["context_snapshot"].get("architectural_decisions", [])
            all_decisions.extend(decisions)

        # Deduplicate and format as markdown
        unique_decisions = list(set(all_decisions))

        return f"""# DWS IQ 6 Project Context

## Architecture Decisions (Last {days_back} Days)

{chr(10).join(f"- {decision}" for decision in unique_decisions)}

## Active Context Files
{chr(10).join(f"- {file}" for file in self._get_active_files(sessions.data))}

## Common Commands
```bash
# Development
docker-compose -f docker-compose.mcp.yml up -d
npm run dev

# Testing
pytest tests/
npm test

# Deployment
./scripts/deploy.sh staging
```

## Carbon Calculation Rules
- Use EN 15978 methodology
- Material factors from EU databases
- Include A1-A3 stages minimum (cradle to gate)
- Account for transport (50km default for Finland)
- EU Fit for 55 compliance targets: 55% reduction by 2030

## MCP Hub Architecture
- Supabase MCP Server: http://localhost:8766
- MCP Coordination Hub: http://localhost:8765
- Temporal Workflows: http://localhost:7233

Last updated: {datetime.now().isoformat()}
"""

    def _get_active_files(self, sessions: list[dict]) -> list[str]:
        """Extract frequently referenced files from session history"""
        file_counts = {}

        for session in sessions:
            files = session["context_snapshot"].get("context_files", [])
            for file in files:
                file_counts[file] = file_counts.get(file, 0) + 1

        # Return files mentioned in >50% of sessions
        threshold = len(sessions) * 0.5
        return [f for f, count in file_counts.items() if count >= threshold]

    async def get_session_summary(self, session_id: str) -> dict:
        """Get summary of a specific session for Claude Chat queries"""
        response = (
            self.supabase.table("agent_sessions")
            .select("*")
            .eq("session_id", session_id)
            .execute()
        )

        if not response.data:
            return {"error": "Session not found"}

        session = response.data[0]
        context = session["context_snapshot"]

        return {
            "session_id": session_id,
            "session_name": session["session_name"],
            "created_at": session["created_at"],
            "architectural_decisions": context.get("architectural_decisions", []),
            "context_files": context.get("context_files", []),
            "message_count": len(context.get("conversation_history", [])),
            "summary": self._generate_summary(context),
        }

    def _generate_summary(self, context: dict) -> str:
        """Generate human-readable summary of session"""
        decisions = context.get("architectural_decisions", [])
        files = context.get("context_files", [])

        summary = f"Session involved {len(decisions)} architectural decisions "
        summary += f"and referenced {len(files)} files. "

        if decisions:
            summary += "\n\nKey decisions:\n"
            for i, decision in enumerate(decisions[:3], 1):
                summary += f"{i}. {decision}\n"

        return summary
