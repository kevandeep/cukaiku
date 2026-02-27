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
    tip: 'Not sure? 90% of salaried Malaysians file Form BE. Choose Form B if you are a sole proprietor, registered freelancer, or receive partnership income — basically if you run a business alongside your job. Choose Form M only if you spent fewer than 182 days in Malaysia this tax year; non-residents are taxed at a flat 30% with no personal reliefs.',
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
    tip: 'Your employer is required by law to give you an EA form by March 1 each year — look for this number in Section B. It covers everything you earned as an employee: basic salary, annual bonus, performance bonuses, car/housing/meal allowances, commissions, overtime, director fees, and gratuity. If you worked at more than one employer this year, add up all your EA forms. This maps to field C1 on Form BE.',
    type: 'currency', icon: '💰', formRef: 'C1',
  },

  // ═══ BUSINESS INCOME (Form B only) ═══
  {
    id: 'businessGrossIncome', section: 'secBusiness',
    question: 'What is your gross business income? (sales, fees, commissions before expenses)',
    tip: 'Include all revenue from your sole proprietorship, partnership share, or registered freelance business before any deductions. For a consulting business this would be total invoiced fees. For a retail business, total sales revenue. Do not subtract any expenses yet — the next question asks for your adjusted (net) income.',
    type: 'currency', icon: '🏪', formRef: 'C6',
    showIf: (a: Answers) => a.formType === 'B',
  },
  {
    id: 'businessAdjustedIncome', section: 'secBusiness',
    question: 'What is your adjusted business income (after deducting allowable business expenses)?',
    tip: 'This is your gross business income minus allowable business expenses. Deductible items include: staff salaries, office rent, depreciation via capital allowances, cost of goods sold, utilities, professional fees, and marketing costs. Not deductible: private/personal expenses, capital expenditure (claim as capital allowances instead), fines. If you have a business accountant, use the figure from your income statement.',
    type: 'currency', icon: '🏪', formRef: 'C6',
    showIf: (a: Answers) => a.formType === 'B',
  },

  {
    id: 'hasRentalIncome', section: 'secOtherIncome',
    question: 'Do you receive rental income from property?',
    tip: 'This covers rental from residential or commercial properties you own. The good news: you can deduct several expenses before tax. Allowable deductions include assessment tax, quit rent, fire insurance, repair and maintenance costs, loan interest on the property\'s mortgage, and agent fees. Capital improvements (renovations that add value) are NOT deductible — only repairs are.',
    type: 'yesno', icon: '🏘️',
  },
  {
    id: 'rentalGross', section: 'secOtherIncome',
    question: 'What is your gross annual rental income?',
    tip: 'Total rent received from all properties before any deductions. If you have 3 properties, add all 3 together. Use the amount actually received in 2025, not the amount due.',
    type: 'currency', showIf: (a: Answers) => a.hasRentalIncome === 'yes',
    icon: '🏘️', formRef: 'C2',
  },
  {
    id: 'rentalExpenses', section: 'secOtherIncome',
    question: 'What are your allowable rental expenses? (Assessment, quit rent, repairs, loan interest, agent fees)',
    tip: 'Deductible: assessment tax, quit rent, fire insurance premiums, genuine repairs & maintenance (not improvements), loan interest on the rental property, and agent commission. NOT deductible: capital improvements like adding a room or renovating a kitchen (those are capital items), your own time spent managing the property, or any personal expenses mixed in.',
    type: 'currency', showIf: (a: Answers) => a.hasRentalIncome === 'yes', icon: '🏘️',
  },
  {
    id: 'hasInterestIncome', section: 'secOtherIncome',
    question: 'Do you receive taxable interest or discount income?',
    tip: 'Important distinction: interest from Malaysian bank savings accounts and fixed deposits is TAX EXEMPT and should NOT be included here. What IS taxable: interest from bonds, debentures, treasury bills, foreign bank accounts, and corporate debentures. If you only have savings/FD interest from Malaysian banks, answer No.',
    type: 'yesno', icon: '💵',
  },
  {
    id: 'interestIncome', section: 'secOtherIncome',
    question: 'How much taxable interest / discount income?',
    tip: 'Do NOT include Malaysian bank savings or fixed deposit interest (those are exempt). Include: interest from bonds and corporate debentures, income from treasury bills bought at a discount, and any interest earned from foreign bank accounts. When in doubt, check whether the paying institution issued you a tax certificate.',
    type: 'currency', showIf: (a: Answers) => a.hasInterestIncome === 'yes',
    icon: '💵', formRef: 'C3',
  },
  {
    id: 'hasDividendIncome', section: 'secOtherIncome',
    question: 'Do you receive dividend income exceeding RM100,000 from Malaysian resident companies?',
    tip: 'Under the single-tier tax system, most dividends from Malaysian-resident companies are fully exempt — you pay nothing on them regardless of amount. HOWEVER, a new rule from YA 2025 (Budget 2025) imposes a flat 2% tax on the portion exceeding RM100,000 per year. If your total Malaysian dividends are under RM100k, answer No. Only answer Yes if you received more than RM100,000 in dividends from resident companies.',
    type: 'yesno', icon: '📈',
  },
  {
    id: 'dividendIncome', section: 'secOtherIncome',
    question: 'Enter the portion of dividend income ABOVE RM100,000.',
    tip: 'Only enter the excess — the amount above the RM100,000 threshold. The first RM100,000 is completely exempt. Example: if you received RM150,000 in dividends, enter RM50,000 here. This amount is taxed at a flat 2% rate, completely separate from the progressive income tax brackets — it does not push your other income into higher brackets.',
    type: 'currency', showIf: (a: Answers) => a.hasDividendIncome === 'yes',
    icon: '📈', formRef: 'C3a',
  },
  {
    id: 'hasRoyaltyIncome', section: 'secOtherIncome',
    question: 'Do you receive royalty income? (copyright, patents, literary works)',
    tip: 'Royalties include payments for use of your intellectual property: books, articles, music, artistic works, patents, and trademarks. Some partial exemptions apply: the first RM20,000 of royalties from literary/artistic works and music compositions is exempt from tax. Enter your net taxable amount in the next question after accounting for these exemptions.',
    type: 'yesno', icon: '📝',
  },
  {
    id: 'royaltyIncome', section: 'secOtherIncome',
    question: 'Net taxable royalty income (after exemptions)?',
    tip: 'Apply the relevant exemption before entering: literary/artistic royalties have a RM20,000 exemption, musical compositions also RM20,000. Example: if you earned RM35,000 in book royalties, your taxable amount is RM15,000 (RM35k minus RM20k exemption). For patents or trademarks, there is no exemption — the full amount is taxable. Check LHDN guidelines for your specific royalty type if unsure.',
    type: 'currency', showIf: (a: Answers) => a.hasRoyaltyIncome === 'yes',
    icon: '📝', formRef: 'C3',
  },
  {
    id: 'hasPensionIncome', section: 'secOtherIncome',
    question: 'Do you receive pension income?',
    tip: 'Malaysian pension rules: if you retired at age 55 or above (or at the compulsory retirement age set by your employer), your pension is fully tax-exempt. Only answer Yes if you retired before age 55 — in that case, pension is taxable until you actually reach 55. Most retirees answer No here because they retired at 55+.',
    type: 'yesno', icon: '👴',
  },
  {
    id: 'pensionIncome', section: 'secOtherIncome',
    question: 'How much taxable pension income? (only if retired before 55)',
    tip: 'Enter the pension you received in 2025. Once you reach age 55, all future pension payments become fully exempt — so if you turned 55 partway through the year, only the portion received before your 55th birthday is taxable. If you are unsure, check your pension provider\'s annual statement.',
    type: 'currency', showIf: (a: Answers) => a.hasPensionIncome === 'yes',
    icon: '👴', formRef: 'C3',
  },
  {
    id: 'hasOtherIncome', section: 'secOtherIncome',
    question: 'Any other income? (freelance, part-time, occasional jobs not in EA form)',
    tip: 'If you earned money outside your main employment and it was NOT captured in an EA form, declare it here. This includes: freelance/consulting fees paid to you personally (not through a registered business), part-time lecturing or tutoring fees, writing fees from publications, broadcasting income, honoraria, and prize money. Note: if you have a registered business receiving this income, it belongs in the Form B business income section instead.',
    type: 'yesno', icon: '💼',
  },
  {
    id: 'otherIncome', section: 'secOtherIncome',
    question: 'Total other income?',
    tip: 'Add up all income from the sources you identified. Keep supporting documents (invoices, bank statements, payment receipts) in case LHDN asks for verification. This all goes into field C3 on your form.',
    type: 'currency', showIf: (a: Answers) => a.hasOtherIncome === 'yes',
    icon: '💼', formRef: 'C3',
  },

  // ═══ PERSONAL ═══
  {
    id: 'maritalStatus', section: 'secPersonal',
    question: 'What is your marital status?',
    tip: 'This determines whether you can claim spouse-related reliefs. If you are married and your spouse has no income or you are doing joint assessment together, you may claim an additional RM4,000 spouse relief. If divorced and paying court-ordered alimony, you may deduct that amount as well.',
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
    tip: 'If your spouse has no income, or if you and your spouse have chosen joint assessment (filing together as one taxpayer), you can claim RM4,000 spouse relief. If your spouse has their own income and files separately, this relief does not apply — but your spouse gets their own full RM9,000 individual relief on their return.',
    type: 'select', showIf: (a: Answers) => notM(a) && a.maritalStatus === 'married', icon: '👫',
    options: [
      { value: 'no', label: 'No income / Joint assessment' },
      { value: 'yes', label: 'Yes, separate assessment' },
    ],
  },
  {
    id: 'isDisabled', section: 'secPersonal',
    question: 'Are you registered as a disabled person (OKU) with JKM?',
    tip: 'If you are registered with Jabatan Kebajikan Masyarakat (JKM) as an OKU (Orang Kurang Upaya), you receive an additional RM7,000 relief on top of the standard RM9,000 individual relief — giving you a total of RM16,000. You must have an active OKU card/registration to claim this. The registration is with JKM, not LHDN.',
    type: 'yesno', icon: '♿', showIf: notM,
  },
  {
    id: 'spouseDisabled', section: 'secPersonal',
    question: 'Is your spouse registered as disabled (OKU)?',
    tip: 'If your spouse is registered with JKM as OKU, you can claim an additional RM6,000 disabled spouse relief on top of the standard RM4,000 spouse relief — for a total of RM10,000 in spouse-related reliefs. Your spouse must be an active OKU registrant.',
    type: 'yesno', showIf: (a: Answers) => notM(a) && a.maritalStatus === 'married', icon: '♿',
  },

  // ═══ CHILDREN ═══
  {
    id: 'hasChildren', section: 'secChildren',
    question: 'Do you have children?',
    tip: 'Children-related reliefs are among the most valuable for Malaysian taxpayers. Claiming RM2,000 per child under 18 is automatic. But there are additional reliefs for higher education, SSPN deposits, childcare fees, and special needs children that many parents miss. Answer Yes to see the full picture.',
    type: 'yesno', icon: '👶', showIf: notM,
  },
  {
    id: 'childrenUnder18', section: 'secChildren',
    question: 'How many unmarried children under 18?',
    tip: 'RM2,000 per child, no cap on the number of children. The child must be unmarried and under 18 years old as of December 31, 2025. Adopted children qualify if legally adopted. Stepchildren qualify if dependent on you.',
    type: 'number', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes',
    icon: '🧒', formRef: 'D9',
  },
  {
    id: 'childrenHigherEdu', section: 'secChildren',
    question: 'How many children (18+) in full-time higher education (diploma/degree/masters)?',
    tip: 'RM8,000 per child pursuing a full-time diploma, degree, or postgraduate programme at an approved institution. The institution must be in Malaysia or a recognised foreign university. The programme must be in an approved field of study. Keep the university enrollment letter and fee receipts.',
    type: 'number', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes',
    icon: '🎓', formRef: 'D10',
  },
  {
    id: 'childrenPreU', section: 'secChildren',
    question: 'How many children (18+) in pre-U / A-Levels / matriculation?',
    tip: 'RM2,000 per child in pre-university programmes: A-Levels, STPM, Matriculation (Matrikulasi), Foundation programmes, or equivalent. The child must be 18 or above and studying full-time. This is separate from the RM8,000 for university-level education.',
    type: 'number', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes',
    icon: '📚', formRef: 'D10',
  },
  {
    id: 'disabledChildren', section: 'secChildren',
    question: 'How many disabled children (registered OKU)?',
    tip: 'RM8,000 per child registered as OKU with JKM, regardless of age. If the disabled child is also in full-time higher education (university level), you can claim an additional RM8,000 on top — giving RM16,000 total for that child. The child\'s OKU registration must be current.',
    type: 'number', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes',
    icon: '♿', formRef: 'D11',
  },
  {
    id: 'disabledChildInEdu', section: 'secChildren',
    question: 'Of disabled children, how many are in higher education (18+)?',
    tip: 'If a disabled child (OKU) is also studying full-time at diploma level or above, you can claim an additional RM8,000 education relief on top of the RM8,000 OKU child relief — totalling RM16,000 for that child. Enter only the number of your disabled children who are currently in higher education.',
    type: 'number', showIf: (a: Answers) => parseInt(a.disabledChildren) > 0,
    icon: '🎓', formRef: 'D12',
  },
  {
    id: 'hasBreastfeedingChild', section: 'secChildren',
    question: 'Purchased breastfeeding equipment for a child aged 2 or below?',
    tip: 'Up to RM1,000 for breastfeeding equipment — this includes breast pumps, milk storage bottles, and nursing accessories. Claimable once every two years (so if you claimed in 2024, you cannot claim again until 2026). The child must be 2 years old or younger.',
    type: 'yesno', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes', icon: '🍼',
  },
  {
    id: 'breastfeedingAmount', section: 'secChildren',
    question: 'Amount spent on breastfeeding equipment?',
    tip: 'Enter the total spent on breast pumps, milk storage, and nursing accessories. The cap is RM1,000. Keep your receipts — LHDN may request them during an audit.',
    type: 'currency', max: 1000, showIf: (a: Answers) => a.hasBreastfeedingChild === 'yes',
    icon: '🍼', formRef: 'D13',
  },
  {
    id: 'childcareFees', section: 'secChildren',
    question: 'Paid childcare / kindergarten fees for children aged 6 or below?',
    tip: 'Up to RM3,000 for fees paid to a registered childcare centre or kindergarten for children aged 6 and below. The institution must be registered with the relevant government authority. This relief is for the parent who actually paid the fees — if both parents contributed, the one claiming should be the one whose name is on the invoice.',
    type: 'yesno', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes', icon: '🏫',
  },
  {
    id: 'childcareAmount', section: 'secChildren',
    question: 'Total childcare / kindergarten fees?',
    tip: 'Enter the total fees paid in 2025 for registered childcare or kindergarten. Maximum claimable is RM3,000. If you paid more than RM3,000, enter RM3,000. Keep the official receipt from the registered institution.',
    type: 'currency', max: 3000, showIf: (a: Answers) => a.childcareFees === 'yes',
    icon: '🏫', formRef: 'D14',
  },
  {
    id: 'sspnDeposit', section: 'secChildren',
    question: 'Made net deposits into SSPN (education savings) this year?',
    tip: 'SSPN (Skim Simpanan Pendidikan Nasional) is PTPTN\'s education savings scheme to fund your children\'s higher education. The relief is based on NET deposits: total deposits made in 2025 minus any withdrawals made in 2025. Log in to ptptn.gov.my/sspn to check your annual statement. You can deposit up to RM8,000 and claim it all as relief — making this one of the most straightforward tax reliefs available if you have school-age children.',
    type: 'yesno', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes', icon: '🎒',
  },
  {
    id: 'sspnAmount', section: 'secChildren',
    question: 'SSPN net deposit amount?',
    tip: 'Net deposit = total deposited in 2025 minus total withdrawn in 2025. If you deposited RM5,000 and withdrew RM2,000, enter RM3,000. If you only deposited and made no withdrawals, enter the full deposit amount. Cap is RM8,000.',
    type: 'currency', max: 8000, showIf: (a: Answers) => a.sspnDeposit === 'yes',
    icon: '🎒', formRef: 'D15',
  },
  {
    id: 'learningDisability', section: 'secChildren',
    question: 'Spent on learning disability assessment / intervention for a child aged 18 or below?',
    tip: 'Up to RM6,000 for costs related to a child (aged 18 or below) with a learning disability such as dyslexia, autism spectrum disorder (ASD), ADHD, or developmental delays. Claimable expenses include: formal diagnostic assessments, early intervention programmes, speech therapy, occupational therapy, and special education tuition. The diagnosis does not need to be from a government hospital — private specialists qualify too.',
    type: 'yesno', showIf: (a: Answers) => notM(a) && a.hasChildren === 'yes', icon: '🧠',
  },
  {
    id: 'learningDisabilityAmount', section: 'secChildren',
    question: 'Amount spent on learning disability treatment?',
    tip: 'Enter total spent on diagnosis, therapy, and intervention for the child\'s learning disability. Maximum RM6,000. Keep all receipts from therapists, assessment centres, or medical professionals.',
    type: 'currency', max: 6000, showIf: (a: Answers) => a.learningDisability === 'yes',
    icon: '🧠', formRef: 'D5a',
  },

  // ═══ PARENTS ═══
  {
    id: 'parentsMedical', section: 'secParents',
    question: 'Paid medical / carer / dental expenses for parents or grandparents?',
    tip: 'Up to RM8,000 for medical, dental, or care-related expenses for your parents or grandparents. Key conditions: (1) They must be Malaysian residents. (2) The expenses must be paid by you — not reimbursed by insurance. (3) Covers: hospital treatment, specialist fees, dental treatment, nursing home fees, and home nursing care. If multiple siblings share the cost, each may claim their proportion.',
    type: 'yesno', icon: '👴', showIf: notM,
  },
  {
    id: 'parentsMedicalAmount', section: 'secParents',
    question: 'Amount spent on parents\' medical/carer expenses?',
    tip: 'Enter the total you personally paid in 2025 for your parents\' or grandparents\' medical, dental, and care costs. Cap is RM8,000. If siblings split the bill, each claims their share. Keep hospital invoices, pharmacy receipts, and nursing home statements as supporting documents.',
    type: 'currency', max: 8000, showIf: (a: Answers) => a.parentsMedical === 'yes',
    icon: '👴', formRef: 'D4',
  },

  // ═══ EDUCATION & LIFESTYLE ═══
  {
    id: 'selfEducation', section: 'secEduLifestyle',
    question: 'Paid for education / professional courses for yourself?',
    tip: 'Up to RM7,000 for courses you took to improve your skills or qualifications. The full RM7,000 applies if you are pursuing a Masters or PhD (any field of study qualifies). For other levels, approved fields include: law, accounting, Islamic financing, technical & vocational skills, and specific upskilling programmes — these have a RM2,000 sub-limit within the RM7,000 cap. Professional certifications (CFA, ACCA, CIMA, etc.) generally qualify. The course provider must be an approved institution.',
    type: 'yesno', icon: '📖', showIf: notM,
  },
  {
    id: 'educationAmount', section: 'secEduLifestyle',
    question: 'Education fees amount?',
    tip: 'Enter the total tuition/course fees you paid in 2025. Maximum RM7,000. Keep your official fee receipt from the institution. Note: examination fees, registration fees, and study materials may qualify depending on the course — check with the institution whether they are included in the approved fee structure.',
    type: 'currency', max: 7000, showIf: (a: Answers) => a.selfEducation === 'yes',
    icon: '📖', formRef: 'D3',
  },
  {
    id: 'lifestyleSpending', section: 'secEduLifestyle',
    question: 'Total lifestyle spending? (Books, PC, phone, internet, sports equipment, gym)',
    tip: 'Up to RM2,500 for a broad range of everyday purchases. Qualifying items include: books and magazines (printed or e-books), laptops, desktops, and tablets, smartphones and other personal gadgets, internet subscription fees (broadband, mobile data), sports equipment, gym memberships, and sports activity fees. Keep all receipts. Note: household appliances (fridges, washing machines) do not qualify — only the categories listed here.',
    type: 'currency', max: 2500, icon: '📱', formRef: 'D7', showIf: notM,
  },
  {
    id: 'additionalSports', section: 'secEduLifestyle',
    question: 'Additional sports spending beyond the lifestyle limit?',
    tip: 'There is a separate, additional RM1,000 relief specifically for sports — on top of the RM2,500 lifestyle relief. If your sports spending has already maxed out the lifestyle relief, this extra RM1,000 lets you claim more. Qualifying items: sports equipment, sports facility rental, competition entry fees, gym memberships, and sports training fees. This cannot be double-counted with the lifestyle relief — it must be additional spending.',
    type: 'yesno', icon: '🏋️', showIf: notM,
  },
  {
    id: 'additionalSportsAmount', section: 'secEduLifestyle',
    question: 'Additional sports amount?',
    tip: 'Enter the sports-specific spending that was NOT already counted in your lifestyle relief. Maximum RM1,000 additional.',
    type: 'currency', max: 1000, showIf: (a: Answers) => a.additionalSports === 'yes',
    icon: '🏋️', formRef: 'D8',
  },
  {
    id: 'hasEV', section: 'secEduLifestyle',
    question: 'Installed EV charging equipment at home, or purchased a domestic compost machine?',
    tip: 'Up to RM2,500 for two specific Budget 2025 initiatives: (1) EV charging equipment installed at your residential property — includes the charger hardware, wiring, and installation labour costs; and (2) domestic compost machines for home composting. Both must be for personal residential use, not commercial. Keep the purchase receipt and, for EV chargers, the installation invoice.',
    type: 'yesno', icon: '🔌', showIf: notM,
  },
  {
    id: 'evAmount', section: 'secEduLifestyle',
    question: 'EV charging / compost machine amount?',
    tip: 'Enter the total spent including equipment and installation. Cap is RM2,500.',
    type: 'currency', max: 2500, showIf: (a: Answers) => a.hasEV === 'yes',
    icon: '🔌', formRef: 'D16',
  },

  // ═══ MEDICAL ═══
  {
    id: 'medicalSelf', section: 'secMedical',
    question: 'Medical expenses for serious diseases, fertility treatment, vaccines, dental, or mental health?',
    tip: 'This relief covers a wide range of medical costs for yourself, your spouse, and your children — up to RM10,000 total. Within that cap, there are sub-limits to be aware of: vaccines (MMR, pneumococcal, flu, HPV, shingles, etc.) are capped at RM1,000; dental treatment (fillings, extractions, braces, crowns) is capped at RM1,000; medical examinations, health screenings, and mental health consultations are capped at RM1,000. Serious disease treatments (cancer chemotherapy, dialysis, heart surgery, organ transplants, etc.) have no sub-limit and can use the full RM10,000 cap.',
    type: 'yesno', icon: '🏥', showIf: notM,
  },
  {
    id: 'medicalSelfAmount', section: 'secMedical',
    question: 'Total medical expenses (self, spouse, or child)?',
    tip: 'Add up all qualifying medical costs paid in 2025 for yourself, your spouse, and your children — up to RM10,000. Qualifying costs: specialist fees, hospital bills, prescribed medications, fertility treatment, vaccination, dental treatment, health screenings, and mental health consultations. Not qualifying: cosmetic procedures, gym supplements, or non-prescription health products.',
    type: 'currency', max: 10000, showIf: (a: Answers) => a.medicalSelf === 'yes',
    icon: '🏥', formRef: 'D5',
  },
  {
    id: 'disabledEquipment', section: 'secMedical',
    question: 'Purchased equipment for a disabled person (self, spouse, child, or parent)?',
    tip: 'Up to RM6,000 for specialised equipment purchased for a person with a disability — whether yourself, your spouse, child, or parent. Qualifying items: wheelchairs, crutches, hearing aids, dialysis machines, and other medically necessary mobility or assistive devices. Note: standard spectacles and contact lenses do NOT qualify. The equipment must be a medical necessity, not a convenience item.',
    type: 'yesno', icon: '🦽', showIf: notM,
  },
  {
    id: 'disabledEquipmentAmount', section: 'secMedical',
    question: 'Disabled equipment amount?',
    tip: 'Enter the total cost of qualifying disability equipment. Cap is RM6,000. Keep the purchase receipt and, if possible, a note from a medical professional confirming the necessity of the equipment.',
    type: 'currency', max: 6000, showIf: (a: Answers) => a.disabledEquipment === 'yes',
    icon: '🦽', formRef: 'D6',
  },

  // ═══ INSURANCE & RETIREMENT ═══
  {
    id: 'epfAmount', section: 'secInsurance',
    question: 'EPF contributions this year?',
    tip: 'Log in to i-Akaun (kwsp.gov.my) to see your total contributions for 2025, or check the EPF column on your payslips and add them up. The standard employee contribution rate is 11% of monthly salary. Important: even if your actual EPF contribution exceeds RM4,000, the tax relief cap is RM4,000 — enter the lower of the two. This relief is shared with life insurance in a combined RM7,000 cap.',
    type: 'currency', max: 4000, icon: '🏦', formRef: 'D17a', showIf: notM,
  },
  {
    id: 'lifeInsurance', section: 'secInsurance',
    question: 'Life insurance / takaful premiums paid this year?',
    tip: 'Life insurance and EPF share a combined RM7,000 cap. Life insurance alone is capped at RM3,000 within that. Example: if your EPF relief is RM4,000, you can claim up to RM3,000 in life insurance (total = RM7,000). If your EPF is RM2,000, you could claim up to RM3,000 in life insurance — you cannot claim RM5,000 even though there is RM5,000 remaining in the combined cap, because life insurance itself is capped at RM3,000. Check your yearly insurance certificate or annual premium notice for the annual premium amount.',
    type: 'currency', max: 3000, icon: '🛡️', formRef: 'D17b', showIf: notM,
  },
  {
    id: 'eduMedInsurance', section: 'secInsurance',
    question: 'Education or medical insurance premiums?',
    tip: 'Up to RM4,000 for education insurance (covering your children\'s future education costs) or medical/health insurance (hospitalisation, surgical, critical illness) for yourself, your spouse, or your children. This is a SEPARATE relief from life insurance — it has its own RM4,000 cap. Check your insurance policy type to confirm it qualifies as education or medical insurance.',
    type: 'currency', max: 4000, icon: '🏥', formRef: 'D18', showIf: notM,
  },
  {
    id: 'socso', section: 'secInsurance',
    question: 'SOCSO / EIS contribution this year?',
    tip: 'SOCSO (Social Security Organisation) and EIS (Employment Insurance System) contributions are deducted from your salary automatically if you are a private sector employee. Find the amount on your payslip — it is usually labelled "SOCSO" or "PERKESO". The tax relief cap is RM350, which most full-year employees will reach. Employers also contribute to SOCSO, but only the employee\'s share is claimable as relief.',
    type: 'currency', max: 350, icon: '📋', formRef: 'D19', showIf: notM,
  },
  {
    id: 'prsContribution', section: 'secInsurance',
    question: 'Contributed to a Private Retirement Scheme (PRS)?',
    tip: 'PRS (Private Retirement Scheme) is a voluntary retirement savings vehicle managed by SC-approved fund managers. It gives you an additional RM3,000 relief that is completely separate from EPF — making it one of the most underutilised reliefs available. Providers include CIMB-Principal, Public Mutual, AmFunds, RHB, and others. You can contribute any amount up to RM3,000 before December 31 and claim the full relief. If you haven\'t started a PRS account yet, this is one of the easiest tax optimisations available.',
    type: 'yesno', icon: '🎯', showIf: notM,
  },
  {
    id: 'prsAmount', section: 'secInsurance',
    question: 'PRS contribution amount?',
    tip: 'Enter the total amount you contributed to your PRS account(s) in 2025. The maximum relief is RM3,000. Log in to your PRS provider\'s portal or check your annual PRS statement for the total.',
    type: 'currency', max: 3000, showIf: (a: Answers) => a.prsContribution === 'yes',
    icon: '🎯', formRef: 'D20',
  },

  // ═══ HOUSING ═══
  {
    id: 'firstHomeLoan', section: 'secHousing',
    question: 'Are you paying a housing loan for your FIRST residential property, with SPA signed between 2025–2027?',
    tip: 'This is a brand new relief introduced under Budget 2025, applicable from YA 2025. Four eligibility conditions must ALL be met: (1) It must be your first residential property — you cannot already own a home when the SPA was signed. (2) The Sale and Purchase Agreement (SPA) must have been signed between 1 January 2025 and 31 December 2027. (3) The property must be residential (not commercial or mixed-use). (4) You must be paying a housing loan for it. The maximum relief depends on purchase price: ≤RM500k → up to RM7,000 interest relief; RM500k–RM750k → up to RM5,000; above RM750k → not eligible.',
    type: 'yesno', icon: '🏠', showIf: notM,
  },
  {
    id: 'housePrice', section: 'secHousing',
    question: 'What is the purchase price range of the property?',
    tip: 'The purchase price determines your maximum eligible relief. Use the price on your SPA (Sale and Purchase Agreement), not the market value or valuation. Properties above RM750,000 are not eligible for this relief.',
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
    tip: 'Enter the total interest component of your housing loan payments in 2025 — NOT the principal repayment. Your bank\'s annual loan statement will show a breakdown of principal vs interest. Alternatively, your monthly instalment letter will show the interest rate and you can calculate the annual interest. Only the interest qualifies for relief, not the principal.',
    type: 'currency', max: 7000,
    showIf: (a: Answers) => a.firstHomeLoan === 'yes' && a.housePrice !== 'above750k',
    icon: '🏠', formRef: 'D21',
  },

  // ═══ DEDUCTIONS ═══
  {
    id: 'hasDonations', section: 'secDeductions',
    question: 'Made donations to approved charities, sports bodies, or government funds?',
    tip: 'Donations to LHDN-approved institutions are deductible up to 10% of your aggregate income. Approved recipients include: registered charities and welfare organisations (e.g. National Cancer Society, Pertubuhan Kebajikan), sports associations affiliated with the Olympic Council of Malaysia, national interest projects approved by the Finance Ministry, wakaf contributions, and donations directly to government funds. Important: NOT all charities are LHDN-approved. Always ask the institution for confirmation of their LHDN approval status and get an official receipt with their registration details.',
    type: 'yesno', icon: '🤲', showIf: notM,
  },
  {
    id: 'donationAmount', section: 'secDeductions',
    question: 'Total approved donations?',
    tip: 'Enter the total amount donated to LHDN-approved institutions in 2025. The deduction is capped at 10% of your aggregate income (LHDN will apply the cap automatically). Keep all official receipts — they should show the institution\'s name, registration number, and amount donated. Donations of cash, cheque, or bank transfer all qualify; in-kind donations are more complex.',
    type: 'currency', showIf: (a: Answers) => a.hasDonations === 'yes',
    icon: '🤲', formRef: 'C7',
  },

  // ═══ PCB (Monthly Tax Deduction) ═══
  {
    id: 'pcbAmount', section: 'secPcb',
    question: 'Total PCB (Potongan Cukai Bulanan) deducted by your employer this year?',
    tip: 'PCB is the monthly tax your employer automatically deducts from your salary and remits to LHDN on your behalf — essentially tax paid in advance. Find the total in Section C of your EA form, or add up the "PCB" line from all 12 monthly payslips. This number is crucial: if your total PCB exceeds your actual tax liability, you are owed a refund from LHDN (usually paid within 30 working days of e-Filing). If PCB is less than your tax, you will need to pay the difference when you file.',
    type: 'currency', icon: '🏦', formRef: 'H4',
    showIf: (a: Answers) => a.formType !== 'M',
  },

  // ═══ REBATES ═══
  {
    id: 'zakatAmount', section: 'secRebates',
    question: 'Paid zakat or fitrah this year? If so, how much?',
    tip: 'Zakat is uniquely powerful compared to other reliefs — it is a direct tax rebate, not just a deduction. This means it reduces your final tax bill ringgit-for-ringgit. Example: if your calculated income tax is RM5,000 and you paid RM1,200 in zakat, your final tax bill is RM3,800 — not RM4,760 as it would be if zakat were only a relief deduction. Enter your total zakat fitrah plus zakat harta (wealth zakat) paid in 2025. Keep your official receipts from your state\'s Pusat Zakat or Lembaga Zakat.',
    type: 'currency', icon: '🕌', formRef: 'F1', showIf: notM,
  },

  // ═══ EMAIL ═══
  {
    id: 'email', section: 'secEmail',
    question: 'Enter your email to receive your personalised LHDN form guide',
    tip: 'We\'ll email you a PDF that mirrors the actual LHDN Borang BE/B/M layout with your calculated amounts pre-filled into the correct fields. The form guide is in Bahasa Malaysia — matching the real LHDN form — so you can use it side-by-side while doing your e-Filing on MyTax. No spam, just your form guide.',
    type: 'email', icon: '📧',
  },
];
