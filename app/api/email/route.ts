import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { FormField, MissedOpportunity } from '@/data/types';
import { generateFormGuidePdf } from '@/lib/pdf/generateFormGuidePdf';
import { buildEmailHtml, getEmailSubject } from '@/lib/email/emailTemplates';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

interface EmailPayload {
  to: string;
  locale: 'en' | 'ms' | 'zh';
  formType: 'BE' | 'B' | 'M';
  totalIncome: number;
  totalRelief: number;
  finalTax: number;
  chargeableIncome: number;
  pcb: number;
  balanceDue: number;
  taxSaved: number;
  formFields: FormField[];
  missed: MissedOpportunity[];
}

export async function POST(req: NextRequest) {
  try {
    const payload: EmailPayload = await req.json();

    if (!payload.to || !payload.to.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const locale = (['en', 'ms', 'zh'] as const).includes(payload.locale)
      ? payload.locale
      : 'en';

    // Generate the PDF form guide (always in BM)
    const pdfBuffer = generateFormGuidePdf({
      formFields:      payload.formFields,
      formType:        payload.formType,
      totalIncome:     payload.totalIncome,
      finalTax:        payload.finalTax,
      totalRelief:     payload.totalRelief,
      chargeableIncome: payload.chargeableIncome,
      pcb:             payload.pcb,
      balanceDue:      payload.balanceDue,
    });

    // Build simplified email body (in user's language)
    const emailData = {
      formType:    payload.formType,
      finalTax:    payload.finalTax,
      totalRelief: payload.totalRelief,
      balanceDue:  payload.balanceDue,
      pcb:         payload.pcb,
    };

    const html = buildEmailHtml(locale, emailData);
    const subject = getEmailSubject(locale, emailData);

    const { error } = await getResend().emails.send({
      from:    'CukaiKu <onboarding@resend.dev>',
      to:      payload.to,
      subject,
      html,
      attachments: [
        {
          content: pdfBuffer,
          filename: `CukaiKu-Borang-${payload.formType}-2025.pdf`,
        },
      ],
    });

    if (error) {
      console.error('[email] Resend error:', error);
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[email] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
