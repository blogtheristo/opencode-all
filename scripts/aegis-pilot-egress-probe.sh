#!/usr/bin/env bash
# Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-29
# Audit trail: git log -- scripts/aegis-pilot-egress-probe.sh
#
# Aegis Pilot — core-step egress probe (runbook §6.1, offer §2 "Ydinvaiheilla
# ei ole verkkoyhteyttä"). Lets the site's IT verify the claim themselves.
#
# 1. Plain container, same image (control): shows the network is reachable.
# 2. OpenShell sandbox with the core-step policy: every attempt must fail.
#
#   AEGIS_IMAGE=<image> AEGIS_OPENSHELL_CLI=<path> OPENSHELL_GATEWAY_ENDPOINT=<url> \
#     scripts/aegis-pilot-egress-probe.sh [host:port ...]
#
# Default targets: the Docker host bridge, a public IP, the cloud metadata
# address. Pass the site's own targets (proxy, ERP, historian) as arguments.
# Exit 0 = PASS (control reached something, core sandbox reached nothing).
set -euo pipefail

IMAGE="${AEGIS_IMAGE:?set AEGIS_IMAGE}"
CLI="${AEGIS_OPENSHELL_CLI:-openshell}"
TARGETS=("$@")
[ ${#TARGETS[@]} -eq 0 ] && TARGETS=("172.17.0.1:22" "1.1.1.1:443" "169.254.169.254:80")
NAME="aegis-egress-$$"
WORK="$(mktemp -d)"
trap '"$CLI" sandbox delete "$NAME" >/dev/null 2>&1 || true; rm -rf "$WORK"' EXIT

cd "$(dirname "$0")/.."
npx tsx -e "
import { stepPolicy } from './src/aegis/pilot/openshell-policy.ts';
const p = stepPolicy({ id: 'egress-probe', criticality: 'core', requiresNetwork: false } as any);
require('fs').writeFileSync('$WORK/policy.json', JSON.stringify(p));"

PROBE="
const net=require('net'),dgram=require('dgram'),dns=require('dns');
const T=process.argv.slice(1);const out=[];
const tcp=(h,p)=>new Promise(r=>{const s=net.connect({host:h,port:+p});const t=setTimeout(()=>{s.destroy();r('TIMEOUT')},4000);
 s.on('connect',()=>{clearTimeout(t);s.destroy();r('CONNECTED')});s.on('error',e=>{clearTimeout(t);r('ERR:'+e.code)})});
const udp=(h,p)=>new Promise(r=>{const s=dgram.createSocket('udp4');const t=setTimeout(()=>{s.close();r('TIMEOUT')},4000);
 s.on('error',e=>{clearTimeout(t);r('ERR:'+e.code)});s.send('aegis-probe',+p,h,e=>{clearTimeout(t);s.close();r(e?'ERR:'+e.code:'SENT')})});
(async()=>{for(const x of T){const [h,p]=x.split(':');out.push('tcp '+x+'='+await tcp(h,p));out.push('udp '+x+'='+await udp(h,p));}
 out.push('tcp6 [2606:4700:4700::1111]:443='+await tcp('2606:4700:4700::1111',443));
 const a=await new Promise(r=>dns.lookup('pypi.org',{family:4},(e,a)=>r(e?null:a)));
 out.push('dns pypi.org='+(a||'none'));if(a)out.push('tcp '+a+':443='+await tcp(a,443));
 console.log(out.join('\n'));})();"

echo "== control: plain container ($IMAGE)"
CONTROL="$(docker run --rm "$IMAGE" node -e "$PROBE" "${TARGETS[@]}" 2>&1 || true)"
echo "$CONTROL"

echo "== core step: OpenShell sandbox"
"$CLI" sandbox create --name "$NAME" --from "$IMAGE" --policy "$WORK/policy.json" \
  --detach --no-tty --no-auto-providers -o json >/dev/null
CORE="$("$CLI" sandbox exec -n "$NAME" --no-tty --no-login-shell -- node -e "$PROBE" "${TARGETS[@]}" 2>&1)"
echo "$CORE"

# A UDP 'SENT' in the control is only a local send; TCP CONNECTED is the reachability proof.
if ! grep -q '=CONNECTED' <<<"$CONTROL"; then
  echo "INCONCLUSIVE: the control reached nothing; pick targets the host can reach"
  exit 2
fi
if grep -qE '=(CONNECTED|SENT)' <<<"$CORE"; then
  echo "FAIL: the core-step sandbox reached the network"
  exit 1
fi
echo "PASS: control reached the network; the core-step sandbox reached nothing"
