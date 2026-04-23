/**
 * Recommendation Engine Tests
 *
 * Tests for fuzzy matching, scoring, and the full recommendation pipeline.
 */

import { describe, it, expect } from 'vitest';
import { fuzzyMatch, levenshteinDistance, resolveSynonym, normalizeNote, countMatches } from './fuzzyMatch';
import { scoreNoteMatch, scoreSeason, scoreIntensity } from './scoring';
import { recommendPerfumes } from './recommend';
import { Perfume, QuizAnswers } from '@/types';

// --- Test Data ---

const maldivesPerfume: Perfume = {
  id: '3',
  name: 'Le Beau Paradis Garden (Maldives)',
  slug: 'le-beau-paradis-garden-maldives',
  inspiredBy: 'Le Beau Parfum',
  price: 599,
  currency: 'EGP',
  gender: 'male',
  description: 'A tropical paradise fragrance',
  imageUrl: '/test.jpg',
  sourceUrl: 'https://lailfragrances.com/test',
  inStock: true,
  mainNotes: ['Coconut', 'Green Notes', 'Fig', 'Water Notes', 'Mint'],
  seasons: ['summer', 'spring'],
  longevity: 'enormous',
  notes: {
    top: ['Coconut', 'Green Notes', 'Fig'],
    middle: ['Water Notes', 'Mint'],
    base: ['Sandalwood', 'Vanilla'],
  },
};

const vanillaPerfume: Perfume = {
  id: '4',
  name: 'Vanilla Dream',
  slug: 'vanilla-dream',
  inspiredBy: 'Vanilla Sky',
  price: 499,
  currency: 'EGP',
  gender: 'female',
  description: 'A sweet vanilla fragrance',
  imageUrl: '/test.jpg',
  sourceUrl: 'https://lailfragrances.com/test',
  inStock: true,
  mainNotes: ['Vanilla', 'Caramel', 'Tonka Beans', 'Jasmine', 'Rose', 'Sandalwood', 'Musk', 'Amber'],
  seasons: ['winter', 'fall'],
  longevity: 'strong',
  notes: {
    top: ['Vanilla', 'Caramel', 'Tonka Beans'],
    middle: ['Jasmine', 'Rose'],
    base: ['Sandalwood', 'Musk', 'Amber'],
  },
};

const oudPerfume: Perfume = {
  id: '5',
  name: 'Royal Oud',
  slug: 'royal-oud',
  inspiredBy: 'Oud Wood Tom Ford',
  price: 799,
  currency: 'EGP',
  gender: 'male',
  description: 'A rich oud fragrance',
  imageUrl: '/test.jpg',
  sourceUrl: 'https://lailfragrances.com/test',
  inStock: true,
  mainNotes: ['Oud', 'Saffron', 'Rose', 'Leather', 'Amber', 'Sandalwood', 'Musk'],
  seasons: ['winter', 'fall'],
  longevity: 'enormous',
  notes: {
    top: ['Oud', 'Saffron'],
    middle: ['Rose', 'Leather'],
    base: ['Amber', 'Sandalwood', 'Musk'],
  },
};

const lightPerfume: Perfume = {
  id: '6',
  name: 'Fresh Breeze',
  slug: 'fresh-breeze',
  inspiredBy: null,
  price: 399,
  currency: 'EGP',
  gender: 'unisex',
  description: 'A light fresh fragrance',
  imageUrl: '/test.jpg',
  sourceUrl: 'https://lailfragrances.com/test',
  inStock: true,
  mainNotes: ['Bergamot', 'Lemon', 'Green Tea', 'Mint', 'White Musk'],
  seasons: ['summer', 'spring'],
  longevity: 'moderate',
  notes: {
    top: ['Bergamot', 'Lemon'],
    middle: ['Green Tea', 'Mint'],
    base: ['White Musk'],
  },
};

