/**
 * Recommendation Engine Configuration
 *
 * All tunable parameters for the perfume recommendation system.
 * Change values here to adjust filtering thresholds, scoring weights,
 * and fuzzy matching behavior without modifying algorithm code.
 */

export const RECOMMENDATION_CONFIG = {
  // --- Minimum Match Gate ---
  // Minimum number of notes that must match for a perfume to be included
  MIN_MATCH_COUNT: 2,
  // Alternative: dynamic threshold as a ratio of perfume's total notes
  // MIN_MATCH_RATIO: 0.3, // uncomment to use instead of MIN_MATCH_COUNT

  // --- Scoring Weights (must sum to 100) ---
  SCORE_WEIGHTS: {
    notePosition: 50,   // Note match + tier/position weighting
    season: 15,         // Season suitability
    intensity: 15,      // Intensity/longevity match
    genderMatch: 10,    // Gender exact match
    inspiredBonus: 5,   // Inspired-by luxury brand bonus
    richProfile: 5,     // Rich note profile (≥6 notes)
  } as const,

  // --- Tier Weights ---
  // How much each note tier contributes (top notes are most prominent)
  TIER_WEIGHTS: {
    top: 1.0,
    middle: 0.6,
    base: 0.3,
  } as const,

  // --- Output Thresholds ---
  MIN_TOTAL_SCORE: 10,        // Minimum score to appear in results
  MAX_RESULTS: 6,             // How many perfumes to return
  RICH_PROFILE_THRESHOLD: 6,  // Min total notes for rich profile bonus

  // --- Synonym Map ---
  // Maps alternate spellings/names to a canonical form for fuzzy matching
  SYNONYM_MAP: {
    'marine notes': 'water notes',
    'ba7r': 'marine notes',
    'tonka': 'tonka bean',
    'woods': 'wood notes',
    'pinapple': 'pineapple',
    'oud wood': 'oud',
    'oud agarwood': 'oud',
    'watery notes': 'water notes',
    'sea notes': 'water notes',
    'aquatic notes': 'water notes',
    'whiskey': 'cognac',
    // Quiz ID → perfume note mappings
    'marine': 'marine notes',
    'lemon': 'citrus',
    'coconut': 'vanilla',
    'peony': 'rose',
    'magnolia': 'white flowers',
    'gardenia': 'white flowers',
    'incense': 'elemi',
    'clove': 'spices',
    'ginger': 'spices',
    'chocolate': 'cacao',
    'lime': 'citrus',
    'grapefruit': 'citrus',
    'orange': 'mandarin',
    'mandarin': 'mandarin',
    'yuzu': 'citrus',
    'neroli': 'orange blossom',
    'green apple': 'apple',
    'green tea': 'clary sage',
    'ozone': 'ambrox',
    'tuberose': 'white flowers',
    'iris': 'violet',
    'lily of the valley': 'white flowers',
    'ylang': 'jasmine',
    'carnation': 'spices',
    'osmanthus': 'apricot',
    'frangipani': 'white flowers',
    'cherry blossom': 'rose',
    'honeysuckle': 'jasmine',
    'freesia': 'white flowers',
    'hibiscus': 'rose',
    'caramel': 'toffee',
    'praline': 'almond',
    'cotton candy': 'sugar',
    'marshmallow': 'vanilla',
    'toffee': 'toffee',
    'brown sugar': 'sugar',
    'maple': 'caramel',
    'rum': 'rum',
    'cognac': 'cognac',
    'bubblegum': 'strawberry',
    'cream': 'creamy milk',
    'milk': 'creamy milk',
    'ice cream': 'vanilla',
    'birch': 'leather',
    'pine': 'cedar',
    'cypress': 'cedar',
    'juniper': 'juniper',
    'driftwood': 'woody notes',
    'teakwood': 'woody notes',
    'rosewood': 'woody notes',
    'ebony': 'woody notes',
    'mahogany': 'woody notes',
    'bamboo wood': 'woody notes',
    'cashmeran': 'musk',
    'iso e super': 'ambrox',
    'nutmeg': 'spices',
    'coriander': 'spices',
    'star anise': 'licorice',
    'myrrh': 'labdanum',
    'elemi': 'elemi',
    'bay leaf': 'spices',
    'paprika': 'spices',
    'chili': 'spices',
    'wasabi': 'spices',
    'labdanum': 'labdanum',
    'benzoin': 'benzoin',
    'coumarin': 'tonka bean',
    'styrax': 'benzoin',
    'opoponax': 'labdanum',
    'peru balsam': 'vanilla',
    'tolu balsam': 'vanilla',
    'ambergris': 'ambrox',
    'castoreum': 'leather',
    'civet': 'musk',
    'beeswax': 'honey',
    'white musk': 'musk',
    'skin musk': 'musk',
    'ambroxan': 'ambrox',
    'muscone': 'musk',
    'egyptian musk': 'musk',
    'clean musk': 'musk',
    'powdery musk': 'musk',
    'animalic musk': 'musk',
    'synthetic musk': 'musk',
    'musk tahara': 'musk',
    'smoke': 'leather',
    'birch tar': 'leather',
    'ashes': 'leather',
    'gunpowder': 'leather',
    'almond': 'almond',
    'coffee': 'cacao',
    'honey': 'honey',
    'passionfruit': 'passionfruit',
    'black currant': 'black currant',
    'caraway': 'caraway',
    'dried fruits': 'dried fruits',
    'licorice': 'licorice',
    'oakwood': 'oakwood',
    'lavender': 'lavender',
    'geranium': 'geranium',
    'violet': 'violet',
    'saffron': 'saffron',
    'cinnamon': 'cinnamon',
    'cardamom': 'cardamom',
    'pink pepper': 'pink pepper',
    'black pepper': 'pepper',
    'bergamot': 'bergamot',
    'vanilla': 'vanilla',
    'oud': 'oud',
    'sandalwood': 'sandalwood',
    'cedar': 'cedar',
    'patchouli': 'patchouli',
    'amber': 'amber',
    'mint': 'mint',
    'rose': 'rose',
    'jasmine': 'jasmine',
    'tobacco': 'tobacco',
    'leather': 'leather',
    'vetiver': 'vetiver',
    'pear': 'pear',
    'musk': 'musk',
    'natural oud agarwood': 'oud',
    'bourbon vanilla': 'vanilla',
    'madagascar vanilla': 'vanilla',
    'vanilla absolute': 'vanilla',
    'vanilla caviar': 'vanilla',
    'turkish rose': 'rose',
    'woody notes': 'woody notes',
    'spices': 'spices',
  } as Record<string, string>,

  // --- Fuzzy Matching ---
  LEVENSHTEIN_MAX_SHORT: 2,   // Max Levenshtein distance for words ≤6 chars
  LEVENSHTEIN_MAX_LONG: 3,    // Max Levenshtein distance for words >6 chars
  SHORT_WORD_THRESHOLD: 6,    // Word length threshold for short/long categorization
} as const;

export type RecommendationConfig = typeof RECOMMENDATION_CONFIG;
