/**
 * Scrapes product images from nspiredbeauty.com and saves them to public/images.
 * Run: node scripts/scrape-nspired-images.js
 *
 * Uses CDN pattern: https://nspiredbeauty.com/cdn/shop/files/{filename}.jpg
 * Product pages use data-master or data-srcset on main product image.
 */

const fs = require('fs');
const path = require('path');

const BASE = 'https://nspiredbeauty.com';
const COLLECTIONS = [
  `${BASE}/collections/women`,
  `${BASE}/collections/men`,
];
const OUT_DIR = path.join(__dirname, '..', 'public', 'images');

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/119.0' },
  });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.text();
}

function extractProductSlugs(html) {
  const slugs = new Set();
  const re = /href="[^"]*\/products\/([^"/?#]+)/g;
  let m;
  while ((m = re.exec(html)) !== null) slugs.add(m[1]);
  return [...slugs];
}

function extractImageUrlFromProductPage(html) {
  // data-master="//nspiredbeauty.com/cdn/shop/files/berry-pop.jpg?v=..."
  const dataMaster = html.match(/data-master="(?:https?:)?\/\/[^"]*cdn\/shop\/files\/([^"?]+)/);
  if (dataMaster) return `https://nspiredbeauty.com/cdn/shop/files/${dataMaster[1]}`;
  // data-srcset or srcset with cdn/shop/files
  const srcset = html.match(/(?:data-srcset|srcset)="[^"]*cdn\/shop\/files\/([^"?&]+)/);
  if (srcset) return `https://nspiredbeauty.com/cdn/shop/files/${srcset[1]}`;
  // src="...cdn/shop/files/..."
  const src = html.match(/src="(https:\/\/[^"]*cdn\/shop\/files\/[^"]+)"/);
  if (src) return src[1];
  return null;
}

async function downloadImage(url, filepath) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/119.0' },
  });
  if (!res.ok) throw new Error(`Image ${url} ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filepath, buf);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const allSlugs = new Set();
  for (const url of COLLECTIONS) {
    console.log('Fetching collection:', url);
    const html = await fetchHtml(url);
    const slugs = extractProductSlugs(html);
    slugs.forEach((s) => allSlugs.add(s));
    console.log('  Found', slugs.length, 'product links');
  }

  console.log('\nTotal unique product slugs:', allSlugs.size);

  let done = 0;
  let skipped = 0;
  for (const slug of allSlugs) {
    try {
      const productUrl = `${BASE}/products/${slug}`;
      const html = await fetchHtml(productUrl);
      const imageUrl = extractImageUrlFromProductPage(html);

      if (!imageUrl) {
        console.log(`  [skip] ${slug} - no image found`);
        skipped++;
        continue;
      }

      const filename = slug + path.extname(new URL(imageUrl).pathname) || '.jpg';
      const filepath = path.join(OUT_DIR, filename);

      await downloadImage(imageUrl, filepath);
      console.log(`  [ok] ${slug} -> ${filename}`);
      done++;
    } catch (err) {
      console.log(`  [err] ${slug}:`, err.message);
    }
  }

  console.log('\nDone. Downloaded:', done, 'Skipped:', skipped);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
