'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { CurrencyInput } from './inputs/CurrencyInput';
import { NumberInput } from './inputs/NumberInput';
import { YesNoInput } from './inputs/YesNoInput';
import { SelectInput } from './inputs/SelectInput';
import { EmailInput } from './inputs/EmailInput';
import type { Question } from '@/data/types';

interface QuestionCardProps {
  question: Question;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function QuestionCard({ question, value, onChange, onNext, onBack, isFirst, isLast }: QuestionCardProps) {
  const { t } = useTranslation();
  const [local, setLocal] = useState(value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocal(value || '');
    inputRef.current?.focus();
  }, [question.id, value]);

  const commit = () => { onChange(local); onNext(); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && local) commit();
  };

  // For yes/no and select, selection auto-advances
  const handleAutoSelect = (v: string) => {
    setLocal(v);
    onChange(v);
    setTimeout(onNext, 180);
  };

  const needsButton = ['currency', 'number', 'email'].includes(question.type);
  const canSubmit   = question.type === 'email' ? true : !!local;

  return (
    <div className="animate-fadeIn">
      <div className="text-4xl mb-3">{question.icon}</div>
      <h2 className="text-lg font-semibold text-slate-100 mb-2 leading-snug">{question.question}</h2>

      {question.tip && (
        <div className="flex gap-2 mb-5 px-3 py-2.5 rounded-lg border-l-2 border-cyan-500 bg-cyan-400/[0.03] text-xs text-slate-500 leading-relaxed">
          <span>💡</span>
          <span>{question.tip}</span>
        </div>
      )}

      <div className="mb-5">
        {question.type === 'currency' && (
          <CurrencyInput ref={inputRef} value={local} onChange={setLocal} onKeyDown={handleKeyDown} max={question.max} />
        )}
        {question.type === 'number' && (
          <NumberInput ref={inputRef} value={local} onChange={setLocal} onKeyDown={handleKeyDown} />
        )}
        {question.type === 'yesno' && (
          <YesNoInput value={local} onSelect={handleAutoSelect} />
        )}
        {question.type === 'select' && question.options && (
          <SelectInput options={question.options} value={local} onSelect={handleAutoSelect} />
        )}
        {question.type === 'email' && (
          <EmailInput ref={inputRef} value={local} onChange={setLocal} onKeyDown={handleKeyDown} />
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        {!isFirst && (
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 text-sm border border-slate-700 rounded-lg text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-all"
          >
            {t('back')}
          </button>
        )}

        {needsButton && (
          <button
            type="button"
            onClick={commit}
            disabled={!canSubmit}
            className={`ml-auto px-7 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              canSubmit
                ? 'text-slate-900 cursor-pointer'
                : 'bg-slate-800 text-slate-600 cursor-default'
            }`}
            style={canSubmit ? { background: 'linear-gradient(135deg, #22d3ee, #a78bfa)' } : undefined}
          >
            {isLast ? t('calculate') : t('next')}
          </button>
        )}
      </div>
    </div>
  );
}
