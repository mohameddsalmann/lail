'use client';

import Link from 'next/link';
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

function getOptionLabel(stepName: string, optionId: string | null) {
    if (!optionId) return null;
    return quizSteps
        .find((step) => step.name === stepName)
        ?.options.find((option) => option.id === optionId)
        ?.label ?? null;
}

const elegantSpring = { type: "spring" as const, stiffness: 350, damping: 28 };

export default function QuizContainer() {
    const { t, locale } = useI18n();
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
    const summaryItems = [
        answers.gender ? getOptionLabel('gender', answers.gender) : null,
        answers.favoriteNotes.length > 0 ? `${answers.favoriteNotes.length} ${t('quiz.summary.favoriteNotes')}` : null,
        answers.avoidedNotes.length > 0 ? `${answers.avoidedNotes.length} ${t('quiz.summary.avoidedNotes')}` : null,
        answers.season ? getOptionLabel('season', answers.season) : null,
        answers.intensity ? getOptionLabel('intensity', answers.intensity) : null,
    ].filter(Boolean) as string[];

    return (
        <div className="min-h-screen bg-white text-[#121212]">
            <StoreHeader active="quiz" />

            <main className="px-4 py-10">
                <div className="mx-auto max-w-[1300px]">
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={elegantSpring}
                        className="relative border-b border-[#121212] pb-10"
                    >
                        {/* Storefront-style rule */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute bottom-0 left-0 h-[2px] w-24 bg-[#121212]"
                        />

                        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                            <div>
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ ...elegantSpring, delay: 0 }}
                                    className="site-eyebrow"
                                >
                                    Lail Scent Finder
                                </motion.p>
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ ...elegantSpring, delay: 0.05 }}
                                    className="mt-4 max-w-4xl text-4xl font-normal leading-tight sm:text-5xl lg:text-6xl"
                                >
                                    {t('quiz.header.title')}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ ...elegantSpring, delay: 0.1 }}
                                    className="mt-5 max-w-2xl text-base leading-8 text-[#4d4d4d]"
                                >
                                    {t('quiz.header.desc')}
                                </motion.p>

                                {summaryItems.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="mt-8 flex flex-wrap gap-2"
                                    >
                                        {summaryItems.map((item, index) => (
                                            <motion.span
                                                key={item}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2 + index * 0.05 }}
                                                className="site-chip"
                                            >
                                                {item}
                                            </motion.span>
                                        ))}
                                    </motion.div>
                                )}
                            </div>

                            <div className="grid gap-px border border-[#121212] bg-[#121212] sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                                {[
                                    { eyebrow: t('quiz.stat.chapters'), value: totalSteps, desc: t('quiz.stat.chapters.desc') },
                                    { eyebrow: t('quiz.stat.focus'), value: t('quiz.stat.focus.value'), desc: t('quiz.stat.focus.desc') },
                                    { eyebrow: t('quiz.stat.output'), value: t('quiz.stat.output.value'), desc: t('quiz.stat.output.desc') }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={stat.eyebrow}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ ...elegantSpring, delay: 0.15 + index * 0.1 }}
                                        className="bg-white p-5"
                                    >
                                        <p className="site-eyebrow">{stat.eyebrow}</p>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="mt-3 text-3xl text-[#121212]"
                                        >
                                            {stat.value}
                                        </motion.p>
                                        <p className="mt-2 text-sm text-[#4d4d4d]">{stat.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
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

                        <aside className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ ...elegantSpring, delay: 0.2 }}
                                className="site-card p-6"
                            >
                                <p className="site-eyebrow">{t('quiz.brief.title')}</p>
                                <div className="mt-5 divide-y divide-[#dcdcdc] border-y border-[#dcdcdc]">
                                    {quizSteps.map((item, index) => {
                                        const isDone = index < currentStep;
                                        const isCurrent = index === currentStep;
                                        const status = isDone ? t('quiz.brief.done') : isCurrent ? t('quiz.brief.current') : t('quiz.brief.next');
                                        const label = item.name === 'favoriteNotes'
                                            ? t('quiz.brief.notesLove')
                                            : item.name === 'avoidedNotes'
                                                ? t('quiz.brief.notesAvoid')
                                                : locale === 'ar' ? item.questionAr : item.question;

                                        return (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.3 + index * 0.05 }}
                                                className="flex items-start justify-between gap-4 py-4"
                                            >
                                                <div className="flex items-start gap-3">
                                                    {isDone && (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={elegantSpring}
                                                            className="flex h-5 w-5 items-center justify-center bg-[#121212] text-white"
                                                        >
                                                            ✓
                                                        </motion.span>
                                                    )}
                                                    <div>
                                                        <p className={`text-[11px] uppercase tracking-[0.22em] ${isCurrent ? 'text-[#121212]' : 'text-[#5c5c5c]'}`}>
                                                            {status}
                                                        </p>
                                                        <p className="mt-2 text-sm leading-7 text-[#121212]">
                                                            {label}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-xs uppercase tracking-[0.22em] text-[#5c5c5c]">
                                                    {`0${index + 1}`.slice(-2)}
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ ...elegantSpring, delay: 0.3 }}
                                className="site-card p-6"
                            >
                                <p className="site-eyebrow">{t('quiz.howItWorks.title')}</p>
                                <div className="mt-5 space-y-4 text-sm leading-7 text-[#4d4d4d]">
                                    <p>{t('quiz.howItWorks.p1')}</p>
                                    <p>{t('quiz.howItWorks.p2')}</p>
                                    <p>{t('quiz.howItWorks.p3')}</p>
                                </div>

                                <div className="mt-6 border-t border-[#dcdcdc] pt-6">
                                    <Link href="/" className="site-button-secondary w-full">
                                        {t('quiz.results.empty.home')}
                                    </Link>
                                </div>
                            </motion.div>
                        </aside>
                    </div>
                </div>
            </main>

            <StoreFooter />
        </div>
    );
}
