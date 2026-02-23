'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import { formatRM } from '@/engine/taxCalculator';
import type { ComputeResult } from '@/data/types';

export function MissedOpportunities({ r }: { r: ComputeResult }) {
  const { t } = useTranslation();

  if (r.missed.length === 0) return null;

  const total = r.missed.reduce((s, m) => s + m.potential, 0);

  return (
    <div className="mb-7">
      <h3 className="text-sm font-semibold text-amber-400 mb-1">{t('missedTitle')}</h3>
      <p className="text-xs text-slate-500 mb-3">{t('missedSubtitle')}: {formatRM(total)}</p>
      <div className="flex flex-col gap-2">
        {r.missed.map(m => (
          <div key={m.name} className="rounded-xl px-3.5 py-3 border border-amber-400/12 bg-amber-400/[0.03]">
            <div className="flex justify-between mb-1.5">
              <span className="text-sm font-semibold text-amber-400">{m.name}</span>
              <span className="text-xs font-mono text-amber-400">up to {formatRM(m.potential)}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{m.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
