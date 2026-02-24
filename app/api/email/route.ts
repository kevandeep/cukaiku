import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { FormField, MissedOpportunity } from '@/data/types';

// Lazy init — Resend must not be created at module level or Next.js build fails
// (env vars are not available at static analysis time, only at runtime)
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

/* ── Section metadata — mirrors FormBETemplate.tsx SECTIONS ── */
const SECTION_META: Record<string, { title: string; color: string }> = {
  B: { title: 'Section B — Statutory Income',   color: '#3b82f6' },
  C: { title: 'Section C — Tax Reliefs',        color: '#8b5cf6' },
  D: { title: 'Section D — Personal Details',   color: '#22d3ee' },
  E: { title: 'Section E — Tax Computation',    color: '#fbbf24' },
  F: { title: 'Section F — Rebates',            color: '#34d399' },
};

/* ── Build the Form Guide HTML table ── */
function buildFormSection(formFields: FormField[], formType: string): string {
  if (!formFields || formFields.length === 0) return '';

  const sectionOrder = ['B', 'C', 'D', 'E', 'F'];
  let rows = '';

  for (const secKey of sectionOrder) {
    const fields = formFields.filter(f => f.section === secKey);
    if (fields.length === 0) continue;

    const meta = SECTION_META[secKey] || { title: secKey, color: '#64748b' };

    // Section header row
    rows += `
      <tr>
        <td colspan="3" style="padding:12px 16px 8px 16px;border-left:3px solid ${meta.color};">
          <span style="font-size:11px;font-weight:700;color:${meta.color};text-transform:uppercase;letter-spacing:0.05em;">
            ${meta.title}
          </span>
        </td>
      </tr>`;

    // Field rows
    for (const f of fields) {
      const isActive = f.highlight && f.value > 0;
      const bgColor = isActive ? `${meta.color}10` : 'transparent';
      const leftBorder = isActive ? `3px solid ${meta.color}` : '3px solid transparent';
      const valueColor = f.value > 0
        ? (f.bold ? meta.color : '#e2e8f0')
        : '#334155';
      const labelColor = f.bold ? '#e2e8f0' : '#94a3b8';
      const fontWeight = f.bold ? 'bold' : 'normal';

      rows += `
      <tr style="background:${bgColor};">
        <td style="padding:6px 8px 6px 16px;border-left:${leftBorder};width:40px;vertical-align:top;">
          <span style="font-size:10px;font-family:monospace;color:#475569;">${f.ref}</span>
        </td>
        <td style="padding:6px 4px;color:${labelColor};font-size:12px;font-weight:${fontWeight};">
          ${f.label}
        </td>
        <td style="padding:6px 16px 6px 4px;text-align:right;font-family:monospace;font-size:12px;font-weight:${fontWeight};color:${valueColor};white-space:nowrap;">
          ${formatRM(f.value)}
        </td>
      </tr>`;
    }
  }

  // Form type labels
  const formLabels: Record<string, string> = {
    BE: 'FORM BE 2025 — Resident Individual (Employment Income)',
    B:  'FORM B 2025 — Resident Individual (Business Income)',
    M:  'FORM M 2025 — Non-Resident Individual',
  };

  return `
    <!-- Form Guide -->
    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:16px;overflow:hidden;margin-bottom:24px;">
      <div style="padding:16px 16px 12px 16px;border-bottom:1px solid #1e293b;background:linear-gradient(135deg,#0f172a,#1e293b);">
        <div style="font-size:9px;font-family:monospace;color:#475569;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">
          Lembaga Hasil Dalam Negeri Malaysia
        </div>
        <div style="font-size:16px;font-weight:800;color:#e2e8f0;margin-bottom:2px;">
          ${formLabels[formType] || `FORM ${formType} 2025`}
        </div>
        <div style="font-size:11px;color:#64748b;">
          Your personalised e-Filing reference — enter these values in the corresponding fields
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        ${rows}
      </table>

      <div style="padding:10px 16px;background:rgba(251,191,36,0.03);border-top:1px solid #1e293b;">
        <span style="font-size:11px;color:#94a3b8;">
          &#128161; <strong style="color:#fbbf24;">PCB (Monthly Tax Deduction):</strong>
          Check your EA form Section C for the total PCB deducted by your employer this year.
        </span>
      </div>
    </div>`;
}

