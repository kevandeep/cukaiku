'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import { formatRM } from '@/engine/taxCalculator';
import { useTheme } from '@/contexts/ThemeContext';
import type { ComputeResult } from '@/data/types';

const SECTIONS = [
  { key: 'B', titleKey: 'sectionB', color: '#3b82f6' },
  { key: 'C', titleKey: 'sectionC', color: '#8b5cf6' },
  { key: 'D', titleKey: 'sectionD', color: '#22d3ee' },
  { key: 'E', titleKey: 'sectionE', color: '#fbbf24' },
  { key: 'F', titleKey: 'sectionF', color: '#34d399' },
] as const;

export function FormBETemplate({ r }: { r: ComputeResult }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="mb-8">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">{t('formTitle')}</h3>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed">{t('formSubtitle')}</p>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Form header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-100 to-white dark:from-slate-800/50 dark:to-slate-900">
          <div>
            <div className="text-[9px] font-mono text-slate-400 dark:text-slate-600 tracking-widest uppercase mb-1">
              Lembaga Hasil Dalam Negeri Malaysia
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">FORM BE 2025</div>
            <div className="text-xs text-slate-500">Resident Individual — Employment Income</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-mono text-slate-400 dark:text-slate-600 uppercase">Year of Assessment</div>
            <div className="text-2xl font-bold font-mono text-cyan-400">2025</div>
          </div>
        </div>

        {/* Section A — static */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-sm bg-slate-300 dark:bg-slate-600 inline-block" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('sectionA')}</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-600">{t('sectionANote')}</p>
        </div>

        {/* Dynamic sections */}
        {SECTIONS.map(sec => {
          const fields = r.formFields.filter(f => f.section === sec.key);
          if (fields.length === 0) return null;

          return (
            <div key={sec.key} className="border-b border-slate-200 dark:border-slate-800 last:border-0">
              <div className="px-5 py-2.5 bg-black/[0.01] dark:bg-white/[0.01]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-sm inline-block" style={{ background: sec.color }} />
                  <span className="text-xs font-bold" style={{ color: sec.color }}>{t(sec.titleKey)}</span>
                </div>
              </div>

              {fields.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-5 py-2 border-t border-slate-200/50 dark:border-slate-800/50"
                  style={{
                    background: f.highlight && f.value > 0 ? `${sec.color}08` : 'transparent',
                    borderLeft: f.highlight && f.value > 0 ? `3px solid ${sec.color}` : '3px solid transparent',
                  }}
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600 mr-2">{f.ref}</span>
                    <span className={`text-xs ${f.bold ? 'text-slate-900 dark:text-slate-100 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                      {f.label}
                    </span>
                  </div>
                  <div
                    className={`text-right font-mono px-2 py-1 rounded text-xs ${f.bold ? 'text-sm font-bold' : ''}`}
                    style={{
                      color: f.value > 0
                        ? (f.bold ? sec.color : (isDark ? '#e2e8f0' : '#1e293b'))
                        : (isDark ? '#334155' : '#94a3b8'),
                      background: f.highlight && f.value > 0 ? `${sec.color}15` : 'transparent',
                    }}
                  >
                    {formatRM(f.value)}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {/* PCB note */}
        <div className="px-5 py-3 bg-amber-400/[0.03]">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            💡 <strong className="text-amber-400">Monthly Tax Deduction (PCB):</strong>{' '}
            {t('pcbNote')}
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-600 text-center mt-3 leading-relaxed">{t('formBENote')}</p>
    </div>
  );
}
