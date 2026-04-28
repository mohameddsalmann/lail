'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useQuiz } from '@/hooks/useQuiz';
import { quizSteps } from '@/config/quizSteps';
import StoreFooter from '@/components/site/StoreFooter';
import StoreHeader from '@/components/site/StoreHeader';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizNavigation from './QuizNavigation';
import QuizResults from './QuizResults';
import { useI18n } from '@/lib/i18n/context';

const elegantSpring = { type: "spring" as const, stiffness: 350, damping: 28 };

export default function QuizContainer() {
    const { t } = useI18n();
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
        usedFallback,
        canProceed
    } = useQuiz();

    if (isComplete && recommendations) {
        return <QuizResults recommendations={recommendations} onRetake={resetQuiz} usedFallback={usedFallback} />;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white text-[#121212]">
                <StoreHeader active="quiz" />
                <div className="mx-auto flex min-h-[70vh] max-w-[1300px] items-center justify-center px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={elegantSpring}
                        className="site-card w-full max-w-2xl p-10 text-center"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mx-auto h-12 w-12 border-2 border-[#121212] border-t-transparent"
                        />
                        <p className="site-eyebrow mt-6">{t('quiz.loading.eyebrow')}</p>
                        <h2 className="mt-4 text-3xl font-normal text-[#121212]">
                            {t('quiz.loading.title')}
                        </h2>
                        <p className="mt-4 text-base leading-8 text-[#4d4d4d]">
                            {t('quiz.loading.desc')}
                        </p>
                    </motion.div>
                </div>
                <StoreFooter />
            </div>
        );
    }

    const step = quizSteps[currentStep];
    const isLastStep = currentStep === totalSteps - 1;
    const isNotesStep = step.name === 'favoriteNotes' || step.name === 'avoidedNotes';

    return (
        <div className="min-h-screen bg-white text-[#121212]">
            <StoreHeader active="quiz" />

            <main className="px-4 py-10">
                <div className="mx-auto max-w-[1300px]">

                    <div className="mt-8">
                        <div className="space-y-6">
                            <QuizProgress
                                current={currentStep + 1}
                                total={totalSteps}
                            />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    className={isNotesStep ? '' : 'site-card p-6 md:p-8'}
                                >
                                    <QuizQuestion
                                        step={step}
                                        value={answers[step.name]}
                                        onChange={(value) => setAnswer(step.name, value)}
                                        otherAnswers={{
                                            favoriteNotes: answers.favoriteNotes,
                                            avoidedNotes: answers.avoidedNotes,
                                        }}
                                    />
                                </motion.div>
                            </AnimatePresence>

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
            </main>

            <StoreFooter />
        </div>
    );
}
