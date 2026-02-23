import type { Answers, Question } from './types';

// TODO Week 2: Move question/tip text to i18n JSON files for BM and ZH translations.
// Each question.question and question.tip should become a key lookup.

// Form M (non-resident) has no personal reliefs — income questions still apply
const notM = (a: Answers) => a.formType !== 'M';

export const QUESTIONS: Question[] = [
  // ═══ FORM TYPE ═══
  {
    id: 'formType', section: 'secFormType',
    question: 'Which LHDN tax form applies to you?',
    tip: 'Form BE: resident with employment/rental income only. Form B: resident with business income (sole proprietor, partnership, freelancer with registered business). Form M: non-resident individual.',
    type: 'select', icon: '📋',
    options: [
      { value: 'BE', label: 'Form BE — Resident, no business income (most common)' },
      { value: 'B',  label: 'Form B — Resident with business income' },
      { value: 'M',  label: 'Form M — Non-resident individual' },
    ],
  },

  // ═══ INCOME ═══
  {
    id: 'employmentIncome', section: 'secIncome',
    question: 'What is your total statutory employment income?',
    tip: 'From your EA form (Section B). Includes salary, bonuses, commissions, allowances, gratuity, director fees. Maps to Form BE field C1.',
    type: 'currency', icon: '💰', formRef: 'C1',
  },
  // ═══ BUSINESS INCOME (Form B only) ═══
  {
    id: 'businessGrossIncome', section: 'secBusiness',
    question: 'What is your gross business income? (sales, fees, commissions before expenses)',
    tip: 'Include all revenue from your sole proprietorship, partnership share, or registered freelance business. This is before any business deductions.',
    type: 'currency', icon: '🏪', formRef: 'C6',
    showIf: (a: Answers) => a.formType === 'B',
  },
  {
    id: 'businessAdjustedIncome', section: 'secBusiness',
    question: 'What is your adjusted business income (after deducting allowable business expenses)?',
    tip: 'From your business accounts: gross income minus allowable expenses (salaries, rent, depreciation via capital allowances, cost of goods, utilities, etc.). This is your statutory business income.',
    type: 'currency', icon: '🏪', formRef: 'C6',
    showIf: (a: Answers) => a.formType === 'B',
  },

  {
    id: 'hasRentalIncome', section: 'secOtherIncome',
    question: 'Do you receive rental income from property?',
    tip: 'Rental income from houses, apartments, commercial property. You can deduct expenses like assessment, quit rent, repairs, interest on loan.',
    type: 'yesno', icon: '🏘️',
  },
  {
    id: 'rentalGross', section: 'secOtherIncome',
    question: 'What is your gross annual rental income?',
    tip: 'Total rent received from all properties before any deductions.',
    type: 'currency', showIf: (a: Answers) => a.hasRentalIncome === 'yes',
    icon: '🏘️', formRef: 'C2',
  },
  {
    id: 'rentalExpenses', section: 'secOtherIncome',
    question: 'What are your allowable rental expenses? (Assessment, quit rent, repairs, loan interest, agent fees)',
    tip: 'Deductible: assessment tax, quit rent, fire insurance, repairs & maintenance, loan interest, agent commission. Not deductible: capital improvements, personal expenses.',
    type: 'currency', showIf: (a: Answers) => a.hasRentalIncome === 'yes', icon: '🏘️',
  },
  {
    id: 'hasInterestIncome', section: 'secOtherIncome',
    question: 'Do you receive taxable interest or discount income?',
    tip: 'Interest from bonds, debentures, treasury bills. Note: Interest from Malaysian banks (savings/FD) is generally TAX EXEMPT.',
    type: 'yesno', icon: '💵',
  },
  {
    id: 'interestIncome', section: 'secOtherIncome',
    question: 'How much taxable interest / discount income?',
    tip: 'Do NOT include bank savings/FD interest (tax exempt). Include: bonds, foreign interest, corporate debentures.',
    type: 'currency', showIf: (a: Answers) => a.hasInterestIncome === 'yes',
    icon: '💵', formRef: 'C3',
  },
  {
    id: 'hasDividendIncome', section: 'secOtherIncome',
    question: 'Do you receive dividend income exceeding RM100,000 from Malaysian resident companies?',
    tip: 'Most dividends from Malaysian companies are single-tier (tax exempt). Only dividends exceeding RM100,000 per year from resident companies are taxed at a flat 2% from YA 2025.',
    type: 'yesno', icon: '📈',
  },
  {
    id: 'dividendIncome', section: 'secOtherIncome',
    question: 'Enter the portion of dividend income ABOVE RM100,000.',
    tip: 'Only enter the amount exceeding RM100,000. The first RM100,000 is tax-exempt. This is taxed at a flat 2% (not the progressive brackets).',
    type: 'currency', showIf: (a: Answers) => a.hasDividendIncome === 'yes',
    icon: '📈', formRef: 'C3a',
  },
  {
    id: 'hasRoyaltyIncome', section: 'secOtherIncome',
    question: 'Do you receive royalty income? (copyright, patents, literary works)',
    tip: 'Royalties from books, artistic works, music, patents. Some royalties have partial tax exemptions. Literary/artistic royalties: first RM20,000 exempt.',
    type: 'yesno', icon: '📝',
  },
  {
    id: 'royaltyIncome', section: 'secOtherIncome',
    question: 'Net taxable royalty income (after exemptions)?',
    tip: 'Literary/artistic royalties: first RM20,000 exempt. Music compositions: first RM20,000 exempt. Check LHDN guidelines for your specific type.',
    type: 'currency', showIf: (a: Answers) => a.hasRoyaltyIncome === 'yes',
    icon: '📝', formRef: 'C3',
  },
  {
    id: 'hasPensionIncome', section: 'secOtherIncome',
    question: 'Do you receive pension income?',
    tip: 'Pension is TAX EXEMPT if you retired at 55 or above (or compulsory retirement age). Only taxable if you retired before 55.',
    type: 'yesno', icon: '👴',
  },
  {
    id: 'pensionIncome', section: 'secOtherIncome',
    question: 'How much taxable pension income? (only if retired before 55)',
    tip: 'If you retired at/after 55: RM0 (exempt). If before 55: pension is taxable until you reach 55.',
    type: 'currency', showIf: (a: Answers) => a.hasPensionIncome === 'yes',
    icon: '👴', formRef: 'C3',
  },
  {
    id: 'hasOtherIncome', section: 'secOtherIncome',
    question: 'Any other income? (freelance, part-time, occasional jobs not in EA form)',
    tip: 'Includes freelance income, lecturing fees, writing fees, broadcasting income — anything not captured in your EA form.',
    type: 'yesno', icon: '💼',
  },
  {
    id: 'otherIncome', section: 'secOtherIncome',
    question: 'Total other income?',
    type: 'currency', showIf: (a: Answers) => a.hasOtherIncome === 'yes',
    icon: '💼', formRef: 'C3',
  },

  // ═══ PERSONAL ═══
  {
    id: 'maritalStatus', section: 'secPersonal',
    question: 'What is your marital status?',
    type: 'select', icon: '💍', showIf: notM,
    options: [
      { value: 'single', label: 'Single' },
      { value: 'married', label: 'Married' },
      { value: 'divorced', label: 'Divorced (paying alimony)' },
    ],
  },
  {
    id: 'spouseWorking', section: 'secPersonal',
    question: 'Does your spouse have their own income?',
    tip: 'If no income or joint assessment: claim RM4,000 spouse relief.',
    type: 'select', showIf: (a: Answers) => notM(a) && a.maritalStatus === 'married', icon: '👫',
    options: [
      { value: 'no', label: 'No income / Joint assessment' },
      { value: 'yes', label: 'Yes, separate assessment' },
    ],
  },
  {
    id: 'isDisabled', section: 'secPersonal',
    question: 'Are you registered as a disabled person (OKU) with JKM?',
    tip: 'Additional RM7,000 on top of standard RM9,000 individual relief.',
    type: 'yesno', icon: '♿', showIf: notM,
  },
  {
    id: 'spouseDisabled', section: 'secPersonal',
    question: 'Is your spouse registered as disabled (OKU)?',
    tip: 'Additional RM6,000 relief.',
    type: 'yesno', showIf: (a: Answers) => notM(a) && a.maritalStatus === 'married', icon: '♿',
  },

  // ═══ CHILDREN ═══
  {
    id: 'hasChildren', section: 'secChildren',
    question: 'Do you have children?',
    type: 'yesno', icon: '👶', showIf: notM,
  },
  {
    id: 'childrenUnder18', section: 'secChildren',
    question: 'How many unmarried children under 18?',
    tip: 'RM2,000 per child.',
    type: 'number', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes',
    icon: '🧒', formRef: 'D9',
  },
  {
    id: 'childrenHigherEdu', section: 'secChildren',
    question: 'How many children (18+) in full-time higher education (diploma/degree/masters)?',
    tip: 'RM8,000 per child at diploma level or above.',
    type: 'number', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes',
    icon: '🎓', formRef: 'D10',
  },
  {
    id: 'childrenPreU', section: 'secChildren',
    question: 'How many children (18+) in pre-U / A-Levels / matriculation?',
    tip: 'RM2,000 per child in pre-university.',
    type: 'number', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes',
    icon: '📚', formRef: 'D10',
  },
  {
    id: 'disabledChildren', section: 'secChildren',
    question: 'How many disabled children (registered OKU)?',
    tip: 'RM8,000 per disabled child. Additional RM8,000 if in higher edu.',
    type: 'number', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes',
    icon: '♿', formRef: 'D11',
  },
  {
    id: 'disabledChildInEdu', section: 'secChildren',
    question: 'Of disabled children, how many are in higher education (18+)?',
    type: 'number', showIf: (a: Answers) => parseInt(a.disabledChildren) > 0,
    icon: '🎓', formRef: 'D12',
  },
  {
    id: 'hasBreastfeedingChild', section: 'secChildren',
    question: 'Purchased breastfeeding equipment for a child aged 2 or below?',
    tip: 'Up to RM1,000. Claimable once every 2 years.',
    type: 'yesno', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes', icon: '🍼',
  },
  {
    id: 'breastfeedingAmount', section: 'secChildren',
    question: 'Amount spent on breastfeeding equipment?',
    type: 'currency', max: 1000, showIf: (a: Answers) => a.hasBreastfeedingChild === 'yes',
    icon: '🍼', formRef: 'D13',
  },
  {
    id: 'childcareFees', section: 'secChildren',
    question: 'Paid childcare / kindergarten fees for children aged 6 or below?',
    tip: 'Up to RM3,000 for registered centres.',
    type: 'yesno', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes', icon: '🏫',
  },
  {
    id: 'childcareAmount', section: 'secChildren',
    question: 'Total childcare / kindergarten fees?',
    type: 'currency', max: 3000, showIf: (a: Answers) => a.childcareFees === 'yes',
    icon: '🏫', formRef: 'D14',
  },
  {
    id: 'sspnDeposit', section: 'secChildren',
    question: 'Made net deposits into SSPN (education savings) this year?',
    tip: 'Net deposit = total deposits minus total withdrawals in the year. Up to RM8,000.',
    type: 'yesno', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes', icon: '🎒',
  },
  {
    id: 'sspnAmount', section: 'secChildren',
    question: 'SSPN net deposit amount?',
    type: 'currency', max: 8000, showIf: (a: Answers) => a.sspnDeposit === 'yes',
    icon: '🎒', formRef: 'D15',
  },
  {
    id: 'learningDisability', section: 'secChildren',
    question: 'Spent on learning disability assessment / intervention for a child aged 18 or below?',
    tip: 'Up to RM6,000 for diagnosis, early intervention, rehabilitation.',
    type: 'yesno', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes', icon: '🧠',
  },
  {
    id: 'learningDisabilityAmount', section: 'secChildren',
    question: 'Amount spent on learning disability treatment?',
    type: 'currency', max: 6000, showIf: (a: Answers) => a.learningDisability === 'yes',
    icon: '🧠', formRef: 'D5a',
  },

  // ═══ PARENTS ═══
  {
    id: 'parentsMedical', section: 'secParents',
    question: 'Paid medical / carer / dental expenses for parents or grandparents?',
    tip: 'Parents must reside in Malaysia. Includes dental, nursing home, medical treatment. Up to RM8,000.',
    type: 'yesno', icon: '👴', showIf: notM,
  },
  {
    id: 'parentsMedicalAmount', section: 'secParents',
    question: 'Amount spent on parents\' medical/carer expenses?',
    type: 'currency', max: 8000, showIf: (a: Answers) => a.parentsMedical === 'yes',
    icon: '👴', formRef: 'D4',
  },

  // ═══ EDUCATION & LIFESTYLE ═══
  {
    id: 'selfEducation', section: 'secEduLifestyle',
    question: 'Paid for education / professional courses for yourself?',
    tip: 'Masters/PhD: any course. Others: law, accounting, technical, vocational, upskilling (RM2,000 sub-limit). Up to RM7,000 total.',
    type: 'yesno', icon: '📖', showIf: notM,
  },
  {
    id: 'educationAmount', section: 'secEduLifestyle',
    question: 'Education fees amount?',
    type: 'currency', max: 7000, showIf: (a: Answers) => a.selfEducation === 'yes',
    icon: '📖', formRef: 'D3',
  },
  {
    id: 'lifestyleSpending', section: 'secEduLifestyle',
    question: 'Total lifestyle spending? (Books, PC, phone, internet, sports equipment, gym)',
    tip: 'Books, laptops, phones, tablets, internet bills, sports equipment, gym memberships. Up to RM2,500.',
    type: 'currency', max: 2500, icon: '📱', formRef: 'D7', showIf: notM,
  },
  {
    id: 'additionalSports', section: 'secEduLifestyle',
    question: 'Additional sports spending beyond the lifestyle limit?',
    tip: 'Extra RM1,000 for sports equipment, facility rental, competition fees, gym.',
    type: 'yesno', icon: '🏋️', showIf: notM,
  },
  {
    id: 'additionalSportsAmount', section: 'secEduLifestyle',
    question: 'Additional sports amount?',
    type: 'currency', max: 1000, showIf: (a: Answers) => a.additionalSports === 'yes',
    icon: '🏋️', formRef: 'D8',
  },
  {
    id: 'hasEV', section: 'secEduLifestyle',
    question: 'Installed EV charging equipment at home, or purchased a domestic compost machine?',
    tip: 'Up to RM2,500 for EV charging facilities or domestic compost machines.',
    type: 'yesno', icon: '🔌', showIf: notM,
  },
  {
    id: 'evAmount', section: 'secEduLifestyle',
    question: 'EV charging / compost machine amount?',
    type: 'currency', max: 2500, showIf: (a: Answers) => a.hasEV === 'yes',
    icon: '🔌', formRef: 'D16',
  },

  // ═══ MEDICAL ═══
  {
    id: 'medicalSelf', section: 'secMedical',
    question: 'Medical expenses for serious diseases, fertility treatment, vaccines, dental, or mental health?',
    tip: 'Overall cap RM10,000. Sub-limits: vaccines RM1,000, dental RM1,000, health screening/mental health RM1,000.',
    type: 'yesno', icon: '🏥', showIf: notM,
  },
  {
    id: 'medicalSelfAmount', section: 'secMedical',
    question: 'Total medical expenses (self, spouse, or child)?',
    type: 'currency', max: 10000, showIf: (a: Answers) => a.medicalSelf === 'yes',
    icon: '🏥', formRef: 'D5',
  },
  {
    id: 'disabledEquipment', section: 'secMedical',
    question: 'Purchased equipment for a disabled person (self, spouse, child, or parent)?',
    tip: 'Wheelchairs, hearing aids, dialysis machines, crutches. Up to RM6,000. Spectacles are NOT included.',
    type: 'yesno', icon: '🦽', showIf: notM,
  },
  {
    id: 'disabledEquipmentAmount', section: 'secMedical',
    question: 'Disabled equipment amount?',
    type: 'currency', max: 6000, showIf: (a: Answers) => a.disabledEquipment === 'yes',
    icon: '🦽', formRef: 'D6',
  },

  // ═══ INSURANCE & RETIREMENT ═══
  {
    id: 'epfAmount', section: 'secInsurance',
    question: 'EPF contributions this year?',
    tip: 'Check your EPF statement. Private sector: EPF cap is RM4,000 for relief purposes.',
    type: 'currency', max: 4000, icon: '🏦', formRef: 'D17a', showIf: notM,
  },
  {
    id: 'lifeInsurance', section: 'secInsurance',
    question: 'Life insurance / takaful premiums paid this year?',
    tip: 'EPF + life insurance combined cap is RM7,000. Life insurance alone capped at RM3,000.',
    type: 'currency', max: 3000, icon: '🛡️', formRef: 'D17b', showIf: notM,
  },
  {
    id: 'eduMedInsurance', section: 'secInsurance',
    question: 'Education or medical insurance premiums?',
    tip: 'For self, spouse, or child. Up to RM4,000.',
    type: 'currency', max: 4000, icon: '🏥', formRef: 'D18', showIf: notM,
  },
  {
    id: 'socso', section: 'secInsurance',
    question: 'SOCSO / EIS contribution this year?',
    tip: 'Check your payslip. Cap is RM350.',
    type: 'currency', max: 350, icon: '📋', formRef: 'D19', showIf: notM,
  },
  {
    id: 'prsContribution', section: 'secInsurance',
    question: 'Contributed to a Private Retirement Scheme (PRS)?',
    tip: 'Up to RM3,000. Separate from EPF. Saves tax AND builds retirement savings!',
    type: 'yesno', icon: '🎯', showIf: notM,
  },
  {
    id: 'prsAmount', section: 'secInsurance',
    question: 'PRS contribution amount?',
    type: 'currency', max: 3000, showIf: (a: Answers) => a.prsContribution === 'yes',
    icon: '🎯', formRef: 'D20',
  },

  // ═══ HOUSING ═══
  {
    id: 'firstHomeLoan', section: 'secHousing',
    question: 'Are you paying a housing loan for your FIRST residential property, with SPA signed between 2025–2027?',
    tip: 'New from YA 2025! Claim interest paid on your first home loan. Must be a residential property.',
    type: 'yesno', icon: '🏠', showIf: notM,
  },
  {
    id: 'housePrice', section: 'secHousing',
    question: 'What is the purchase price range of the property?',
    type: 'select', showIf: (a: Answers) => a.firstHomeLoan === 'yes', icon: '🏠',
    options: [
      { value: 'under500k', label: '≤ RM500,000 (up to RM7,000 relief)' },
      { value: '500k750k', label: 'RM500,001 – RM750,000 (up to RM5,000)' },
      { value: 'above750k', label: 'Above RM750,000 (not eligible)' },
    ],
  },
  {
    id: 'housingInterest', section: 'secHousing',
    question: 'Housing loan interest paid this year?',
    type: 'currency', max: 7000,
    showIf: (a: Answers) => a.firstHomeLoan === 'yes' && a.housePrice !== 'above750k',
    icon: '🏠', formRef: 'D21',
  },

  // ═══ DEDUCTIONS ═══
  {
    id: 'hasDonations', section: 'secDeductions',
    question: 'Made donations to approved charities, sports bodies, or government funds?',
    tip: 'Up to 10% of aggregate income. Includes LHDN-approved institutions, sports activities, national interest projects, wakaf. Keep receipts.',
    type: 'yesno', icon: '🤲', showIf: notM,
  },
  {
    id: 'donationAmount', section: 'secDeductions',
    question: 'Total approved donations?',
    tip: 'Only donations to LHDN-approved institutions qualify. Keep official receipts.',
    type: 'currency', showIf: (a: Answers) => a.hasDonations === 'yes',
    icon: '🤲', formRef: 'C7',
  },

  // ═══ PCB (Monthly Tax Deduction) ═══
  {
    id: 'pcbAmount', section: 'secPcb',
    question: 'Total PCB (Potongan Cukai Bulanan) deducted by your employer this year?',
    tip: 'Check your EA form (Section C) or total up your monthly payslips. PCB is the monthly tax already withheld by your employer — it reduces what you still owe LHDN. If PCB > tax payable, you get a refund.',
    type: 'currency', icon: '🏦', formRef: 'H4',
    showIf: (a: Answers) => a.formType !== 'M',
  },

  // ═══ REBATES ═══
  {
    id: 'zakatAmount', section: 'secRebates',
    question: 'Paid zakat or fitrah this year? If so, how much?',
    tip: 'Zakat is a DIRECT tax rebate — it reduces your tax payable ringgit-for-ringgit, not just your chargeable income.',
    type: 'currency', icon: '🕌', formRef: 'F1', showIf: notM,
  },

  // ═══ EMAIL ═══
  {
    id: 'email', section: 'secEmail',
    question: 'Want a reminder in November to maximize your year-end reliefs?',
    tip: 'We\'ll remind you to top up PRS, SSPN, insurance, and lifestyle before December 31st. No spam.',
    type: 'email', icon: '📧',
  },
];
