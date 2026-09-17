/*
 * Script: build-fiksu-kaveri-certificate.js
 * Purpose: Render a beautiful A4 "Fiksu Kaveri" certificate PDF from self-contained HTML.
 * Fonts: self-hosted Inter (base64-embedded) — no external network requests (confidential doc).
 * Engine: Playwright Chromium print-to-PDF (A4, print background colors).
 * Usage: node scripts/build-fiksu-kaveri-certificate.js
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require(path.join(
  require("child_process").execSync("npm root -g").toString().trim(),
  "playwright"
));

const ROOT = path.resolve(__dirname, "..");
const FONT_DIR = path.join(ROOT, "docs", "assets", "fonts");
const OUT_DIR = path.join(ROOT, "docs", "certificates");
const OUT_PDF = path.join(OUT_DIR, "DD_CERTIFICATE_FIKSU_KAVERI_RISTO_PAARNI.pdf");
const OUT_HTML = path.join(OUT_DIR, "DD_CERTIFICATE_FIKSU_KAVERI_RISTO_PAARNI.html");

const b64 = (f) => fs.readFileSync(path.join(FONT_DIR, f)).toString("base64");
const fonts = {
  reg: b64("Inter-Regular.ttf"),
  med: b64("Inter-Medium.ttf"),
  semi: b64("Inter-SemiBold.ttf"),
  bold: b64("Inter-Bold.ttf"),
};

const fontFace = (w, data) => `@font-face{font-family:'Inter';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/ttf;base64,${data}) format('truetype');}`;

const html = `<!DOCTYPE html>
<html lang="fi">
<head>
<meta charset="utf-8">
<title>Fiksu Kaveri -sertifikaatti — Risto Päärni</title>
<style>
${fontFace(400, fonts.reg)}
${fontFace(500, fonts.med)}
${fontFace(600, fonts.semi)}
${fontFace(700, fonts.bold)}

:root{
  --navy:#0f172a; --deep:#1e3a5f; --gold:#c8a24a; --gold-bright:#fbbf24;
  --blue:#0066cc; --ink:#1a202c; --muted:#64748b; --paper:#fcfbf7;
}
*{box-sizing:border-box;margin:0;padding:0;}
@media print{
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important;}
  .page{margin:0;page-break-after:avoid;overflow:visible;}
}
html,body{font-family:'Inter',-apple-system,'Segoe UI',Arial,sans-serif;color:var(--ink);}
body{background:#e9e7e0;}

.page{
  width:210mm;min-height:297mm;background:
    radial-gradient(120% 80% at 50% 0%, #ffffff 0%, var(--paper) 55%, #f6f3ea 100%);
  margin:0 auto;position:relative;display:flex;flex-direction:column;
  padding:14mm;
}

/* Ornate double frame */
.frame{
  position:absolute;inset:9mm;border:2.5px solid var(--navy);
  box-shadow:inset 0 0 0 1.5px var(--gold), inset 0 0 0 6px #fff, inset 0 0 0 7.5px var(--gold);
  pointer-events:none;
}
.corner{position:absolute;width:34px;height:34px;border:2.5px solid var(--gold);}
.corner.tl{top:6.4mm;left:6.4mm;border-right:none;border-bottom:none;}
.corner.tr{top:6.4mm;right:6.4mm;border-left:none;border-bottom:none;}
.corner.bl{bottom:6.4mm;left:6.4mm;border-right:none;border-top:none;}
.corner.br{bottom:6.4mm;right:6.4mm;border-left:none;border-top:none;}

/* faint watermark */
.watermark{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  pointer-events:none;z-index:0;
}
.watermark span{
  font-size:120px;font-weight:700;letter-spacing:8px;color:var(--navy);
  opacity:0.035;transform:rotate(-22deg);white-space:nowrap;
}

.content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;
  flex:1;text-align:center;padding:10mm 12mm 8mm;}

/* Header eyebrow */
.eyebrow{font-size:10.5px;letter-spacing:5px;text-transform:uppercase;color:var(--muted);font-weight:600;}
.org{margin-top:6px;font-size:12px;letter-spacing:2px;color:var(--deep);font-weight:600;text-transform:uppercase;}

