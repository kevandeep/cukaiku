'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Logo } from '@/components/ui/Logo';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { Results } from '@/components/results/Results';
import { useCalculator } from '@/hooks/useCalculator';
import Link from 'next/link';

export default function CalculatorPage() {
  const { t } = useTranslation();
  const { screen, answers, current, qi, total, setAnswer, goNext, goBack, restart } = useCalculator();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex justify-center px-4 py-4">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none -z-0">
        <div className="absolute -top-1/5 -right-1/10 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.03) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-1/5 -left-1/10 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.03) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-[560px]">
        {/* Top bar */}
        <div className="flex justify-between items-center pt-3 mb-4">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Questions */}
        {screen === 'questions' && current && (
          <div>
            <ProgressBar current={qi + 1} total={total} sectionKey={current.section} />
            <QuestionCard
              question={current}
              value={answers[current.id] ?? ''}
              onChange={v => setAnswer(current.id, v)}
              onNext={goNext}
              onBack={goBack}
              isFirst={qi === 0}
              isLast={qi === total - 1}
            />
          </div>
        )}

        {/* Results */}
        {screen === 'results' && (
          <Results answers={answers} onRestart={restart} />
        )}

        {/* Fallback */}
        {screen !== 'questions' && screen !== 'results' && (
          <div className="text-center pt-20">
            <p className="text-slate-500 text-sm mb-4">Ready to calculate your tax?</p>
            <Link
              href="/"
              className="inline-block px-8 py-3 text-sm font-semibold text-slate-900 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #a78bfa)' }}
            >
              {t('startBtn')}
            </Link>
          </div>
        )}

        <div className="text-center mt-8 pb-5">
          <p className="text-[9px] font-mono text-slate-300 dark:text-slate-800">{t('footer')}</p>
        </div>
      </div>
    </main>
  );
}
