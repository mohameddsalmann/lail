/**
 * Recommendation Orchestrator
 *
 * Main entry point for the perfume recommendation system.
 * Applies hard filters → minimum match gate → scoring → sorting → top N results.
 *
 * Uses a 3-stage fallback: strict → relaxed match ratio → lower score floor.
 */

import { Perfume, QuizAnswers, RecommendationResult, RecommendationOutput } from '@/types';
import { RECOMMENDATION_CONFIG } from './config';
import { anyMatch, countMatches } from './fuzzyMatch';
import {
  scoreNoteMatch,
  scoreSeason,
  scoreIntensity,
  scoreGender,
  scoreInspiredBonus,
  scoreRichProfile,
} from './scoring';

// --- Hard Filters ---

/**
 * Gender filter: exclude perfumes that don't match the user's gender preference.
 * - "male" → keep "male" + "unisex"
 * - "female" → keep "female" + "unisex"
 * - "unisex" or null → keep all
 */
function passesGenderFilter(perfume: Perfume, answers: QuizAnswers): boolean {
  if (!answers.gender || answers.gender === 'unisex') return true;
  if (answers.gender === 'male') {
    return perfume.gender === 'male' || perfume.gender === 'unisex';
  }
  if (answers.gender === 'female') {
    return perfume.gender === 'female' || perfume.gender === 'unisex';
  }
  return true;
}

/**
 * Avoided notes filter: exclude perfumes that contain any avoided note.
 * Uses fuzzy matching for robust comparison.
 */
function passesAvoidedNotesFilter(perfume: Perfume, answers: QuizAnswers): boolean {
  if (!answers.avoidedNotes || answers.avoidedNotes.length === 0) return true;
  if (answers.avoidedNotes.includes('none')) return true;

  const allPerfumeNotes = perfume.mainNotes && perfume.mainNotes.length > 0
    ? perfume.mainNotes
    : [...perfume.notes.top, ...perfume.notes.middle, ...perfume.notes.base];

  // Check if any avoided note fuzzy-matches any perfume note
  for (const avoidedNote of answers.avoidedNotes) {
    if (avoidedNote === 'none') continue;
    if (anyMatch(avoidedNote, allPerfumeNotes)) {
      return false; // This perfume contains an avoided note → exclude
    }
  }

  return true;
}

/**
 * Stock filter: exclude out-of-stock perfumes.
 */
function passesStockFilter(perfume: Perfume): boolean {
  return perfume.inStock;
}

// --- Minimum Match Gate ---

/**
 * Dynamic match gate: count how many of the user's favorite notes match
 * the perfume's notes, and compare against a dynamic threshold based on
 * the perfume's total note count and the given ratio.
 */
function passesDynamicMatchGate(
  perfume: Perfume,
  answers: QuizAnswers,
  ratio: number
): boolean {
  const favoriteNotes = answers.favoriteNotes || [];
  if (favoriteNotes.length === 0 || favoriteNotes.includes('none')) return true;

  const allPerfumeNotes = perfume.mainNotes && perfume.mainNotes.length > 0
    ? perfume.mainNotes
    : [...perfume.notes.top, ...perfume.notes.middle, ...perfume.notes.base];

  const matchedUserIndices = countMatches(favoriteNotes, allPerfumeNotes);
  const matchCount = matchedUserIndices.size;

  const minimumRequired = Math.max(2, Math.ceil(allPerfumeNotes.length * ratio));
  if (matchCount < minimumRequired) return false;

  return true;
}

// --- Scoring Loop ---

interface ScoringOptions {
  matchRatio: number;
  minScore: number;
}

/**
 * Run the full scoring pipeline with configurable match ratio and score floor.
 * This is the core function that can be called multiple times with relaxed thresholds.
 */
