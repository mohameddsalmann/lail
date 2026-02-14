# perfumes.json – Analysis & Update

## Source

Data is aligned with **[nspiredbeauty.com](https://nspiredbeauty.com/)** (collections and product pages), fetched via MCP and the update script.

---

## What the JSON had before (original schema)

| Field      | Present | Notes |
|-----------|---------|--------|
| `url`     | ✅      | Product URL on nspiredbeauty.com |
| `name`    | ✅      | Product name |
| `price`   | ⚠️      | Raw string, e.g. `"From 485 EGP\n795 EGP"` or `"299 EGP"` |
| `notes`   | ✅      | `{ top, middle, base }` arrays; some entries had trailing `\"` in strings |
| `scrapedAt` | ✅    | ISO date |

---

## What was missing (and added)

| Field        | Added | Description |
|-------------|--------|-------------|
| `id`        | ✅     | Unique id (1-based index). |
| `slug`      | ✅     | From URL path (e.g. `berry-pop` from `/products/berry-pop`). |
| `inspiredBy`| ✅     | “Inspired by” brand/name from [nspiredbeauty.com](https://nspiredbeauty.com/collections/all) and product pages. |
| `price`     | ✅     | **Numeric** EGP (parsed from original string; “From 485 EGP” → 485, “299 EGP” → 299). |
| `currency`  | ✅     | `"EGP"`. |
| `gender`    | ✅     | `"male"` \| `"female"` \| `"unisex"` from site (collection/product context). |
| `description` | ✅   | Placeholder `""` for now (can be filled from product “ABOUT THIS SCENT” later). |
| `imageUrl`  | ✅     | Local path, e.g. `/images/berry-pop.jpg` (matches scraped images in `public/images/`). |
| `sourceUrl` | ✅     | Same as original `url` (nspiredbeauty.com). |
| `inStock`   | ✅     | `true` (products on site treated as in stock). |

---

## Other changes

- **Notes:** Trailing `\"` and stray newlines in note strings were normalized (e.g. `"Oak Moss\""` → `"Oak Moss"`).
- **Images:** `imageUrl` uses slug + extension; `.png` only for `black-sugar-copy` and `rogue-potion` (as in `public/images/`).

---

## Not in this JSON (app-only)

The **app** type `Perfume` in `src/types/index.ts` also has **`attributes`** (season ratings, occasions, longevity, sillage, style flags). Those are not stored in `perfumes.json`; they live in `src/data/perfumes.ts` for the quiz/recommendation engine. To drive the app from JSON you’d either:

- Extend the update script to compute/default `attributes` from notes/gender, or  
- Keep using `perfumes.ts` and optionally sync from this JSON (id, slug, name, inspiredBy, price, imageUrl, sourceUrl, notes, etc.).

---

## How the JSON was updated

1. **Analyzed** `perfumes.json` and compared to [nspiredbeauty.com](https://nspiredbeauty.com/) (collections/all + product pages) via MCP.
2. **Script:** `scripts/update-perfumes-json.js`  
   - Reads `perfumes.json`.  
   - For each entry: derives `slug` from `url`, parses numeric `price`, sets `id`, `currency`, `imageUrl`, `sourceUrl`, `inStock`, cleans `notes`.  
   - Fills `inspiredBy` and `gender` from a map built from the site.
3. **Run:** `node scripts/update-perfumes-json.js`  
   - Writes the enriched data back to `perfumes.json`.

You can re-run the script after re-scraping or editing the map to refresh `inspiredBy` / `gender` or other fields.
