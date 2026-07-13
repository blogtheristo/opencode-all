#!/usr/bin/env node
/**
 * inject-blog-nav.cjs
 * Injects prev/next navigation + 3 product cards before <!-- Footer --> in all root-level blog posts.
 * Run: node scripts/inject-blog-nav.cjs
 */
const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'onelifetime.world', 'posts');

// Chronological order of root-level posts
const posts = [
  {
    file: 'business-case-logistics.html',
    title: 'Business Case: The Intelligent Fleet Pilot',
    date: 'Dec 2025',
  },
  {
    file: 'kya-standard-v1.html',
    title: 'Field Note: KYA Standard for Autonomous Control Rooms',
    date: 'Mar 2026',
  },
  {
    file: 'eu-regulation-harness-engineering.html',
    title: 'EU Regulation Makes Better AI',
    date: '14 Mar 2026',
  },
  {
    file: 'eu-ai-act-compliance-ready.html',
    title: 'EU AI Act: Compliance Ready',
    date: '15 Mar 2026',
  },
  {
    file: 'buyers-note-harness-engineering.html',
    title: 'Buyer\u2019s Note: Harness Engineering',
    date: '15 Mar 2026',
  },
  {
    file: 'harness-engineering-investor-note.html',
    title: 'Investor Note: Harness Engineering',
    date: '15 Mar 2026',
  },
  {
    file: 'nvidia-gtc-2026-dws-roadmap-impact.html',
    title: 'NVIDIA GTC 2026: Industrial AI Roadmaps',
    date: '16 Mar 2026',
  },
  {
    file: 'validated-mock-data-principle.html',
    title: 'The Validated Mock Data Principle',
    date: '16 Mar 2026',
  },
  {
    file: 'closing-the-bom-gap-cad-erp-sync.html',
    title: 'Closing the BOM Gap: CAD-ERP Sync',
    date: '26 Mar 2026',
  },
  {
    file: 'liquidity-engine-captain-seats.html',
    title: 'The Liquidity Engine: Captain Seats',
    date: '28 Mar 2026',
  },
  {
    file: 'core-resilience-hybrid-threats.html',
    title: 'CORE: The EU Model That Maps Every Hybrid Threat',
    date: '16 Apr 2026',
  },
  {
    file: 'solid-layers-aiven-scaleway-kya.html',
    title: 'Our Layers Are Solid — Aiven, Scaleway, KYA + Foundry',
    date: '22 Apr 2026',
  },
  {
    file: 'mcp-apps-identity-spine.html',
    title: 'MCP Apps Extends the Frontier — KYA Is the Identity Spine',
    date: '22 Apr 2026',
  },
  {
    file: 'fpe-dark-mode-construction-wedge.html',
    title: 'FPE · The Construction Wedge — €14,999 to Reduce Weakest-Link Failure',
    date: '27 Apr 2026',
  },
  {
    file: 'dws-ontology-standard-v1.html',
    title: 'DWS Ontology Standard v1.3 — Etymology, Philosophy, and the Decision-Centric Pillars',
    date: '29 Apr 2026',
  },
  {
    file: 'baseten-inference-engineering-300m.html',
    title: 'Field Note: Baseten Raises $300M — Inference Engineering Is a Discipline Now',
    date: '7 May 2026',
  },
  {
    file: 'fire-brigades-drone-defense-units.html',
    title: 'Fire Brigades as Drone Defence Units — Three Reasons to Build the Network Now',
    date: '15 May 2026',
  },
  {
    file: 'palokunnat-droonitorjuntayksikot.html',
    title: 'Palokunnat ja VPK:t droonitorjuntayksiköiksi — kolme syytä rakentaa verkko nyt',
    date: '15 May 2026',
  },
  {
    file: 'brandkarer-dronarforsvars-enheter.html',
    title: 'Brandkårer som drönarförsvarsenheter — tre skäl att bygga nätverket nu',
    date: '15 May 2026',
  },
  {
    file: 'moat-is-not-the-model.html',
    title:
      'The Moat Is Not the Model — NVIDIA Makes It Possible, EU-Sovereign Deployment Makes It Defensible',
    date: '17 May 2026',
  },
  {
    file: 'sovereignty-field-note-2-three-pillars.html',
    title: 'Sovereignty Field Note #2 — The Three Pillars Every Global Enterprise Needs',
    date: '28 May 2026',
  },
  {
    file: 'sovereignty-field-note-2-three-pillars.fi.html',
    title: 'Suvereniteetin kenttämuistio #2 — Digitaalisen suvereniteetin kolme tasoa (FI)',
    date: '28 May 2026',
  },
  {
    file: 'point-it-at-the-ontology.html',
    title: "Don't Point the LLM at the Data — Point It at the Ontology",
    date: '5 Jun 2026',
  },
  {
    file: 'your-model-cant-beat-your-noise-floor.html',
    title: "Your Model Can't Beat Your Noise Floor",
    date: '15 Jun 2026',
  },
  {
    file: 'your-model-cant-beat-your-noise-floor.fi.html',
    title: 'Mallisi ei voita kohinatasoasi (FI)',
    date: '15 Jun 2026',
  },
  {
    file: 'four-capital-classes.html',
    title: 'Prompt, People, Plant, Perception — The Four Capital Classes of the Agentic Era',
    date: '19 Jun 2026',
  },
  {
    file: 'software-vs-world-model.html',
    title: 'Software You Operate vs Intelligence That Operates',
    date: '20 Jun 2026',
  },
  {
    file: 'ontologia-tiimin-aivoissa.html',
    title: 'Ontologia elää tiimin aivoissa',
    date: '20 Jun 2026',
  },
  {
    file: 'the-ontology-lives-in-the-team.html',
    title: 'The Ontology Lives in the Team',
    date: '20 Jun 2026',
  },
  {
    file: 'lifetime-world-model-three-piece-loop.html',
    title: 'The Three-Piece Loop — Lifetime World Model V1 for Control Rooms',
    date: '23 Jun 2026',
  },
  {
    file: 'four-learning-paradigms-world-model.html',
    title: 'The Four Learning Paradigms Behind a World Model',
    date: '23 Jun 2026',
  },
  {
    file: 'lifetime-world-model-three-piece-loop.fi.html',
    title: 'Kolmiosainen silmukka valvomoille — Lifetime World Model V1 (FI)',
    date: '23 Jun 2026',
  },
  {
    file: 'four-learning-paradigms-world-model.fi.html',
    title: 'Maailmanmallin neljä oppimisparadigmaa (FI)',
    date: '23 Jun 2026',
  },
  {
    file: 'nvidia-vera-rubin-ai-factory.html',
    title: 'NVIDIA Vera Rubin — The AI Factory Grows Up. The Sovereign Edge Is Still a Box.',
    date: '24 Jun 2026',
  },
  {
    file: 'eu-sovereign-ai-factories-35-supercomputers.html',
    title: "Europe's AI Factory Came Home — 35 Supercomputers, and Why the Edge Still Needs a Box",
    date: '25 Jun 2026',
  },
  {
    file: 'nvidia-jetson-thor-physical-ai.html',
    title:
      'NVIDIA Jetson Thor — The Supercomputer Moves Onto the Robot. The Governance Sits Beside It.',
    date: '26 Jun 2026',
  },
  {
    file: 'industrial-intelligence-weekly-2026-06-28.html',
    title: 'Industrial Intelligence Weekly — Five Signals from the Regulated Economy',
    date: '28 Jun 2026',
  },
  {
    file: 'brexit-interdependence-moat-us-eu.html',
    title: 'Sovereignty Is a Setting, Not a Switch — What the US and EU Can Learn from Brexit',
    date: '30 Jun 2026',
  },
  {
    file: 'brexit-interdependence-moat-us-eu.fi.html',
    title: 'Suvereniteetti on säädin, ei kytkin — mitä USA ja EU voivat oppia brexitistä (FI)',
    date: '30 Jun 2026',
  },
  {
    file: 'tiedon-vanheneminen-sensoridata-retention.html',
    title: 'Tiedon vanheneminen — sensoridatan tallennusstrategia (FI, field note)',
    date: '1 Jul 2026',
  },
  {
    file: 'the-moats-we-hand-you.html',
    title: 'The Moats Are Yours, Not Ours — Sovereignty vs. Interdependence, in Nineteen Places',
    date: '1 Jul 2026',
  },
  {
    file: 'the-moats-we-hand-you.fi.html',
    title: 'Vallihaudat ovat sinun, eivät meidän — suvereniteetti vs. keskinäisriippuvuus (FI)',
    date: '1 Jul 2026',
  },
  {
    file: 'nvidia-halos-robotics-physical-ai-safety.html',
    title:
      'NVIDIA Halos for Robotics — The Robot Gets Certified. The Evidence Still Has to Keep Talking.',
    date: '10 Jul 2026',
  },
];

