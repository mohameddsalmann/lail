'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fragranceNotes, noteCategories } from '@/config/quizSteps';
import type { QuizOption } from '@/types';

const MAX_LOVE_SELECTIONS = 10;
const MAX_AVOID_SELECTIONS = 20;

const categoriesWithCounts = noteCategories.map((cat) => ({
    ...cat,
    count: (fragranceNotes as Record<string, QuizOption[]>)[cat.id]?.length ?? 0,
}));

interface NotesSelectorStepProps {
    mode: 'love' | 'avoid';
    value: string[];
    onChange: (ids: string[]) => void;
    disabledNotes?: string[];
}

const elegantSpring = { type: "spring" as const, stiffness: 350, damping: 28 };
const bouncySpring = { type: "spring" as const, stiffness: 500, damping: 20 };

export default function NotesSelectorStep({ mode, value, onChange, disabledNotes = [] }: NotesSelectorStepProps) {
    const [search, setSearch] = useState('');
    const [expandedCategory, setExpandedCategory] = useState<string | null>(categoriesWithCounts[0]?.id ?? null);

    const selectedIds = useMemo(() => {
        const arr = Array.isArray(value) ? value : [];
        return arr.filter((id) => id !== 'none');
    }, [value]);
    const disabledNoteIds = useMemo(
        () => new Set(disabledNotes.filter((id) => id !== 'none')),
        [disabledNotes]
    );

    const maxSelections = mode === 'love' ? MAX_LOVE_SELECTIONS : MAX_AVOID_SELECTIONS;
    const atLimit = selectedIds.length >= maxSelections;

    useEffect(() => {
        if (disabledNoteIds.size === 0) return;

        const safeIds = selectedIds.filter((id) => !disabledNoteIds.has(id));
        if (safeIds.length !== selectedIds.length) {
            onChange(safeIds);
        }
    }, [disabledNoteIds, onChange, selectedIds]);

    const selectedNotes = useMemo(() => {
        const notes: { id: string; label: string; icon: string }[] = [];
        for (const cat of categoriesWithCounts) {
            const items = (fragranceNotes as Record<string, QuizOption[]>)[cat.id] ?? [];
            for (const note of items) {
                if (selectedIds.includes(note.id) && !notes.some((item) => item.id === note.id)) {
                    notes.push({ id: note.id, label: note.label, icon: note.icon });
                }
            }
        }
        return notes.sort((a, b) => selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id));
    }, [selectedIds]);

    const disabledSelectedNotes = useMemo(() => {
        if (disabledNoteIds.size === 0) return [];

        const notes: { id: string; label: string; icon: string }[] = [];
        for (const cat of categoriesWithCounts) {
            const items = (fragranceNotes as Record<string, QuizOption[]>)[cat.id] ?? [];
            for (const note of items) {
                if (disabledNoteIds.has(note.id) && !notes.some((item) => item.id === note.id)) {
                    notes.push({ id: note.id, label: note.label, icon: note.icon });
                }
            }
        }

        return notes;
    }, [disabledNoteIds]);

    const handleToggle = (noteId: string) => {
        if (disabledNoteIds.has(noteId)) return;

        if (selectedIds.includes(noteId)) {
            onChange(selectedIds.filter((id) => id !== noteId));
            return;
        }

        if (atLimit) return;
        onChange([...selectedIds, noteId]);
    };

    const removeSelected = (noteId: string) => {
        onChange(selectedIds.filter((id) => id !== noteId));
    };

    const filterNotes = (notes: QuizOption[]) => {
        const q = search.trim().toLowerCase();
        const visibleNotes = disabledNoteIds.size > 0
            ? notes.filter((note) => !disabledNoteIds.has(note.id))
            : notes;

        if (!q) return visibleNotes;
        return visibleNotes.filter(
            (note) =>
                note.label.toLowerCase().includes(q) ||
                (note.labelAr && note.labelAr.toLowerCase().includes(q))
        );
    };

    const isLove = mode === 'love';

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={elegantSpring}
                className="site-card p-6"
            >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={elegantSpring}
                            className="site-eyebrow"
                        >
                            {isLove ? 'Moodboard' : 'Refine the brief'}
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...elegantSpring, delay: 0.05 }}
                            className="mt-4 text-3xl font-normal leading-tight text-[#121212] md:text-4xl"
                        >
                            {isLove ? 'Pin the notes you want leading the scent.' : 'Block anything that ruins the vibe.'}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...elegantSpring, delay: 0.1 }}
                            className="mt-4 text-base leading-8 text-[#4d4d4d]"
                        >
                            {isLove
                                ? 'Pick the notes that should show up first when you test a fragrance.'
                                : 'Tell us what to avoid and the shortlist will stay clear of those directions.'}
                        </motion.p>
                    </div>

                    <motion.div
                        className={`
                            border border-[#121212] p-5 transition-all duration-300
                            ${atLimit ? 'bg-[#f3f3f3]' : ''}
                        `}
                    >
                        <p className="site-eyebrow">{isLove ? 'Pinned notes' : 'Blocked notes'}</p>
                        <p className="mt-3 text-4xl text-[#121212]">
                            {selectedIds.length}
                        </p>
                        <p className="mt-2 text-sm text-[#4d4d4d]">out of {maxSelections}</p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...elegantSpring, delay: 0.15 }}
                    className="relative mt-6"
                >
                    <svg
                        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7a7a7a]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search for notes, textures, or ingredients..."
                        className="site-input pl-12"
                    />
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...elegantSpring, delay: 0.1 }}
                className="site-card p-5"
            >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="site-eyebrow">Selected notes</p>
                        <p className="mt-3 text-sm leading-7 text-[#4d4d4d]">
                            {selectedNotes.length > 0
                                ? isLove
                                    ? 'These notes will steer the shortlist.'
                                    : 'These notes will be filtered out.'
                                : isLove
                                    ? 'No notes pinned yet.'
                                    : 'Nothing blocked yet.'}
                        </p>
                    </div>
                    {!isLove && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => onChange([])}
                            className="text-xs uppercase tracking-[0.22em] text-[#5c5c5c] transition hover:text-[#121212]"
                        >
                            Clear list
                        </motion.button>
                    )}
                </div>

                <AnimatePresence mode="popLayout">
                    {selectedNotes.length > 0 && (
                        <motion.div className="mt-5 flex flex-wrap gap-2">
                            {selectedNotes.map((note) => (
                                <motion.button
                                    key={note.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                    transition={bouncySpring}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => removeSelected(note.id)}
                                    className={`
                                        inline-flex items-center gap-2 border px-4 py-2 text-sm transition
                                        ${isLove
                                            ? 'border-[#121212] bg-[#121212] text-white'
                                            : 'border-[#121212] bg-white text-[#121212]'
                                        }
                                    `}
                                >
                                    <span>
                                        {note.icon}
                                    </span>
                                    <span>{note.label}</span>
                                    <span aria-hidden>×</span>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {disabledSelectedNotes.length > 0 && (
                    <div className="mt-5 border-t border-[#dcdcdc] pt-5">
                        <p className="site-eyebrow">{isLove ? 'Already in your blocks' : 'Already in your loves'}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {disabledSelectedNotes.map((note) => (
                                <span
                                    key={note.id}
                                    className="inline-flex items-center gap-2 border border-[#dcdcdc] bg-[#f3f3f3] px-4 py-2 text-sm text-[#5c5c5c]"
                                >
                                    <span aria-hidden>{note.icon}</span>
                                    <span>{note.label}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            <div className="space-y-3">
                <AnimatePresence>
                    {categoriesWithCounts.map((cat, catIndex) => {
                        const notes = (fragranceNotes as Record<string, QuizOption[]>)[cat.id] ?? [];
                        const filtered = filterNotes(notes);
                        const isExpanded = expandedCategory === cat.id;

                        if (search && filtered.length === 0) return null;

                        return (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ ...elegantSpring, delay: catIndex * 0.03 }}
                                layout
                                className="site-card overflow-hidden"
                            >
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <motion.span
                                            animate={isExpanded ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] } : { scale: 1 }}
                                            transition={isExpanded ? { duration: 0.3 } : elegantSpring}
                                            className="flex h-12 w-12 items-center justify-center border border-[#dcdcdc] bg-[#f3f3f3] text-2xl"
                                        >
                                            {cat.icon}
                                        </motion.span>
                                        <div>
                                            <p className="text-xl text-[#121212]">{cat.label}</p>
                                            <p className="mt-1 text-sm text-[#5c5c5c]">
                                                {filtered.length} note{filtered.length === 1 ? '' : 's'}
                                            </p>
                                        </div>
                                    </div>

                                    <motion.svg
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={elegantSpring}
                                        className="h-5 w-5 text-[#7a7a7a]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </motion.svg>
                                </motion.button>

                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="overflow-hidden border-t border-[#dcdcdc]"
                                        >
                                            <div className="grid gap-px bg-[#dcdcdc] md:grid-cols-2 xl:grid-cols-3">
                                                {filtered.map((note, noteIndex) => {
                                                    const selected = selectedIds.includes(note.id);
                                                    const blockedByOtherStep = disabledNoteIds.has(note.id);
                                                    const disabled = blockedByOtherStep || (!selected && atLimit);

                                                    return (
                                                        <motion.button
                                                            key={note.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: noteIndex * 0.02 }}
                                                            type="button"
                                                            onClick={() => !disabled && handleToggle(note.id)}
                                                            disabled={disabled}
                                                            whileTap={!disabled ? { scale: 0.98 } : {}}
                                                            className={`
                                                                flex items-center justify-between gap-3 bg-white px-4 py-4 text-left text-sm transition
                                                                ${selected
                                                                    ? isLove
                                                                        ? 'bg-[#121212] text-white'
                                                                        : 'bg-[#f3f3f3] text-[#121212]'
                                                                    : 'text-[#121212] hover:bg-[#fafafa]'
                                                                }
                                                                ${disabled ? 'cursor-not-allowed opacity-45' : ''}
                                                            `}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <span aria-hidden>{note.icon}</span>
                                                                <span>{note.label}</span>
                                                            </span>
                                                            {selected && (
                                                                <motion.span
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={bouncySpring}
                                                                    className="text-[10px] uppercase tracking-[0.22em]"
                                                                >
                                                                    On
                                                                </motion.span>
                                                            )}
                                                        </motion.button>
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

            {atLimit && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-sm text-[#121212]"
                >
                    You&apos;ve reached the maximum of {maxSelections}. Remove one note to add another.
                </motion.p>
            )}
        </div>
    );
}
