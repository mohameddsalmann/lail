'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n/context';

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

interface RecommendationCardProps {
    rec: Recommendation;
    index: number;
    featured?: boolean;
}

const spring = { type: 'spring' as const, stiffness: 300, damping: 26 };

export default function RecommendationCard({ rec, index, featured = false }: RecommendationCardProps) {
    const { t } = useI18n();
    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...spring, delay: 0.15 + index * 0.15 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`
                group relative overflow-hidden rounded-2xl border bg-white transition-shadow duration-300
                hover:shadow-lg
                ${featured ? 'border-[#C4A265]' : 'border-[#E8E0D4]'}
            `}
        >
            {featured && (
                <div className="bg-[#C4A265] px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-white">
                    {t('concierge.results.topPick')}
                </div>
            )}

            <div className="relative h-48 overflow-hidden bg-[#F5EDE3] sm:h-56">
                <motion.img
                    src={rec.image}
                    alt={rec.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#2C1810] backdrop-blur-sm">
                    {rec.topNote}
                </div>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
                <div>
                    <h3 className="text-lg font-semibold text-[#2C1810]">{rec.name}</h3>
                    <p className="mt-0.5 text-xs text-[#8A7E72]">{t('concierge.inspiredBy')} {rec.inspiredBy}</p>
                </div>

                <p className="text-sm italic leading-relaxed text-[#5A4E42]">
                    &ldquo;{rec.vibe}&rdquo;
                </p>

                <div className="space-y-2 text-[13px] text-[#5A4E42]">
                    <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-[#C4A265]">◆</span>
                        <span><span className="font-medium text-[#2C1810]">{t('concierge.bestFor')}</span> {rec.bestFor}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-[#C4A265]">◆</span>
                        <span><span className="font-medium text-[#2C1810]">{t('concierge.whySpecial')}</span> {rec.whySpecial}</span>
                    </div>
                </div>

                <motion.a
                    href={rec.shopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                        relative block overflow-hidden rounded-xl py-3.5 text-center text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300
                        ${featured
                            ? 'bg-[#2C1810] text-white hover:bg-[#3D2920]'
                            : 'border border-[#2C1810] bg-white text-[#2C1810] hover:bg-[#2C1810] hover:text-white'
                        }
                    `}
                >
                    <span className="relative z-10">{t('concierge.shopNow')}</span>
                    {featured && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                        />
                    )}
                </motion.a>
            </div>
        </motion.div>
    );
}
