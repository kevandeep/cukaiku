// YA 2025 tax relief limits — cross-check against LHDN Schedule 9
// Source: Finance Act 2024 / Budget 2025 amendments
// Last verified: February 2026 — confirm against hasil.gov.my before launch

export const RELIEF_LIMITS = {
  individual:                9000,
  spouse:                    4000,   // No income / joint assessment
  disabledSelf:              7000,   // Additional on top of individual relief
  disabledSpouse:            6000,

  education:                 7000,   // Incl. RM2,000 upskilling sub-limit
  parentsMedical:            8000,

  medicalSelf:               10000,  // Cap for self/spouse/child medical
  // Sub-limits within medicalSelf: vaccines RM1,000, dental RM1,000, mental health RM1,000
  learningDisability:        6000,   // Child ≤18, diagnosis/intervention/rehab
  disabledEquipment:         6000,

  lifestyle:                 2500,   // Books, laptop, phone, internet, sports, gym
  additionalSports:          1000,   // Extra sports equipment/facility/competition

  childUnder18:              2000,   // Per child
  childHigherEdu:            8000,   // Per child, diploma level or above
  childPreU:                 2000,   // Per child, A-Level / matriculation
  disabledChild:             8000,   // Per disabled child
  disabledChildHigherEdu:    8000,   // Per disabled child in higher edu (addtl)

  breastfeeding:             1000,   // Once every 2 years, child ≤2
  childcare:                 3000,   // Registered centre, child ≤6
  sspn:                      8000,   // Net deposit (deposits minus withdrawals)

  evCharging:                2500,   // EV charging equipment OR compost machine

  epf:                       4000,   // Private sector EPF cap
  lifeInsurance:             3000,   // Life/takaful premiums
  epfLifeCombined:           7000,   // Combined EPF + life insurance cap
  eduMedInsurance:           4000,   // Education or medical insurance
  socso:                     350,    // SOCSO / EIS contributions

  prs:                       3000,   // Private Retirement Scheme

  housingLoanUnder500k:      7000,   // First home, SPA 2025-2027, price ≤RM500k
  housingLoan500kTo750k:     5000,   // First home, SPA 2025-2027, RM500k–750k

  donationPercent:           0.10,   // Max 10% of aggregate income
  dividendFlatRate:          0.02,   // 2% flat tax on dividends above RM100k from resident cos
  dividendExemptThreshold:   100000, // First RM100k of dividends is exempt
} as const;
