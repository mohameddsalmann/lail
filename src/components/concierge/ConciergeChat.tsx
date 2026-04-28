'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConciergeBubble from './ConciergeBubble';
import ConciergeChoices from './ConciergeChoices';
import RecommendationCard from './RecommendationCard';
import TypingIndicator from './TypingIndicator';
import { useI18n } from '@/lib/i18n/context';

type Step = 'greeting' | 'filter' | 'typing' | 'results';

interface Recommendation {
    name: string;
    inspiredBy: string;
    vibe: string;
    bestFor: string;
    whySpecial: string;
    shopUrl: string;
    image: string;
    topNote: string;
}

const SHOP = 'https://cozyfragrances.shop';

const catalog: Record<string, Recommendation> = {
    'sweet-honey': {
        name: 'Sweet Honey',
        inspiredBy: 'Bianco Latte',
        vibe: 'Wraps around you like a warm vanilla blanket on a cold night.',
        bestFor: 'Evening wear, cozy dates, all seasons',
        whySpecial: 'The caramel-honey heart gives maximum warmth with zero heaviness.',
        shopUrl: SHOP,
        image: '/images/naughty-honey.jpg',
        topNote: 'Vanilla + Caramel',
    },
    'florenza': {
        name: 'Florenza',
        inspiredBy: 'Delina Exclusif',
        vibe: 'A rose garden at golden hour with a soft vanilla finish.',
        bestFor: 'Special occasions, year-round elegance',
        whySpecial: 'Turkish rose meets litchi — feminine, unique, unforgettable.',
        shopUrl: SHOP,
        image: '/images/floral-fantasy.jpg',
        topNote: 'Turkish Rose + Litchi',
    },
    'creme-de-nuit': {
        name: 'Crème de Nuit',
        inspiredBy: 'Yum Boujee Marshmallow',
        vibe: 'Like biting into a strawberry macaron at a Parisian café.',
        bestFor: 'Night out, sweet comfort, cozy evenings',
        whySpecial: 'Marshmallow + whipped cream — dessert-level indulgence you can wear.',
        shopUrl: SHOP,
        image: '/images/vanilla-lust-100ml.jpg',
        topNote: 'Marshmallow + Strawberry',
    },
    'ranoula': {
        name: 'Ranoula',
        inspiredBy: 'Goddess',
        vibe: 'Deep vanilla warmth with a lavender twist — sophistication in a bottle.',
        bestFor: 'Evening, cooler weather, statement scent',
        whySpecial: 'Vanilla absolute is the richest vanilla note in perfumery — this is peak cozy.',
        shopUrl: SHOP,
        image: '/images/gold-bar.jpg',
        topNote: 'Vanilla Absolute',
    },
    'blue-night': {
        name: 'Blue Night',
        inspiredBy: 'Y Eau de Parfum',
        vibe: 'Crisp, confident, turns heads from across the room.',
        bestFor: 'Night out, year-round versatility',
        whySpecial: 'The apple-sage opening cuts through any crowd — bold without trying.',
        shopUrl: SHOP,
        image: '/images/indigo-drop.jpg',
        topNote: 'Apple + Sage',
    },
    'denaro': {
        name: 'Denaro',
        inspiredBy: 'Hacivat',
        vibe: 'Walking into a boardroom with the scent of victory.',
        bestFor: 'Office, summer, all-day confidence',
        whySpecial: 'Oakmoss and pineapple create a magnetic, distinctive trail.',
        shopUrl: SHOP,
        image: '/images/titans-trophy.jpg',
        topNote: 'Oakmoss + Pineapple',
    },
    'tuxedo': {
        name: 'Tuxedo',
        inspiredBy: 'Apple Brandy on the Rocks',
        vibe: 'Smooth as a fireside whiskey — effortlessly sophisticated.',
        bestFor: 'Evenings, dates, cooler seasons',
        whySpecial: 'Apple meets rum and brandy — warm, boozy, impossible to ignore.',
        shopUrl: SHOP,
        image: '/images/gatsbys-spice.jpg',
        topNote: 'Apple + Brandy',
    },
    'woody-coconut': {
        name: 'Woody Coconut',
        inspiredBy: 'Le Beau Le Parfum',
        vibe: 'Sun-kissed skin after a day on a tropical island.',
        bestFor: 'Summer, beach, daytime confidence',
        whySpecial: 'Coconut + tonka bean — the ultimate summer scent with serious presence.',
        shopUrl: SHOP,
        image: '/images/macho-muse.jpg',
        topNote: 'Coconut + Pineapple',
    },
    'maldives': {
        name: 'Maldives',
        inspiredBy: 'Le Beau Paradise Garden',
        vibe: 'A fresh coconut breeze in a lush green paradise.',
        bestFor: 'Summer mornings, vacation energy',
        whySpecial: 'Green fig and coconut — smells like paradise feels.',
        shopUrl: SHOP,
        image: '/images/the-man.jpg',
        topNote: 'Coconut + Fig',
    },
    'tropica': {
        name: 'Tropica',
        inspiredBy: 'Erba Pura',
        vibe: 'Biting into a fresh tropical fruit basket on a sunny terrace.',
        bestFor: 'Spring and summer, daytime energy',
        whySpecial: 'Fruity explosion with a vanilla-musk base that lasts all day.',
        shopUrl: SHOP,
        image: '/images/berry-pop.jpg',
        topNote: 'Tropical Fruits',
    },
    'spark': {
        name: 'Spark',
        inspiredBy: 'Thé Noir 29',
        vibe: 'A refined cup of black tea on a sunlit balcony.',
        bestFor: 'Spring, summer mornings, elegant daywear',
        whySpecial: 'Chinese black tea with bergamot — cultured, clean, endlessly wearable.',
        shopUrl: SHOP,
        image: '/images/bright-tide.jpg',
        topNote: 'Black Tea + Bergamot',
    },
    'mintos': {
        name: 'Mintos',
        inspiredBy: 'Menthe Fraîche',
        vibe: 'A burst of cool mint that wakes up every sense.',
        bestFor: 'Hot summer days, morning freshness',
        whySpecial: 'Pure mint and lemon — the freshest wake-up call in a bottle.',
        shopUrl: SHOP,
        image: '/images/bright-tide.jpg',
        topNote: 'Mint + Lemon',
    },
    'bali': {
        name: 'Bali',
        inspiredBy: 'Summer Hammer',
        vibe: 'Mango smoothie by the pool with a tropical breeze.',
        bestFor: 'Beach days, summer holidays, casual wear',
        whySpecial: 'Mango and coconut milk create pure vacation energy.',
        shopUrl: SHOP,
        image: '/images/sea-me-sometime.jpg',
        topNote: 'Mango + Coconut',
    },
    'laith': {
        name: 'Laith',
        inspiredBy: 'Tygar',
        vibe: 'Clean power — like stepping out of a luxury shower.',
        bestFor: 'Daytime, summer, sharp confidence',
        whySpecial: 'Grapefruit + ambroxan — minimal but magnetic.',
        shopUrl: SHOP,
        image: '/images/greek-icon.jpg',
        topNote: 'Grapefruit + Ambroxan',
    },
};

