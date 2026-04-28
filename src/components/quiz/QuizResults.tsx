'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { RecommendationResult } from '@/types';
import PerfumeCard from './PerfumeCard';
import { useI18n } from '@/lib/i18n/context';

interface QuizResultsProps {
    recommendations: RecommendationResult[];
    onRetake: () => void;
    usedFallback?: boolean;
}

export default function QuizResults({ recommendations, onRetake, usedFallback }: QuizResultsProps) {
    const { t } = useI18n();

    if (recommendations.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-[#e0e0e0] p-8 text-center max-w-md"
                >
                    <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-medium text-[#1a1a1a] mb-2">{t('quiz.results.empty.title')}</h2>
                    <p className="text-[#4a4a4a] text-sm mb-6">
                        {t('quiz.results.empty.desc')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => window.open('https://lailfragrances.com/', '_blank')}
                            className="bg-[#6A1B9A] text-white px-6 py-3 text-sm uppercase tracking-wider font-medium hover:bg-[#4A148C] transition"
                        >
                            {t('quiz.results.fallback.explore')}
                        </button>
                        <button
                            onClick={onRetake}
                            className="border border-[#1a1a1a] text-[#1a1a1a] px-6 py-3 text-sm uppercase tracking-wider font-medium hover:bg-[#1a1a1a] hover:text-white transition"
                        >
                            {t('quiz.results.fallback.retake')}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            {/* Header */}
            <header className="bg-white border-b border-[#e0e0e0]">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-semibold tracking-wide text-[#1a1a1a]">
                        LAIL
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-[#4a4a4a] hover:text-[#6A1B9A] transition flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {t('nav.home')}
                    </Link>
                </div>
            </header>

            <div className="py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Results Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <p className="text-[#6A1B9A] text-sm uppercase tracking-widest mb-2 font-medium">
                            {t('quiz.results.complete')}
                        </p>
                        <h2 className="text-3xl md:text-4xl font-light text-[#1a1a1a] mb-3">
                            {t('quiz.results.title1')} <span className="font-semibold">{t('quiz.results.title2')}</span>
                        </h2>
                        <p className="text-[#4a4a4a]">
                            {t('quiz.results.subtitle')}
                        </p>
                    </motion.div>

                    {/* Fallback Banner */}
                    {usedFallback && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#FFF8E1] border border-[#F5C518] p-4 mb-8 text-center"
                        >
                            <p className="text-[#4a4a4a] text-sm mb-4">
                                {t('quiz.results.fallback.banner')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => window.open('https://lailfragrances.com/', '_blank')}
                                    className="bg-[#6A1B9A] text-white px-6 py-3 text-sm uppercase tracking-wider font-medium hover:bg-[#4A148C] transition"
                                >
                                    {t('quiz.results.fallback.explore')}
                                </button>
                                <button
                                    onClick={onRetake}
                                    className="border border-[#1a1a1a] text-[#1a1a1a] px-6 py-3 text-sm uppercase tracking-wider font-medium hover:bg-[#1a1a1a] hover:text-white transition"
                                >
                                    {t('quiz.results.fallback.retake')}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.map((result, index) => (
                            <motion.div
                                key={result.perfume.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <PerfumeCard
                                    perfume={result.perfume}
                                    matchScore={result.matchScore}
                                    matchReasons={result.matchReasons}
                                    rank={index + 1}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row justify-center gap-4 mt-12"
                    >
                        <button
                            onClick={onRetake}
                            className="px-8 py-3 border border-[#1a1a1a] text-[#1a1a1a] text-sm uppercase tracking-wider font-medium hover:bg-[#1a1a1a] hover:text-white transition"
                        >
                            {t('quiz.results.retake')}
                        </button>
                        <Link
                            href="/"
                            className="px-8 py-3 bg-[#6A1B9A] text-white text-sm uppercase tracking-wider font-medium hover:bg-[#4A148C] transition text-center"
                        >
                            {t('quiz.results.browse')}
                        </Link>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-center mt-16 pt-8 border-t border-[#e0e0e0]"
                    >
                        <p className="text-[#888888] text-sm">
                            {t('quiz.results.footer')}{' '}
                            <a
                                href="https://lailfragrances.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#6A1B9A] hover:underline"
                            >
                                {t('quiz.results.brand')}
                            </a>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