// Three featured products
const products = [
  {
    name: 'DWS IQ Platform',
    price: '\u20ac4,999',
    desc: '18+ AI agents for EU compliance automation',
    url: 'https://dws10.com/products/dwsiq.html',
    badge: 'Flagship',
  },
  {
    name: 'Climate Reporting Bundle',
    price: '\u20ac6,500',
    desc: 'DWS IQ + Firehorse Report + Workshop',
    url: 'https://dws10.com/products/bundle.html',
    badge: 'Best Value',
  },
  {
    name: 'Firehorse Omnichannel',
    price: '\u20ac499',
    desc: 'AI marketing engine, Green Claims compliant',
    url: 'https://dws10.com/products/firehorse-omnichannel.html',
    badge: 'Start Here',
  },
];

function buildProductCards() {
  return products
    .map(
      (p) => `
                        <a href="${p.url}" class="block rounded-lg p-4 text-center" style="background: linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95)); border: 1px solid rgba(6,182,212,0.2); transition: border-color 0.3s, transform 0.2s;" onmouseover="this.style.borderColor='rgba(6,182,212,0.5)';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='rgba(6,182,212,0.2)';this.style.transform='none'">
                            <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded mb-2" style="background: rgba(212,168,67,0.15); color: #d4a843; border: 1px solid rgba(212,168,67,0.25);">${p.badge}</span>
                            <p class="text-sm font-semibold text-gray-200">${p.name}</p>
                            <p class="text-lg font-bold text-cyan-400 my-1">${p.price}</p>
                            <p class="text-xs text-gray-500">${p.desc}</p>
                        </a>`,
    )
    .join('\n');
}

