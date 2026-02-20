'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import { formatRM } from '@/engine/taxCalculator';
import { computeAll } from '@/engine/reliefEngine';
import type { Answers } from '@/data/types';
import { ResultsSummary } from './ResultsSummary';
import { ReliefBreakdown } from './ReliefBreakdown';
import { MissedOpportunities } from './MissedOpportunities';
import { TaxBracketTable } from './TaxBracketTable';
import { FormBETemplate } from './FormBETemplate';

interface ResultsProps {
  answers: Answers;
  onRestart: () => void;
}

export function Results({ answers, onRestart }: ResultsProps) {
  const { t } = useTranslation();
  const r = computeAll(answers);

  return (
    <div className="animate-fadeInSlow">
      <ResultsSummary r={r} />

      {/* Rebates */}
      {r.totalRebate > 0 && (
        <div className="mb-7 rounded-xl px-4 py-3.5 border border-emerald-400/15 bg-emerald-400/[0.04]">
          <h3 className="text-sm font-semibold text-emerald-400 mb-2.5">{t('rebatesTitle')}</h3>
          {r.zakat       > 0 && <p className="text-sm text-slate-300 mb-1">🕌 Zakat / Fitrah: {formatRM(r.zakat)}</p>}
          {r.selfRebate  > 0 && <p className="text-sm text-slate-300 mb-1">👤 Self rebate: {formatRM(r.selfRebate)}</p>}
          {r.spouseRebate > 0 && <p className="text-sm text-slate-300">👫 Spouse rebate: {formatRM(r.spouseRebate)}</p>}
        </div>
      )}

      <ReliefBreakdown r={r} />
      <MissedOpportunities r={r} />
      <TaxBracketTable r={r} />
      <FormBETemplate r={r} />

      {/* Disclaimer */}
      <div className="mb-5 rounded-xl px-4 py-3.5 border border-red-400/12 bg-red-400/[0.03]">
        <p className="text-[10px] text-slate-500 leading-relaxed">{t('disclaimer')}</p>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="w-full py-3.5 text-base font-semibold text-slate-900 rounded-xl cursor-pointer transition-opacity hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #22d3ee, #a78bfa)' }}
      >
        {t('startOver')}
      </button>
    </div>
  );
}
