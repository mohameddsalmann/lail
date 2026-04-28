'use client';

import { useI18n } from '@/lib/i18n/context';

interface MatchReasonsProps {
    reasons: string[];
}

export default function MatchReasons({ reasons }: MatchReasonsProps) {
    const { t } = useI18n();
    if (reasons.length === 0) return null;

    return (
        <div className="space-y-2">
            <p className="text-xs text-[#888888] uppercase tracking-wider">{t('perfume.whyMatches')}</p>
            {reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-[#6A1B9A] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-[#4a4a4a]">{reason}</span>
                </div>
            ))}
        </div>
    );
}