function runScoring(
  answers: QuizAnswers,
  perfumeList: Perfume[],
  options: ScoringOptions
): RecommendationResult[] {
  const weights = RECOMMENDATION_CONFIG.SCORE_WEIGHTS;
  const results: RecommendationResult[] = [];

  for (const perfume of perfumeList) {
    // === STEP 1: HARD FILTERS ===

    if (!passesGenderFilter(perfume, answers)) continue;
    if (!passesAvoidedNotesFilter(perfume, answers)) continue;
    if (!passesStockFilter(perfume)) continue;

    // === STEP 2: DYNAMIC MATCH GATE ===

    if (!passesDynamicMatchGate(perfume, answers, options.matchRatio)) continue;

    // === STEP 3: SCORING ===

    let totalScore = 0;
    const allReasons: string[] = [];

    // Note match + position weighting (50 pts max)
    const noteResult = scoreNoteMatch(answers, perfume, weights.notePosition);
    totalScore += noteResult.score;
    allReasons.push(...noteResult.reasons);

    // Season match (15 pts max)
    const seasonResult = scoreSeason(answers, perfume, weights.season);
    totalScore += seasonResult.score;
    allReasons.push(...seasonResult.reasons);

    // Intensity match (15 pts max)
    const intensityResult = scoreIntensity(answers, perfume, weights.intensity);
    totalScore += intensityResult.score;
    allReasons.push(...intensityResult.reasons);

    // Gender match (10 pts max)
    const genderResult = scoreGender(answers, perfume, weights.genderMatch);
    totalScore += genderResult.score;
    allReasons.push(...genderResult.reasons);

    // Inspired-by bonus (5 pts max)
    const inspiredResult = scoreInspiredBonus(perfume, weights.inspiredBonus);
    totalScore += inspiredResult.score;
    allReasons.push(...inspiredResult.reasons);

    // Rich profile bonus (5 pts max)
    const richResult = scoreRichProfile(perfume, weights.richProfile);
    totalScore += richResult.score;
    allReasons.push(...richResult.reasons);

    // === STEP 4: THRESHOLD & COLLECTION ===

    // Cap total score at 99
    const normalizedScore = Math.min(Math.round(totalScore), 99);

    // Only include if score meets minimum threshold
    if (normalizedScore >= options.minScore) {
      results.push({
        perfume,
        matchScore: normalizedScore,
        matchReasons: allReasons.slice(0, 4), // Limit to 4 reasons for display
      });
    }
  }

  // Sort by score descending, return top N
  return results
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, RECOMMENDATION_CONFIG.MAX_RESULTS);
}

// --- Main Recommendation Function ---

/**
 * Recommend perfumes based on quiz answers.
 *
 * Pipeline (3-stage fallback):
 * 1. Strict: ratio 0.6, minScore 20
 * 2. Relaxed ratio: ratio 0.4, minScore 20
 * 3. Lower floor: ratio 0.4, minScore 15
 *
 * @param answers - User's quiz answers
 * @param perfumeList - Full list of perfumes to filter/score
 * @returns RecommendationOutput with results and usedFallback flag
 */
export function recommendPerfumes(
  answers: QuizAnswers,
  perfumeList: Perfume[]
): RecommendationOutput {
  // Stage 1: Strict thresholds
  let results = runScoring(answers, perfumeList, {
    matchRatio: RECOMMENDATION_CONFIG.MIN_MATCH_RATIO,
    minScore: RECOMMENDATION_CONFIG.MIN_TOTAL_SCORE,
  });

  const usedFallback = results.length === 0;

  // Stage 2: Relax match ratio
  if (usedFallback) {
    results = runScoring(answers, perfumeList, {
      matchRatio: RECOMMENDATION_CONFIG.MIN_MATCH_RATIO_FALLBACK,
      minScore: RECOMMENDATION_CONFIG.MIN_TOTAL_SCORE,
    });
  }

  // Stage 3: Lower score floor as last resort
  if (results.length === 0) {
    results = runScoring(answers, perfumeList, {
      matchRatio: RECOMMENDATION_CONFIG.MIN_MATCH_RATIO_FALLBACK,
      minScore: 15,
    });
  }

  return {
    results,
    usedFallback,
  };
}