const recommendations: Record<string, string[]> = {
    'morning-sweet': ['tropica', 'bali', 'creme-de-nuit'],
    'morning-woody': ['denaro', 'spark', 'mintos'],
    'morning-fresh': ['maldives', 'woody-coconut', 'mintos'],
    'night-sweet': ['ranoula', 'sweet-honey', 'florenza'],
    'night-woody': ['blue-night', 'tuxedo', 'denaro'],
    'night-fresh': ['blue-night', 'laith', 'spark'],
};

const moodChoices = [
    { id: 'morning', label: 'Sunny Morning', icon: 'summer', hint: 'Light, fresh, energizing' },
    { id: 'night', label: 'Night Out', icon: 'winter', hint: 'Bold, warm, magnetic' },
];

const scentChoices = [
    { id: 'sweet', label: 'Sweet & Gourmand', icon: 'gourmand', hint: 'Vanilla, caramel, fruits' },
    { id: 'woody', label: 'Bold & Woody', icon: 'woody', hint: 'Oud, leather, wood' },
    { id: 'fresh', label: 'Fresh & Clean', icon: 'citrus', hint: 'Citrus, mint, aquatic' },
];

const moodLabels: Record<string, string> = {
    morning: 'Sunny morning',
    night: 'Night out',
};

const scentLabels: Record<string, string> = {
    sweet: 'Sweet & gourmand',
    woody: 'Bold & woody',
    fresh: 'Fresh & clean',
};

