'use client';

import { motion } from 'framer-motion';
import { QuizOption as QuizOptionType } from '@/types';

interface QuizOptionProps {
    option: QuizOptionType;
    selected: boolean;
    onClick: () => void;
}

export default function QuizOption({ option, selected, onClick }: QuizOptionProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                relative p-4 border transition-all duration-200 text-left bg-white
                ${selected
                    ? 'border-[#6A1B9A] bg-white'
                    : 'border-[#e0e0e0] hover:border-[#888888]'
                }
            `}
        >
            {/* Selection indicator */}
            {selected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 bg-[#6A1B9A] flex items-center justify-center"
                >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>
            )}

            {/* Icon */}
            <span className="text-2xl mb-2 block">{option.icon}</span>

            {/* Label */}
            <span className={`font-medium block text-sm ${selected ? 'text-[#6A1B9A]' : 'text-[#1a1a1a]'}`}>
                {option.label}
            </span>

            {/* Arabic label */}
            <span className="text-xs text-[#888888] block mt-0.5" dir="rtl">
                {option.labelAr}
            </span>

            {/* Description */}
            {option.description && (
                <span className="text-xs text-[#4a4a4a] mt-2 block">
                    {option.description}
                </span>
            )}
        </motion.button>
    );
}
