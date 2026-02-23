'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { QUESTIONS } from '@/data/questions';
import type { Answers } from '@/data/types';
import { saveCheckpoint } from '@/lib/storage';

export type Screen = 'landing' | 'questions' | 'results';

// Stable session ID for the life of this browser session
function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  const key = 'cukaiku_session';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

// Sections that mark checkpoint transitions
const INCOME_LAST_SECTION  = 'secOtherIncome';
const PRS_LAST_SECTION     = 'secInsurance';

export function useCalculator() {
  const [screen, setScreen]   = useState<Screen>('questions');
  const [qi, setQi]           = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const firedCheckpoints      = useRef<Set<string>>(new Set());

  // Visible questions are re-evaluated on every answer change
  const visible = QUESTIONS.filter(q => !q.showIf || q.showIf(answers));
  const current = visible[qi];
  const total   = visible.length;

  const fireCheckpoint = useCallback((checkpoint: Parameters<typeof saveCheckpoint>[0]['checkpoint'], extra?: object) => {
    if (firedCheckpoints.current.has(checkpoint)) return;
    firedCheckpoints.current.add(checkpoint);
    saveCheckpoint({
      sessionId:  getSessionId(),
      checkpoint,
      timestamp:  new Date().toISOString(),
      formType:   answers.formType,
      answers,
      ...extra,
    });
  }, [answers]);

  const setAnswer = useCallback((id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }, []);

  const goNext = useCallback(() => {
    // Fire income checkpoint when leaving the income/other-income section
    if (current?.section === INCOME_LAST_SECTION) {
      const nextQ = visible[qi + 1];
      if (!nextQ || nextQ.section !== INCOME_LAST_SECTION) {
        fireCheckpoint('income_completed');
      }
    }

    // Fire PRS checkpoint when leaving the insurance/PRS section
    if (current?.section === PRS_LAST_SECTION) {
      const nextQ = visible[qi + 1];
      if (!nextQ || nextQ.section !== PRS_LAST_SECTION) {
        fireCheckpoint('prs_completed');
      }
    }

    if (qi < visible.length - 1) {
      setQi(q => q + 1);
    } else {
      setScreen('results');
    }
  }, [qi, visible, current, fireCheckpoint]);

  const goBack = useCallback(() => {
    if (qi > 0) setQi(q => q - 1);
  }, [qi]);

  const restart = useCallback(() => {
    setScreen('landing');
    setQi(0);
    setAnswers({});
    firedCheckpoints.current.clear();
  }, []);

  const start = useCallback(() => {
    setScreen('questions');
  }, []);

  // Fire fully_completed when results screen appears
  useEffect(() => {
    if (screen === 'results') {
      fireCheckpoint('fully_completed');
    }
  }, [screen, fireCheckpoint]);

  // Fire email_captured when user fills in their email
  useEffect(() => {
    const email = answers['email'];
    if (email && email.includes('@')) {
      fireCheckpoint('email_captured');
    }
  }, [answers, fireCheckpoint]);

  return {
    screen, answers, current, qi, total,
    setAnswer, goNext, goBack, restart, start,
  };
}
