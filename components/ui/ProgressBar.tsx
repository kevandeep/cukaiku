'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import enMessages from '@/i18n/en.json';

type MessageKey = keyof typeof enMessages;

interface ProgressBarProps {
  current: number;
  total: number;
  sectionKey: string;
}

export function ProgressBar({ current, total, sectionKey }: ProgressBarProps) {
  const { t } = useTranslation();
  const pct = Math.round((current / total) * 100);

  return (
    <div className="mb-7">
      <div className="flex justify-between mb-1.5 text-xs">
        <span className="text-slate-500 tracking-wide">{t(sectionKey as MessageKey)}</span>
        <span className="text-slate-600 font-mono">{current}/{total}</span>
      </div>
      <div className="h-[3px] bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #22d3ee, #a78bfa)' }}
        />
      </div>
    </div>
  );
}
