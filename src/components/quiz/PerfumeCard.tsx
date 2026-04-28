'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Perfume } from '@/types';
import MatchReasons from './MatchReasons';
import { useI18n } from '@/lib/i18n/context';

interface PerfumeCardProps {
    perfume: Perfume;
    matchScore: number;
    matchReasons: string[];
    rank: number;
}

export default function PerfumeCard({ perfume, matchScore, matchReasons, rank }: PerfumeCardProps) {
    const { t } = useI18n();

    const getBadge = () => {
        switch (rank) {
            case 1: return { label: t('perfume.rank1'), color: 'bg-[#6A1B9A] text-white' };
            case 2: return { label: t('perfume.rank2'), color: 'bg-[#1a1a1a] text-white' };
            case 3: return { label: t('perfume.rank3'), color: 'bg-[#666666] text-white' };
            default: return null;
        }
    };

    const badge = getBadge();

    // Get gender badge color
    const getGenderBadge = () => {
        switch (perfume.gender) {
            case 'female': return { label: t('home.gender.women'), color: 'bg-[#6A1B9A]' };
            case 'male': return { label: t('home.gender.men'), color: 'bg-[#1a1a1a]' };
            default: return { label: t('home.gender.unisex'), color: 'bg-[#666666]' };
        }
    };

    const genderBadge = getGenderBadge();

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white overflow-hidden h-full flex flex-col hover:shadow-lg transition-all"
        >
            {/* Image Container */}
            <div className="relative">
                {/* Gender Badge */}
                <span className={`absolute top-3 left-3 z-10 text-xs font-medium px-2 py-1 text-white ${genderBadge.color}`}>
                    {genderBadge.label}
                </span>

                {/* Wishlist Button */}
                <button
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#f5f5f5] transition"
                    aria-label="Add to wishlist"
                >
                    <svg className="w-4 h-4 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {/* Product Image */}
                <div className="h-56 bg-[#f5f5f5] relative overflow-hidden">
                    <Image
                        src={perfume.imageUrl}
                        alt={perfume.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                {/* Match Score Badge */}
                <div className="absolute bottom-3 right-3 bg-[#6A1B9A] text-white text-xs font-semibold px-3 py-1.5">
                    {matchScore}% {t('perfume.match')}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Rank Badge */}
                {badge && (
                    <span className={`inline-block w-fit text-xs font-medium px-2 py-1 mb-2 ${badge.color}`}>
                        {badge.label}
                    </span>
                )}

                {/* Name */}
                <h3 className="text-base font-medium text-[#1a1a1a]">{perfume.name}</h3>

                {/* Price */}
                <p className="text-sm text-[#4a4a4a] mt-1">
                    {t('perfume.from')} {perfume.price} {perfume.currency}
                </p>

                {/* Star Rating */}
                <div className="flex gap-0.5 my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-3 h-3 ${star <= 4 ? 'text-[#1a1a1a]' : 'text-[#e0e0e0]'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>

                {/* Inspired By */}
                {perfume.inspiredBy && perfume.inspiredBy !== 'nspired beauty' && (
                    <div className="mb-3">
                        <p className="text-xs text-[#888888]">{t('perfume.inspiredBy')}</p>
                        <p className="text-xs text-[#C9A84C]">{perfume.inspiredBy}</p>
                    </div>
                )}

                {/* Match Reasons */}
                <div className="mt-auto flex-1">
                    <MatchReasons reasons={matchReasons} />
                </div>

                {/* Notes Preview */}
                <div className="mt-4 pt-4 border-t border-[#e0e0e0]">
                    <p className="text-xs text-[#888888] uppercase tracking-wider mb-1">{t('perfume.keyNotes')}</p>
                    <p className="text-sm text-[#4a4a4a]">
                        {[...perfume.notes.top, ...perfume.notes.middle].slice(0, 4).join(' · ')}
                    </p>
                </div>

                {/* CTA */}
                <a
                    href={perfume.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 bg-[#6A1B9A] text-white text-center py-3 text-sm uppercase tracking-wider font-medium hover:bg-[#4A148C] transition"
                >
                    {t('perfume.buyNow')}
                </a>
            </div>
        </motion.div>
    );
}