function buildSocialShare(post) {
  const url = `https://onelifetime.world/posts/${post.file}`;
  const title = post.title;
  // URL-encode for share links
  const encUrl = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);
  const encText = encodeURIComponent(`${title} — by @LifetimeOy`);

  return `
                <!-- Share This Post -->
                <div class="flex items-center gap-3 mt-8">
                    <span class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Share</span>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors" style="background: rgba(30,41,59,0.8); border: 1px solid rgba(100,116,139,0.3);" onmouseover="this.style.borderColor='#0077b5';this.style.background='rgba(0,119,181,0.15)'" onmouseout="this.style.borderColor='rgba(100,116,139,0.3)';this.style.background='rgba(30,41,59,0.8)'" aria-label="Share on LinkedIn">
                        <svg width="16" height="16" fill="#94a3b8" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=${encText}&url=${encUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors" style="background: rgba(30,41,59,0.8); border: 1px solid rgba(100,116,139,0.3);" onmouseover="this.style.borderColor='#1da1f2';this.style.background='rgba(29,161,242,0.15)'" onmouseout="this.style.borderColor='rgba(100,116,139,0.3)';this.style.background='rgba(30,41,59,0.8)'" aria-label="Share on X">
                        <svg width="14" height="14" fill="#94a3b8" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href="mailto:?subject=${encTitle}&body=${encText}%0A%0A${encUrl}" class="inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors" style="background: rgba(30,41,59,0.8); border: 1px solid rgba(100,116,139,0.3);" onmouseover="this.style.borderColor='#06b6d4';this.style.background='rgba(6,182,212,0.15)'" onmouseout="this.style.borderColor='rgba(100,116,139,0.3)';this.style.background='rgba(30,41,59,0.8)'" aria-label="Share via Email">
                        <svg width="16" height="16" fill="#94a3b8" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    </a>
                    <button onclick="navigator.clipboard.writeText('${url}');this.querySelector('span').textContent='Copied!';setTimeout(()=>this.querySelector('span').textContent='Copy link',2000)" class="inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-xs text-gray-400 transition-colors" style="background: rgba(30,41,59,0.8); border: 1px solid rgba(100,116,139,0.3);" onmouseover="this.style.borderColor='rgba(6,182,212,0.5)'" onmouseout="this.style.borderColor='rgba(100,116,139,0.3)'">
                        <svg width="14" height="14" fill="#94a3b8" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                        <span>Copy link</span>
                    </button>
                </div>`;
}

