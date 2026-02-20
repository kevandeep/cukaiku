'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import { formatRM } from '@/engine/taxCalculator';
import type { ComputeResult } from '@/data/types';

export function ResultsSummary({ r }: { r: ComputeResult }) {
  const { t } = useTranslation();

  const stats = [
    { label: t('totalRelief'),   value: formatRM(r.totalRelief),    color: 'text-violet-400' },
    { label: t('taxSaved'),      value: formatRM(r.taxSaved),       color: 'text-emerald-400' },
    {
      label: t('effectiveRate'),
      value: r.totalIncome > 0 ? `${((r.finalTax / r.totalIncome) * 100).toFixed(1)}%` : '0%',
      color: 'text-amber-400',
    },
    { label: t('reliefsClaimed'), value: String(r.reliefs.length),  color: 'text-slate-100' },
  ];

  return (
    <>
      {/* Hero */}
      <div className="text-center px-5 py-9 mb-7 rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.06] to-violet-400/[0.06]">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{t('estimatedTax')}</p>
        <div className="text-5xl font-bold font-mono text-cyan-400 mb-2">{formatRM(r.finalTax)}</div>
        <p className="text-sm text-slate-400">{t('chargeableIncome')}: {formatRM(r.chargeableIncome)}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-7">
        {stats.map(s => (
          <div key={s.label} className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
