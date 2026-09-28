#!/usr/bin/env python3
# Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
# Audit trail: git log -- scripts/aegis-pilot-netns-lo-up.py
"""Rehearsal only: bring up loopback inside a fresh `unshare --net` namespace
(no `ip` binary needed), so the pilot CLI can reach the local OpenShell gateway
bridge. The namespace still has no route off the host."""

import fcntl
import socket
import struct

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
ifr = fcntl.ioctl(s, 0x8913, struct.pack("16sH14x", b"lo", 0))
flags = struct.unpack("16sH14x", ifr)[1]
fcntl.ioctl(s, 0x8914, struct.pack("16sH14x", b"lo", flags | 0x1))
