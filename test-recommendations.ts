/**
 * Comprehensive Recommendation Engine Test — 16 Cases
 * 
 * Tests diverse user profiles including edge cases not in the Excel data.
 * Run: npx tsx test-recommendations.ts
 */

import { recommendPerfumes } from './src/lib/recommendation/recommend';
import { Perfume, QuizAnswers } from './src/types';
import perfumesData from './perfumes.json';

const perfumes = (perfumesData as Perfume[]).filter(
  (p) => (p.mainNotes && p.mainNotes.length > 0) || p.notes.top.length > 0 || p.notes.middle.length > 0 || p.notes.base.length > 0
);

const testCases: { label: string; answers: QuizAnswers }[] = [
  // ── CASE 1: Classic male summer fresh ──
  {
    label: 'Male, Summer, Strong, loves citrus/marine',
    answers: {
      gender: 'male',
      favoriteNotes: ['bergamot', 'lemon', 'marine notes', 'mint'],
      avoidedNotes: ['vanilla', 'caramel'],
      season: 'summer',
      intensity: 'strong',
    },
  },

  // ── CASE 2: Female gourmand sweet winter ──
  {
    label: 'Female, Winter, Strong, loves sweet/gourmand',
    answers: {
      gender: 'female',
      favoriteNotes: ['vanilla', 'caramel', 'marshmallow', 'honey'],
      avoidedNotes: ['marine notes', 'mint'],
      season: 'winter',
      intensity: 'strong',
    },
  },

  // ── CASE 3: Unisex tropical summer ──
  {
    label: 'Unisex, Summer, Moderate, loves tropical/fruity',
    answers: {
      gender: 'unisex',
      favoriteNotes: ['mango', 'pineapple', 'coconut', 'tropical fruits'],
      avoidedNotes: ['oud', 'leather'],
      season: 'summer',
      intensity: 'moderate',
    },
  },

  // ── CASE 4: Male woody/spicy fall ──
  {
    label: 'Male, Fall, Strong, loves woody/spicy',
    answers: {
      gender: 'male',
      favoriteNotes: ['amber', 'wood notes', 'pepper', 'incense'],
      avoidedNotes: ['strawberry', 'marshmallow'],
      season: 'fall',
      intensity: 'strong',
    },
  },

  // ── CASE 5: Female floral spring ──
  {
    label: 'Female, Spring, Moderate, loves floral/rose',
    answers: {
      gender: 'female',
      favoriteNotes: ['rose', 'jasmine', 'vanilla', 'pear'],
      avoidedNotes: ['leather', 'tobacco'],
      season: 'spring',
      intensity: 'moderate',
    },
  },

  // ── CASE 6: Unisex fresh/aquatic all-season ──
  {
    label: 'Unisex, All seasons, Light, loves fresh/aquatic',
    answers: {
      gender: 'unisex',
      favoriteNotes: ['grapefruit', 'bergamot', 'marine notes', 'mint'],
      avoidedNotes: ['oud', 'amber'],
      season: 'all',
      intensity: 'light',
    },
  },

  // ── CASE 7: Male apple/brandy all-season ──
  {
    label: 'Male, All seasons, Strong, loves apple/brandy',
    answers: {
      gender: 'male',
      favoriteNotes: ['green apple', 'vanilla', 'rum', 'pineapple'],
      avoidedNotes: ['rose', 'jasmine'],
      season: 'all',
      intensity: 'strong',
    },
  },

  // ── CASE 8: Female sweet/creamy all-season ──
  {
    label: 'Female, All seasons, Moderate, loves creamy/sweet',
    answers: {
      gender: 'female',
      favoriteNotes: ['marshmallow', 'strawberry', 'vanilla', 'sugar'],
      avoidedNotes: ['incense', 'pepper'],
      season: 'all',
      intensity: 'moderate',
    },
  },

  // ── CASE 9: No favorite notes selected (edge case) ──
  {
    label: 'Male, Summer, Strong, NO favorite notes',
    answers: {
      gender: 'male',
      favoriteNotes: ['none'],
      avoidedNotes: [],
      season: 'summer',
      intensity: 'strong',
    },
  },

  // ── CASE 10: Avoid everything sweet (strict filter) ──
  {
    label: 'Female, Summer, Light, avoids all sweet notes',
    answers: {
      gender: 'female',
      favoriteNotes: ['bergamot', 'grapefruit', 'mint'],
      avoidedNotes: ['vanilla', 'caramel', 'marshmallow', 'honey', 'sugar', 'strawberry'],
      season: 'summer',
      intensity: 'light',
    },
  },

  // ── CASE 11: Notes NOT in Excel — oud, leather, tobacco (dark winter) ──
  {
    label: 'Male, Winter, Strong, loves oud/leather/tobacco (NOT in catalog)',
    answers: {
      gender: 'male',
      favoriteNotes: ['oud', 'leather', 'tobacco', 'saffron'],
      avoidedNotes: ['strawberry', 'coconut'],
      season: 'winter',
      intensity: 'strong',
    },
  },

  // ── CASE 12: Notes NOT in Excel — patchouli, vetiver, sandalwood (earthy) ──
  {
    label: 'Unisex, Fall, Moderate, loves patchouli/vetiver/sandalwood (NOT in catalog)',
    answers: {
      gender: 'unisex',
      favoriteNotes: ['patchouli', 'vetiver', 'sandalwood', 'cedar'],
      avoidedNotes: ['marshmallow', 'strawberry'],
      season: 'fall',
      intensity: 'moderate',
    },
  },

  // ── CASE 13: Only 1 favorite note (minimal input) ──
  {
    label: 'Unisex, Summer, Moderate, only 1 note: musk',
    answers: {
      gender: 'unisex',
      favoriteNotes: ['musk'],
      avoidedNotes: [],
      season: 'summer',
      intensity: 'moderate',
    },
  },

  // ── CASE 14: Conflicting preferences — loves vanilla but avoids sweet ──
  {
    label: 'Female, Winter, Strong, loves vanilla but avoids caramel/sugar',
    answers: {
      gender: 'female',
      favoriteNotes: ['vanilla', 'rose', 'amber'],
      avoidedNotes: ['caramel', 'sugar', 'marshmallow'],
      season: 'winter',
      intensity: 'strong',
    },
  },

  // ── CASE 15: All notes avoided (extreme edge case) ──
  {
    label: 'Male, Summer, Moderate, avoids MANY notes',
    answers: {
      gender: 'male',
      favoriteNotes: ['bergamot', 'musk'],
      avoidedNotes: ['vanilla', 'coconut', 'mango', 'pineapple', 'strawberry', 'caramel', 'honey', 'marshmallow'],
      season: 'summer',
      intensity: 'moderate',
    },
  },

  // ── CASE 16: Null/undefined everything (most minimal) ──
  {
    label: 'No preferences at all (null gender, no notes, no season)',
    answers: {
      gender: null,
      favoriteNotes: [],
      avoidedNotes: [],
      season: null,
      intensity: null,
    },
  },
];

