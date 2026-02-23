import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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
}

function formatRM(n: number) {
  return `RM ${Math.abs(n).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#020617;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:28px;font-weight:800;color:#22d3ee;letter-spacing:-0.5px;">CukaiKu</div>
      <div style="font-size:13px;color:#64748b;margin-top:4px;">Malaysian Tax Relief Calculator · YA 2025</div>
    </div>

    <!-- Intro -->
    <p style="color:#cbd5e1;font-size:15px;line-height:1.6;margin-bottom:24px;">
      Here is your YA 2025 tax summary for <strong style="color:#e2e8f0;">Form ${p.formType}</strong>.
      Keep this as a reference when filing via LHDN e-Filing.
    </p>

    <!-- Summary Card -->
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

    <!-- Year-end reminder -->
    <div style="background:#0f172a;border:1px solid #fbbf2440;border-radius:12px;padding:16px;margin-bottom:24px;">
      <div style="font-size:13px;font-weight:600;color:#fbbf24;margin-bottom:8px;">📅 November Reminder</div>
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
      <br>© 2025 CukaiKu · <a href="https://cukaiku.vercel.app" style="color:#475569;">cukaiku.vercel.app</a>
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
