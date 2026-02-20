'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import enMessages from '@/i18n/en.json';
import msMessages from '@/i18n/ms.json';
import zhMessages from '@/i18n/zh.json';

export type Locale = 'en' | 'ms' | 'zh';
type Messages = typeof enMessages;

const messages: Record<Locale, Messages> = {
  en: enMessages,
  ms: msMessages as Messages,
  zh: zhMessages as Messages,
};

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Messages) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key as string,
});

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  const t = useCallback(
    (key: keyof Messages): string => messages[locale][key] ?? (key as string),
    [locale]
  );

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  return useContext(TranslationContext);
}
