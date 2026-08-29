"""
Observability for MCP Hub: logging, Redis streams, Supabase logging.
"""

import json
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

# Global connections (set by hub startup)
_redis: Any = None
_supabase: Any = None

REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6380")
SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")


STREAM_AGENT_TASKS = "agent:tasks"
STREAM_AGENT_RESULTS = "agent:results"
CONSUMER_GROUP = "mcp-hub-workers"

ALLOWED_STREAMS: set[str] = {
    STREAM_AGENT_TASKS,
    STREAM_AGENT_RESULTS,
    "email:outbox",
    "email:inbox",
}

_FALLBACK_LOG_PATH = Path(__file__).resolve().parent / "agent_activity.jsonl"


async def init_redis() -> Any:
    """Initialize Redis connection."""
    global _redis
    try:
        from redis.asyncio import from_url as redis_from_url

        _redis = redis_from_url(
            REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=3,
        )
        await _redis.ping()
        logger.info("✅ Redis connected (%s)", REDIS_URL)
        await _ensure_streams()
    except Exception as exc:
        _redis = None
        logger.warning("⚠️  Redis unavailable — streams disabled (%s)", exc)
    return _redis


async def init_supabase() -> Any:
    """Initialize Supabase connection."""
    global _supabase
    if SUPABASE_URL and SUPABASE_SERVICE_KEY:
        try:
            from supabase._async.client import create_async_client

            _supabase = await create_async_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
            logger.info("✅ Supabase connected (%s)", SUPABASE_URL[:40])
        except Exception as exc:
            _supabase = None
            logger.warning("⚠️  Supabase unavailable — direct logging disabled (%s)", exc)
    else:
        logger.info("ℹ️  Supabase env vars not set — direct logging disabled")
    return _supabase


async def _ensure_streams() -> None:
    """Create consumer groups if they don't already exist."""
    if not _redis:
        return
    for stream in [STREAM_AGENT_TASKS, STREAM_AGENT_RESULTS]:
        with __import__("contextlib").suppress(Exception):
            await _redis.xgroup_create(stream, CONSUMER_GROUP, id="0", mkstream=True)


async def publish_to_stream(
    stream: str = STREAM_AGENT_TASKS,
    message: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Publish a message to a Redis Stream."""
    if message is None:
        message = {}
    if stream not in ALLOWED_STREAMS:
        raise ValueError(
            f"Stream '{stream}' not allowed. Permitted: {sorted(ALLOWED_STREAMS)}"
        )
    if not _redis:
        raise RuntimeError("Redis not available")

    await _ensure_streams()
    flat = {k: str(v) if not isinstance(v, str) else v for k, v in message.items()}
    msg_id = await _redis.xadd(stream, flat)
    return {"stream": stream, "message_id": msg_id}


async def read_from_stream(
    stream: str = STREAM_AGENT_RESULTS,
    count: int = 10,
) -> dict[str, Any]:
    """Read the latest messages from a Redis Stream (non-blocking peek)."""
    if stream not in ALLOWED_STREAMS:
        raise ValueError(
            f"Stream '{stream}' not allowed. Permitted: {sorted(ALLOWED_STREAMS)}"
        )
    if not _redis:
        raise RuntimeError("Redis not available")

    messages = await _redis.xrevrange(stream, count=count)
    return {
        "stream": stream,
        "count": len(messages),
        "messages": [{"id": mid, "data": data} for mid, data in messages],
    }


async def stream_info() -> dict[str, Any]:
    """Return length / consumer-group info for known streams."""
    if not _redis:
        return {"status": "redis_unavailable"}

    info: dict[str, Any] = {}
    for stream in [
        STREAM_AGENT_TASKS,
        STREAM_AGENT_RESULTS,
        "email:outbox",
        "email:inbox",
    ]:
        try:
            length = await _redis.xlen(stream)
            info[stream] = {"length": length}
        except Exception:
            info[stream] = {"length": 0, "note": "stream does not exist yet"}
    return info


async def log_agent_activity(
    agent_name: str,
    task_desc: str,
    status: str,
    metadata: dict[str, Any] | None = None,
) -> None:
    """Log agent activity to Supabase, Redis stream, or file fallback."""
    record = {
        "agent_name": agent_name,
        "task": task_desc,
        "status": status,
        "metadata": metadata or {"source": "mcp-hub"},
        "created_at": datetime.now().isoformat(),
    }

    # 1. Supabase direct
    if _supabase:
        try:
            await _supabase.table("agent_activity").insert(record).execute()
            return
        except Exception as exc:
            logger.warning("Supabase log failed: %s", exc)

    # 2. Redis stream fallback
    if _redis:
        try:
            flat = {k: str(v) for k, v in record.items()}
            await _redis.xadd(STREAM_AGENT_RESULTS, flat)
            return
        except Exception as exc:
            logger.warning("Redis log failed: %s", exc)

    # 3. Local JSONL file fallback (survives container restarts)
    try:
        with open(_FALLBACK_LOG_PATH, "a", encoding="utf-8") as fh:
            fh.write(json.dumps(record, default=str) + "\n")
        logger.info("[ACTIVITY→FILE] %s | %s | %s", agent_name, status, task_desc)
        return
    except Exception as exc:
        logger.warning("JSONL file log failed: %s", exc)

    # 4. Stderr last resort (ephemeral — lost on restart)
    logger.info("[ACTIVITY] %s | %s | %s", agent_name, status, task_desc)


async def sweep_fallback_logs() -> dict[str, Any]:
    """Push locally-buffered JSONL logs back to Supabase (or Redis)."""
    if not _FALLBACK_LOG_PATH.is_file():
        return {"swept": 0, "note": "no fallback log file"}

    swept = 0
    failed = 0
    with open(_FALLBACK_LOG_PATH, encoding="utf-8") as fh:
        lines = fh.readlines()

    if not lines:
        return {"swept": 0, "note": "file empty"}

    for line in lines:
        line = line.strip()
        if not line:
            continue
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            failed += 1
            continue

        stored = False
        if _supabase:
            try:
                await _supabase.table("agent_activity").insert(record).execute()
                stored = True
            except Exception:
                pass
        if not stored and _redis:
            try:
                flat = {k: str(v) for k, v in record.items()}
                await _redis.xadd(STREAM_AGENT_RESULTS, flat)
                stored = True
            except Exception:
                pass
        if stored:
            swept += 1
        else:
            failed += 1

    if failed == 0:
        open(_FALLBACK_LOG_PATH, "w").close()
        return {"swept": swept, "failed": 0, "file": "truncated"}

    logger.warning("Sweep: %d sent, %d failed — file kept for retry", swept, failed)
    return {"swept": swept, "failed": failed, "file": "retained"}


async def shutdown() -> None:
    """Close connections."""
    global _redis, _supabase
    if _redis:
        await _redis.aclose()
        _redis = None
    _supabase = None
    logger.info("Observability shutdown complete")