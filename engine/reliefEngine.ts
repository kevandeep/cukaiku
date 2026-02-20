import { calculateTax } from './taxCalculator';
import { RELIEF_LIMITS } from '@/data/reliefLimits';
import type { Answers, ComputeResult, FormField, MissedOpportunity, Relief } from '@/data/types';

export function computeAll(a: Answers): ComputeResult {
  const reliefs: Relief[] = [];
  const missed: MissedOpportunity[] = [];
  const formFields: FormField[] = [];

  const p = (v: string | undefined) => parseFloat(v ?? '0') || 0;
  const n = (v: string | undefined) => parseInt(v ?? '0') || 0;

  // ── INCOME ──────────────────────────────────────────────────────────────────
  const employment   = p(a.employmentIncome);
  const rentalNet    = a.hasRentalIncome === 'yes'
    ? Math.max(0, p(a.rentalGross) - p(a.rentalExpenses))
    : 0;
  const interest     = a.hasInterestIncome === 'yes' ? p(a.interestIncome)  : 0;
  const royalty      = a.hasRoyaltyIncome  === 'yes' ? p(a.royaltyIncome)   : 0;
  const pension      = a.hasPensionIncome  === 'yes' ? p(a.pensionIncome)   : 0;
  const other        = a.hasOtherIncome    === 'yes' ? p(a.otherIncome)     : 0;
  const otherStatutory = interest + royalty + pension + other;

  // FIX: Dividends from resident companies (above RM100k threshold) are taxed at
  // a FLAT 2% rate — they are NOT subject to the progressive brackets.
  // v2 incorrectly included dividend in totalIncome, causing double taxation.
  const dividend     = a.hasDividendIncome === 'yes' ? p(a.dividendIncome)  : 0;

  // Progressive bracket income: employment + rental + other statutory ONLY
  const totalIncome  = employment + rentalNet + otherStatutory;

  // Form BE — Income section
  formFields.push({ section: 'B', ref: 'C1',  label: 'Statutory employment income', value: employment, highlight: employment > 0 });
  formFields.push({ section: 'B', ref: 'C2',  label: 'Statutory rental income (net)', value: rentalNet, highlight: rentalNet > 0 });
  formFields.push({ section: 'B', ref: 'C3',  label: 'Interest, discounts, royalties, premiums, pensions, annuities, other', value: otherStatutory, highlight: otherStatutory > 0 });
  if (dividend > 0) formFields.push({ section: 'B', ref: 'C3a', label: 'Dividend income (above RM100k — flat 2% tax, verify with LHDN)', value: dividend, highlight: true });
  // Aggregate income on Form BE includes all income for reference
  formFields.push({ section: 'C', ref: 'C4',  label: 'Aggregate income', value: totalIncome + dividend, highlight: true });

  // ── DONATIONS (deduction from aggregate income, not a relief) ───────────────
  const donationMax = totalIncome * RELIEF_LIMITS.donationPercent;
  const donations   = a.hasDonations === 'yes' ? Math.min(p(a.donationAmount), donationMax) : 0;
  if (donations > 0) formFields.push({ section: 'C', ref: 'C7', label: `Approved donations (max ${Math.round(RELIEF_LIMITS.donationPercent * 100)}% of aggregate income)`, value: donations, highlight: true });
  const totalIncomeAfterDed = Math.max(0, totalIncome - donations);

  // ── RELIEFS ─────────────────────────────────────────────────────────────────
  const addRelief = (name: string, amount: number, ref: string) => {
    reliefs.push({ name, amount, ref });
    formFields.push({ section: 'D', ref, label: name, value: amount, highlight: true });
  };

  // Individual relief (automatic — every resident taxpayer)
  addRelief('Individual & dependents', RELIEF_LIMITS.individual, 'D1');

  // Spouse
  if (a.maritalStatus === 'married' && a.spouseWorking === 'no') {
    addRelief('Spouse (no income / joint assessment)', RELIEF_LIMITS.spouse, 'D2');
  } else if (a.maritalStatus === 'divorced') {
    addRelief('Alimony (formal agreement)', RELIEF_LIMITS.spouse, 'D2');
  }

  // Disabled self & spouse
  if (a.isDisabled      === 'yes') addRelief('Disabled individual (self)',  RELIEF_LIMITS.disabledSelf,   'D2a');
  if (a.spouseDisabled  === 'yes') addRelief('Disabled spouse',             RELIEF_LIMITS.disabledSpouse, 'D2b');

  // Self education
  if (a.selfEducation === 'yes') {
    const v = Math.min(p(a.educationAmount), RELIEF_LIMITS.education);
    if (v > 0) addRelief('Education fees (self)', v, 'D3');
  } else {
    missed.push({ name: 'Education fees', potential: RELIEF_LIMITS.education, tip: 'Consider upskilling courses (RM2,000 sub-limit) or a professional qualification. Up to RM7,000.' });
  }

  // Parents medical
  if (a.parentsMedical === 'yes') {
    const v = Math.min(p(a.parentsMedicalAmount), RELIEF_LIMITS.parentsMedical);
    if (v > 0) addRelief('Parents medical / carer expenses', v, 'D4');
  }

  // Medical — self/spouse/child (D5)
  if (a.medicalSelf === 'yes') {
    const v = Math.min(p(a.medicalSelfAmount), RELIEF_LIMITS.medicalSelf);
    if (v > 0) addRelief('Medical expenses (self / spouse / child)', v, 'D5');
  }

  // Learning disability (D5a — separate sub-field from D5, verify LHDN form)
  if (a.learningDisability === 'yes') {
    const v = Math.min(p(a.learningDisabilityAmount), RELIEF_LIMITS.learningDisability);
    if (v > 0) addRelief('Learning disability treatment (child ≤18)', v, 'D5a');
  }

  // Disabled equipment (D6)
  if (a.disabledEquipment === 'yes') {
    const v = Math.min(p(a.disabledEquipmentAmount), RELIEF_LIMITS.disabledEquipment);
    if (v > 0) addRelief('Disabled equipment', v, 'D6');
  }

  // Lifestyle (D7)
  const lifestyle = Math.min(p(a.lifestyleSpending), RELIEF_LIMITS.lifestyle);
  if (lifestyle > 0) addRelief('Lifestyle (books, PC, internet, sports, gym)', lifestyle, 'D7');
  if (lifestyle < RELIEF_LIMITS.lifestyle) {
    missed.push({ name: 'Lifestyle relief', potential: RELIEF_LIMITS.lifestyle - lifestyle, tip: 'Books, laptops, phones, internet bills, gym memberships all count. Up to RM2,500.' });
  }

  // Additional sports (D8)
  if (a.additionalSports === 'yes') {
    const v = Math.min(p(a.additionalSportsAmount), RELIEF_LIMITS.additionalSports);
    if (v > 0) addRelief('Additional sports activity', v, 'D8');
  }

  // Children
  const u18 = n(a.childrenUnder18);
  const he  = n(a.childrenHigherEdu);
  const pu  = n(a.childrenPreU);
  const dk  = n(a.disabledChildren);
  const dke = n(a.disabledChildInEdu);

  if (u18 > 0) addRelief(`Children under 18 (${u18} × RM${RELIEF_LIMITS.childUnder18.toLocaleString()})`,           u18 * RELIEF_LIMITS.childUnder18,           'D9');
  if (he  > 0) addRelief(`Children higher edu (${he} × RM${RELIEF_LIMITS.childHigherEdu.toLocaleString()})`,         he  * RELIEF_LIMITS.childHigherEdu,          'D10a');
  if (pu  > 0) addRelief(`Children pre-U (${pu} × RM${RELIEF_LIMITS.childPreU.toLocaleString()})`,                   pu  * RELIEF_LIMITS.childPreU,               'D10b');
  if (dk  > 0) addRelief(`Disabled children (${dk} × RM${RELIEF_LIMITS.disabledChild.toLocaleString()})`,            dk  * RELIEF_LIMITS.disabledChild,           'D11');
  if (dke > 0) addRelief(`Disabled children in higher edu (${dke} × RM${RELIEF_LIMITS.disabledChildHigherEdu.toLocaleString()})`, dke * RELIEF_LIMITS.disabledChildHigherEdu, 'D12');

  // Breastfeeding (D13)
  if (a.hasBreastfeedingChild === 'yes') {
    const v = Math.min(p(a.breastfeedingAmount), RELIEF_LIMITS.breastfeeding);
    if (v > 0) addRelief('Breastfeeding equipment', v, 'D13');
  }

  // Childcare (D14)
  if (a.childcareFees === 'yes') {
    const v = Math.min(p(a.childcareAmount), RELIEF_LIMITS.childcare);
    if (v > 0) addRelief('Childcare / kindergarten', v, 'D14');
  }

  // SSPN (D15)
  if (a.sspnDeposit === 'yes') {
    const v = Math.min(p(a.sspnAmount), RELIEF_LIMITS.sspn);
    if (v > 0) addRelief('SSPN net deposit', v, 'D15');
  } else if (a.hasChildren === 'yes') {
    missed.push({ name: 'SSPN deposit', potential: RELIEF_LIMITS.sspn, tip: 'Open SSPN and deposit up to RM8,000 — save for your children\'s education AND reduce tax.' });
  }

  // EV / compost (D16)
  if (a.hasEV === 'yes') {
    const v = Math.min(p(a.evAmount), RELIEF_LIMITS.evCharging);
    if (v > 0) addRelief('EV charging facility / compost machine', v, 'D16');
  }

  // EPF + life insurance (D17, combined cap RM7,000)
  const epf     = Math.min(p(a.epfAmount),      RELIEF_LIMITS.epf);
  const life    = Math.min(p(a.lifeInsurance),   RELIEF_LIMITS.lifeInsurance);
  const epfLife = Math.min(epf + life,           RELIEF_LIMITS.epfLifeCombined);
  if (epfLife > 0) addRelief('EPF & life insurance / takaful', epfLife, 'D17');
  if (epfLife < RELIEF_LIMITS.epfLifeCombined) {
    missed.push({ name: 'EPF & life insurance', potential: RELIEF_LIMITS.epfLifeCombined - epfLife, tip: 'Consider voluntary EPF top-up or increasing life insurance coverage.' });
  }

  // Education & medical insurance (D18)
  const emi = Math.min(p(a.eduMedInsurance), RELIEF_LIMITS.eduMedInsurance);
  if (emi > 0) addRelief('Education & medical insurance', emi, 'D18');
  if (emi < RELIEF_LIMITS.eduMedInsurance) {
    missed.push({ name: 'Medical / education insurance', potential: RELIEF_LIMITS.eduMedInsurance - emi, tip: 'Medical and education insurance premiums are claimable up to RM4,000.' });
  }

  // SOCSO (D19)
  const socso = Math.min(p(a.socso), RELIEF_LIMITS.socso);
  if (socso > 0) addRelief('SOCSO / EIS contributions', socso, 'D19');

  // PRS (D20)
  if (a.prsContribution === 'yes') {
    const v = Math.min(p(a.prsAmount), RELIEF_LIMITS.prs);
    if (v > 0) addRelief('Private Retirement Scheme (PRS)', v, 'D20');
  } else {
    missed.push({ name: 'PRS contribution', potential: RELIEF_LIMITS.prs, tip: 'PRS gives up to RM3,000 relief AND builds retirement savings. Open an account before December!' });
  }

  // Housing loan interest (D21) — new YA 2025
  if (a.firstHomeLoan === 'yes' && a.housePrice !== 'above750k') {
    const cap = a.housePrice === 'under500k' ? RELIEF_LIMITS.housingLoanUnder500k : RELIEF_LIMITS.housingLoan500kTo750k;
    const v   = Math.min(p(a.housingInterest), cap);
    if (v > 0) addRelief('Housing loan interest (first home)', v, 'D21');
  }

  // ── COMPUTATION ─────────────────────────────────────────────────────────────
  const totalRelief       = reliefs.reduce((s, r) => s + r.amount, 0);
  const chargeableIncome  = Math.max(0, totalIncomeAfterDed - totalRelief);
  const taxBeforeRebate   = calculateTax(chargeableIncome);

  // FIX: Dividend 2% flat tax is computed separately, NOT added to bracket income.
  const dividendTax       = dividend * RELIEF_LIMITS.dividendFlatRate;
  const taxWithDividend   = taxBeforeRebate + dividendTax;

  // Rebates (reduce tax payable directly)
  const zakat       = p(a.zakatAmount);
  const selfRebate  = chargeableIncome <= 35000 ? 400 : 0;
  const spouseRebate = (chargeableIncome <= 35000 && a.maritalStatus === 'married' && a.spouseWorking === 'no') ? 400 : 0;
  const totalRebate = zakat + selfRebate + spouseRebate;
  const finalTax    = Math.max(0, taxWithDividend - totalRebate);

  // Tax saved = tax if only mandatory individual relief was claimed vs actual final tax
  const taxWithoutRelief = calculateTax(Math.max(0, totalIncomeAfterDed - RELIEF_LIMITS.individual));
  const taxSaved = taxWithoutRelief - finalTax;

  // Form BE — computation section
  formFields.push({ section: 'D', ref: 'D_TOTAL',  label: 'Total tax reliefs',                value: totalRelief,     highlight: true, bold: true });
  formFields.push({ section: 'E', ref: 'E1',        label: 'Chargeable income',                value: chargeableIncome, highlight: true, bold: true });
  formFields.push({ section: 'E', ref: 'E2',        label: 'Tax on chargeable income',         value: taxBeforeRebate,  highlight: true });
  if (dividendTax > 0) formFields.push({ section: 'E', ref: 'E2a', label: 'Tax on dividend income (2% flat)', value: dividendTax, highlight: true });
  if (zakat        > 0) formFields.push({ section: 'F', ref: 'F1', label: 'Zakat / fitrah rebate',             value: zakat,        highlight: true });
  if (selfRebate   > 0) formFields.push({ section: 'F', ref: 'F2', label: 'Self rebate (chargeable income ≤ RM35,000)', value: selfRebate,   highlight: true });
  if (spouseRebate > 0) formFields.push({ section: 'F', ref: 'F3', label: 'Spouse rebate',                    value: spouseRebate, highlight: true });
  formFields.push({ section: 'E', ref: 'E_FINAL',   label: 'TAX PAYABLE',                      value: finalTax,        highlight: true, bold: true });

  return {
    reliefs, missed, formFields,
    totalIncome, totalRelief, chargeableIncome,
    taxBeforeRebate, dividend, dividendTax,
    totalRebate, finalTax, taxSaved,
    zakat, selfRebate, spouseRebate,
  };
}
