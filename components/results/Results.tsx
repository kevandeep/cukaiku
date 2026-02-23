'use client';

import { useEffect, useRef } from 'react';
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
  const emailSent = useRef(false);

  // Send summary email once if user provided their email address
  useEffect(() => {
    const email = answers['email'];
    if (!email || !email.includes('@') || emailSent.current) return;
    emailSent.current = true;

    fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to:             email,
        formType:       r.formType,
        totalIncome:    r.totalIncome,
        totalRelief:    r.totalRelief,
        finalTax:       r.finalTax,
        chargeableIncome: r.chargeableIncome,
        pcb:            r.pcb,
        balanceDue:     r.balanceDue,
        taxSaved:       r.taxSaved,
      }),
    }).catch(() => { /* fail silently */ });
  }, [answers, r]);


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
