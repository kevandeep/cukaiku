export type Answers = Record<string, string>;

export type QuestionType = 'currency' | 'number' | 'yesno' | 'select' | 'email';

export interface SelectOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  section: string;       // i18n key e.g. 'secIncome'
  question: string;      // English text (Week 2: move to i18n)
  tip?: string;          // English text (Week 2: move to i18n)
  type: QuestionType;
  options?: SelectOption[];
  showIf?: (answers: Answers) => boolean;
  max?: number;
  icon: string;
  formRef?: string;
}

export interface Relief {
  name: string;
  amount: number;
  ref: string;
}

export interface MissedOpportunity {
  name: string;
  potential: number;
  tip: string;
}

export interface FormField {
  section: string;
  ref: string;
  label: string;
  value: number;
  highlight: boolean;
  bold?: boolean;
}

export interface ComputeResult {
  reliefs: Relief[];
  missed: MissedOpportunity[];
  formFields: FormField[];
  totalIncome: number;
  totalRelief: number;
  chargeableIncome: number;
  taxBeforeRebate: number;
  dividend: number;
  dividendTax: number;
  totalRebate: number;
  finalTax: number;
  taxSaved: number;
  zakat: number;
  selfRebate: number;
  spouseRebate: number;
}
