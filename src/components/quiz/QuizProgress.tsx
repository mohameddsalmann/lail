'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';

interface QuizProgressProps {
    current: number;
    total: number;
}

export default function QuizProgress({ current, total }: QuizProgressProps) {
    const { t } = useI18n();
    const percentage = (current / total) * 100;

    return (
        <div className="w-full">
            <div className="flex justify-between text-sm text-[#4a4a4a] mb-2">
                <span>{t('quiz.progress.step')} {current} {t('quiz.progress.of')} {total}</span>
                <span>{Math.round(percentage)}% {t('quiz.progress.complete')}</span>
            </div>
            <div className="h-1 bg-[#e0e0e0] overflow-hidden">
                <motion.div
                    className="h-full bg-[#6A1B9A]"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}
