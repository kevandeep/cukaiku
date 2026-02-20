import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TranslationProvider } from '@/contexts/TranslationContext';

export const metadata: Metadata = {
  title: 'CukaiKu — Malaysian Tax Relief Calculator YA 2025',
  description:
    'Calculate your Malaysian personal income tax for YA 2025. Find all tax reliefs, optimize deductions, and get a personalised Form BE guide. Free, no signup required.',
  keywords: [
    'Malaysia tax calculator',
    'cukai pendapatan',
    'LHDN',
    'Form BE 2025',
    'tax relief Malaysia 2025',
    'YA 2025',
    'e-filing 2026',
    'income tax relief calculator',
  ],
  openGraph: {
    title: 'CukaiKu — Malaysian Tax Relief Calculator',
    description:
      'Maximize your YA 2025 tax reliefs before e-filing. Free, interactive Malaysian income tax calculator.',
    type: 'website',
    locale: 'en_MY',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#020617',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased font-sans">
        <TranslationProvider>{children}</TranslationProvider>
      </body>
    </html>
  );
}
