/**
 * Updates perfumes.json with missing fields from nspiredbeauty.com.
 * Data from https://nspiredbeauty.com/collections/all and product pages (MCP fetch).
 * Run: node scripts/update-perfumes-json.js
 */

const fs = require('fs');
const path = require('path');

const PERFUMES_JSON = path.join(__dirname, '..', 'perfumes.json');

// From https://nspiredbeauty.com/collections/all and product pages
const INSPIRED_BY_AND_GENDER = {
  "Be My Fortè": { inspiredBy: "Armani's Stronger With You", gender: "male" },
  "Discovery Set For Her": { inspiredBy: "nspired beauty", gender: "female" },
  "Wild Child": { inspiredBy: "Dior's Sauvage", gender: "male" },
  "Gatsby's Spice": { inspiredBy: "Tom Ford's Black Orchid", gender: "unisex" },
  "Indigo Drop": { inspiredBy: "Chanel's Bleu De Chanel", gender: "male" },
  "Bella Vita": { inspiredBy: "Lancome's La Vie Est Belle", gender: "female" },
  "Discovery Set For Him": { inspiredBy: "nspired beauty", gender: "male" },
  "Vanilla Blooms": { inspiredBy: "Mancera's Roses Vanilla", gender: "unisex" },
  "Sea Me Sometime": { inspiredBy: "Armani's Acqua Di Gio", gender: "male" },
  "Hot Stiletto": { inspiredBy: "Carolina Herrera's Good Girl", gender: "female" },
  "Titan's Trophy": { inspiredBy: "Paco Rabanne's Invictus", gender: "male" },
  "Greek Icon": { inspiredBy: "Paco Rabanne's Olympea", gender: "female" },
  "Rogue Potion": { inspiredBy: "Dior's Sauvage Elixir", gender: "male" },
  "Lady C": { inspiredBy: "Chanel's Coco Mademoiselle", gender: "female" },
  "Naughty Honey": { inspiredBy: "nspired beauty", gender: "female" },
  "Macho Muse": { inspiredBy: "nspired beauty", gender: "male" },
  "Scarlet Seduction": { inspiredBy: "Maison Francis Kurkdjian's Baccarat Rouge 540", gender: "female" },
  "Rebellion Pulse": { inspiredBy: "YSL's Libre", gender: "female" },
  "Elixir Of Desire": { inspiredBy: "Armani's Si Passione", gender: "female" },
  "Berry Pop": { inspiredBy: "Burberry Her", gender: "female" },
  "Gold Bar": { inspiredBy: "Paco Rabanne's 1 Million", gender: "male" },
  "Dark Candy": { inspiredBy: "Tom Ford's Lost Cherry", gender: "unisex" },
  "Inferno Spice": { inspiredBy: "Viktor & Rolf's Spicebomb", gender: "male" },
  "Oud Odyssey": { inspiredBy: "Dior's Oud Ispahan", gender: "unisex" },
  "Floral Fantasy": { inspiredBy: "Viktor & Rolf's Flowerbomb", gender: "female" },
  "Velvet Muse": { inspiredBy: "Miss Dior", gender: "female" },
  "Vanilla Lust": { inspiredBy: "Tom Ford's Vanilla Sex", gender: "female" },
  "Sugared Lace": { inspiredBy: "nspired beauty", gender: "female" },
  "Fabulous Riot": { inspiredBy: "Tom Ford's Fucking Fabulous", gender: "unisex" },
  "Fancy Fleur": { inspiredBy: "Dior's J'adore", gender: "female" },
  "Mystic Flora": { inspiredBy: "Chanel Chance", gender: "unisex" },
  "Starstruck Blooms": { inspiredBy: "nspired beauty", gender: "female" },
  "Leather Luster": { inspiredBy: "Tom Ford's Tuscan Leather", gender: "male" },
  "Nightfall Spell": { inspiredBy: "nspired beauty", gender: "male" },
  "Angel Dust": { inspiredBy: "nspired beauty", gender: "unisex" },
  "The Man": { inspiredBy: "nspired beauty", gender: "male" },
  "Bright Tide": { inspiredBy: "nspired beauty", gender: "male" },
  "Cupid's Call": { inspiredBy: "Givenchy's Irresistible", gender: "female" },
  "Pistachio Dream": { inspiredBy: "Kayali's Yum Pistachio Gelato", gender: "female" },
  "Sweet Sin": { inspiredBy: "nspired beauty", gender: "female" },
  "Eden Glow": { inspiredBy: "Kayali's Eden Sparkling Lychee", gender: "female" },
  "Tobacco Crush": { inspiredBy: "Armani Stronger With You Tobacco", gender: "male" },
  "Suede Swagger": { inspiredBy: "nspired beauty", gender: "male" },
  "Oh La Love": { inspiredBy: "YSL's Mon Paris", gender: "female" },
  "Joy Ride": { inspiredBy: "Dior's Joy", gender: "female" },
  "Code Noir": { inspiredBy: "nspired beauty", gender: "unisex" },
  "nspired x Ovio Black Sugar": { inspiredBy: "YSL's Black Opium", gender: "female" },
  "Apple Silk": { inspiredBy: "Kayali's Elixir", gender: "female" },
  "nspired x Ovio Sweet Cigar": { inspiredBy: "Tom Ford's Tobacco Vanille", gender: "unisex" },
};

// Image extension override (we have .png for these)
const IMAGE_EXT = { "black-sugar-copy": "png", "rogue-potion": "png" };

function slugFromUrl(url) {
  const m = url.match(/\/products\/([^/?]+)/);
  return m ? m[1] : url.replace(/.*\//, "").replace(/\?.*/, "");
}

function parsePrice(priceStr) {
  if (!priceStr || typeof priceStr !== "string") return 485;
  const numbers = priceStr.match(/\d+/g);
  if (!numbers || numbers.length === 0) return 485;
  return Math.min(...numbers.map(Number));
}

function cleanNote(n) {
  if (typeof n !== "string") return n;
  return n.replace(/\\?"$/g, "").replace(/\\"/g, '"').replace(/\n/g, " ").trim();
}

function cleanNotes(notes) {
  if (!notes) return { top: [], middle: [], base: [] };
  return {
    top: (notes.top || []).map(cleanNote),
    middle: (notes.middle || []).map(cleanNote),
    base: (notes.base || []).map(cleanNote),
  };
}

function main() {
  const data = JSON.parse(fs.readFileSync(PERFUMES_JSON, "utf8"));
  const updated = data.map((item, index) => {
    const slug = slugFromUrl(item.sourceUrl || item.url);
    const ext = IMAGE_EXT[slug] || "jpg";
    const meta = INSPIRED_BY_AND_GENDER[item.name] || { inspiredBy: null, gender: "unisex" };
    return {
      id: String(index + 1),
      slug,
      name: item.name,
      inspiredBy: meta.inspiredBy ?? null,
      price: parsePrice(item.price),
      currency: "EGP",
      gender: meta.gender,
      description: "",
      imageUrl: `/images/${slug}.${ext}`,
      sourceUrl: item.sourceUrl || item.url,
      inStock: true,
      notes: cleanNotes(item.notes),
      scrapedAt: item.scrapedAt,
    };
  });
  fs.writeFileSync(PERFUMES_JSON, JSON.stringify(updated, null, 2), "utf8");
  console.log("Updated perfumes.json with", updated.length, "entries.");
}

main();
