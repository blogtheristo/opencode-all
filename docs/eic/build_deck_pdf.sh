#!/bin/bash
# Render EIC_STEP1_PITCH_DECK.html -> EIC_STEP1_PITCH_DECK.pdf (10 landscape pages)
# via headless Chromium. Strips the JS (rAF loop breaks print) and forces
# one slide per page (the .deck position:fixed otherwise collapses to 1 page).
set -e
D="$(cd "$(dirname "$0")" && pwd)"
python3 - "$D" <<'PY'
import re,sys
D=sys.argv[1]
h=open(D+"/EIC_STEP1_PITCH_DECK.html").read()
h=re.sub(r'<script>.*?</script>','',h,flags=re.S)
force='''<style>
@media print{
 html,body{height:auto!important;overflow:visible!important;background:#0a1830!important}
 .deck{position:static!important;inset:auto!important;height:auto!important;display:block!important}
 .foot,.bar,.hint{display:none!important}
 .slide{position:relative!important;inset:auto!important;display:flex!important;width:100%!important;height:7.5in!important;break-after:page!important;page-break-after:always!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
 .slide:last-child{break-after:auto!important;page-break-after:avoid!important}
 @page{size:13.333in 7.5in;margin:0}
}
</style></body>'''
open("/tmp/deck_print.html","w").write(h.replace('</body>',force))
PY
CHROME=$(find /opt/pw-browsers -name chrome -type f | head -1)
"$CHROME" --headless=new --no-sandbox --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$D/EIC_STEP1_PITCH_DECK.pdf" "file:///tmp/deck_print.html"
echo "wrote $D/EIC_STEP1_PITCH_DECK.pdf"
