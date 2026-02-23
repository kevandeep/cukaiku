'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import { formatRM } from '@/engine/taxCalculator';
import type { ComputeResult } from '@/data/types';

export function ReliefBreakdown({ r }: { r: ComputeResult }) {
  const { t } = useTranslation();
  const sorted = [...r.reliefs].sort((a, b) => b.amount - a.amount);

  if (sorted.length === 0) return null;

  return (
    <div className="mb-7">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">{t('reliefBreakdown')}</h3>
      <div className="flex flex-col gap-1">
        {sorted.map(rl => (
          <div key={rl.ref} className="bg-white dark:bg-slate-900 rounded-lg px-3.5 py-2.5 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-1.5">
              <div>
                <span className="text-[10px] text-slate-400 dark:text-slate-600 font-mono mr-1.5">{rl.ref}</span>
                <span className="text-xs text-slate-700 dark:text-slate-300">{rl.name}</span>
              </div>
              <span className="text-sm font-semibold font-mono text-violet-400">{formatRM(rl.amount)}</span>
            </div>
            <div className="h-[2px] bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(rl.amount / r.totalRelief) * 100}%`,
                  background: 'linear-gradient(90deg, #22d3ee, #a78bfa)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
