'use client';

import { motion } from 'framer-motion';

interface QuizNavigationProps {
    onBack: () => void;
    onNext: () => void;
    onSkip?: () => void;
    canGoBack: boolean;
    canGoNext: boolean;
    isLastStep: boolean;
}

export default function QuizNavigation({
    onBack,
    onNext,
    onSkip,
    canGoBack,
    canGoNext,
    isLastStep
}: QuizNavigationProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mt-6 gap-4"
        >
            {/* Back Button */}
            <button
                onClick={onBack}
                disabled={!canGoBack}
                className={`
                    px-6 py-3 text-sm font-medium transition-all
                    ${canGoBack
                        ? 'text-[#4a4a4a] hover:text-[#1a1a1a]'
                        : 'text-[#cccccc] cursor-not-allowed'
                    }
                `}
            >
                Back
            </button>

            {/* Skip Button (optional) */}
            {onSkip && (
                <button
                    onClick={onSkip}
                    className="text-[#888888] hover:text-[#4a4a4a] text-sm underline underline-offset-2"
                >
                    Skip this step
                </button>
            )}

            {/* Next/Submit Button */}
            <motion.button
                whileHover={{ scale: canGoNext ? 1.02 : 1 }}
                whileTap={{ scale: canGoNext ? 0.98 : 1 }}
                onClick={onNext}
                disabled={!canGoNext}
                className={`
                    px-8 py-3 text-sm uppercase tracking-wider font-medium transition-all
                    ${canGoNext
                        ? 'bg-[#6A1B9A] text-white hover:bg-[#4A148C]'
                        : 'bg-[#e0e0e0] text-[#888888] cursor-not-allowed'
                    }
                `}
            >
                {isLastStep ? 'Find My Perfumes' : 'Next'}
            </motion.button>
        </motion.div>
    );
}
