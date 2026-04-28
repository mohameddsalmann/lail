'use client';

import { useState, useCallback } from 'react';
import { QuizAnswers, RecommendationResult, RecommendationOutput } from '@/types';
import { quizSteps } from '@/config/quizSteps';
import { perfumes } from '@/data/perfumes';
import { recommendPerfumes } from '@/lib/recommendation/recommend';

const initialAnswers: QuizAnswers = {
    gender: null,
    favoriteNotes: [],
    avoidedNotes: [],
    season: null,
    intensity: null
};

function normalizeNoteIds(value: unknown) {
    if (!Array.isArray(value)) return [];
    return value.filter((id): id is string => typeof id === 'string' && id !== 'none');
}

function removeLovedNotesFromAvoided(answers: QuizAnswers): QuizAnswers {
    const favoriteIds = new Set(answers.favoriteNotes);
    return {
        ...answers,
        avoidedNotes: answers.avoidedNotes.filter((id) => !favoriteIds.has(id)),
    };
}

export function useQuiz() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<RecommendationResult[] | null>(null);
    const [usedFallback, setUsedFallback] = useState(false);

    const setAnswer = useCallback((name: keyof QuizAnswers, value: unknown) => {
        setAnswers(prev => {
            if (name === 'favoriteNotes') {
                const favoriteNotes = normalizeNoteIds(value);
                const favoriteIds = new Set(favoriteNotes);

                return {
                    ...prev,
                    favoriteNotes,
                    avoidedNotes: prev.avoidedNotes.filter((id) => !favoriteIds.has(id)),
                };
            }

            if (name === 'avoidedNotes') {
                const favoriteIds = new Set(prev.favoriteNotes);

                return {
                    ...prev,
                    avoidedNotes: normalizeNoteIds(value).filter((id) => !favoriteIds.has(id)),
                };
            }

            return { ...prev, [name]: value };
        });
    }, []);

    const nextStep = useCallback(() => {
        if (currentStep < quizSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep]);

    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const skipStep = useCallback(() => {
        nextStep();
    }, [nextStep]);

    const submitQuiz = useCallback(async () => {
        setIsLoading(true);

        // Simulate API delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        const safeAnswers = removeLovedNotesFromAvoided(answers);
        const output: RecommendationOutput = recommendPerfumes(safeAnswers, perfumes);
        setRecommendations(output.results);
        setUsedFallback(output.usedFallback);
        setIsComplete(true);
        setIsLoading(false);
    }, [answers]);

    const resetQuiz = useCallback(() => {
        setCurrentStep(0);
        setAnswers(initialAnswers);
        setIsComplete(false);
        setRecommendations(null);
        setUsedFallback(false);
    }, []);

    const canProceed = useCallback(() => {
        const step = quizSteps[currentStep];
        const answer = answers[step.name];

        if (!step.required) return true;
        if (Array.isArray(answer)) return answer.length > 0;
        return answer !== null;
    }, [currentStep, answers]);

    return {
        currentStep,
        totalSteps: quizSteps.length,
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
        canProceed: canProceed()
    };
}
