'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import { formatRM } from '@/engine/taxCalculator';
import { TAX_BRACKETS_2025 } from '@/data/taxBrackets';
import type { ComputeResult } from '@/data/types';

export function TaxBracketTable({ r }: { r: ComputeResult }) {
  const { t } = useTranslation();

  const rows = TAX_BRACKETS_2025.map(b => {
    const bandSize  = b.max === Infinity ? Math.max(0, r.chargeableIncome - b.min) : b.max - b.min;
    const taxable   = Math.min(Math.max(0, r.chargeableIncome - b.min), bandSize);
    const taxOnBand = taxable * (b.rate / 100);
    return { b, taxable, taxOnBand };
  }).filter(row => row.taxable > 0);

  if (rows.length === 0) return null;

  return (
    <div className="mb-7">
      <h3 className="text-sm font-semibold text-slate-100 mb-3">{t('bracketsTitle')}</h3>
      <div className="bg-slate-900 rounded-xl p-3.5 border border-slate-800">
        {rows.map(({ b, taxable, taxOnBand }, i) => (
          <div
            key={i}
            className="flex justify-between py-1.5 border-b border-slate-800 last:border-0 text-xs"
          >
            <span className="text-slate-400">
              {formatRM(b.min)} – {b.max === Infinity ? 'above' : formatRM(b.max)}
            </span>
            <span className="font-mono text-slate-500">{b.rate}%</span>
            <span className="font-mono text-cyan-400">{formatRM(taxOnBand)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
