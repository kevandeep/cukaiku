/**
 * Maps English FormField labels (from reliefEngine.ts) to Bahasa Malaysia equivalents.
 * Uses exact LHDN Borang BE 2024 wording where possible.
 * The PDF always renders in BM to match the official LHDN form.
 */

export const BM_LABELS: Record<string, string> = {
  // ── Section B — Income ──
  'Employment income':
    'Pendapatan penggajian',
  'Statutory employment income':
    'Pendapatan berkanun penggajian punca Malaysia',
  'Rental income (net)':
    'Pendapatan berkanun sewa (bersih)',
  'Statutory rental income (net)':
    'Pendapatan berkanun sewa punca Malaysia',
  'Other income':
    'Pendapatan lain',
  'Interest, discounts, royalties, premiums, pensions, annuities, other':
    'Pendapatan berkanun faedah, diskaun, royalti, premium, pencen, anuiti, lain-lain',
  'Statutory business income (adjusted)':
    'Pendapatan berkanun perniagaan (dilaraskan)',
  'Dividend income (above RM100k — flat 2% tax, verify with LHDN)':
    'Pendapatan dividen (melebihi RM100k — cukai rata 2%)',

  // ── Section C — Aggregate ──
  'Aggregate income':
    'Pendapatan agregat',

  // ── Section D — Reliefs ──
  'Individual & dependents':
    'Individu dan saudara tanggungan',
  'Spouse (no income / joint assessment)':
    'Suami / isteri (tiada pendapatan / taksiran bersama)',
  'Alimony (formal agreement)':
    'Bayaran alimoni kepada bekas isteri',
  'Disabled individual (self)':
    'Individu yang kurang upaya',
  'Disabled spouse':
    'Suami / isteri yang kurang upaya',
  'Education fees (self)':
    'Yuran pengajian (sendiri)',
  'Parents medical / carer expenses':
    'Perbelanjaan perubatan / penjaga ibu bapa',
  'Medical expenses (self / spouse / child)':
    'Perbelanjaan perubatan (sendiri / suami / isteri / anak)',
  'Learning disability treatment (child ≤18)':
    'Rawatan ketidakupayaan pembelajaran (anak ≤18 tahun)',
  'Disabled equipment':
    'Peralatan sokongan asas untuk orang kurang upaya',
  'Lifestyle (books, PC, internet, sports, gym)':
    'Gaya hidup (buku, PC, internet, sukan, gimnasium)',
  'Additional sports activity':
    'Gaya hidup — pelepasan tambahan (sukan)',
  'Breastfeeding equipment':
    'Peralatan penyusuan ibu',
  'Childcare / kindergarten':
    'Yuran taska / tadika',
  'SSPN net deposit':
    'Tabungan bersih SSPN',
  'EV charging facility / compost machine':
    'Pemasangan peralatan pengecasan EV / mesin kompos',
  'EPF & life insurance / takaful':
    'Insurans nyawa dan KWSP',
  'Education & medical insurance':
    'Insurans pendidikan dan perubatan',
  'SOCSO / EIS contributions':
    'Caruman PERKESO / SIP',
  'Private Retirement Scheme (PRS)':
    'Skim persaraan swasta dan anuiti tertangguh',
  'Housing loan interest (first home)':
    'Faedah pinjaman perumahan (rumah pertama)',
  'Total tax reliefs':
    'Jumlah pelepasan',

  // ── Section E — Tax Computation ──
  'Total income':
    'Jumlah pendapatan',
  'Chargeable income':
    'Pendapatan bercukai',
  'Tax on chargeable income':
    'Jumlah cukai pendapatan',
  'Tax on dividend income (2% flat)':
    'Cukai atas pendapatan dividen (2% rata)',
  'TAX PAYABLE':
    'JUMLAH CUKAI YANG DIKENAKAN',
  'Tax payable (30% flat rate — non-resident)':
    'Cukai kena dibayar (kadar rata 30% — bukan pemastautin)',

  // ── Section F — Rebates ──
  'Zakat / fitrah rebate':
    'Zakat dan fitrah',
  'Self rebate (chargeable income ≤ RM35,000)':
    'Rebat sendiri',
  'Spouse rebate':
    'Rebat suami / isteri',

  // ── Section H — PCB / Balance ──
  'PCB / monthly tax deductions':
    'PCB / potongan cukai bulanan',
  'PCB deducted by employer':
    'PCB yang ditolak oleh majikan',
  'Balance payable to LHDN':
    'Baki cukai kena dibayar',
  'Refund from LHDN':
    'Bayaran balik daripada LHDN',
};

/** Section headers in BM — matching LHDN form structure */
export const BM_SECTION_TITLES: Record<string, string> = {
  B: 'PENDAPATAN BERKANUN DAN JUMLAH PENDAPATAN',
  C: 'JUMLAH PENDAPATAN',
  D: 'PELEPASAN',
  E: 'RUMUSAN CUKAI',
  F: 'REBAT',
  H: 'BAYARAN',
};

/**
 * Returns the BM label for a FormField, with pattern matching fallback
 * for dynamic labels (e.g., children counts).
 */
export function getBmLabel(englishLabel: string): string {
  if (BM_LABELS[englishLabel]) return BM_LABELS[englishLabel];

  // Dynamic children labels: "Children under 18 (3 × RM2,000)"
  if (englishLabel.startsWith('Children under 18'))
    return englishLabel.replace('Children under 18', 'Anak bawah 18 tahun');
  if (englishLabel.startsWith('Children higher edu'))
    return englishLabel.replace('Children higher edu', 'Anak pengajian tinggi');
  if (englishLabel.startsWith('Children pre-U'))
    return englishLabel.replace('Children pre-U', 'Anak pra-universiti');
  if (englishLabel.startsWith('Disabled children in higher edu'))
    return englishLabel.replace('Disabled children in higher edu', 'Anak OKU dalam pengajian tinggi');
  if (englishLabel.startsWith('Disabled children'))
    return englishLabel.replace('Disabled children', 'Anak kurang upaya');
  if (englishLabel.includes('Approved donations'))
    return englishLabel.replace(/Approved donations.*/, 'Derma / hadiah / sumbangan yang diluluskan');

  return englishLabel;
}
