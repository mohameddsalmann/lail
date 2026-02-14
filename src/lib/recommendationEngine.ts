import { Perfume, QuizAnswers, RecommendationResult } from '@/types';
import { uniqueAllNotes } from '@/config/quizSteps';

const noteIdToLabel = new Map(uniqueAllNotes.map(note => [note.id, note.label]));

// Normalize a note for comparison
function normalizeNote(value: string): string {
    return value
        .toLowerCase()
        .replace(/[-_']/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Get all terms for a note (handles multi-part notes)
function normalizeNoteTerms(value: string): string[] {
    const label = noteIdToLabel.get(value) ?? value;
    const normalized = normalizeNote(label);
    // Split on common separators
    const parts = normalized
        .split(/[\/,&]/)
        .map(p => p.trim())
        .filter(Boolean);
    return Array.from(new Set([normalized, ...parts]));
}

// Infer intensity from notes
function inferIntensity(perfume: Perfume): 'light' | 'moderate' | 'strong' {
    const allNotes = [
        ...perfume.notes.top,
        ...perfume.notes.middle,
        ...perfume.notes.base
    ].map(n => n.toLowerCase());

    // Strong intensity indicators
    const strongNotes = ['oud', 'leather', 'tobacco', 'saffron', 'patchouli', 'amber', 'incense'];
    // Light intensity indicators
    const lightNotes = ['citrus', 'bergamot', 'lemon', 'lime', 'grapefruit', 'green tea', 'water', 'aquatic', 'marine'];

    const hasStrong = strongNotes.some(n => allNotes.some(note => note.includes(n)));
    const hasLight = lightNotes.some(n => allNotes.some(note => note.includes(n)));

    if (hasStrong && !hasLight) return 'strong';
    if (hasLight && !hasStrong) return 'light';
    return 'moderate';
}

// Infer season suitability from notes
function inferSeasonScore(perfume: Perfume, season: string): number {
    const allNotes = [
        ...perfume.notes.top,
        ...perfume.notes.middle,
        ...perfume.notes.base
    ].map(n => n.toLowerCase());

    const seasonIndicators: Record<string, { boost: string[], penalty: string[] }> = {
        spring: {
            boost: ['floral', 'rose', 'jasmine', 'lily', 'violet', 'peony', 'green', 'fresh'],
            penalty: ['oud', 'leather', 'tobacco', 'heavy']
        },
        summer: {
            boost: ['citrus', 'bergamot', 'lemon', 'aquatic', 'marine', 'fresh', 'mint', 'cucumber'],
            penalty: ['oud', 'amber', 'tobacco', 'leather', 'heavy', 'spicy']
        },
        fall: {
            boost: ['amber', 'vanilla', 'cinnamon', 'spice', 'wood', 'cedar', 'sandalwood'],
            penalty: ['aquatic', 'marine', 'cucumber']
        },
        winter: {
            boost: ['oud', 'leather', 'tobacco', 'amber', 'vanilla', 'spice', 'incense', 'tonka'],
            penalty: ['aquatic', 'marine', 'citrus', 'fresh']
        }
    };

    const indicators = seasonIndicators[season] || { boost: [], penalty: [] };

    let score = 5; // Base score

    for (const note of allNotes) {
        if (indicators.boost.some(b => note.includes(b))) score += 1;
        if (indicators.penalty.some(p => note.includes(p))) score -= 1;
    }

    return Math.max(1, Math.min(10, score));
}

export function calculateRecommendations(
    answers: QuizAnswers,
    perfumeList: Perfume[]
): RecommendationResult[] {
    const results: RecommendationResult[] = [];

    for (const perfume of perfumeList) {
        // ============ HARD FILTERS (Exclusions) ============

        // 1. Gender filter
        if (answers.gender && answers.gender !== 'unisex') {
            if (perfume.gender !== answers.gender && perfume.gender !== 'unisex') {
                continue;
            }
        }

        // 2. Avoided notes filter - STRICT EXCLUSION
        if (answers.avoidedNotes.length > 0 && !answers.avoidedNotes.includes('none')) {
            const allPerfumeNotes = [
                ...perfume.notes.top,
                ...perfume.notes.middle,
                ...perfume.notes.base
            ].map(n => normalizeNote(n));

            const avoidedTerms = answers.avoidedNotes.flatMap(normalizeNoteTerms);

            const hasAvoidedNote = avoidedTerms.some(avoidedTerm =>
                allPerfumeNotes.some(note =>
                    note.includes(avoidedTerm) || avoidedTerm.includes(note)
                )
            );

            if (hasAvoidedNote) {
                continue; // Skip this perfume entirely
            }
        }

        // 3. Stock check
        if (!perfume.inStock) continue;

        // ============ SCORING (Positive Matching) ============
        let score = 0;
        const reasons: string[] = [];

        // --- Favorite Notes Match (40 points max) - PRIMARY SCORING ---
        if (answers.favoriteNotes.length > 0 && !answers.favoriteNotes.includes('none')) {
            const allPerfumeNotes = [
                ...perfume.notes.top,
                ...perfume.notes.middle,
                ...perfume.notes.base
            ].map(n => normalizeNote(n));

            let noteMatches = 0;
            const matchedNotes: string[] = [];

            for (const favorite of answers.favoriteNotes) {
                const favoriteLabel = noteIdToLabel.get(favorite) ?? favorite;
                const terms = normalizeNoteTerms(favorite);

                const isMatch = terms.some(term =>
                    allPerfumeNotes.some(note =>
                        note.includes(term) || term.includes(note)
                    )
                );

                if (isMatch) {
                    noteMatches++;
                    matchedNotes.push(favoriteLabel);
                }
            }

            // Calculate score based on match ratio
            const matchRatio = noteMatches / answers.favoriteNotes.length;
            const noteScore = matchRatio * 40;
            score += noteScore;

            if (matchedNotes.length > 0) {
                const displayNotes = matchedNotes.slice(0, 3).join(', ');
                reasons.push(`Contains ${displayNotes}`);
            }
        } else {
            // If no favorite notes selected, give base score
            score += 20;
        }

        // --- Season Match (20 points max) ---
        if (answers.season && answers.season !== 'all') {
            const seasonScore = inferSeasonScore(perfume, answers.season);
            const seasonPoints = (seasonScore / 10) * 20;
            score += seasonPoints;

            if (seasonScore >= 7) {
                const seasonNames: Record<string, string> = {
                    spring: 'Spring',
                    summer: 'Summer',
                    fall: 'Fall',
                    winter: 'Winter'
                };
                reasons.push(`Perfect for ${seasonNames[answers.season]}`);
            }
        } else {
            score += 15; // Neutral for "all seasons"
        }

        // --- Intensity Match (20 points max) ---
        const perfumeIntensity = inferIntensity(perfume);
        const preferredIntensity = answers.intensity || 'moderate';

        const intensityOrder = ['light', 'moderate', 'strong'];
        const perfumeIdx = intensityOrder.indexOf(perfumeIntensity);
        const preferredIdx = intensityOrder.indexOf(preferredIntensity);
        const intensityDiff = Math.abs(perfumeIdx - preferredIdx);

        const intensityScore = intensityDiff === 0 ? 20 : intensityDiff === 1 ? 12 : 5;
        score += intensityScore;

        if (intensityDiff === 0) {
            reasons.push('Matches your intensity preference');
        }

        // --- Gender exact match bonus (10 points) ---
        if (perfume.gender === answers.gender) {
            score += 10;
        } else if (perfume.gender === 'unisex') {
            score += 5; // Partial bonus for unisex
        }

        // --- Inspired by bonus (5 points) ---
        if (perfume.inspiredBy && perfume.inspiredBy !== 'nspired beauty') {
            score += 5;
            reasons.push(`Inspired by ${perfume.inspiredBy}`);
        }

        // --- Rich note profile bonus (5 points) ---
        const totalNotes = perfume.notes.top.length + perfume.notes.middle.length + perfume.notes.base.length;
        if (totalNotes >= 6) {
            score += 5;
        }

        // Calculate normalized score (max ~100)
        const normalizedScore = Math.min(Math.round(score), 99);

        // Only include if score is reasonable
        if (score >= 20) {
            results.push({
                perfume,
                matchScore: normalizedScore,
                matchReasons: reasons.slice(0, 4)
            });
        }
    }

    // Sort by score descending, return top 6
    return results
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6);
}
