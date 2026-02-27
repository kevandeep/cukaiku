import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { FormField } from '@/data/types';
import { getBmLabel, BM_SECTION_TITLES } from './bmLabels';

interface PdfOptions {
  formFields: FormField[];
  formType: 'BE' | 'B' | 'M';
  totalIncome: number;
  finalTax: number;
  totalRelief: number;
  chargeableIncome: number;
  pcb: number;
  balanceDue: number;
}

function formatRM(n: number): string {
  return Math.abs(n).toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function generateFormGuidePdf(opts: PdfOptions): Buffer {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // ── HEADER ──
  // LHDN-style header
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('LEMBAGA HASIL DALAM NEGERI MALAYSIA', margin, 14);

  const formSubtitles: Record<string, string> = {
    BE: 'BORANG NYATA INDIVIDU PEMASTAUTIN YANG TIDAK MENJALANKAN PERNIAGAAN',
    B:  'BORANG NYATA INDIVIDU PEMASTAUTIN YANG MENJALANKAN PERNIAGAAN',
    M:  'BORANG NYATA INDIVIDU BUKAN PEMASTAUTIN',
  };

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`BORANG ${opts.formType}`, margin, 22);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(formSubtitles[opts.formType] || '', margin, 27);

  // Right side: year
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('TAHUN TAKSIRAN', pageWidth - margin, 14, { align: 'right' });
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('2025', pageWidth - margin, 23, { align: 'right' });

  // CukaiKu attribution
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('Dijana oleh CukaiKu \u2014 cukaiku.vercel.app', pageWidth - margin, 28, { align: 'right' });

  // Separator
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, 31, pageWidth - margin, 31);

  let yPos = 37;

  // ── SECTIONS ──
  const sectionOrder = ['B', 'C', 'D', 'E', 'F', 'H'];

  for (const secKey of sectionOrder) {
    const fields = opts.formFields.filter(f => f.section === secKey);
    if (fields.length === 0) continue;

    const sectionTitle = BM_SECTION_TITLES[secKey] || secKey;

    // Check if we need a page break for the section header + at least a few rows
    if (yPos > 265) {
      doc.addPage();
      yPos = 15;
    }

    // Section header
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(sectionTitle, margin, yPos);
    yPos += 2;

    // Build table data
    const tableData = fields.map(f => [
      f.ref,
      getBmLabel(f.label),
      formatRM(f.value),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Rujukan', 'Perkara', 'Jumlah (RM)']],
      body: tableData,
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
      styles: {
        fontSize: 8,
        cellPadding: { top: 2, bottom: 2, left: 3, right: 3 },
        lineColor: [220, 220, 220],
        lineWidth: 0.2,
        textColor: [30, 30, 30],
      },
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: [80, 80, 80],
        fontStyle: 'bold',
        fontSize: 7,
      },
      columnStyles: {
        0: { cellWidth: 18, textColor: [120, 120, 120], fontSize: 7 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 32, halign: 'right' },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      didParseCell: (data: any) => {
        if (data.section !== 'body') return;
        const field = fields[data.row.index];
        if (!field) return;

        if (field.bold) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = [0, 0, 0];
        }
        if (field.highlight && field.value > 0) {
          data.cell.styles.fillColor = [248, 250, 255];
        }
        if (field.value === 0) {
          data.cell.styles.textColor = [180, 180, 180];
        }
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yPos = (doc as any).lastAutoTable.finalY + 6;
  }

  // ── FOOTER on every page ──
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(
      'Ini adalah anggaran sahaja. Sahkan dengan LHDN atau ejen cukai berlesen sebelum pemfailan.',
      pageWidth / 2, 287, { align: 'center' }
    );
    doc.text(`Muka surat ${i}/${totalPages}`, pageWidth - margin, 287, { align: 'right' });
    doc.text('CukaiKu \u2014 cukaiku.vercel.app', margin, 287);
  }

  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