// Run tests
console.log('='.repeat(80));
console.log('RECOMMENDATION ENGINE TEST — 16 CASES');
console.log(`Catalog: ${perfumes.length} perfumes`);
console.log('='.repeat(80));

let passCount = 0;
let failCount = 0;

for (const tc of testCases) {
  const output = recommendPerfumes(tc.answers, perfumes);
  const results = output.results;

  const status = results.length > 0 ? '✅ PASS' : '❌ FAIL';
  if (results.length > 0) passCount++; else failCount++;

  console.log(`\n${status} — ${tc.label}`);
  console.log(`  Results: ${results.length} perfume(s)`);

  if (results.length === 0) {
    console.log('  ⚠️  NO RECOMMENDATIONS RETURNED');
    // Debug: check which filters are blocking
    const { RECOMMENDATION_CONFIG } = require('./src/lib/recommendation/config');
    const { anyMatch, countMatches } = require('./src/lib/recommendation/fuzzyMatch');

    for (const p of perfumes.slice(0, 5)) {
      // Gender check
      const genderOk = !tc.answers.gender || tc.answers.gender === 'unisex'
        || (tc.answers.gender === 'male' && (p.gender === 'male' || p.gender === 'unisex'))
        || (tc.answers.gender === 'female' && (p.gender === 'female' || p.gender === 'unisex'));

      // Avoided notes check
      let avoidedOk = true;
      if (tc.answers.avoidedNotes?.length > 0 && !tc.answers.avoidedNotes.includes('none')) {
        const allNotes = p.mainNotes.length > 0 ? p.mainNotes : [...p.notes.top, ...p.notes.middle, ...p.notes.base];
        for (const av of tc.answers.avoidedNotes) {
          if (av === 'none') continue;
          if (anyMatch(av, allNotes)) { avoidedOk = false; break; }
        }
      }

      // Min match gate
      let minMatchOk = true;
      if (tc.answers.favoriteNotes?.length > 0 && !tc.answers.favoriteNotes.includes('none')) {
        const allNotes = p.mainNotes.length > 0 ? p.mainNotes : [...p.notes.top, ...p.notes.middle, ...p.notes.base];
        const matchCount = countMatches(tc.answers.favoriteNotes, allNotes).size;
        if (matchCount < RECOMMENDATION_CONFIG.MIN_MATCH_COUNT) minMatchOk = false;
      }

      console.log(`  Debug[${p.name}]: gender=${genderOk} avoided=${avoidedOk} minMatch=${minMatchOk}`);
    }
  }

  for (const r of results) {
    console.log(`  #${results.indexOf(r) + 1}: ${r.perfume.name} (${r.matchScore}%) — ${r.matchReasons.join('; ')}`);
  }
}

console.log('\n' + '='.repeat(80));
console.log(`SUMMARY: ${passCount} passed, ${failCount} failed out of ${testCases.length} test cases`);
console.log('='.repeat(80));
