'use client';

import ConciergeChat from '@/components/concierge/ConciergeChat';
import { useI18n } from '@/lib/i18n/context';
import LangToggle from '@/components/icons/LangToggle';

export default function ConciergePage() {
    const { t } = useI18n();

    return (
        <main className="min-h-screen bg-[#FBF8F3]">
            <header className="border-b border-[#E8E0D4] bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-6">
                    <a
                        href="https://cozyfragrances.shop"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold tracking-wide text-[#2C1810]"
                    >
                        {t('concierge.greeting.brand')}
                    </a>
                    <div className="flex items-center gap-3">
                        <LangToggle />
                        <a
                            href="https://cozyfragrances.shop"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-[#E8E0D4] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2C1810] transition-colors hover:border-[#C4A265] hover:bg-[#C4A265]/5"
                        >
                            {t('nav.shop')}
                        </a>
                    </div>
                </div>
            </header>

            <ConciergeChat />
        </main>
    );
}
