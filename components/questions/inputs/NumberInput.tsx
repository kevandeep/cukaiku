'use client';

import { forwardRef } from 'react';

interface NumberInputProps {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, onKeyDown }, ref) => {
    const current = parseInt(value) || 0;

    return (
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(String(Math.max(0, current - 1)))}
          className="w-11 h-11 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 text-2xl hover:border-slate-600 transition-colors flex items-center justify-center"
        >
          −
        </button>
        <input
          ref={ref}
          type="number"
          min="0"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-20 text-center text-2xl font-mono py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 outline-none focus:border-cyan-400 transition-colors"
        />
        <button
          type="button"
          onClick={() => onChange(String(current + 1))}
          className="w-11 h-11 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 text-2xl hover:border-slate-600 transition-colors flex items-center justify-center"
        >
          +
        </button>
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
