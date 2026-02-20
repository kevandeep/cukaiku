'use client';

import { useCallback, useState } from 'react';
import { QUESTIONS } from '@/data/questions';
import type { Answers } from '@/data/types';

export type Screen = 'landing' | 'questions' | 'results';

export function useCalculator() {
  const [screen, setScreen]   = useState<Screen>('questions');
  const [qi, setQi]           = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  // Visible questions are re-evaluated on every answer change
  const visible = QUESTIONS.filter(q => !q.showIf || q.showIf(answers));
  const current = visible[qi];
  const total   = visible.length;

  const setAnswer = useCallback((id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }, []);

  const goNext = useCallback(() => {
    if (qi < visible.length - 1) {
      setQi(q => q + 1);
    } else {
      setScreen('results');
    }
  }, [qi, visible.length]);

  const goBack = useCallback(() => {
    if (qi > 0) setQi(q => q - 1);
  }, [qi]);

  const restart = useCallback(() => {
    setScreen('landing');
    setQi(0);
    setAnswers({});
  }, []);

  const start = useCallback(() => {
    setScreen('questions');
  }, []);

  return {
    screen, answers, current, qi, total,
    setAnswer, goNext, goBack, restart, start,
  };
}
