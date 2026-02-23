'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/TranslationContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from '@/components/ui/Logo';

const FEATURES = [
  { icon: '💬', key: 'feature1' as const },
  { icon: '📋', key: 'feature2' as const },
  { icon: '✅', key: 'feature3' as const },
];

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center px-4 py-4">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none -z-0">
        <div className="absolute -top-1/5 -right-1/10 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-1/5 -left-1/10 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-[560px]">
        {/* Top bar */}
        <div className="flex justify-between items-center pt-3 mb-12">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Hero */}
        <div className="animate-fadeInSlow">
          {/* Flag */}
          <div className="text-5xl mb-5 animate-float text-center">🇲🇾</div>

          {/* Year badge */}
          <div className="text-center mb-5">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 tracking-widest uppercase border border-slate-300 dark:border-slate-700 px-2.5 py-1 rounded-full">
              {t('headerBadge')}
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 leading-tight text-center">
            {t('heroHeadline')}
          </h1>

          {/* Form BE sub-headline — the key differentiator */}
          <p className="text-base text-slate-500 dark:text-slate-400 mb-9 text-center leading-relaxed max-w-md mx-auto">
            {t('heroSubheadline')}
          </p>

          {/* 3 feature bullets */}
          <div className="mb-9 flex flex-col gap-2.5">
            {FEATURES.map(f => (
              <div
                key={f.key}
                className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800"
              >
                <span className="text-xl flex-shrink-0">{f.icon}</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">{t(f.key)}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/calculator"
              className="inline-block px-12 py-3.5 text-base font-semibold text-slate-900 rounded-xl cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.99]"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #a78bfa)', boxShadow: '0 4px 24px rgba(34,211,238,0.18)' }}
            >
              {t('startBtn')}
            </Link>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-700 mt-3">{t('startNote')}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-14 pb-5">
          <p className="text-[9px] font-mono text-slate-300 dark:text-slate-800">{t('footer')}</p>
        </div>
      </div>
    </main>
  );
}
