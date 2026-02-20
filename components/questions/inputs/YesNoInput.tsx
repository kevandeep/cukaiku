'use client';

import { useTranslation } from '@/contexts/TranslationContext';

interface YesNoInputProps {
  value: string;
  onSelect: (v: string) => void;
}

export function YesNoInput({ value, onSelect }: YesNoInputProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3">
      {(['yes', 'no'] as const).map(opt => {
        const isYes = opt === 'yes';
        const isSelected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`flex-1 py-3.5 text-sm font-medium rounded-xl border transition-all ${
              isSelected
                ? isYes
                  ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                  : 'border-red-400 bg-red-400/10 text-red-400'
                : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600'
            }`}
          >
            {isYes ? t('yes') : t('no')}
          </button>
        );
      })}
    </div>
  );
}
