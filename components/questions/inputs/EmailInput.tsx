'use client';

import { forwardRef } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

interface EmailInputProps {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ value, onChange, onKeyDown }, ref) => {
    const { t } = useTranslation();
    return (
      <input
        ref={ref}
        type="email"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={t('emailPlaceholder')}
        className="w-full py-3.5 px-4 text-base bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-none focus:border-cyan-400 transition-colors"
      />
    );
  }
);

EmailInput.displayName = 'EmailInput';
