'use client';

import type { SelectOption } from '@/data/types';

interface SelectInputProps {
  options: SelectOption[];
  value: string;
  onSelect: (v: string) => void;
}

export function SelectInput({ options, value, onSelect }: SelectInputProps) {
  return (
    <div className="flex flex-col gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt.value)}
          className={`px-4 py-3.5 text-sm text-left rounded-xl border transition-all ${
            value === opt.value
              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
