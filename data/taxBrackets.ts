export interface TaxBracket {
  min: number;
  max: number;
  rate: number; // percentage
}

// YA 2025 progressive tax brackets.
// Each bracket: min is inclusive, max is exclusive (i.e. min of next bracket = max of this one).
// Band size = max - min. This avoids the off-by-one error in naive +1 implementations.
export const TAX_BRACKETS_2025: TaxBracket[] = [
  { min: 0,       max: 5000,    rate: 0  },
  { min: 5000,    max: 20000,   rate: 1  },
  { min: 20000,   max: 35000,   rate: 3  },
  { min: 35000,   max: 50000,   rate: 6  },
  { min: 50000,   max: 70000,   rate: 11 },
  { min: 70000,   max: 100000,  rate: 19 },
  { min: 100000,  max: 400000,  rate: 25 },
  { min: 400000,  max: 600000,  rate: 26 },
  { min: 600000,  max: 2000000, rate: 28 },
  { min: 2000000, max: Infinity, rate: 30 },
];
