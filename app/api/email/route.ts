import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { FormField, MissedOpportunity } from '@/data/types';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

export interface EmailPayload {
  to: string;
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

function formatRM(n: number) {
  return `RM ${Math.abs(n).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ── Section metadata — mirrors FormBETemplate.tsx ── */
const SECTION_META: Record<string, { title: string; color: string; bg: string }> = {
  B: { title: 'Section B — Statutory Income', color: '#2563eb', bg: '#eff6ff' },
  C: { title: 'Section C — Tax Reliefs',      color: '#7c3aed', bg: '#f5f3ff' },
  D: { title: 'Section D — Personal Details',  color: '#0891b2', bg: '#ecfeff' },
  E: { title: 'Section E — Tax Computation',   color: '#d97706', bg: '#fffbeb' },
  F: { title: 'Section F — Rebates',           color: '#059669', bg: '#ecfdf5' },
};

/* ── Form Guide HTML table ── */
function buildFormSection(formFields: FormField[], formType: string): string {
  if (!formFields || formFields.length === 0) return '';

  const sectionOrder = ['B', 'C', 'D', 'E', 'F'];
  let rows = '';

  for (const secKey of sectionOrder) {
    const fields = formFields.filter(f => f.section === secKey);
    if (fields.length === 0) continue;

    const meta = SECTION_META[secKey] || { title: secKey, color: '#64748b', bg: '#f8fafc' };

    rows += `
      <tr>
        <td colspan="3" style="padding:10px 16px 6px 16px;border-left:3px solid ${meta.color};background:${meta.bg};">
          <span style="font-size:11px;font-weight:700;color:${meta.color};text-transform:uppercase;letter-spacing:0.05em;">
            ${meta.title}
          </span>
        </td>
      </tr>`;

    for (const f of fields) {
      const isActive = f.highlight && f.value > 0;
      const leftBorder = isActive ? `3px solid ${meta.color}` : '3px solid transparent';
      const bgColor = isActive ? meta.bg : '#ffffff';
      const valueColor = f.value > 0
        ? (f.bold ? meta.color : '#1e293b')
        : '#94a3b8';
      const labelColor = f.bold ? '#0f172a' : '#475569';
      const fontWeight = f.bold ? 'bold' : 'normal';

      rows += `
      <tr style="background:${bgColor};">
        <td style="padding:5px 8px 5px 16px;border-left:${leftBorder};border-bottom:1px solid #f1f5f9;width:40px;vertical-align:top;">
          <span style="font-size:10px;font-family:monospace;color:#94a3b8;">${f.ref}</span>
        </td>
        <td style="padding:5px 4px;border-bottom:1px solid #f1f5f9;color:${labelColor};font-size:12px;font-weight:${fontWeight};">
          ${f.label}
        </td>
        <td style="padding:5px 16px 5px 4px;border-bottom:1px solid #f1f5f9;text-align:right;font-family:monospace;font-size:12px;font-weight:${fontWeight};color:${valueColor};white-space:nowrap;">
          ${formatRM(f.value)}
        </td>
      </tr>`;
    }
  }

  const formLabels: Record<string, string> = {
    BE: 'FORM BE 2025',
    B:  'FORM B 2025',
    M:  'FORM M 2025',
  };

  return `
    <div style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
      <div style="padding:14px 16px;border-bottom:1px solid #e2e8f0;background:#f8fafc;">
        <div style="font-size:9px;font-family:monospace;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2px;">
          Lembaga Hasil Dalam Negeri Malaysia
        </div>
        <div style="font-size:16px;font-weight:800;color:#0f172a;">
          ${formLabels[formType] || `FORM ${formType} 2025`}
        </div>
        <div style="font-size:11px;color:#64748b;margin-top:2px;">
          Use these values when filling in your LHDN e-Filing form.
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${rows}
      </table>
    </div>`;
}

/* ── Missed Opportunities — max 3 ── */
function buildMissedSection(missed: MissedOpportunity[]): string {
  if (!missed || missed.length === 0) return '';

  const cards = missed.slice(0, 3);
  let html = '';

  for (const m of cards) {
    html += `
      <div style="border:1px solid #fde68a;border-left:3px solid #d97706;border-radius:8px;padding:12px 14px;margin-bottom:8px;background:#fffbeb;">
        <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:3px;">
          ${m.name}
        </div>
        <div style="font-size:12px;color:#78716c;margin-bottom:4px;">
          ${m.tip}
        </div>
        <div style="font-size:12px;font-weight:700;color:#059669;">
          Potential saving: ${formatRM(m.potential)}
        </div>
      </div>`;
  }

  return `
    <div style="margin-bottom:24px;">
      <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:8px;">
        Reliefs You Could Still Claim
      </div>
      ${html}
    </div>`;
}

function buildEmailHtml(p: EmailPayload): string {
  const isRefund = p.pcb > 0 && p.balanceDue < 0;
  const hasPcb = p.pcb > 0;
  const balanceLabel = isRefund ? 'Estimated LHDN refund' : 'Balance payable to LHDN';
  const balanceColor = isRefund ? '#059669' : '#d97706';

  const pcbRow = hasPcb ? `
    <tr>
      <td style="padding:6px 0;color:#64748b;border-top:1px solid #e2e8f0;">PCB deducted</td>
      <td style="padding:6px 0;text-align:right;color:#0f172a;border-top:1px solid #e2e8f0;">${formatRM(p.pcb)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-weight:bold;color:${balanceColor};border-top:1px solid #e2e8f0;">${balanceLabel}</td>
      <td style="padding:8px 0;text-align:right;font-weight:bold;color:${balanceColor};border-top:1px solid #e2e8f0;">${formatRM(Math.abs(p.balanceDue))}</td>
    </tr>` : '';

  const formGuideHtml = buildFormSection(p.formFields, p.formType);
  const missedHtml = buildMissedSection(p.missed);

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">CukaiKu</div>
      <div style="font-size:12px;color:#94a3b8;margin-top:2px;">Malaysian Tax Relief Calculator &middot; YA 2025</div>
    </div>

    <!-- Intro -->
    <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 24px 0;">
      Your Form ${p.formType} tax summary is below. Use it as a reference when filing on LHDN e-Filing.
    </p>

    <!-- Summary Card -->
    <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
      <div style="text-align:center;padding-bottom:16px;border-bottom:1px solid #f1f5f9;margin-bottom:14px;">
        <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Estimated Tax Payable</div>
        <div style="font-size:36px;font-weight:800;font-family:monospace;color:#0f172a;">${formatRM(p.finalTax)}</div>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;color:#64748b;">Total income</td>
          <td style="padding:6px 0;text-align:right;color:#0f172a;">${formatRM(p.totalIncome)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#64748b;">Total reliefs</td>
          <td style="padding:6px 0;text-align:right;color:#7c3aed;">${formatRM(p.totalRelief)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#64748b;">Chargeable income</td>
          <td style="padding:6px 0;text-align:right;color:#0f172a;">${formatRM(p.chargeableIncome)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-weight:bold;color:#059669;">Tax saved</td>
          <td style="padding:6px 0;text-align:right;font-weight:bold;color:#059669;">${formatRM(p.taxSaved)}</td>
        </tr>
        ${pcbRow}
      </table>
    </div>

    <!-- Form Guide -->
    ${formGuideHtml}

    <!-- Missed Opportunities -->
    ${missedHtml}

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:28px;">
      <a href="https://cukaiku.vercel.app/calculator"
         style="display:inline-block;background:#0f172a;color:#ffffff;font-weight:600;font-size:13px;
                padding:10px 24px;border-radius:8px;text-decoration:none;">
        Recalculate on CukaiKu
      </a>
    </div>

    <!-- Footer -->
    <p style="font-size:11px;color:#94a3b8;text-align:center;line-height:1.5;margin:0;">
      This is an estimate only. Verify with LHDN or a licensed tax agent before filing.
      <br>&copy; 2025 CukaiKu &middot; <a href="https://cukaiku.vercel.app" style="color:#94a3b8;">cukaiku.vercel.app</a>
    </p>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const payload: EmailPayload = await req.json();

    if (!payload.to || !payload.to.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { error } = await getResend().emails.send({
      from:    'CukaiKu <onboarding@resend.dev>',
      to:      payload.to,
      subject: `Your YA 2025 Tax Summary — Form ${payload.formType} | CukaiKu`,
      html:    buildEmailHtml(payload),
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