/* ── Build Missed Opportunities section — max 3 amber cards ── */
function buildMissedSection(missed: MissedOpportunity[]): string {
  if (!missed || missed.length === 0) return '';

  const cards = missed.slice(0, 3);
  let html = '';

  for (const m of cards) {
    html += `
      <div style="background:#0f172a;border:1px solid rgba(251,191,36,0.2);border-left:3px solid #fbbf24;border-radius:12px;padding:14px 16px;margin-bottom:10px;">
        <div style="font-size:13px;font-weight:700;color:#fbbf24;margin-bottom:4px;">
          ${m.name}
        </div>
        <div style="font-size:12px;color:#94a3b8;margin-bottom:6px;">
          ${m.tip}
        </div>
        <div style="font-size:12px;font-weight:700;color:#34d399;">
          Potential saving: ${formatRM(m.potential)}
        </div>
      </div>`;
  }

  return `
    <!-- Missed Opportunities -->
    <div style="margin-bottom:24px;">
      <div style="font-size:13px;font-weight:700;color:#fbbf24;margin-bottom:10px;">
        &#128161; Reliefs You Could Still Claim
      </div>
      ${html}
    </div>`;
}

function buildEmailHtml(p: EmailPayload): string {
  const isRefund  = p.pcb > 0 && p.balanceDue < 0;
  const hasPcb    = p.pcb > 0;
  const balanceLabel = isRefund ? 'Estimated refund from LHDN' : 'Balance still payable to LHDN';
  const balanceColor = isRefund ? '#34d399' : '#fbbf24';   // emerald : amber

  const pcbRow = hasPcb ? `
    <tr>
      <td style="padding:8px 0;color:#94a3b8;">PCB (monthly tax deducted)</td>
      <td style="padding:8px 0;text-align:right;color:#e2e8f0;">${formatRM(p.pcb)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-weight:bold;color:${balanceColor};">${balanceLabel}</td>
      <td style="padding:8px 0;text-align:right;font-weight:bold;color:${balanceColor};">${formatRM(Math.abs(p.balanceDue))}</td>
    </tr>` : '';

  const formGuideHtml = buildFormSection(p.formFields, p.formType);
  const missedHtml = buildMissedSection(p.missed);

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#020617;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:28px;font-weight:800;color:#22d3ee;letter-spacing:-0.5px;">CukaiKu</div>
      <div style="font-size:13px;color:#64748b;margin-top:4px;">Malaysian Tax Relief Calculator &middot; YA 2025</div>
    </div>

    <!-- Intro -->
    <p style="color:#cbd5e1;font-size:15px;line-height:1.6;margin-bottom:24px;">
      Here is your YA 2025 tax summary for <strong style="color:#e2e8f0;">Form ${p.formType}</strong>.
      Keep this email as a reference when filing via LHDN e-Filing &mdash; every field and amount is listed below.
    </p>

    <!-- Section 1: Summary Card -->
    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:16px;padding:24px;margin-bottom:24px;">
      <div style="text-align:center;padding-bottom:20px;border-bottom:1px solid #1e293b;margin-bottom:20px;">
        <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px;">Estimated Tax Payable</div>
        <div style="font-size:40px;font-weight:800;font-family:monospace;color:#22d3ee;">${formatRM(p.finalTax)}</div>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#94a3b8;">Total income</td>
          <td style="padding:8px 0;text-align:right;color:#e2e8f0;">${formatRM(p.totalIncome)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;">Total reliefs claimed</td>
          <td style="padding:8px 0;text-align:right;color:#a78bfa;">${formatRM(p.totalRelief)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;">Chargeable income</td>
          <td style="padding:8px 0;text-align:right;color:#e2e8f0;">${formatRM(p.chargeableIncome)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-weight:bold;color:#34d399;">Tax saved vs zero relief</td>
          <td style="padding:8px 0;text-align:right;font-weight:bold;color:#34d399;">${formatRM(p.taxSaved)}</td>
        </tr>
        ${pcbRow}
      </table>
    </div>

    <!-- Section 2: Form Guide -->
    ${formGuideHtml}

    <!-- Section 3: Missed Opportunities -->
    ${missedHtml}

    <!-- Year-end reminder -->
    <div style="background:#0f172a;border:1px solid #fbbf2440;border-radius:12px;padding:16px;margin-bottom:24px;">
      <div style="font-size:13px;font-weight:600;color:#fbbf24;margin-bottom:8px;">&#128197; November Reminder</div>
      <p style="font-size:13px;color:#94a3b8;margin:0;line-height:1.5;">
        We'll remind you in November to top up your PRS, SSPN, lifestyle, and insurance reliefs
        before the December 31st cut-off. Every ringgit counts!
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="https://cukaiku.vercel.app/calculator"
         style="display:inline-block;background:#22d3ee;color:#020617;font-weight:700;font-size:14px;
                padding:12px 28px;border-radius:9999px;text-decoration:none;">
        Recalculate on CukaiKu
      </a>
    </div>

    <!-- Footer -->
    <p style="font-size:11px;color:#334155;text-align:center;line-height:1.5;">
      This is an estimate only. Always verify figures with LHDN or a licensed tax agent before filing.
      <br>&copy; 2025 CukaiKu &middot; <a href="https://cukaiku.vercel.app" style="color:#475569;">cukaiku.vercel.app</a>
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
      from:    'CukaiKu <noreply@cukaiku.vercel.app>',
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
