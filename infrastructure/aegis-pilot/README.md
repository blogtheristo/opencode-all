# Aegis Pilot systemd deployment

## Quick start

```bash
# Create the service user (system account, no login)
sudo useradd --system --no-create-home --shell /usr/sbin/nologin aegis-pilot

# Enable the health probe timer for a site (replace <site> with your site ID)
sudo systemctl enable --now aegis-pilot-health@<site>.timer

# Enable the daily seal timer for a site
sudo systemctl enable --now aegis-pilot-seal@<site>.timer
```

## Service layout

The pilot kit runs as a dedicated system user (`aegis-pilot`) with separate state directories per site inside `/var/lib/aegis-pilot/<site>`.

### Units

| Unit                        | Type    | Purpose                                                                  |
| --------------------------- | ------- | ------------------------------------------------------------------------ |
| `aegis-pilot@.service`      | oneshot | Health probe: runs `aegis-pilot.ts status` to verify the state directory |
| `aegis-pilot-health@.timer` | timer   | Triggers the health probe every 5 minutes                                |
| `aegis-pilot-seal@.service` | oneshot | Ledger seal: runs `aegis-pilot.ts seal` to roll the active segment       |
| `aegis-pilot-seal@.timer`   | timer   | Triggers the seal once per day                                           |

**Note:** Pruning is not automated. Run `aegis-pilot prune` manually per the runbook §4 "Ledger segments and retention".

### Hardening

All units are hardened with:

- `User=aegis-pilot` — dedicated service user, no privilege escalation
- `StateDirectory=aegis-pilot/%i` — per-site state in `/var/lib/aegis-pilot/<site>`
- `StateDirectoryMode=0700` — only the service user can read/write state
- `NoNewPrivileges=yes` — process cannot gain additional privileges
- `ProtectSystem=strict` — read-only `/usr` and `/boot`, limited `/etc`
- `ProtectHome=yes` — `/home`, `/root`, `/run/user` invisible to the process
- `PrivateTmp=yes` — private `/tmp` namespace per instance
- `ReadWritePaths=%StateDir` — only the state directory is writable
- `RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6` — only Unix and IP sockets (probes need INET)

## Operator keys

The operator key belongs to the **operator's home directory**, never to the state directory.

Example:

```bash
# Operator's home (human user)
/home/operator/.aegis/operator.key

# State directory (service)
/var/lib/aegis-pilot/<site>/
```

The CLI refuses to write the operator key inside the state directory.

## Log inspection

```bash
# Health probe logs (replace <site>)
journalctl -u aegis-pilot-health@<site>.timer -f

# Seal logs
journalctl -u aegis-pilot-seal@<site>.service -f

# All aegis-pilot units
journalctl -u aegis-pilot@*.service -f
```

## Validation

If `systemd-analyze` is available:

```bash
# Verify syntax
systemd-analyze verify /etc/systemd/system/aegis-pilot@.service
systemd-analyze verify /etc/systemd/system/aegis-pilot-health@.timer
systemd-analyze verify /etc/systemd/system/aegis-pilot-seal@.service
systemd-analyze verify /etc/systemd/system/aegis-pilot-seal@.timer
```

## Runbook reference

- **Ownership & hardening:** `docs/runbooks/AEGIS_PILOT_RUNBOOK.md` §4 "Phase 1 — local substrate"
- **Ledger segments and retention:** `docs/runbooks/AEGIS_PILOT_RUNBOOK.md` §4 "Ledger segments and retention"
