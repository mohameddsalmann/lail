/**
 * Fuzzy Matching Module
 *
 * Provides fuzzy string matching for perfume note comparison.
 * Handles: exact match, substring containment, Levenshtein distance, and synonym resolution.
 */

import { RECOMMENDATION_CONFIG } from './config';

// --- Levenshtein Distance ---

/**
 * Compute the Levenshtein distance between two strings.
 * Standard dynamic-programming implementation: O(len(a) * len(b)).
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;

  // Quick exits
  if (m === 0) return n;
  if (n === 0) return m;
  if (a === b) return 0;

  // Use single-row optimization for memory efficiency
  let prevRow = Array.from({ length: n + 1 }, (_, i) => i);

  for (let i = 1; i <= m; i++) {
    const currRow: number[] = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        currRow[j - 1] + 1,       // insertion
        prevRow[j] + 1,           // deletion
        prevRow[j - 1] + cost     // substitution
      );
    }
    prevRow = currRow;
  }

  return prevRow[n];
}

// --- Synonym Resolution ---

/**
 * Resolve a note name through the synonym map to its canonical form.
 * Applies synonym mapping recursively until no more mappings are found.
 */
export function resolveSynonym(note: string): string {
  const normalized = note.toLowerCase().trim();
  const synonymMap = RECOMMENDATION_CONFIG.SYNONYM_MAP;

  let resolved = normalized;
  let depth = 0;
  const maxDepth = 5; // prevent infinite loops

  while (synonymMap[resolved] && depth < maxDepth) {
    resolved = synonymMap[resolved];
    depth++;
  }

  return resolved;
}

// --- Normalize ---

/**
 * Normalize a note name for comparison:
 * - lowercase
 * - strip punctuation/dashes/underscores
 * - collapse whitespace
 * - resolve synonyms
 */
export function normalizeNote(note: string): string {
  return resolveSynonym(
    note
      .toLowerCase()
      .replace(/[-_'']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

// --- Fuzzy Match ---

/**
 * Check if two note names fuzzy-match each other.
 *
 * Matching criteria (in order of priority):
 * 1. Exact match after normalization (case-insensitive + synonyms)
 * 2. One string contains the other (substring)
 * 3. Levenshtein distance within threshold (short words ≤2, long words ≤3)
 *
 * @returns true if the notes match
 */
export function fuzzyMatch(noteA: string, noteB: string): boolean {
  const a = normalizeNote(noteA);
  const b = normalizeNote(noteB);

  // 1. Exact match after normalization
  if (a === b) return true;

  // 2. Substring containment (e.g., "water" matches "water notes")
  if (a.includes(b) || b.includes(a)) return true;

  // 3. Levenshtein distance
  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;
  const maxDist = shorter.length <= RECOMMENDATION_CONFIG.SHORT_WORD_THRESHOLD
    ? RECOMMENDATION_CONFIG.LEVENSHTEIN_MAX_SHORT
    : RECOMMENDATION_CONFIG.LEVENSHTEIN_MAX_LONG;

  const dist = levenshteinDistance(a, b);
  if (dist <= maxDist) return true;

  // 4. Multi-word: check if any individual word fuzzy-matches
  //    Handles cases like "oud wood" vs "oud" where the full string
  //    Levenshtein is too high but individual words match
  const wordsA = a.split(/\s+/);
  const wordsB = b.split(/\s+/);

  if (wordsA.length > 1 || wordsB.length > 1) {
    for (const wa of wordsA) {
      for (const wb of wordsB) {
        if (wa === wb) return true;
        if (wa.includes(wb) || wb.includes(wa)) return true;
        const wordDist = levenshteinDistance(wa, wb);
        const wordMaxDist = Math.min(wa.length, wb.length) <= RECOMMENDATION_CONFIG.SHORT_WORD_THRESHOLD
          ? RECOMMENDATION_CONFIG.LEVENSHTEIN_MAX_SHORT
          : RECOMMENDATION_CONFIG.LEVENSHTEIN_MAX_LONG;
        if (wordDist <= wordMaxDist) return true;
      }
    }
  }

  return false;
}

// --- Batch Matching ---

/**
 * Find all indices in a note array that fuzzy-match a target note.
 * Returns the indices of matching notes.
 */
export function findMatchingIndices(targetNote: string, noteArray: string[]): number[] {
  const matches: number[] = [];
  for (let i = 0; i < noteArray.length; i++) {
    if (fuzzyMatch(targetNote, noteArray[i])) {
      matches.push(i);
    }
  }
  return matches;
}

/**
 * Check if any note in a list fuzzy-matches a target note.
 */
export function anyMatch(targetNote: string, noteArray: string[]): boolean {
  return noteArray.some(note => fuzzyMatch(targetNote, note));
}

/**
 * Count how many notes from the user's list fuzzy-match any note in the perfume's list.
 * Returns the set of matched user note indices.
 */
export function countMatches(userNotes: string[], perfumeNotes: string[]): Set<number> {
  const matchedUserIndices = new Set<number>();

  for (let i = 0; i < userNotes.length; i++) {
    if (anyMatch(userNotes[i], perfumeNotes)) {
      matchedUserIndices.add(i);
    }
  }

  return matchedUserIndices;
}
