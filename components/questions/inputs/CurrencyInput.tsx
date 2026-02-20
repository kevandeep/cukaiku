'use client';

import { forwardRef } from 'react';

interface CurrencyInputProps {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  max?: number;
}

const inputClass = 'w-full py-3.5 pr-4 pl-12 text-xl font-mono bg-slate-900 border border-slate-700 rounded-xl text-slate-100 outline-none transition-colors focus:border-cyan-400';

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, onKeyDown, max }, ref) => (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">RM</span>
      <input
        ref={ref}
        type="number"
        min="0"
        max={max}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="0"
        className={inputClass}
      />
      {max && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-xs font-mono">
          max RM {max.toLocaleString()}
        </span>
      )}
    </div>
  )
);

CurrencyInput.displayName = 'CurrencyInput';