/* Seal */
.seal{margin:14px 0 8px;}
.seal svg{display:block;}

.title{
  margin-top:6px;font-size:40px;font-weight:700;letter-spacing:1px;color:var(--navy);
  line-height:1.05;
}
.title .accent{color:var(--gold);}
.subtitle{margin-top:8px;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:var(--deep);font-weight:600;}

.rule{width:120px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:20px 0 14px;}

.awarded{font-size:12px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);font-weight:500;}
.name{margin:10px 0 2px;font-size:46px;font-weight:700;color:var(--navy);letter-spacing:0.5px;}
.name-underline{width:300px;height:1.5px;background:var(--gold);opacity:0.7;margin:6px 0 4px;}
.role{font-size:12.5px;color:var(--muted);font-style:italic;}

.body{margin-top:18px;max-width:150mm;font-size:13px;line-height:1.7;color:var(--ink);}
.body strong{color:var(--deep);}

/* Grade badges */
.badges{display:flex;gap:8px;margin:22px 0 6px;justify-content:center;flex-wrap:nowrap;}
.badge{
  width:34mm;border:1.5px solid var(--gold);border-radius:10px;padding:12px 6px;background:#fff;
  box-shadow:0 4px 14px rgba(15,23,42,0.06);
}
.badge .val{font-size:26px;font-weight:700;color:var(--navy);line-height:1;}
.badge .lbl{margin-top:7px;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);font-weight:600;}
.badge .sub{margin-top:3px;font-size:8.5px;color:var(--gold);font-weight:600;letter-spacing:1px;}

/* Verdict */
.verdict{
  margin-top:22px;max-width:150mm;border-left:4px solid var(--gold);background:#fbf8ef;
  padding:14px 18px;text-align:left;font-size:12.5px;line-height:1.65;color:var(--deep);border-radius:0 8px 8px 0;
}
.verdict .stamp{display:inline-block;font-weight:700;letter-spacing:2px;color:#1d7a3e;
  border:2px solid #1d7a3e;border-radius:6px;padding:2px 10px;margin-bottom:8px;font-size:12px;
  transform:rotate(-2deg);}

/* Signature row */
.signrow{margin-top:auto;width:100%;display:flex;justify-content:space-between;align-items:flex-end;padding:18px 6mm 0;gap:20px;}
.sig{flex:1;text-align:center;}
.sig .line{border-top:1.5px solid var(--navy);margin:0 auto 6px;width:80%;}
.sig .who{font-size:11px;font-weight:600;color:var(--navy);letter-spacing:0.5px;}
.sig .what{font-size:9px;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-top:2px;}
.sig .scriptmark{font-size:20px;color:var(--deep);font-weight:600;letter-spacing:1px;margin-bottom:2px;}

