'use client';

import { useTranslation, type Locale } from '@/contexts/TranslationContext';

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ms', label: 'BM' },
  { code: 'zh', label: '中' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex gap-1">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-all ${
            locale === code
              ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
              : 'border-slate-300 dark:border-slate-700 text-slate-500 hover:border-slate-400 dark:hover:border-slate-600 hover:text-slate-600 dark:hover:text-slate-400'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
