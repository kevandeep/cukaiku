'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import { formatRM } from '@/engine/taxCalculator';
import type { ComputeResult } from '@/data/types';

export function ResultsSummary({ r }: { r: ComputeResult }) {
  const { t } = useTranslation();

  const hasPcb   = r.pcb > 0;
  const isRefund = hasPcb && r.balanceDue < 0;

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
      {/* Hero — tax payable */}
      <div className="text-center px-5 py-9 mb-4 rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.06] to-violet-400/[0.06]">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{t('estimatedTax')}</p>
        <div className="text-5xl font-bold font-mono text-cyan-400 mb-2">{formatRM(r.finalTax)}</div>
        <p className="text-sm text-slate-400">{t('chargeableIncome')}: {formatRM(r.chargeableIncome)}</p>
      </div>

      {/* PCB balance card — only shown if PCB was entered */}
      {hasPcb && (
        <div className={`text-center px-5 py-5 mb-7 rounded-2xl border ${
          isRefund
            ? 'border-emerald-400/20 bg-emerald-400/[0.06]'
            : 'border-amber-400/20 bg-amber-400/[0.06]'
        }`}>
          <p className="text-xs uppercase tracking-widest mb-1 text-slate-400">
            {isRefund ? 'Estimated LHDN Refund' : 'Balance Still Payable to LHDN'}
          </p>
          <div className={`text-4xl font-bold font-mono mb-1 ${isRefund ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isRefund ? '+' : ''}{formatRM(Math.abs(r.balanceDue))}
          </div>
          <p className="text-xs text-slate-500">
            PCB paid: {formatRM(r.pcb)} · Tax payable: {formatRM(r.finalTax)}
          </p>
        </div>
      )}

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
