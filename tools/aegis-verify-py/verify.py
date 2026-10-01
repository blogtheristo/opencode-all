#!/usr/bin/env python3
# Evidence: Tool=Claude Code Model=claude Agent=aegis-evidence-impl Date=2026-10-01
# Audit trail: git log -- tools/aegis-verify-py/verify.py
"""Independent reference verifier for Aegis pilot evidence bundles.

Implements docs/aegis/EVIDENCE_FORMAT_v1.md from the specification alone: Python standard
library plus the `cryptography` package (Ed25519). It shares no code with the Aegis kit, so
an auditor can check a bundle years later without Lifetime's code.

    python3 verify.py bundle DIR [--expect-key-id K] [--operator-copies DIR] [--now ISO]
    python3 verify.py ledger FILE --bundle DIR [--extra-bodies DIR] [--omit-body DIGEST ...]
    python3 verify.py vectors DIR      (docs/aegis/evidence-test-vectors)

Prints one JSON document. Exit 0 verified, 4 verification failed, 1 usage error.
Without --expect-key-id a bundle is checked only against the key it carries (integrity,
not authenticity): pass the key id from your own copy of the signed scope.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import math
import os
import re
import sys
from datetime import datetime, timezone
from decimal import Decimal

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)
from cryptography.hazmat.primitives.serialization import (
    Encoding,
    PublicFormat,
    load_pem_public_key,
)

GENESIS_HASH = "0" * 64
FRAME_DOMAIN = "dws.aegis.operator-command.v1"
HEX64 = re.compile(r"^[0-9a-f]{64}$")
CLOCK_SKEW_S = 5 * 60
BUNDLE_PATH = re.compile(
    r"^(AUDITOR_GUIDE\.md|ledger/article12\.jsonl|ledger/segments/\d{6}\.(jsonl|seal\.json)"
    r"|site/site\.json|acceptance/[A-Za-z0-9._-]{1,128}\.json"
    r"|credentials/[A-Za-z0-9._-]{1,128}\.json|command-bodies/[0-9a-f]{64}\.json"
    r"|anchor/(queue\.jsonl|state\.json))$"
)
AGENT_WORK_EVENTS = {"agent.decide", "tool.invoke"}
OPERATOR_EVENT_OF = {"stop": "human.override", "decide": "human.decide"}
OPERATOR_EVENT_TYPES = set(OPERATOR_EVENT_OF.values())


# --- §2 canonical JSON -------------------------------------------------------------------


def es_number(x) -> str:
    """ECMAScript Number::toString, as JSON.stringify writes a number."""
    if isinstance(x, bool):
        raise TypeError("bool is not a number")
    if isinstance(x, int):
        if abs(x) <= 2**53:
            return str(x)
        x = float(x)  # what an ECMAScript parser would hold
    if not math.isfinite(x):
        return "null"
    if x == 0:
        return "0"
    sign = "-" if x < 0 else ""
    t = Decimal(repr(abs(x))).as_tuple()  # repr: shortest round-trip digits
    # value = int(all_digits) * 10**exponent; strip trailing zeros.
    all_digits = "".join(map(str, t.digits))
    stripped = all_digits.rstrip("0")
    exp = t.exponent + (len(all_digits) - len(stripped))
    s = stripped.lstrip("0")
    k = len(s)
    n = exp + k  # value = 0.s × 10**n
    if k <= n <= 21:
        out = s + "0" * (n - k)
    elif 0 < n <= 21:
        out = s[:n] + "." + s[n:]
    elif -6 < n <= 0:
        out = "0." + "0" * (-n) + s
    else:
        e = n - 1
        mant = s[0] + ("." + s[1:] if k > 1 else "")
        out = f"{mant}e{'+' if e >= 0 else '-'}{abs(e)}"
    return sign + out


_ESC = {'"': '\\"', "\\": "\\\\", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "\t": "\\t"}


def es_string(s: str) -> str:
    """JSON.stringify of a string (ES2019 well-formed: lone surrogates escaped)."""
    out = ['"']
    for ch in s:
        c = ord(ch)
        if ch in _ESC:
            out.append(_ESC[ch])
        elif c < 0x20 or 0xD800 <= c <= 0xDFFF:
            out.append(f"\\u{c:04x}")
        else:
            out.append(ch)
    out.append('"')
    return "".join(out)


def _utf16_key(k: str) -> bytes:
    return k.encode("utf-16-be", "surrogatepass")


def canonical(v) -> str:
    if v is None:
        return "null"
    if v is True:
        return "true"
    if v is False:
        return "false"
    if isinstance(v, (int, float)):
        return es_number(v)
    if isinstance(v, str):
        return es_string(v)
    if isinstance(v, list):
        return "[" + ",".join(canonical(x) for x in v) + "]"
    if isinstance(v, dict):
        return "{" + ",".join(
            es_string(k) + ":" + canonical(v[k]) for k in sorted(v, key=_utf16_key)
        ) + "}"
    raise TypeError(f"not a JSON value: {type(v)}")


def _no_duplicates(pairs):
    out = {}
    for k, v in pairs:
        if k in out:
            raise ValueError(f"duplicate key {k!r}")
        out[k] = v
    return out


def _no_constants(name):
    raise ValueError(f"{name} is not JSON")


def loads(text: str):
    return json.loads(text, object_pairs_hook=_no_duplicates, parse_constant=_no_constants)


def read_json(path: str):
    with open(path, encoding="utf-8") as f:
        return loads(f.read())


def read_jsonl(path: str):
    with open(path, encoding="utf-8", newline="") as f:
        raw = f.read()
    if raw and not raw.endswith("\n"):
        raise ValueError("torn final line (incomplete write)")
    return [loads(line) for line in raw.split("\n") if line.strip()]


# --- §3 hashes, signatures, keys ---------------------------------------------------------------


def sha256_hex(data) -> str:
    if isinstance(data, str):
        data = data.encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def b64url(sig: str) -> bytes:
    return base64.urlsafe_b64decode(sig + "=" * (-len(sig) % 4))


def public_key(pem: str) -> Ed25519PublicKey:
    key = load_pem_public_key(pem.encode("ascii"))
    if not isinstance(key, Ed25519PublicKey):
        raise ValueError("not an Ed25519 public key")
    return key


def key_id(pem: str) -> str:
    return sha256_hex(pem.strip())[:16]


def verify_payload(payload, sig, key: Ed25519PublicKey) -> bool:
    """Ed25519 over the UTF-8 canonical JSON of the payload; base64url signature."""
    if not isinstance(sig, str):
        return False
    try:
        key.verify(b64url(sig), canonical(payload).encode("utf-8"))
        return True
    except (InvalidSignature, ValueError):
        return False


def parse_time(s) -> float | None:
    if not isinstance(s, str):
        return None
    try:
        d = datetime.fromisoformat(s.replace("Z", "+00:00"))
    except ValueError:
        return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=timezone.utc)
    return d.timestamp()


# --- §4 ledger ---------------------------------------------------------------------------


def event_body(e: dict) -> dict:
    return {k: v for k, v in e.items() if k not in ("event_hash", "sig")}


def verify_chain(events, site_key) -> str | None:
    """Sequence, links, hashes, site signatures, time order, stop tombstones."""
    prev = GENESIS_HASH
    prev_ts = None
    stopped = set()
    for i, e in enumerate(events):
        if e.get("seq") != i:
            return f"seq {i}: sequence break"
        if e.get("prev_hash") != prev:
            return f"seq {i}: prev_hash does not link to previous event"
        if sha256_hex(prev + canonical(event_body(e))) != e.get("event_hash"):
            return f"seq {i}: event_hash does not match event content"
        if not verify_payload(e["event_hash"], e.get("sig"), site_key):
            return f"seq {i}: site signature missing or invalid"
        ts = parse_time(e.get("timestamp"))
        if ts is None:
            return f"seq {i}: unparseable timestamp"
        if prev_ts is not None and ts < prev_ts:
            return f"seq {i}: timestamp moved backwards"
        if e.get("agent_id") in stopped and e.get("event_type") in AGENT_WORK_EVENTS:
            return f"seq {i}: agent recorded work after its stop (tombstone violated)"
        if e.get("event_type") == "human.override":
            stopped.update(x for x in (e.get("detail") or {}).get("agents_stopped", []) if isinstance(x, str))
        prev_ts = ts
        prev = e["event_hash"]
    return None


# --- §5 operator evidence --------------------------------------------------------------------


def split_command(cmd: dict):
    body = {k: v for k, v in cmd.items() if k not in ("signature", "digestSignature")}
    return body, cmd.get("signature"), cmd.get("digestSignature")


def command_digest(cmd: dict) -> str:
    return sha256_hex(canonical(split_command(cmd)[0]))


def frame(kind, command_id, issued_at, role, digest) -> dict:
    return {
        "domain": FRAME_DOMAIN,
        "command_id": command_id,
        "command_kind": kind,
        "role": role,
        "issued_at": issued_at,
        "command_digest": digest,
    }


def same(a, b) -> bool:
    return canonical(a) == canonical(b)


def credential_problem(cred, cid, site, site_key) -> str | None:
    if not isinstance(cred, dict) or cred.get("v") != 1:
        return "unsupported credential version"
    if cred.get("credentialId") != cid:
        return "credential file id differs from its credentialId"
    if cred.get("kind") != "operator" or not isinstance(cred.get("subjectPublicKeyPem"), str):
        return "not an operator credential with a bound public key"
    if cred.get("siteId") != site["siteId"]:
        return "credential is for another site"
    if cred.get("issuerKeyId") != key_id(site["publicKeyPem"]):
        return "issuer is not this site key"
    body = {k: v for k, v in cred.items() if k != "signature"}
    if not verify_payload(body, cred.get("signature"), site_key):
        return "credential signature does not verify under the site key"
    return None


def operator_event_failure(e, segment_events, ctx, body_override=None) -> str | None:
    """EVIDENCE_FORMAT_v1.md §5.3, in its order. Returns 'CODE: message' or None."""
    def mismatch(field):
        return f"OPERATOR_BINDING_MISMATCH:{field}: event field differs from what the operator signed"

    d = e.get("detail") if isinstance(e.get("detail"), dict) else {}
    digest = d.get("command_digest")
    # 1
    if not (
        isinstance(digest, str) and HEX64.match(digest)
        and isinstance(d.get("command_id"), str)
        and isinstance(d.get("command_kind"), str)
        and isinstance(d.get("issued_at"), str)
        and "role" in d and (d["role"] is None or isinstance(d["role"], str))
        and isinstance(d.get("operator_credential_id"), str)
        and isinstance(d.get("digest_signature"), str)
        and isinstance(d.get("operator_signature"), str)
    ):
        return "OPERATOR_EVIDENCE_MISSING: event carries no operator-signed command evidence"
    kind = d["command_kind"]
    # 2
    if OPERATOR_EVENT_OF.get(kind) != e.get("event_type"):
        return mismatch("command_kind")
    # 3
    body = body_override if body_override is not None else ctx["bodies"].get(digest)
    if body is not None:
        if command_digest(body) != digest:
            return "COMMAND_BODY_INVALID: body does not hash to command_digest"
        if not same(body.get("operatorCredentialId"), d["operator_credential_id"]):
            return mismatch("operator_credential_id")
    # 4–5
    cid = d["operator_credential_id"]
    cred = ctx["credentials"].get(cid)
    if cred is None:
        return f"OPERATOR_CREDENTIAL_MISSING: credentials/{cid}.json not in the bundle"
    problem = credential_problem(cred, cid, ctx["site"], ctx["site_key"])
    if problem:
        return f"OPERATOR_CREDENTIAL_INVALID: {problem}"
    cap = "agent.stop" if kind == "stop" else "decision.record"
    if cap not in (cred.get("capabilities") or []):
        return f'OPERATOR_CREDENTIAL_INVALID: capability "{cap}" not granted'
    try:
        op_key = public_key(cred["subjectPublicKeyPem"])
    except ValueError:
        return "OPERATOR_CREDENTIAL_INVALID: bound public key is not Ed25519"
    # 6
    if not verify_payload(frame(kind, d["command_id"], d["issued_at"], d["role"], digest), d["digest_signature"], op_key):
        return "OPERATOR_SIGNATURE_INVALID: framed digest signature does not verify under the operator key"
    # 7
    issued = parse_time(d["issued_at"])
    c_from, c_to = parse_time(cred.get("issuedAt")), parse_time(cred.get("expiresAt"))
    if issued is None or c_from is None or c_to is None or issued < c_from - CLOCK_SKEW_S or issued >= c_to:
        return "OPERATOR_CREDENTIAL_EXPIRED: command signed outside the credential's validity"
    # 8
    if cred.get("subjectId") != e.get("operator_id"):
        return mismatch("operator_id")
    if not same(cred.get("role"), d["role"]):
        return mismatch("role")
    # 9
    if kind == "stop":
        if d.get("action") != "agent.stop":
            return mismatch("action")
    else:
        if d.get("action") != "decision":
            return mismatch("action")
        if not isinstance(d["role"], str) or d.get("decision_by") != d["role"]:
            return mismatch("decision_by")
        if not same(d.get("signed_at"), d["issued_at"]):
            return mismatch("signed_at")
        seq = d.get("recommendation_seq")
        rec = segment_events[seq] if isinstance(seq, int) and not isinstance(seq, bool) and 0 <= seq < len(segment_events) else None
        if rec is None or rec.get("seq") != seq or rec.get("event_hash") != d.get("recommendation_hash"):
            return mismatch("recommendation")
    # 10
    if body is None:
        if digest in ctx["redacted"]:
            return None
        return f"COMMAND_BODY_MISSING: body {digest} absent and no evidence.redacted records its erasure"
    # 11
    if not same(body.get("signature"), d["operator_signature"]):
        return mismatch("operator_signature")
    signed, _, _ = split_command(body)
    if not verify_payload(signed, d["operator_signature"], op_key):
        return "OPERATOR_SIGNATURE_INVALID: command body signature does not verify under the operator key"
    if body.get("v") != 1:
        return mismatch("v")
    if not same(body.get("commandId"), d["command_id"]):
        return mismatch("command_id")
    if not same(body.get("issuedAt"), d["issued_at"]):
        return mismatch("issued_at")
    if kind == "stop":
        return mismatch("target") if not same(body.get("target"), d.get("target")) else None
    for bk, dk in (
        ("verdict", "verdict"),
        ("recommendationSeq", "recommendation_seq"),
        ("recommendationHash", "recommendation_hash"),
        ("modificationDigest", "modification_digest"),
    ):
        if not same(body.get(bk), d.get(dk)):
            return mismatch(dk)
    if not same(body.get("capture") or "live", d.get("capture")):
        return mismatch("capture")
    occurred = body.get("occurredAt") if body.get("capture") == "manual_entry" else body.get("issuedAt")
    a, b = parse_time(occurred), parse_time(d.get("decided_at"))
    if a is None or a != b:
        return mismatch("decided_at")
    return None


def verify_operator_evidence(segments, ctx) -> list[str]:
    failures = []
    referenced = set()
    seen = {}  # a command is executed once (§5.3 step 0)
    for label, events, _ in segments:
        for e in events:
            if e.get("event_type") not in OPERATOR_EVENT_TYPES:
                continue
            d = e.get("detail") or {}
            dg = d.get("command_digest")
            if isinstance(dg, str):
                referenced.add(dg)
            where = f"{label} seq {e.get('seq')}"
            keys = [f"{e.get('event_type')}:{k}" for k in (d.get("command_id"), dg) if isinstance(k, str)]
            first = next((seen[k] for k in keys if k in seen), None)
            if first:
                failures.append(
                    f"OPERATOR_COMMAND_REPLAYED: {where} {e.get('event_type')}: command already recorded at {first}"
                )
                continue
            for k in keys:
                seen[k] = where
            f = operator_event_failure(e, events, ctx)
            if f:
                code, _, rest = f.partition(": ")
                failures.append(f"{code}: {label} seq {e.get('seq')} {e.get('event_type')}: {rest}")
    for dg in ctx["bodies"]:
        if dg not in referenced:
            failures.append(f"COMMAND_BODY_INVALID: command-bodies/{dg}.json: no operator event references it")
    return failures


def redacted_digests(segments) -> set:
    return {
        (e.get("detail") or {}).get("command_digest")
        for _, events, _ in segments
        for e in events
        if e.get("event_type") == "evidence.redacted"
    }


def load_bodies(directory, failures, names=None) -> dict:
    bodies = {}
    if not os.path.isdir(directory):
        return bodies
    for name in sorted(names if names is not None else os.listdir(directory)):
        if not name.endswith(".json"):
            continue
        digest = name[:-5]
        try:
            body = read_json(os.path.join(directory, name))
        except (OSError, ValueError) as err:
            failures.append(f"COMMAND_BODY_INVALID: {name}: unreadable ({err})")
            continue
        if not isinstance(body, dict) or command_digest(body) != digest:
            failures.append(f"COMMAND_BODY_INVALID: {name}: body does not hash to its name")
            continue
        bodies[digest] = body
    return bodies


# --- §7 operator copies --------------------------------------------------------------------------


def verify_operator_copies(directory, segments, ctx, pruned_segments) -> dict:
    """pruned_segments: indices of sealed segments whose file is gone (retention ended)."""
    res = {"checked": 0, "matched": 0, "rejected": [], "unverifiable": [], "failures": []}
    if not os.path.isdir(directory):
        res["failures"].append(f"OPERATOR_COPY_INVALID: operator copies directory {directory} not found")
        return res
    by_digest, rejected, redactions, hashes = {}, set(), [], {}
    for _, events, index in segments:
        for e in events:
            hashes[e["event_hash"]] = (index, e["seq"])
            d = e.get("detail") or {}
            if e.get("event_type") in OPERATOR_EVENT_TYPES and isinstance(d.get("command_digest"), str):
                by_digest[d["command_digest"]] = (e, events)
            if e.get("event_type") == "incident" and str(d.get("kind", "")).endswith("-command-rejected") and isinstance(d.get("command_digest"), str):
                rejected.add(d["command_digest"])
            if e.get("event_type") == "evidence.redacted":
                redactions.append(d)

    def history(name, segment, seq, h):
        # Checked in the segment the copy names; unverifiable only when that segment was
        # pruned. A copy naming no segment is never downgraded.
        if h is None:
            return None
        at = hashes.get(h)
        named = isinstance(segment, int) and not isinstance(segment, bool)
        if at is not None and at[1] == seq and (not named or at[0] is None or at[0] == segment):
            return None
        if named and segment in pruned_segments:
            res["unverifiable"].append(name)
            return None
        return f"OPERATOR_COPY_HISTORY_MISSING: {name}: the ledger head it was issued against (segment {segment} seq {seq}) is not in the chain"

    for name in sorted(n for n in os.listdir(directory) if n.endswith(".json")):
        res["checked"] += 1
        try:
            doc = read_json(os.path.join(directory, name))
        except (OSError, ValueError):
            res["failures"].append(f"OPERATOR_COPY_INVALID: {name}: unreadable")
            continue
        if not isinstance(doc, dict):
            res["failures"].append(f"OPERATOR_COPY_INVALID: {name}: not a JSON object")
            continue
        if isinstance(doc.get("erased_at"), str):
            ok = any(
                r.get("command_digest") == doc.get("command_digest")
                and r.get("erased_at") == doc.get("erased_at")
                and r.get("reason_code") == doc.get("reason_code")
                for r in redactions
            )
            if ok:
                res["matched"] += 1
            else:
                res["failures"].append(f"OPERATOR_COPY_UNMATCHED: {name}: no evidence.redacted records this erasure")
            continue
        if isinstance(doc.get("command"), dict):
            body, sig, dsig = split_command(doc["command"])
            digest = sha256_hex(canonical(body))
            hit = by_digest.get(digest)
            if hit is None:
                if digest in rejected:
                    res["rejected"].append(name)
                else:
                    res["failures"].append(f"OPERATOR_COPY_UNMATCHED: {name}: no ledger event carries this command (deleted history)")
                continue
            inner = operator_event_failure(hit[0], hit[1], ctx, {**body, "signature": sig})
            if inner:
                res["failures"].append(f"OPERATOR_COPY_DIFFERS: {name}: {inner}")
                continue
            if dsig != hit[0]["detail"].get("digest_signature"):
                res["failures"].append(f"OPERATOR_COPY_DIFFERS: {name}: digest signature differs from the event")
                continue
            ia = doc.get("issued_against") if isinstance(doc.get("issued_against"), dict) else None
            h = history(name, ia.get("segment"), ia.get("seq"), ia.get("event_hash")) if ia else None
            if h:
                res["failures"].append(h)
            else:
                res["matched"] += 1
            continue
        if isinstance(doc.get("command_digest"), str) and isinstance(doc.get("digest_signature"), str):
            hit = by_digest.get(doc["command_digest"])
            if hit is None:
                if doc["command_digest"] in rejected:
                    res["rejected"].append(name)
                else:
                    res["failures"].append(f"OPERATOR_COPY_UNMATCHED: {name}: no ledger event carries this command digest (deleted history)")
                continue
            d = hit[0]["detail"]
            field = next(
                (k for k in ("command_id", "command_kind", "role", "issued_at", "operator_credential_id", "digest_signature") if not same(doc.get(k), d.get(k))),
                None,
            )
            if field:
                res["failures"].append(f"OPERATOR_COPY_DIFFERS: {name}: {field} differs from the ledger event")
                continue
            cred = ctx["credentials"].get(doc.get("operator_credential_id"))
            key = None
            if cred is not None and not credential_problem(cred, doc["operator_credential_id"], ctx["site"], ctx["site_key"]):
                try:
                    key = public_key(cred["subjectPublicKeyPem"])
                except ValueError:
                    key = None
            fr = frame(doc.get("command_kind"), doc.get("command_id"), doc.get("issued_at"), doc.get("role"), doc["command_digest"])
            if key is None or not verify_payload(fr, doc["digest_signature"], key):
                res["failures"].append(f"OPERATOR_COPY_SIGNATURE_INVALID: {name}: digest signature does not verify under the operator key")
                continue
            h = history(name, doc.get("ledger_segment"), doc.get("ledger_seq"), doc.get("event_hash"))
            if h:
                res["failures"].append(h)
            else:
                res["matched"] += 1
            continue
        res["failures"].append(f"OPERATOR_COPY_INVALID: {name}: neither a command copy, a WORM record nor a tombstone")
    return res


# --- §6 bundle ----------------------------------------------------------------------------------


def walk_files(root):
    out, other = [], []
    for dirpath, dirnames, filenames in os.walk(root, followlinks=False):
        for dn in list(dirnames):
            if os.path.islink(os.path.join(dirpath, dn)):
                other.append(os.path.relpath(os.path.join(dirpath, dn), root).replace(os.sep, "/"))
                dirnames.remove(dn)
        for fn in filenames:
            p = os.path.join(dirpath, fn)
            rel = os.path.relpath(p, root).replace(os.sep, "/")
            (out if os.path.isfile(p) and not os.path.islink(p) else other).append(rel)
    return sorted(out), other


def link_of(e):
    if e and e.get("event_type") == "system.genesis":
        link = (e.get("detail") or {}).get("prev_segment")
        return link if isinstance(link, dict) else None
    return None


def link_matches(link, prev_seal) -> bool:
    return (
        link is not None
        and link.get("index") == prev_seal["index"]
        and link.get("head_hash") == prev_seal["headHash"]
        and link.get("seal_digest") == seal_digest(prev_seal)
    )


def seal_digest(seal) -> str:
    return sha256_hex(canonical({k: v for k, v in seal.items() if k != "sig"}))


def verify_bundle(root, expect_key_id=None, now=None, operator_copies=None) -> dict:
    failures: list[str] = []
    result = {"ok": False, "failures": failures, "keyId": None}

    def done():
        result["ok"] = not failures
        return result

    now = now if now is not None else datetime.now(timezone.utc).timestamp()
    try:
        manifest = read_json(os.path.join(root, "manifest.json"))
        with open(os.path.join(root, "manifest.sig"), encoding="ascii") as f:
            manifest_sig = f.read().strip()
    except (OSError, ValueError) as err:
        failures.append(f"manifest missing or unreadable: {err}")
        return done()
    if not isinstance(manifest, dict) or manifest.get("v") != 1 or not isinstance(manifest.get("files"), list):
        failures.append("manifest.json malformed")
        return done()
    for f in manifest["files"]:
        if not (isinstance(f, dict) and isinstance(f.get("path"), str) and BUNDLE_PATH.match(f["path"])):
            failures.append("manifest.json malformed: path outside the bundle layout")
            return done()
    try:
        site = read_json(os.path.join(root, "site", "site.json"))
        site_key = public_key(site["publicKeyPem"])
        computed = key_id(site["publicKeyPem"])
    except (OSError, ValueError, KeyError, TypeError):
        failures.append("site/site.json missing or not a site public key")
        return done()
    result["keyId"] = computed
    if site.get("keyId") != computed or manifest.get("keyId") != computed:
        failures.append(f"key id does not match the bundled public key (computed {computed})")
    if expect_key_id is not None and expect_key_id != computed:
        failures.append(f"key id mismatch: expected={expect_key_id}, actual={computed}")
    if manifest.get("siteId") != site.get("siteId"):
        failures.append("manifest siteId differs from site.json")
    if not verify_payload(manifest, manifest_sig, site_key):
        failures.append("manifest signature does not verify against the bundled site key")

    listed = {f["path"]: f for f in manifest["files"]}
    on_disk, other = walk_files(root)
    on_disk = [p for p in on_disk if p not in ("manifest.json", "manifest.sig")]
    for rel in other:
        failures.append(f"not a regular file: {rel}")
    for rel in on_disk:
        f = listed.get(rel)
        if f is None:
            failures.append(f"file not in manifest: {rel}")
            continue
        with open(os.path.join(root, rel), "rb") as fh:
            raw = fh.read()
        if sha256_hex(raw) != f.get("sha256") or len(raw) != f.get("bytes"):
            failures.append(f"file hash mismatch: {rel}")
    for rel in listed:
        if rel not in on_disk:
            failures.append(f"file missing from bundle: {rel}")
    if "ledger/article12.jsonl" not in listed:
        failures.append("bundle holds no ledger")

    # Segments and seals (§4.4)
    seg_dir = os.path.join(root, "ledger", "segments")
    seal_names = sorted(n for n in os.listdir(seg_dir) if re.match(r"^\d{6}\.seal\.json$", n)) if os.path.isdir(seg_dir) else []
    seals, segments, chain_reason, pruned = [], [], None, set()
    for i, name in enumerate(seal_names):
        idx = int(name[:6])
        if idx != i:
            chain_reason = chain_reason or f"seal sequence break: expected {i}, found {idx}"
            break
        try:
            s = read_json(os.path.join(seg_dir, name))
        except (OSError, ValueError) as err:
            chain_reason = chain_reason or f"unreadable seal {name}: {err}"
            break
        prev = seals[-1] if seals else None
        seals.append(s)
        body = {k: v for k, v in s.items() if k != "sig"}
        if s.get("index") != idx:
            chain_reason = chain_reason or "seal index differs from its file name"
        if s.get("keyId") != site.get("keyId"):
            chain_reason = chain_reason or "seal signed by a different site key"
        if not verify_payload(body, s.get("sig"), site_key):
            chain_reason = chain_reason or f"segment {idx}: seal signature invalid"
        if s.get("prevSeal") != (seal_digest(prev) if prev else None):
            chain_reason = chain_reason or f"segment {idx}: seal does not link to the previous seal"
        seg_file = os.path.join(seg_dir, f"{idx:06d}.jsonl")
        if os.path.exists(seg_file):
            with open(seg_file, "rb") as fh:
                raw = fh.read()
            if sha256_hex(raw) != s.get("sha256") or len(raw) != s.get("bytes"):
                chain_reason = chain_reason or f"segment {idx}: file hash mismatch"
            try:
                events = read_jsonl(seg_file)
            except ValueError as err:
                chain_reason = chain_reason or f"segment {idx}: {err}"
                continue
            r = verify_chain(events, site_key)
            if r:
                chain_reason = chain_reason or f"segment {idx}: chain invalid: {r}"
            elif not events or events[-1]["event_hash"] != s.get("headHash") or len(events) != s.get("count"):
                chain_reason = chain_reason or f"segment {idx}: head differs from its seal"
            if not events or events[-1].get("event_type") != "system.segment_seal":
                chain_reason = chain_reason or f"segment {idx}: does not end in its seal event"
            if prev and not link_matches(link_of(events[0] if events else None), prev):
                chain_reason = chain_reason or f"segment {idx}: genesis does not link to the previous segment"
            segments.append((f"segment {idx:06d}", events, idx))
        else:
            until = parse_time((s.get("retention") or {}).get("retainUntil"))
            if until is None or until > now:
                chain_reason = chain_reason or f"segment {idx}: file missing before its retention ends"
            else:
                pruned.add(idx)
    active_path = os.path.join(root, "ledger", "article12.jsonl")
    active = []
    if os.path.exists(active_path):
        try:
            active = read_jsonl(active_path)
        except ValueError as err:
            chain_reason = chain_reason or f"active segment: {err}"
        r = verify_chain(active, site_key)
        if r:
            chain_reason = chain_reason or f"active segment invalid: {r}"
        link = link_of(active[0] if active else None)
        if seals and not link_matches(link, seals[-1]):
            chain_reason = chain_reason or "active segment genesis does not link to the last sealed segment"
        elif not seals and link:
            chain_reason = chain_reason or "active segment links to a sealed segment, but no seals exist"
        segments.append(("active", active, len(seal_names)))
    if chain_reason:
        failures.append(f"ledger chain does not verify: {chain_reason}")
    head = active[-1]["event_hash"] if active else GENESIS_HASH
    lh = manifest.get("ledgerHead") or {}
    if head != lh.get("hash") or len(active) != lh.get("count"):
        failures.append("ledger head differs from the signed manifest")
    if (seal_digest(seals[-1]) if seals else None) != manifest.get("lastSealDigest"):
        failures.append("newest seal differs from the signed manifest")

    # Auditor guide and acceptance records (§6.3)
    guide = os.path.join(root, "AUDITOR_GUIDE.md")
    if not os.path.isfile(guide) or not re.search(r"^Version:\s*\d+(\.\d+)*", open(guide, encoding="utf-8").read(), re.M):
        failures.append("AUDITOR_GUIDE.md missing from the bundle or unversioned")
    all_events = [e for _, evs, _ in segments for e in evs]
    recorded = {
        e["detail"]["record_id"]: e.get("output_digest")
        for e in all_events
        if e.get("event_type") == "acceptance.record" and isinstance((e.get("detail") or {}).get("record_id"), str)
    }
    for rel in (p for p in on_disk if p.startswith("acceptance/")):
        try:
            signed = read_json(os.path.join(root, rel))
            rec = signed.get("record")
            if not isinstance(rec, dict) or not isinstance(signed.get("signature"), str):
                failures.append(f"acceptance record {rel} carries no signature")
                continue
            if not verify_payload(rec, signed["signature"], site_key):
                failures.append(f"acceptance record {rel}: signature does not verify")
            if recorded.get(str(rec.get("recordId"))) != sha256_hex(canonical(rec)):
                failures.append(f"acceptance record {rel} is not recorded in the ledger under its digest")
        except (OSError, ValueError, AttributeError) as err:
            failures.append(f"acceptance record {rel} unreadable: {err}")

    # Operator evidence (§5)
    credentials = {}
    for rel in (p for p in on_disk if p.startswith("credentials/")):
        try:
            credentials[rel[len("credentials/"):-len(".json")]] = read_json(os.path.join(root, rel))
        except (OSError, ValueError):
            failures.append(f"credential {rel} unreadable")
    bodies = load_bodies(
        os.path.join(root, "command-bodies"),
        failures,
        [p.split("/", 1)[1] for p in on_disk if p.startswith("command-bodies/")],
    )
    ctx = {"site": site, "site_key": site_key, "credentials": credentials, "bodies": bodies, "redacted": redacted_digests(segments)}
    failures.extend(verify_operator_evidence(segments, ctx))
    if operator_copies is not None:
        oc = verify_operator_copies(operator_copies, segments, ctx, pruned)
        result["operatorCopies"] = oc
        failures.extend(oc["failures"])

    # Anchor export status (§9): reported, not verified (it is the site's own account).
    state_path = os.path.join(root, "anchor", "state.json")
    if os.path.isfile(state_path):
        try:
            result["anchorGaps"] = read_json(state_path).get("gaps", [])
        except (OSError, ValueError):
            failures.append("anchor/state.json unreadable")
    return done()


def verify_ledger_case(ledger, bundle, extra_bodies=None, omit=()) -> list[str]:
    """One ledger file against a bundle's site key, credentials and bodies (test cases)."""
    site = read_json(os.path.join(bundle, "site", "site.json"))
    site_key = public_key(site["publicKeyPem"])
    events = read_jsonl(ledger)
    r = verify_chain(events, site_key)
    if r:
        return [f"CHAIN_INVALID: {r}"]
    failures: list[str] = []
    bodies = load_bodies(os.path.join(bundle, "command-bodies"), failures)
    if extra_bodies:
        bodies.update(load_bodies(extra_bodies, failures))
    referenced = {(e.get("detail") or {}).get("command_digest") for e in events}
    bodies = {k: v for k, v in bodies.items() if k not in omit and k in referenced}
    cdir = os.path.join(bundle, "credentials")
    credentials = {n[:-5]: read_json(os.path.join(cdir, n)) for n in os.listdir(cdir) if n.endswith(".json")}
    segments = [("000000", events, 0)]
    ctx = {"site": site, "site_key": site_key, "credentials": credentials, "bodies": bodies, "redacted": redacted_digests(segments)}
    return failures + verify_operator_evidence(segments, ctx)