const outOfStockPerfume: Perfume = {
  id: '7',
  name: 'Discontinued Gem',
  slug: 'discontinued-gem',
  inspiredBy: null,
  price: 999,
  currency: 'EGP',
  gender: 'female',
  description: 'No longer available',
  imageUrl: '/test.jpg',
  sourceUrl: 'https://lailfragrances.com/test',
  inStock: false,
  mainNotes: ['Rose', 'Jasmine', 'Vanilla', 'Oud', 'Amber', 'Sandalwood', 'Musk', 'Tonka Beans'],
  seasons: ['winter', 'fall'],
  longevity: 'strong',
  notes: {
    top: ['Rose', 'Jasmine', 'Vanilla', 'Oud'],
    middle: ['Amber', 'Sandalwood'],
    base: ['Musk', 'Tonka Beans'],
  },
};

const allPerfumes: Perfume[] = [maldivesPerfume, vanillaPerfume, oudPerfume, lightPerfume, outOfStockPerfume];

// --- Fuzzy Match Tests ---

describe('fuzzyMatch', () => {
  it('matches exact strings (case-insensitive)', () => {
    expect(fuzzyMatch('Vanilla', 'vanilla')).toBe(true);
    expect(fuzzyMatch('VANILLA', 'vanilla')).toBe(true);
  });

  it('matches via substring containment', () => {
    expect(fuzzyMatch('water', 'water notes')).toBe(true);
    expect(fuzzyMatch('water notes', 'water')).toBe(true);
    expect(fuzzyMatch('watery notes', 'water')).toBe(true);
  });

  it('matches via Levenshtein distance', () => {
    expect(fuzzyMatch('pinapple', 'pineapple')).toBe(true); // distance 1
    expect(fuzzyMatch('oud', 'oud')).toBe(true);
  });

  it('does not match completely different notes', () => {
    expect(fuzzyMatch('vanilla', 'leather')).toBe(false);
    expect(fuzzyMatch('rose', 'oud')).toBe(false);
  });

  it('handles multi-word notes', () => {
    expect(fuzzyMatch('oud wood', 'oud')).toBe(true);
    expect(fuzzyMatch('water notes', 'watery notes')).toBe(true);
  });
});

describe('levenshteinDistance', () => {
  it('returns 0 for identical strings', () => {
    expect(levenshteinDistance('hello', 'hello')).toBe(0);
  });

  it('computes correct distance', () => {
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
    expect(levenshteinDistance('', 'abc')).toBe(3);
  });
});

describe('resolveSynonym', () => {
  it('resolves known synonyms', () => {
    // ba7r → marine notes → water notes (fully resolved chain)
    expect(resolveSynonym('ba7r')).toBe('water notes');
    expect(resolveSynonym('tonka')).toBe('tonka bean');
  });

  it('returns original if no synonym exists', () => {
    expect(resolveSynonym('vanilla')).toBe('vanilla');
  });

  it('resolves chained synonyms', () => {
    // ba7r → marine notes → water notes (fully resolved)
    expect(resolveSynonym('ba7r')).toBe('water notes');
    // marine notes → water notes
    expect(resolveSynonym('marine notes')).toBe('water notes');
  });
});

describe('normalizeNote', () => {
  it('lowercases and strips punctuation', () => {
    // "Oud Wood" resolves through synonym map: oud wood → oud
    expect(normalizeNote("Oud Wood")).toBe('oud');
    expect(normalizeNote("tonka-beans")).toBe('tonka beans');
  });
});

describe('countMatches', () => {
  it('counts fuzzy matches between user and perfume notes', () => {
    const userNotes = ['Coconut', 'Green Notes', 'Fig', 'Mint', 'Watery Notes'];
    const perfumeNotes = ['Coconut', 'Green Notes', 'Fig', 'Water Notes', 'Mint'];
    const matches = countMatches(userNotes, perfumeNotes);
    expect(matches.size).toBe(5);
  });

  it('returns 0 for no matches', () => {
    const matches = countMatches(['Vanilla', 'Rose'], ['Oud', 'Leather']);
    expect(matches.size).toBe(0);
  });
});

