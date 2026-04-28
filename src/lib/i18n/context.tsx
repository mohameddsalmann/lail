'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Locale = 'en' | 'ar';

interface I18nContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
    dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextValue>({
    locale: 'en',
    setLocale: () => {},
    t: (key: string) => key,
    dir: 'ltr',
});

export function useI18n() {
    return useContext(I18nContext);
}

import { en } from './en';
import { ar } from './ar';

const translations: Record<Locale, Record<string, string>> = { en, ar };

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLocale;
    }, []);

    const t = useCallback(
        (key: string): string => {
            return translations[locale]?.[key] ?? translations['en']?.[key] ?? key;
        },
        [locale]
    );

    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
            {children}
        </I18nContext.Provider>
    );
}
