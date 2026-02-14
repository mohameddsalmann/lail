// Types for the nspired Perfume Recommendation Quiz

export interface Perfume {
  id: string;
  name: string;
  slug: string;
  inspiredBy: string | null;
  price: number;
  currency: string;
  gender: 'male' | 'female' | 'unisex';
  description: string;
  imageUrl: string;
  sourceUrl: string;
  inStock: boolean;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  attributes?: PerfumeAttributes; // Optional - not all perfumes have this
}

export interface PerfumeAttributes {
  // Season ratings (1-10)
  seasonSpring: number;
  seasonSummer: number;
  seasonFall: number;
  seasonWinter: number;
  // Occasions
  occasionDaily: boolean;
  occasionOffice: boolean;
  occasionEvening: boolean;
  occasionRomantic: boolean;
  occasionSpecial: boolean;
  occasionCasual: boolean;
  // Performance
  longevityHours: number;
  sillage: 'intimate' | 'moderate' | 'strong' | 'enormous';
  intensityLevel: number; // 1-10
  // Style flags
  styleFresh: boolean;
  styleSweet: boolean;
  styleWoody: boolean;
  styleSpicy: boolean;
  styleFloral: boolean;
  styleFruity: boolean;
  styleOriental: boolean;
  styleAquatic: boolean;
  stylePowdery: boolean;
  styleGourmand: boolean;
}

export interface QuizAnswers {
  gender: 'male' | 'female' | 'unisex' | null;
  favoriteNotes: string[];
  avoidedNotes: string[];
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all' | null;
  intensity: 'light' | 'moderate' | 'strong' | null;
}

export interface QuizStep {
  id: number;
  name: keyof QuizAnswers;
  question: string;
  questionAr: string;
  type: 'single' | 'multiple';
  required: boolean;
  skippable: boolean;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  label: string;
  labelAr: string;
  icon: string;
  description?: string;
}

export interface RecommendationResult {
  perfume: Perfume;
  matchScore: number;
  matchReasons: string[];
}