function buildNavBlock(idx) {
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx < posts.length - 1 ? posts[idx + 1] : null;

  const prevHtml = prev
    ? `<a href="/posts/${prev.file}" class="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors max-w-[45%]">
                        <span class="text-lg">&larr;</span>
                        <span class="truncate">${prev.title}</span>
                    </a>`
    : '<span></span>';

  const nextHtml = next
    ? `<a href="/posts/${next.file}" class="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors max-w-[45%] text-right ml-auto">
                        <span class="truncate">${next.title}</span>
                        <span class="text-lg">&rarr;</span>
                    </a>`
    : '<span></span>';

  return `
    <!-- Post Navigation + Products (auto-injected by inject-blog-nav.cjs) -->
    <section class="max-w-3xl mx-auto px-4 pb-16">
                <!-- Prev / Next -->
                <nav class="flex justify-between items-center pt-8 border-t border-gray-700" aria-label="Post navigation">
                    ${prevHtml}
                    ${nextHtml}
                </nav>
${buildSocialShare(posts[idx])}

                <!-- Featured Products -->
                <div class="mt-10">
                    <h3 class="text-lg font-bold mb-4" style="color: #d4a843;">From the Store</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
${buildProductCards()}
                    </div>
                </div>
    </section>

`;
}

// Process each post
let updated = 0;
for (let i = 0; i < posts.length; i++) {
  const filePath = path.join(POSTS_DIR, posts[i].file);
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${posts[i].file}`);
    continue;
  }

  let html = fs.readFileSync(filePath, 'utf-8');

  // Remove old injected nav if present (idempotent)
  html = html.replace(
    /\n\s*<!-- Post Navigation \+ Products \(auto-injected.*?\) -->[\s\S]*?<\/section>\n\n/g,
    '\n',
  );
  html = html.replace(
    /\n\s*<!-- Post Navigation \+ Products \(auto-injected.*?\) -->\s*\n*/g,
    '\n',
  );

  // Insert before footer (supports both <!-- Footer --> comment and direct <footer> tag)
  const marker1 = '    <!-- Footer -->';
  const marker2 = '    <footer class="bg-gray-900';
  let marker;
  if (html.includes(marker1)) {
    marker = marker1;
  } else if (html.includes(marker2)) {
    marker = marker2;
  } else {
    console.log(`SKIP (no footer marker): ${posts[i].file}`);
    continue;
  }

  const navBlock = buildNavBlock(i);
  html = html.replace(marker, navBlock + marker);

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(
    `OK: ${posts[i].file} (prev: ${i > 0 ? posts[i - 1].file : 'none'} | next: ${i < posts.length - 1 ? posts[i + 1].file : 'none'})`,
  );
  updated++;
}

console.log(`\nDone. Updated ${updated}/${posts.length} posts.`);
