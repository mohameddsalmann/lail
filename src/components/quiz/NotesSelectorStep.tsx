'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fragranceNotes, noteCategories } from '@/config/quizSteps';
import type { QuizOption } from '@/types';

const MAX_LOVE_SELECTIONS = 10;
const MAX_AVOID_SELECTIONS = 20;

// Build categories with actual counts from fragranceNotes
const categoriesWithCounts = noteCategories.map((cat) => ({
    ...cat,
    count: (fragranceNotes as Record<string, QuizOption[]>)[cat.id]?.length ?? 0,
}));

interface NotesSelectorStepProps {
    mode: 'love' | 'avoid';
    value: string[];
    onChange: (ids: string[]) => void;
}

export default function NotesSelectorStep({ mode, value, onChange }: NotesSelectorStepProps) {
    const [search, setSearch] = useState('');
    const [expandedCategory, setExpandedCategory] = useState<string | null>(categoriesWithCounts[0]?.id ?? null);

    const selectedIds = useMemo(() => {
        const arr = Array.isArray(value) ? value : [];
        return arr.filter((id) => id !== 'none');
    }, [value]);

    const maxSelections = mode === 'love' ? MAX_LOVE_SELECTIONS : MAX_AVOID_SELECTIONS;
    const atLimit = selectedIds.length >= maxSelections;

    const selectedNotes = useMemo(() => {
        const notes: { id: string; label: string; icon: string }[] = [];
        for (const cat of categoriesWithCounts) {
            const items = (fragranceNotes as Record<string, QuizOption[]>)[cat.id] ?? [];
            for (const n of items) {
                if (selectedIds.includes(n.id)) notes.push({ id: n.id, label: n.label, icon: n.icon });
            }
        }
        return notes.sort((a, b) => selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id));
    }, [selectedIds]);

    const handleToggle = (noteId: string) => {
        if (noteId === 'none') {
            onChange([]);
            return;
        }
        if (selectedIds.includes(noteId)) {
            onChange(selectedIds.filter((id) => id !== noteId));
        } else {
            if (atLimit) return;
            onChange([...selectedIds, noteId]);
        }
    };

    const removeSelected = (noteId: string) => {
        onChange(selectedIds.filter((id) => id !== noteId));
    };

    const filterNotes = (notes: QuizOption[]) => {
        const q = search.trim().toLowerCase();
        if (!q) return notes;
        return notes.filter(
            (n) =>
                n.label.toLowerCase().includes(q) ||
                (n.labelAr && n.labelAr.includes(q))
        );
    };

    const isLove = mode === 'love';
    const highlightClass = isLove ? 'text-[#6A1B9A]' : 'text-[#4A148C]';

    return (
        <div className="space-y-5">
            {/* Title with highlighted word */}
            <div className="text-center mb-2">
                <h2 className="text-xl md:text-2xl font-light text-[#1a1a1a] mb-1">
                    {isLove ? (
                        <>Which notes do you <span className={`font-semibold ${highlightClass}`}>love</span>?</>
                    ) : (
                        <>Any notes you <span className={`font-semibold ${highlightClass}`}>avoid</span>?</>
                    )}
                </h2>
                <p className="text-sm text-[#4a4a4a]">
                    {isLove
                        ? 'Select the ingredients that make your heart sing'
                        : "We'll make sure to exclude these from your recommendations."}
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search ingredients..."
                    className="w-full border border-[#e0e0e0] pl-10 pr-4 py-3 text-sm outline-none focus:border-[#1a1a1a] bg-white"
                />
            </div>

            {/* Selected tags + count */}
            {(selectedNotes.length > 0 || isLove) && (
                <div className="flex flex-wrap items-center gap-2">
                    {selectedNotes.map((note) => (
                        <motion.span
                            key={note.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-1.5 bg-white border border-[#e0e0e0] px-3 py-1.5 text-sm"
                        >
                            <span aria-hidden>{note.icon}</span>
                            <span className="text-[#1a1a1a] font-medium">{note.label}</span>
                            <button
                                type="button"
                                onClick={() => removeSelected(note.id)}
                                className="ml-1 text-[#888888] hover:text-[#1a1a1a] transition"
                                aria-label={`Remove ${note.label}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </motion.span>
                    ))}
                    {isLove && (
                        <span className="text-sm text-[#888888] ml-1">
                            {selectedIds.length}/{MAX_LOVE_SELECTIONS}
                        </span>
                    )}
                </div>
            )}

            {/* Expandable categories */}
            <div className="max-h-[320px] overflow-y-auto pr-1 space-y-1">
                <AnimatePresence>
                    {categoriesWithCounts.map((cat) => {
                        const notes = (fragranceNotes as Record<string, QuizOption[]>)[cat.id] ?? [];
                        const filtered = filterNotes(notes);
                        const isExpanded = expandedCategory === cat.id;

                        if (search && filtered.length === 0) return null;

                        return (
                            <motion.div
                                key={cat.id}
                                layout
                                className="border border-[#e0e0e0] bg-white overflow-hidden"
                            >
                                <button
                                    type="button"
                                    onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#f5f5f5] transition"
                                >
                                    <span className="font-medium text-[#1a1a1a]">{cat.label}</span>
                                    <span className="flex items-center gap-2 text-[#888888] text-sm">
                                        <span>{filtered.length}</span>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-[#e0e0e0] overflow-hidden"
                                        >
                                            <div className="p-3 flex flex-wrap gap-2 bg-[#f5f5f5]">
                                                {filtered.map((note) => {
                                                    const selected = selectedIds.includes(note.id);
                                                    const disabled = !selected && atLimit;
                                                    return (
                                                        <button
                                                            key={note.id}
                                                            type="button"
                                                            onClick={() => !disabled && handleToggle(note.id)}
                                                            disabled={disabled}
                                                            className={`
                                                                inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition
                                                                ${selected
                                                                    ? 'bg-[#6A1B9A] text-white'
                                                                    : 'bg-white text-[#1a1a1a] border border-[#e0e0e0] hover:border-[#888888]'
                                                                }
                                                                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                                            `}
                                                        >
                                                            <span aria-hidden>{note.icon}</span>
                                                            {note.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {atLimit && isLove && (
                <p className="text-sm text-[#6A1B9A] text-center">
                    You&apos;ve reached the maximum of {MAX_LOVE_SELECTIONS} notes. Remove one to add another.
                </p>
            )}
        </div>
    );
}
