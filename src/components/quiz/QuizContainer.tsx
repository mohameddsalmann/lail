'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuiz } from '@/hooks/useQuiz';
import { quizSteps } from '@/config/quizSteps';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizNavigation from './QuizNavigation';
import QuizResults from './QuizResults';

export default function QuizContainer() {
    const {
        currentStep,
        totalSteps,
        answers,
        setAnswer,
        nextStep,
        prevStep,
        skipStep,
        submitQuiz,
        resetQuiz,
        isComplete,
        isLoading,
        recommendations,
        canProceed
    } = useQuiz();

    // Show results if complete
    if (isComplete && recommendations) {
        return <QuizResults recommendations={recommendations} onRetake={resetQuiz} />;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-10 h-10 border-2 border-[#e53935] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                    <p className="text-lg font-medium text-[#1a1a1a]">Finding your perfect scents...</p>
                    <p className="text-[#888888] text-sm mt-2">Analyzing your preferences</p>
                </motion.div>
            </div>
        );
    }

    const step = quizSteps[currentStep];
    const isLastStep = currentStep === totalSteps - 1;

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            {/* Header */}
            <header className="bg-white border-b border-[#e0e0e0]">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-semibold tracking-wide text-[#1a1a1a]">
                        <span className="font-light">n</span>spired
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-[#4a4a4a] hover:text-[#e53935] transition flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </Link>
                </div>
            </header>

            <div className="py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-2xl md:text-3xl font-light text-[#1a1a1a] mb-2">
                            Find Your <span className="font-semibold">Perfect Scent</span>
                        </h2>
                        <p className="text-[#4a4a4a] text-sm">
                            Answer a few questions to discover your ideal nspired fragrance
                        </p>
                    </motion.div>

                    {/* Progress */}
                    <QuizProgress current={currentStep + 1} total={totalSteps} />

                    {/* Question Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border border-[#e0e0e0] p-6 md:p-8 mt-6"
                        >
                            <QuizQuestion
                                step={step}
                                value={answers[step.name]}
                                onChange={(value) => setAnswer(step.name, value)}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <QuizNavigation
                        onBack={prevStep}
                        onNext={isLastStep ? submitQuiz : nextStep}
                        onSkip={step.skippable ? skipStep : undefined}
                        canGoBack={currentStep > 0}
                        canGoNext={canProceed}
                        isLastStep={isLastStep}
                    />
                </div>
            </div>
        </div>
    );
}
