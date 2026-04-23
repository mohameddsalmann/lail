import { Perfume } from '@/types';
import perfumesData from '../../perfumes.json';

// Load all perfumes from the JSON file
export const perfumes: Perfume[] = (perfumesData as Perfume[]).filter(
    // Exclude items without notes (discovery sets, bundles, etc.)
    (p) => (p.mainNotes && p.mainNotes.length > 0) || p.notes.top.length > 0 || p.notes.middle.length > 0 || p.notes.base.length > 0
);
