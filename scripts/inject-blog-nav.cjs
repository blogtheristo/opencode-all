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
  { file: 'business-case-logistics.html', title: 'Business Case: The Intelligent Fleet Pilot', date: 'Dec 2025' },
  { file: 'kya-standard-v1.html', title: 'Field Note: KYA Standard for Autonomous Control Rooms', date: 'Mar 2026' },
  { file: 'eu-regulation-harness-engineering.html', title: 'EU Regulation Makes Better AI', date: '14 Mar 2026' },
  { file: 'eu-ai-act-compliance-ready.html', title: 'EU AI Act: Compliance Ready', date: '15 Mar 2026' },
  { file: 'buyers-note-harness-engineering.html', title: "Buyer\u2019s Note: Harness Engineering", date: '15 Mar 2026' },
  { file: 'harness-engineering-investor-note.html', title: 'Investor Note: Harness Engineering', date: '15 Mar 2026' },
  { file: 'nvidia-gtc-2026-dws-roadmap-impact.html', title: 'NVIDIA GTC 2026: Industrial AI Roadmaps', date: '16 Mar 2026' },
  { file: 'validated-mock-data-principle.html', title: 'The Validated Mock Data Principle', date: '16 Mar 2026' },
  { file: 'closing-the-bom-gap-cad-erp-sync.html', title: 'Closing the BOM Gap: CAD-ERP Sync', date: '26 Mar 2026' },
  { file: 'liquidity-engine-captain-seats.html', title: 'The Liquidity Engine: Captain Seats', date: '28 Mar 2026' },
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
  return products.map(p => `
                        <a href="${p.url}" class="block rounded-lg p-4 text-center" style="background: linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95)); border: 1px solid rgba(6,182,212,0.2); transition: border-color 0.3s, transform 0.2s;" onmouseover="this.style.borderColor='rgba(6,182,212,0.5)';this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='rgba(6,182,212,0.2)';this.style.transform='none'">
                            <span class="inline-block px-2 py-0.5 text-[10px] font-bold rounded mb-2" style="background: rgba(212,168,67,0.15); color: #d4a843; border: 1px solid rgba(212,168,67,0.25);">${p.badge}</span>
                            <p class="text-sm font-semibold text-gray-200">${p.name}</p>
                            <p class="text-lg font-bold text-cyan-400 my-1">${p.price}</p>
                            <p class="text-xs text-gray-500">${p.desc}</p>
                        </a>`).join('\n');
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
  html = html.replace(/\n\s*<!-- Post Navigation \+ Products \(auto-injected.*?\) -->[\s\S]*?<\/section>\n\n/g, '\n');

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
  console.log(`OK: ${posts[i].file} (prev: ${i > 0 ? posts[i-1].file : 'none'} | next: ${i < posts.length - 1 ? posts[i+1].file : 'none'})`);
  updated++;
}

console.log(`\nDone. Updated ${updated}/${posts.length} posts.`);
