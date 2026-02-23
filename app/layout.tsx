import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans">
        <ThemeProvider>
          <TranslationProvider>{children}</TranslationProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