export default function ConciergeChat() {
    const { t } = useI18n();
    const [step, setStep] = useState<Step>('greeting');
    const [mood, setMood] = useState<string | null>(null);
    const [scent, setScent] = useState<string | null>(null);
    const [showChoices1, setShowChoices1] = useState(false);
    const [showChoices2, setShowChoices2] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setShowChoices1(true), 800);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [step, showChoices1, showChoices2, scrollToBottom]);

    const handleMood = (id: string) => {
        setMood(id);
        setShowChoices1(false);
        setTimeout(() => {
            setStep('filter');
            setTimeout(() => setShowChoices2(true), 600);
        }, 500);
    };

    const handleScent = (id: string) => {
        setScent(id);
        setShowChoices2(false);
        setTimeout(() => {
            setStep('typing');
            setTimeout(() => {
                setStep('results');
                setTimeout(() => {
                    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }, 1800);
        }, 500);
    };

    const handleRestart = () => {
        setStep('greeting');
        setMood(null);
        setScent(null);
        setShowChoices1(false);
        setShowChoices2(false);
        setTimeout(() => setShowChoices1(true), 600);
    };

    const key = mood && scent ? `${mood}-${scent}` : null;
    const recs = key ? (recommendations[key] || recommendations['morning-sweet']).map(k => catalog[k]) : [];

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col px-4 pb-10 pt-6 sm:px-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 text-center"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
                    className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#2C1810] text-xl text-white"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" /></svg>
                </motion.div>
                <h1 className="text-lg font-semibold text-[#2C1810]">{t('concierge.title')}</h1>
                <p className="mt-1 text-xs tracking-wide text-[#8A7E72]">{t('concierge.subtitle')}</p>
            </motion.div>

            <div className="flex flex-1 flex-col gap-5">
                {/* Greeting */}
                <ConciergeBubble from="ai" delay={0.2}>
                    {t('concierge.greeting')} <span className="font-semibold">{t('concierge.greeting.brand')}</span>
                    <br /><br />
                    {t('concierge.greeting.cont')}{' '}
                    <span className="font-medium">{t('concierge.greeting.morning')}</span> {t('concierge.greeting.or')}{' '}
                    <span className="font-medium">{t('concierge.greeting.night')}</span>?
                </ConciergeBubble>

                <AnimatePresence>
                    {showChoices1 && !mood && (
                        <motion.div
                            key="choices1"
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ConciergeChoices choices={moodChoices} onSelect={handleMood} baseDelay={0.1} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* User's first answer */}
                <AnimatePresence>
                    {mood && (
                        <ConciergeBubble from="user">
                            {moodLabels[mood]}
                        </ConciergeBubble>
                    )}
                </AnimatePresence>

                {/* Second question */}
                <AnimatePresence>
                    {step === 'filter' && (
                        <motion.div
                            key="filter-bubble"
                            exit={{ opacity: 0 }}
                        >
                            <ConciergeBubble from="ai" delay={0.2}>
                                {mood === 'morning'
                                    ? t('concierge.mood.morning.reply')
                                    : t('concierge.mood.night.reply')}
                                <br /><br />
                                {t('concierge.scent.question')}{' '}
                                <span className="font-medium">{t('concierge.scent.sweet')}</span>,{' '}
                                <span className="font-medium">{t('concierge.scent.woody')}</span>, {t('concierge.scent.or')}{' '}
                                <span className="font-medium">{t('concierge.scent.fresh')}</span>?
                            </ConciergeBubble>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showChoices2 && !scent && step === 'filter' && (
                        <motion.div
                            key="choices2"
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ConciergeChoices choices={scentChoices} onSelect={handleScent} baseDelay={0.1} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* User's second answer */}
                <AnimatePresence>
                    {scent && (
                        <ConciergeBubble from="user">
                            {scentLabels[scent]}
                        </ConciergeBubble>
                    )}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                    {step === 'typing' && <TypingIndicator />}
                </AnimatePresence>

                {/* Results */}
                <AnimatePresence>
                    {step === 'results' && (
                        <motion.div
                            key="results"
                            ref={resultsRef}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-5"
                        >
                            <ConciergeBubble from="ai">
                                {t('concierge.results.intro')}
                            </ConciergeBubble>

                            <div className="grid gap-4 sm:grid-cols-1">
                                {recs.map((rec, i) => (
                                    <RecommendationCard
                                        key={rec.name}
                                        rec={rec}
                                        index={i}
                                        featured={i === 0}
                                    />
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex flex-col items-center gap-3 pt-4"
                            >
                                <p className="text-center text-sm text-[#8A7E72]">
                                    {t('concierge.results.restart')}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleRestart}
                                    className="rounded-xl border border-[#E8E0D4] bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#2C1810] transition-colors hover:border-[#C4A265]"
                                >
                                    {t('concierge.results.startOver')}
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={bottomRef} />
            </div>
        </div>
    );
}