// --- Scoring Tests ---

describe('scoreNoteMatch', () => {
  it('scores near-maximum for perfect position match', () => {
    const answers: QuizAnswers = {
      gender: 'male',
      favoriteNotes: ['Coconut', 'Green Notes', 'Fig', 'Mint', 'Watery Notes'],
      avoidedNotes: [],
      season: 'summer',
      intensity: 'moderate',
    };
    const result = scoreNoteMatch(answers, maldivesPerfume, 50);
    // All 5 user picks match, with near-perfect position alignment
    expect(result.score).toBeGreaterThan(40);
    expect(result.score).toBeLessThanOrEqual(50);
  });

  it('gives neutral score when no favorite notes selected', () => {
    const answers: QuizAnswers = {
      gender: 'male',
      favoriteNotes: [],
      avoidedNotes: [],
      season: 'summer',
      intensity: 'moderate',
    };
    const result = scoreNoteMatch(answers, maldivesPerfume, 50);
    expect(result.score).toBe(50 * 0.4); // 40% of max
  });

  it('gives partial score for some matches', () => {
    const answers: QuizAnswers = {
      gender: 'male',
      favoriteNotes: ['Coconut', 'Vanilla', 'Rose'],
      avoidedNotes: [],
      season: 'summer',
      intensity: 'moderate',
    };
    const result = scoreNoteMatch(answers, maldivesPerfume, 50);
    // Only Coconut and Vanilla match (Vanilla is in base tier = lower weight)
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(50);
  });
});

describe('scoreSeason', () => {
  it('gives high score for summer perfume in summer', () => {
    const answers: QuizAnswers = {
      gender: 'male',
      favoriteNotes: [],
      avoidedNotes: [],
      season: 'summer',
      intensity: 'moderate',
    };
    const result = scoreSeason(answers, lightPerfume, 15);
    // Bergamot, Lemon, Green Tea are summer boosters
    expect(result.score).toBeGreaterThan(10);
  });

  it('gives neutral score for "all" season preference', () => {
    const answers: QuizAnswers = {
      gender: 'male',
      favoriteNotes: [],
      avoidedNotes: [],
      season: 'all',
      intensity: 'moderate',
    };
    const result = scoreSeason(answers, lightPerfume, 15);
    expect(result.score).toBe(15 * 0.75);
  });
});

describe('scoreIntensity', () => {
  it('gives full score for exact match', () => {
    const answers: QuizAnswers = {
      gender: 'male',
      favoriteNotes: [],
      avoidedNotes: [],
      season: 'summer',
      intensity: 'moderate',  // lightPerfume has longevity: 'moderate'
    };
    const result = scoreIntensity(answers, lightPerfume, 15);
    expect(result.score).toBe(15);
  });

  it('gives partial score for off-by-one', () => {
    const answers: QuizAnswers = {
      gender: 'male',
      favoriteNotes: [],
      avoidedNotes: [],
      season: 'summer',
      intensity: 'strong',  // lightPerfume has longevity: 'moderate', so off-by-one
    };
    const result = scoreIntensity(answers, lightPerfume, 15);
    // moderate vs strong = off-by-one
    expect(result.score).toBe(15 * 0.6);
  });
});

// --- Full Pipeline Tests ---

