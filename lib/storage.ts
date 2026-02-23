/**
 * lib/storage.ts — Data persistence abstraction layer
 *
 * Current backend: Google Sheets via Apps Script Web App webhook.
 * To migrate to Supabase/PostgreSQL at ~15k submissions, only this file changes.
 *
 * Checkpoints saved:
 *   income_completed  — after all income questions answered
 *   prs_completed     — after insurance/PRS section answered
 *   fully_completed   — when results screen is shown
 *   email_captured    — when user submits their email address
 */

export type Checkpoint =
  | 'income_completed'
  | 'prs_completed'
  | 'fully_completed'
  | 'email_captured';

export interface CheckpointPayload {
  sessionId: string;
  checkpoint: Checkpoint;
  timestamp: string;
  formType?: string;
  answers: Record<string, string>;
  // Result summary fields (only at fully_completed)
  summary?: {
    totalIncome: number;
    finalTax: number;
    totalRelief: number;
    balanceDue: number;
  };
}

/**
 * Saves a checkpoint to the configured backend.
 * Fails silently — never blocks the user flow.
 */
export async function saveCheckpoint(payload: CheckpointPayload): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SHEETS_WEBHOOK_URL;

  if (!url) {
    // No webhook configured — skip silently (dev environment or not yet set up)
    if (process.env.NODE_ENV === 'development') {
      console.log('[storage] No SHEETS_WEBHOOK_URL — skipping save for checkpoint:', payload.checkpoint);
    }
    return;
  }

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // 5-second timeout — don't block the user
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Silently ignore — analytics should never break the user experience
  }
}
