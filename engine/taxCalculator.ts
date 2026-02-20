import { TAX_BRACKETS_2025 } from '@/data/taxBrackets';

/**
 * Calculates progressive income tax on chargeable income.
 *
 * Fix vs v2: Uses `max - min` for band size (no +1), matching the bracket
 * definition where each bracket's min equals the previous bracket's max.
 * This eliminates the RM1 overlap error at each bracket boundary.
 */
export function calculateTax(chargeableIncome: number): number {
  let tax = 0;
  let remaining = chargeableIncome;

  for (const bracket of TAX_BRACKETS_2025) {
    if (remaining <= 0) break;
    const bandSize = bracket.max === Infinity ? remaining : bracket.max - bracket.min;
    const taxable = Math.min(remaining, bandSize);
    tax += taxable * (bracket.rate / 100);
    remaining -= taxable;
  }

  return Math.max(0, tax);
}

export function formatRM(n: number): string {
  return `RM ${Math.round(n).toLocaleString()}`;
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}
