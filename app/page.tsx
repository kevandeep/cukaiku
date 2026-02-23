'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/TranslationContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center px-4 py-4">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none -z-0">
        <div className="absolute -top-1/5 -right-1/10 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.03) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-1/5 -left-1/10 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.03) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-[540px]">
        {/* Top bar */}
        <div className="flex justify-between items-center pt-3 mb-2">
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 tracking-widest uppercase">
            {t('headerBadge')}
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Hero */}
        <div className="text-center pt-14 animate-fadeInSlow">
          <div className="text-5xl mb-5 animate-float">🇲🇾</div>

          <h1 className="text-[2.1rem] font-extrabold text-slate-900 dark:text-slate-100 mb-2.5" style={{ fontFamily: 'Georgia, serif' }}>
            {t('appName')}
          </h1>

          <p className="text-base text-slate-500 dark:text-slate-400 mb-2">{t('tagline')}</p>

          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-10">
            {t('subtitle')}
          </p>

          <Link
            href="/calculator"
            className="inline-block px-11 py-3.5 text-sm font-semibold text-slate-900 rounded-xl cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.99]"
            style={{ background: 'linear-gradient(135deg, #22d3ee, #a78bfa)', boxShadow: '0 4px 24px rgba(34,211,238,0.15)' }}
          >
            {t('startBtn')}
          </Link>

          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-700 mt-4">{t('startNote')}</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-5">
          <p className="text-[9px] font-mono text-slate-300 dark:text-slate-800">{t('footer')}</p>
        </div>
      </div>
    </main>
  );
}
