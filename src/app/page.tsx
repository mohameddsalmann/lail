'use client';

import Link from 'next/link';
import Image from 'next/image';
import { perfumes } from '@/data/perfumes';
import { useI18n } from '@/lib/i18n/context';
import LangToggle from '@/components/icons/LangToggle';

export default function Home() {
  const { t } = useI18n();

  // Get 8 popular perfumes (mix of genders)
  const popularPerfumes = perfumes
    .filter(p => p.inspiredBy && p.inspiredBy !== 'nspired beauty')
    .slice(0, 8);

  const genderLabel = (g: string) =>
    g === 'female' ? t('home.gender.women') : g === 'male' ? t('home.gender.men') : t('home.gender.unisex');

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#e0e0e0]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold tracking-widest text-[#1a1a1a] font-serif">
            LAIL
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#4a4a4a]">
            <Link href="/" className="hover:text-[#6A1B9A] transition">{t('nav.home')}</Link>
            <Link href="/quiz" className="hover:text-[#6A1B9A] transition">{t('nav.quiz')}</Link>
            <a
              href="https://lailfragrances.com/collections/all"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#6A1B9A] transition"
            >
              {t('nav.shop')}
            </a>
            <LangToggle />
          </nav>
          <div className="md:hidden flex items-center gap-4">
            <LangToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-[#1a1a1a] overflow-hidden">
        {/* Purple gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6A1B9A]/90 via-[#4A148C]/80 to-[#1a1a1a]" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-[2px] bg-[#C9A84C] mx-auto mb-6" />
            <p className="text-[#C9A84C] text-sm uppercase tracking-[0.3em] mb-4 font-medium">
              {t('home.hero.eyebrow')}
            </p>
            <h2 className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight font-serif">
              {t('home.hero.title1')}<br />
              <span className="font-semibold italic">{t('home.hero.title2')}</span>
            </h2>
            <p className="text-white/70 mb-10 text-lg max-w-md mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <Link
              href="/quiz"
              className="inline-block bg-[#6A1B9A] text-white px-10 py-4 text-sm uppercase tracking-wider font-medium hover:bg-[#9C27B0] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(106,27,154,0.4)]"
            >
              {t('home.hero.cta')}
            </Link>
            <p className="text-white/40 text-sm mt-4">
              {t('home.hero.subtext')}
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#6A1B9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-[#1a1a1a] mb-2 font-serif">{t('home.features.personalized')}</h3>
            <p className="text-sm text-[#4a4a4a]">
              {t('home.features.personalized.desc')}
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#6A1B9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-[#1a1a1a] mb-2 font-serif">{t('home.features.luxury')}</h3>
            <p className="text-sm text-[#4a4a4a]">
              {t('home.features.luxury.desc')}
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#6A1B9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="font-medium text-[#1a1a1a] mb-2 font-serif">{t('home.features.curated')}</h3>
            <p className="text-sm text-[#4a4a4a]">
              {t('home.features.curated.desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Premium Divider */}
      <div className="container mx-auto px-4">
        <div className="premium-divider max-w-xs mx-auto" />
      </div>

      {/* Popular Perfumes */}
      <div className="bg-[#f5f5f5] py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-2xl font-light text-[#1a1a1a] mb-2 font-serif">{t('home.popular.title')}</h3>
          <p className="text-center text-[#4a4a4a] text-sm mb-10">{t('home.popular.subtitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {popularPerfumes.map((perfume) => (
              <a
                key={perfume.id}
                href={perfume.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white group cursor-pointer hover:shadow-[0_4px_16px_rgba(106,27,154,0.12)] transition-all duration-300"
              >
                {/* Gender Badge */}
                <div className="relative">
                  <span className={`absolute top-3 left-3 z-10 text-xs font-medium px-2 py-1 text-white ${perfume.gender === 'female' ? 'bg-[#6A1B9A]' :
                    perfume.gender === 'male' ? 'bg-[#1a1a1a]' : 'bg-[#666666]'
                    }`}>
                    {genderLabel(perfume.gender)}
                  </span>
                  {/* Product Image */}
                  <div className="aspect-square bg-[#f5f5f5] relative overflow-hidden">
                    <Image
                      src={perfume.imageUrl}
                      alt={perfume.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
                {/* Product Info */}
                <div className="p-4">
                  <h4 className="font-medium text-[#1a1a1a] text-sm mb-1">{perfume.name}</h4>
                  <p className="text-sm text-[#4a4a4a] mb-1">{t('home.popular.from')} {perfume.price} {perfume.currency}</p>
                  {/* Star Rating */}
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className={`w-3 h-3 ${star <= 4 ? 'text-[#1a1a1a]' : 'text-[#e0e0e0]'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {perfume.inspiredBy && perfume.inspiredBy !== 'nspired beauty' && (
                    <>
                      <p className="text-xs text-[#888888]">{t('home.popular.inspiredBy')}</p>
                      <p className="text-xs text-[#C9A84C]">{perfume.inspiredBy}</p>
                    </>
                  )}
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="https://lailfragrances.com/collections/all"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-[#6A1B9A] text-[#6A1B9A] px-8 py-3 text-sm uppercase tracking-wider font-medium hover:bg-[#6A1B9A] hover:text-white transition-all duration-300"
            >
              {t('home.popular.viewAll')}
            </a>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-16 text-center bg-white">
        <div className="w-16 h-[2px] bg-[#C9A84C] mx-auto mb-6" />
        <p className="text-[#4a4a4a] mb-6 font-serif text-lg">{t('home.footer.cta')}</p>
        <Link
          href="/quiz"
          className="inline-block bg-gradient-to-r from-[#6A1B9A] to-[#4A148C] text-white px-8 py-3 text-sm uppercase tracking-wider font-medium hover:shadow-[0_4px_20px_rgba(106,27,154,0.3)] transition-all duration-300"
        >
          {t('home.footer.cta.button')}
        </Link>
      </div>

      {/* Footer */}
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
    </main>
  );
}