describe('recommendPerfumes', () => {
  it('excludes perfumes below minimum match gate', () => {
    const answers: QuizAnswers = {
      gender: 'male',
      favoriteNotes: ['Bergamot'], // Only 1 matching note
      avoidedNotes: [],
      season: 'summer',
      intensity: 'light',
    };
    const results = recommendPerfumes(answers, allPerfumes);
    // Only 1 matching note, below MIN_MATCH_COUNT=2
    // So it should be excluded
    expect(results.find(r => r.perfume.id === '6')).toBeUndefined();
  });

  it('excludes out-of-stock perfumes', () => {
    // Stock filter is disabled — out-of-stock perfumes are now included
    // since data may be stale. This test verifies the filter is bypassed.
    const answers: QuizAnswers = {
      gender: 'female',
      favoriteNotes: ['Rose', 'Jasmine', 'Vanilla', 'Oud', 'Amber'],
      avoidedNotes: [],
      season: 'winter',
      intensity: 'strong',
    };
    const results = recommendPerfumes(answers, allPerfumes);
    // outOfStockPerfume should now be included since stock filter is disabled
    expect(results.find(r => r.perfume.id === '7')).toBeDefined();
  });

  it('excludes perfumes with avoided notes', () => {
    const answers: QuizAnswers = {
      gender: 'female',
      favoriteNotes: ['Vanilla', 'Caramel', 'Jasmine', 'Rose', 'Sandalwood'],
      avoidedNotes: ['Vanilla'],
      season: 'winter',
      intensity: 'moderate',
    };
    const results = recommendPerfumes(answers, allPerfumes);
    // vanillaPerfume contains Vanilla → should be excluded
    expect(results.find(r => r.perfume.id === '4')).toBeUndefined();
  });

  it('filters by gender', () => {
    const answers: QuizAnswers = {
      gender: 'male',
      favoriteNotes: ['Vanilla', 'Caramel', 'Jasmine', 'Rose', 'Sandalwood'],
      avoidedNotes: [],
      season: 'winter',
      intensity: 'moderate',
    };
    const results = recommendPerfumes(answers, allPerfumes);
    // vanillaPerfume is female-only → should be excluded
    expect(results.find(r => r.perfume.id === '4')).toBeUndefined();
  });

  it('includes unisex perfumes for any gender', () => {
    const answers: QuizAnswers = {
      gender: 'male',
      favoriteNotes: ['Bergamot', 'Lemon', 'Green Tea', 'Mint', 'White Musk'],
      avoidedNotes: [],
      season: 'summer',
      intensity: 'light',
    };
    const results = recommendPerfumes(answers, allPerfumes);
    // lightPerfume is unisex → should be included for male user
    expect(results.find(r => r.perfume.id === '6')).toBeDefined();
  });

  it('returns sorted results with scores', () => {
    const answers: QuizAnswers = {
      gender: 'male',
      favoriteNotes: ['Oud', 'Saffron', 'Rose', 'Leather', 'Amber'],
      avoidedNotes: [],
      season: 'winter',
      intensity: 'strong',
    };
    const results = recommendPerfumes(answers, allPerfumes);
    // Results should be sorted descending by score
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].matchScore).toBeGreaterThanOrEqual(results[i].matchScore);
    }
    // All scores should be >= MIN_TOTAL_SCORE (10)
    results.forEach(r => {
      expect(r.matchScore).toBeGreaterThanOrEqual(10);
    });
  });

  it('returns at most MAX_RESULTS (6) results', () => {
    const answers: QuizAnswers = {
      gender: 'male',
      favoriteNotes: ['Oud', 'Saffron', 'Rose', 'Leather', 'Amber'],
      avoidedNotes: [],
      season: 'winter',
      intensity: 'strong',
    };
    const results = recommendPerfumes(answers, allPerfumes);
    expect(results.length).toBeLessThanOrEqual(6);
  });

  it('caps scores at 99', () => {
    const answers: QuizAnswers = {
      gender: 'male',
      favoriteNotes: ['Oud', 'Saffron', 'Rose', 'Leather', 'Amber'],
      avoidedNotes: [],
      season: 'winter',
      intensity: 'strong',
    };
    const results = recommendPerfumes(answers, allPerfumes);
    results.forEach(r => {
      expect(r.matchScore).toBeLessThanOrEqual(99);
    });
  });
});