# --- test vectors ---------------------------------------------------------------------------------


def verify_vectors(directory) -> dict:
    """Reproduce expected.json from the spec, then verify the bundle and every case."""
    exp = read_json(os.path.join(directory, "expected.json"))
    failures: list[str] = []
    privs = {}
    for name, k in exp["keys"].items():
        seed = hashlib.sha256(k["seed_label"].encode("utf-8")).digest()
        if seed.hex() != k["test_only_seed_hex"]:
            failures.append(f"key {name}: seed differs from sha256(seed_label)")
        priv = Ed25519PrivateKey.from_private_bytes(seed)
        pem = priv.public_key().public_bytes(Encoding.PEM, PublicFormat.SubjectPublicKeyInfo).decode("ascii")
        if pem != k["public_key_pem"] or key_id(pem) != k["key_id"]:
            failures.append(f"key {name}: public key or key id differs")
        privs[name] = priv

    def sig(name, text):
        return base64.urlsafe_b64encode(privs[name].sign(text.encode("utf-8"))).decode("ascii").rstrip("=")

    for v in exp["canonicalization"]:
        got = canonical(loads(v["json"]))
        if got != v["canonical"]:
            failures.append(f"canonicalization {v['name']}: got {got!r}")
    bundle = os.path.join(directory, "bundle")
    for c in exp["credentials"]:
        cred = read_json(os.path.join(bundle, "credentials", f"{c['credential_id']}.json"))
        body = {k: v for k, v in cred.items() if k != "signature"}
        if canonical(body) != c["canonical_body"] or sig("site", canonical(body)) != c["signature"]:
            failures.append(f"credential {c['credential_id']}: canonical body or signature differs")
    op_of = {}
    for name, k in exp["keys"].items():
        op_of[k["public_key_pem"].strip()] = name
    for c in exp["commands"]:
        body, _, _ = split_command(read_json(os.path.join(bundle, "command-bodies", f"{c['command_digest']}.json")))
        cred = read_json(os.path.join(bundle, "credentials", f"{body['operatorCredentialId']}.json"))
        op = op_of[cred["subjectPublicKeyPem"].strip()]
        digest = sha256_hex(canonical(body))
        fr = canonical(frame(c["kind"], body["commandId"], body["issuedAt"], cred.get("role"), digest))
        if (canonical(body), digest, sig(op, canonical(body)), fr, sig(op, fr)) != (
            c["canonical_body"], c["command_digest"], c["operator_signature"], c["frame_canonical"], c["digest_signature"]
        ):
            failures.append(f"command {c['command_id']}: canonical body, digest, frame or signature differs")
    files = {"000000": os.path.join(bundle, "ledger", "segments", "000000.jsonl"), "active": os.path.join(bundle, "ledger", "article12.jsonl")}
    events = {label: read_jsonl(p) for label, p in files.items()}
    for v in exp["events"]:
        e = events[v["segment"]][v["seq"]]
        c = canonical(event_body(e))
        h = sha256_hex(e["prev_hash"] + c)
        if (c, h, sig("site", canonical(h))) != (v["canonical"], v["event_hash"], v["sig"]):
            failures.append(f"event {v['segment']}/{v['seq']}: canonical, hash or signature differs")
    for v in exp["seals"]:
        s = read_json(os.path.join(bundle, "ledger", "segments", f"{v['index']:06d}.seal.json"))
        c = canonical({k: x for k, x in s.items() if k != "sig"})
        if (c, sha256_hex(c), sig("site", c)) != (v["canonical_body"], v["seal_digest"], v["sig"]):
            failures.append(f"seal {v['index']}: canonical body, digest or signature differs")
    m = canonical(read_json(os.path.join(bundle, "manifest.json")))
    if (m, sig("site", m)) != (exp["manifest"]["canonical"], exp["manifest"]["sig"]):
        failures.append("manifest: canonical form or signature differs")

    ten_years = parse_time("2036-10-01T00:00:00Z")
    b = verify_bundle(bundle, exp["keys"]["site"]["key_id"], ten_years, os.path.join(directory, "operator-copies"))
    failures.extend(f"bundle: {f}" for f in b["failures"])
    cases = []
    for c in exp["cases"]:
        got = verify_ledger_case(
            os.path.join(directory, c["ledger"]),
            bundle,
            os.path.join(directory, c["extra_bodies"]) if c.get("extra_bodies") else None,
            set(c.get("omit_bodies") or []),
        )
        code = "PASS" if not got else got[0].split(": ")[0]
        ok = code == c["expect"] and (c["expect"] == "PASS" or len(got) == 1)
        cases.append({"name": c["name"], "expect": c["expect"], "got": code, "ok": ok})
        if not ok:
            failures.append(f"case {c['name']}: expected {c['expect']}, got {got}")
    site = read_json(os.path.join(bundle, "site", "site.json"))
    site_key = public_key(site["publicKeyPem"])
    cdir = os.path.join(bundle, "credentials")
    ctx = {
        "site": site,
        "site_key": site_key,
        "credentials": {n[:-5]: read_json(os.path.join(cdir, n)) for n in os.listdir(cdir) if n.endswith(".json")},
        "bodies": load_bodies(os.path.join(bundle, "command-bodies"), failures),
        "redacted": set(),
    }
    segs = [("000000", events["000000"], 0), ("active", events["active"], 1)]
    for c in exp.get("copy_cases", []):
        r = verify_operator_copies(os.path.join(directory, c["copies"]), segs, ctx, set(c["pruned_segments"]))
        if c["expect"] == "UNVERIFIABLE":
            code = "UNVERIFIABLE" if not r["failures"] and len(r["unverifiable"]) == 1 else str(r["failures"])
        else:
            code = r["failures"][0].split(": ")[0] if len(r["failures"]) == 1 else str(r["failures"])
        ok = code == c["expect"]
        cases.append({"name": c["name"], "expect": c["expect"], "got": code, "ok": ok})
        if not ok:
            failures.append(f"copy case {c['name']}: expected {c['expect']}, got {code}")
    return {"ok": not failures, "failures": failures, "bundle": b, "cases": cases}


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    pb = sub.add_parser("bundle")
    pb.add_argument("dir")
    pb.add_argument("--expect-key-id")
    pb.add_argument("--operator-copies")
    pb.add_argument("--now", help="ISO 8601 evaluation time (retention); default now")
    pl = sub.add_parser("ledger")
    pl.add_argument("file")
    pl.add_argument("--bundle", required=True)
    pl.add_argument("--extra-bodies")
    pl.add_argument("--omit-body", action="append", default=[])
    pv = sub.add_parser("vectors")
    pv.add_argument("dir")
    a = p.parse_args(argv)
    if a.cmd == "bundle":
        now = parse_time(a.now) if a.now else None
        r = verify_bundle(a.dir, a.expect_key_id, now, a.operator_copies)
        r["authenticity"] = (
            "established - key id matches the pin" if a.expect_key_id and r["keyId"] == a.expect_key_id
            else "unpinned - integrity only; pass --expect-key-id from your copy of the signed scope"
            if not a.expect_key_id else "NOT established - key id does not match the pin"
        )
        print(json.dumps(r, indent=2, ensure_ascii=False))
        return 0 if r["ok"] else 4
    if a.cmd == "ledger":
        f = verify_ledger_case(a.file, a.bundle, a.extra_bodies, set(a.omit_body))
        print(json.dumps({"ok": not f, "failures": f}, indent=2, ensure_ascii=False))
        return 0 if not f else 4
    r = verify_vectors(a.dir)
    print(json.dumps(r, indent=2, ensure_ascii=False))
    return 0 if r["ok"] else 4


if __name__ == "__main__":
    sys.exit(main())
