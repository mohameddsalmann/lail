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

function getOptionLabel(stepName: string, optionId: string | null) {
    if (!optionId) return null;
    return quizSteps
        .find((step) => step.name === stepName)
        ?.options.find((option) => option.id === optionId)
        ?.label ?? null;
}

const elegantSpring = { type: "spring" as const, stiffness: 350, damping: 28 };

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

    if (isComplete && recommendations) {
        return <QuizResults recommendations={recommendations} onRetake={resetQuiz} />;
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
                        <p className="site-eyebrow mt-6">Building your edit</p>
                        <h2 className="mt-4 text-3xl font-normal text-[#121212]">
                            Matching scent, season, and intensity.
                        </h2>
                        <p className="mt-4 text-base leading-8 text-[#4d4d4d]">
                            We&apos;re ranking note overlap first, then season fit and wearability so the
                            shortlist stays useful.
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
        answers.favoriteNotes.length > 0 ? `${answers.favoriteNotes.length} favorite notes` : null,
        answers.avoidedNotes.length > 0 ? `${answers.avoidedNotes.length} notes avoided` : null,
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
                                    Build a short scent brief and get a storefront-style edit.
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ ...elegantSpring, delay: 0.1 }}
                                    className="mt-5 max-w-2xl text-base leading-8 text-[#4d4d4d]"
                                >
                                    Pick who it&apos;s for, the season you care about, the notes you love, and how much
                                    presence you want. The shortlist is scored to stay practical for summer testing,
                                    not just descriptive.
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
                                    { eyebrow: 'Chapters', value: totalSteps, desc: 'A fast brief, not a long survey.' },
                                    { eyebrow: 'Focus', value: 'Summer', desc: 'Tuned for your current testing flow.' },
                                    { eyebrow: 'Output', value: 'Shortlist', desc: 'Ranked matches with direct product links.' }
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
                                label={step.question}
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
                                <p className="site-eyebrow">Your brief</p>
                                <div className="mt-5 divide-y divide-[#dcdcdc] border-y border-[#dcdcdc]">
                                    {quizSteps.map((item, index) => {
                                        const isDone = index < currentStep;
                                        const isCurrent = index === currentStep;
                                        const status = isDone ? 'Done' : isCurrent ? 'Current' : 'Next';
                                        const label = item.name === 'favoriteNotes'
                                            ? 'Notes you love'
                                            : item.name === 'avoidedNotes'
                                                ? 'Notes to avoid'
                                                : item.question;

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
                                <p className="site-eyebrow">How it works</p>
                                <div className="mt-5 space-y-4 text-sm leading-7 text-[#4d4d4d]">
                                    <p>Note overlap carries the most weight, then season and intensity bring the ranking into shape.</p>
                                    <p>The fallback keeps narrow briefs from ending on an empty result state.</p>
                                    <p>Every result still links directly back to the real Lail storefront for manual checking.</p>
                                </div>

                                <div className="mt-6 border-t border-[#dcdcdc] pt-6">
                                    <Link href="/" className="site-button-secondary w-full">
                                        Return Home
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
