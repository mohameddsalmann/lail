'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NoteIcon from '@/components/icons/NoteIcon';

interface Choice {
    id: string;
    label: string;
    icon: string;
    hint: string;
}

interface ConciergeChoicesProps {
    choices: Choice[];
    onSelect: (id: string) => void;
    baseDelay?: number;
}

const spring = { type: 'spring' as const, stiffness: 400, damping: 25 };

export default function ConciergeChoices({ choices, onSelect, baseDelay = 0 }: ConciergeChoicesProps) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (id: string) => {
        if (selected) return;
        setSelected(id);
        setTimeout(() => onSelect(id), 400);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: baseDelay }}
            className="flex flex-col gap-3 sm:flex-row"
        >
            <AnimatePresence>
                {choices.map((choice, i) => {
                    const isSelected = selected === choice.id;
                    const isDimmed = selected !== null && !isSelected;

                    return (
                        <motion.button
                            key={choice.id}
                            initial={{ opacity: 0, y: 16, scale: 0.95 }}
                            animate={{
                                opacity: isDimmed ? 0.4 : 1,
                                y: 0,
                                scale: isSelected ? 1.02 : 1,
                            }}
                            whileHover={!selected ? { scale: 1.03, y: -2 } : {}}
                            whileTap={!selected ? { scale: 0.97 } : {}}
                            transition={{ ...spring, delay: baseDelay + 0.1 + i * 0.12 }}
                            onClick={() => handleSelect(choice.id)}
                            disabled={!!selected}
                            className={`
                                group relative flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 px-6 py-7
                                text-center transition-colors duration-300
                                ${isSelected
                                    ? 'border-[#C4A265] bg-[#C4A265]/10'
                                    : 'border-[#E8E0D4] bg-white hover:border-[#C4A265]/50'
                                }
                                ${selected && !isSelected ? 'pointer-events-none' : 'cursor-pointer'}
                            `}
                        >
                            {isSelected && (
                                <motion.div
                                    className="absolute inset-0 rounded-2xl border-2 border-[#C4A265]"
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.04, 1] }}
                                    transition={{ duration: 0.4 }}
                                />
                            )}

                            <motion.span
                                className="text-[#C4A265]"
                                animate={isSelected ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] } : {}}
                                transition={{ duration: 0.4 }}
                            >
                                <NoteIcon name={choice.icon} size={36} />
                            </motion.span>

                            <span className="text-base font-medium text-[#2C1810]">
                                {choice.label}
                            </span>

                            <span className="text-xs leading-relaxed text-[#8A7E72]">
                                {choice.hint}
                            </span>

                            {isSelected && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={spring}
                                    className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#C4A265] text-xs text-white"
                                >
                                    ✓
                                </motion.span>
                            )}
                        </motion.button>
                    );
                })}
            </AnimatePresence>
        </motion.div>
    );
}
