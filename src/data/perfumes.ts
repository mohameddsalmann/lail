import { Perfume } from '@/types';
import perfumesData from '../../perfumes.json';

// Load all perfumes from the JSON file
export const perfumes: Perfume[] = (perfumesData as Perfume[]).filter(
    // Exclude discovery sets (they don't have notes)
    (p) => p.notes.top.length > 0 || p.notes.middle.length > 0 || p.notes.base.length > 0
);
