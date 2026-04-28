'use client';

import { useI18n } from '@/lib/i18n/context';

export default function StoreFooter() {
    const { t } = useI18n();
    return (
        <footer className="border-t border-[#e0e0e0] py-8 text-center bg-white">
            <p className="text-[#888888] text-sm">
                {t('home.footer.text')}{' '}
                <a
                    href="https://lailfragrances.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6A1B9A] hover:underline"
                >
                    {t('home.footer.brand')}
                </a>
            </p>
        </footer>
    );
}
