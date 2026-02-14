'use client';

import { motion } from 'framer-motion';

interface QuizProgressProps {
    current: number;
    total: number;
}

export default function QuizProgress({ current, total }: QuizProgressProps) {
    const percentage = (current / total) * 100;

    return (
        <div className="w-full">
            <div className="flex justify-between text-sm text-[#4a4a4a] mb-2">
                <span>Step {current} of {total}</span>
                <span>{Math.round(percentage)}% complete</span>
            </div>
            <div className="h-1 bg-[#e0e0e0] overflow-hidden">
                <motion.div
                    className="h-full bg-[#e53935]"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}