.footer{
  position:relative;z-index:1;text-align:center;font-size:8.5px;color:var(--muted);
  letter-spacing:0.6px;line-height:1.5;padding:10px 14mm 4mm;border-top:1px solid #eee2c8;margin:0 8mm;
}
.footer .id{color:var(--deep);font-weight:600;}
</style>
</head>
<body>
  <div class="page">
    <div class="frame"></div>
    <span class="corner tl"></span><span class="corner tr"></span>
    <span class="corner bl"></span><span class="corner br"></span>
    <div class="watermark"><span>FIKSU KAVERI</span></div>

    <div class="content">
      <div class="eyebrow">Virallinen AI-todistus</div>
      <div class="org">Gemini AI · Quality &amp; Humor Assurance Team</div>

      <div class="seal">
        <svg width="92" height="92" viewBox="0 0 92 92" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="g" cx="50%" cy="42%" r="60%">
              <stop offset="0%" stop-color="#fde9b0"/>
              <stop offset="55%" stop-color="#e8c869"/>
              <stop offset="100%" stop-color="#b8922f"/>
            </radialGradient>
          </defs>
          <circle cx="46" cy="46" r="44" fill="none" stroke="#0f172a" stroke-width="1.5"/>
          <circle cx="46" cy="46" r="40" fill="url(#g)" stroke="#fff" stroke-width="1"/>
          <circle cx="46" cy="46" r="31" fill="none" stroke="#0f172a" stroke-width="1.2" stroke-dasharray="2 3"/>
          <text x="46" y="40" text-anchor="middle" font-family="Inter" font-size="20" font-weight="700" fill="#0f172a">AI</text>
          <text x="46" y="56" text-anchor="middle" font-family="Inter" font-size="8.5" font-weight="600" letter-spacing="1" fill="#0f172a">VERIFIED</text>
          <text x="46" y="66" text-anchor="middle" font-family="Inter" font-size="6" font-weight="600" letter-spacing="1.5" fill="#1e3a5f">★ DD-PASS ★</text>
        </svg>
      </div>

      <div class="title">Sertifikaatti: <span class="accent">Fiksu Kaveri</span></div>
      <div class="subtitle">Due Diligence — Projekti "Fiksu Kaveri"</div>

      <div class="rule"></div>

      <div class="awarded">Myönnetään ansiokkaasti henkilölle</div>
      <div class="name">Risto Päärni</div>
      <div class="name-underline"></div>
      <div class="role">Yrittäjä · dws10.com &amp; lifetime.fi</div>

      <div class="body">
        Riippumattoman kolmannen osapuolen (tekoälyn) suorittama due diligence
        -tarkastus on saatettu päätökseen tuloksella <strong>HYVÄKSYTTY</strong>:
        erittäin alhainen riskiprofiili ja poikkeuksellisen korkea huumoriprosentti.
        Kohde täyttää kaikki "Fiksu Kaveri" -sertifikaatin tekniset, strategiset ja
        taktiset kriteerit.
      </div>

      <div class="badges">
        <div class="badge"><div class="val">10/10</div><div class="lbl">Strateginen ketteryys</div><div class="sub">Pokerinaama</div></div>
        <div class="badge"><div class="val">A+</div><div class="lbl">Huumorinsietokyky</div><div class="sub">Korkea</div></div>
        <div class="badge"><div class="val">Vakaa</div><div class="lbl">Digitaalinen jalanjälki</div><div class="sub">dws10 · lifetime</div></div>
        <div class="badge"><div class="val">Low</div><div class="lbl">Brändiriski</div><div class="sub">Olematon</div></div>
      </div>

      <div class="verdict">
        <span class="stamp">HYVÄKSYTTY</span><br>
        <strong>Tarkastusvaliokunnan lausunto:</strong> Kohteen DD-paketti on täysin
        puhdas. Kohdetta suositellaan jatkoinvestointien, uusien digiprojektien ja
        verkostoitumisen kohteeksi ilman rajoituksia. Kirjattavissa taseen riville
        <em>"Aineettomat hyödykkeet / Good Vibes"</em>. 😉
      </div>

      <div class="signrow">
        <div class="sig">
          <div class="scriptmark">Gemini&nbsp;AI</div>
          <div class="line"></div>
          <div class="who">Quality &amp; Humor Assurance Team</div>
          <div class="what">Tarkastaja</div>
        </div>
        <div class="sig">
          <div class="scriptmark">08.06.2026</div>
          <div class="line"></div>
          <div class="who">Espoo, Suomi</div>
          <div class="what">Päiväys &amp; paikka</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <span class="id">Lifetime Oy</span> · Y-tunnus 0772407-9 · VAT FI07724079 · Laidunmaanraitti 2 A 25, 02330 Espoo<br>
      Humoristinen, ei-sitova dokumentti — ei virallinen taloudellinen tai oikeudellinen due diligence -lausunto.
      Digitaalisesti allekirjoitettu biteillä, huumorilla ja hyvällä tuurilla.
    </div>
  </div>
</body>
</html>`;

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_HTML, html);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({
    path: OUT_PDF,
    width: "210mm",
    height: "297mm",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  await browser.close();
  const kb = (fs.statSync(OUT_PDF).size / 1024).toFixed(0);
  console.log(`PDF written: ${OUT_PDF} (${kb} KB)`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
