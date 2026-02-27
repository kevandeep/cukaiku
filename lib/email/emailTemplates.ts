type Locale = 'en' | 'ms' | 'zh';

interface EmailData {
  formType: 'BE' | 'B' | 'M';
  finalTax: number;
  totalRelief: number;
  balanceDue: number;
  pcb: number;
}

function formatRM(n: number): string {
  return `RM ${Math.abs(n).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface Strings {
  subject: string;
  greeting: string;
  summary: string;
  pdfNote: string;
  disclaimer: string;
  ctaLabel: string;
}

function getStrings(locale: Locale, d: EmailData): Strings {
  const isRefund = d.pcb > 0 && d.balanceDue < 0;

  const balance = {
    en: isRefund ? `Estimated refund: ${formatRM(d.balanceDue)}` : `Balance payable: ${formatRM(d.balanceDue)}`,
    ms: isRefund ? `Anggaran bayaran balik: ${formatRM(d.balanceDue)}` : `Baki kena dibayar: ${formatRM(d.balanceDue)}`,
    zh: isRefund ? `\u9884\u8BA1\u9000\u6B3E: ${formatRM(d.balanceDue)}` : `\u5E94\u4ED8\u4F59\u989D: ${formatRM(d.balanceDue)}`,
  };

  const all: Record<Locale, Strings> = {
    en: {
      subject: `Your YA 2025 Form ${d.formType} Guide \u2014 CukaiKu`,
      greeting: 'Your personalised LHDN form guide is attached.',
      summary: `Estimated tax: ${formatRM(d.finalTax)} \u00B7 Total reliefs: ${formatRM(d.totalRelief)} \u00B7 ${balance.en}`,
      pdfNote: `Open the attached PDF for your complete Borang ${d.formType} guide with all fields filled in. Use it as a reference when filing on MyTax (mytax.hasil.gov.my).`,
      disclaimer: 'This is an estimate only. Verify with LHDN or a licensed tax agent before filing.',
      ctaLabel: 'Recalculate on CukaiKu',
    },
    ms: {
      subject: `Panduan Borang ${d.formType} TA 2025 Anda \u2014 CukaiKu`,
      greeting: 'Panduan borang LHDN peribadi anda dilampirkan.',
      summary: `Anggaran cukai: ${formatRM(d.finalTax)} \u00B7 Jumlah pelepasan: ${formatRM(d.totalRelief)} \u00B7 ${balance.ms}`,
      pdfNote: `Buka lampiran PDF untuk panduan lengkap Borang ${d.formType} anda dengan semua medan telah diisi. Gunakan sebagai rujukan semasa e-Filing di MyTax (mytax.hasil.gov.my).`,
      disclaimer: 'Ini adalah anggaran sahaja. Sahkan dengan LHDN atau ejen cukai berlesen sebelum pemfailan.',
      ctaLabel: 'Kira semula di CukaiKu',
    },
    zh: {
      subject: `\u60A8\u76842025\u8BC4\u7A0E\u5E74${d.formType}\u8868\u683C\u6307\u5357 \u2014 CukaiKu`,
      greeting: '\u60A8\u7684\u4E2A\u6027\u5316LHDN\u8868\u683C\u6307\u5357\u5DF2\u9644\u4E0A\u3002',
      summary: `\u9884\u4F30\u7A0E\u6B3E: ${formatRM(d.finalTax)} \u00B7 \u603B\u51CF\u514D: ${formatRM(d.totalRelief)} \u00B7 ${balance.zh}`,
      pdfNote: `\u8BF7\u6253\u5F00\u9644\u4EF6PDF\u67E5\u770B\u5B8C\u6574\u7684Borang ${d.formType}\u6307\u5357\uFF0C\u5176\u4E2D\u6240\u6709\u5B57\u6BB5\u5DF2\u586B\u5165\u3002\u5728MyTax (mytax.hasil.gov.my) \u4E0A\u62A5\u7A0E\u65F6\u53EF\u4F5C\u4E3A\u53C2\u8003\u3002`,
      disclaimer: '\u8FD9\u4EC5\u4E3A\u4F30\u7B97\u3002\u8BF7\u5728\u62A5\u7A0E\u524D\u5411LHDN\u6216\u6301\u724C\u7A0E\u52A1\u4EE3\u7406\u786E\u8BA4\u3002',
      ctaLabel: '\u5728CukaiKu\u91CD\u65B0\u8BA1\u7B97',
    },
  };

  return all[locale] || all.en;
}

export function buildEmailHtml(locale: Locale, d: EmailData): string {
  const s = getStrings(locale, d);

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">

    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:26px;font-weight:800;color:#0f172a;letter-spacing:-0.5px;">CukaiKu</div>
      <div style="font-size:12px;color:#94a3b8;margin-top:2px;">Malaysian Tax Relief Calculator &middot; YA 2025</div>
    </div>

    <p style="color:#0f172a;font-size:15px;font-weight:600;margin:0 0 8px 0;">${s.greeting}</p>
    <p style="color:#475569;font-size:13px;line-height:1.6;margin:0 0 20px 0;">${s.summary}</p>

    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px;margin-bottom:24px;">
      <p style="color:#1e40af;font-size:13px;line-height:1.6;margin:0;">&#128206; ${s.pdfNote}</p>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://cukaiku.vercel.app/calculator"
         style="display:inline-block;background:#0f172a;color:#ffffff;font-weight:600;font-size:13px;padding:10px 24px;border-radius:8px;text-decoration:none;">
        ${s.ctaLabel}
      </a>
    </div>

    <p style="font-size:11px;color:#94a3b8;text-align:center;line-height:1.5;margin:0;">
      ${s.disclaimer}
      <br>&copy; 2025 CukaiKu &middot; <a href="https://cukaiku.vercel.app" style="color:#94a3b8;">cukaiku.vercel.app</a>
    </p>
  </div>
</body>
</html>`;
}

export function getEmailSubject(locale: Locale, d: EmailData): string {
  return getStrings(locale, d).subject;
}
