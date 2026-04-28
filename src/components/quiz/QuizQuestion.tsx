'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { QuizStep } from '@/types';
import QuizOption from './QuizOption';
import NotesSelectorStep from './NotesSelectorStep';
import { useI18n } from '@/lib/i18n/context';

interface QuizQuestionProps {
    step: QuizStep;
    value: unknown;
    onChange: (value: unknown) => void;
    otherAnswers?: {
        favoriteNotes?: string[];
        avoidedNotes?: string[];
    };
}

const elegantSpring = { type: "spring" as const, stiffness: 350, damping: 28 };

const stepCopy: Record<string, { eyebrow: string; title: string; description: string }> = {
    gender: {
        eyebrow: 'Direction',
        title: 'Who are we curating this bottle for?',
        description: 'This sets the first filter before notes and season take over.'
    },
    season: {
        eyebrow: 'Season',
        title: 'When should this fragrance perform best?',
        description: 'Pick the weather window you actually care about testing.'
    },
    intensity: {
        eyebrow: 'Projection',
        title: 'How much presence should it leave behind?',
        description: 'Go lighter for easy daily wear or stronger for room-filling performance.'
    }
};

export default function QuizQuestion({ step, value, onChange, otherAnswers }: QuizQuestionProps) {
    const { t } = useI18n();
    const [search, setSearch] = useState('');
    const [hasSelected, setHasSelected] = useState(false);
    const showSearch = step.options.length > 24;
    const filteredOptions = useMemo(() => {
        if (!showSearch) return step.options;
        const q = search.trim().toLowerCase();
        if (!q) return step.options;
        return step.options.filter((opt) => {
            if (opt.id === 'none') return true;
            return (
                opt.label.toLowerCase().includes(q) ||
                (opt.labelAr && opt.labelAr.toLowerCase().includes(q))
            );
        });
    }, [search, showSearch, step.options]);

    if (step.name === 'favoriteNotes') {
        const ids = Array.isArray(value) ? (value as string[]).filter((id) => id !== 'none') : [];
        const avoidedNoteIds = otherAnswers?.avoidedNotes ?? [];
        return <NotesSelectorStep mode="love" value={ids} onChange={(ids) => onChange(ids)} disabledNotes={avoidedNoteIds} />;
    }

    if (step.name === 'avoidedNotes') {
        const ids = Array.isArray(value) ? (value as string[]).filter((id) => id !== 'none') : [];
        const favoriteNoteIds = otherAnswers?.favoriteNotes ?? [];
        return (
            <NotesSelectorStep
                mode="avoid"
                value={ids}
                onChange={(ids) => onChange(ids)}
                disabledNotes={favoriteNoteIds}
            />
        );
    }

    const copy = stepCopy[step.name] ?? {
        eyebrow: t('quiz.step.default.eyebrow'),
        title: step.question,
        description: t('quiz.step.default.desc')
    };

    // Override with i18n keys when available
    const i18nCopy: Record<string, { eyebrow: string; title: string; description: string }> = {
        gender: {
            eyebrow: t('quiz.step.gender.eyebrow'),
            title: t('quiz.step.gender.title'),
            description: t('quiz.step.gender.desc')
        },
        season: {
            eyebrow: t('quiz.step.season.eyebrow'),
            title: t('quiz.step.season.title'),
            description: t('quiz.step.season.desc')
        },
        intensity: {
            eyebrow: t('quiz.step.intensity.eyebrow'),
            title: t('quiz.step.intensity.title'),
            description: t('quiz.step.intensity.desc')
        }
    };

    const finalCopy = i18nCopy[step.name] ?? copy;

    const handleSelect = (optionId: string) => {
        if (step.type === 'single') {
            onChange(optionId);
            setHasSelected(true);
            return;
        }

        const currentValue = Array.isArray(value) ? value : [];
        if (optionId === 'none') {
            onChange(['none']);
        } else if (currentValue.includes(optionId)) {
            onChange(currentValue.filter((id: string) => id !== optionId));
        } else {
            onChange([...currentValue.filter((id: string) => id !== 'none'), optionId]);
        }
        if (!hasSelected && !currentValue.includes(optionId)) {
            setHasSelected(true);
        }
    };

    const isSelected = (optionId: string) => {
        if (step.type === 'single') return value === optionId;
        return Array.isArray(value) && value.includes(optionId);
    };

    return (
        <motion.div>
            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...elegantSpring, delay: 0 }}
                className="site-eyebrow"
            >
                {finalCopy.eyebrow}
            </motion.p>
            <motion.h2
                key={finalCopy.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...elegantSpring, delay: 0.05 }}
                className="mt-4 max-w-3xl text-3xl font-normal leading-tight text-[#121212] md:text-4xl"
            >
                {finalCopy.title}
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...elegantSpring, delay: 0.1 }}
                className="mt-4 max-w-3xl text-base leading-8 text-[#4d4d4d]"
            >
                {finalCopy.description}
            </motion.p>
            {step.type === 'multiple' && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.12 }}
                    className="mt-6 text-sm uppercase tracking-[0.18em] text-[#5c5c5c]"
                >
                    {t('notes.pickMultiple')}
                </motion.p>
            )}

            {showSearch && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={elegantSpring}
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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('notes.search')}
                        className="site-input pl-12"
                    />
                </motion.div>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
                {filteredOptions.map((option, index) => (
                    <motion.div
                        key={option.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...elegantSpring, delay: 0.1 + index * 0.04 }}
                    >
                        <QuizOption
                            option={option}
                            selected={isSelected(option.id)}
                            onClick={() => handleSelect(option.id)}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
