'use client';

import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      aria-label="CukaiKu — home"
    >
      <span
        className="text-xl font-extrabold tracking-tight"
        style={{
          background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        CukaiKu
      </span>
      <span className="hidden sm:inline text-[9px] font-mono text-slate-400 dark:text-slate-600 tracking-widest uppercase border border-slate-300 dark:border-slate-700 px-1.5 py-0.5 rounded">
        YA 2025
      </span>
    </Link>
  );
}
