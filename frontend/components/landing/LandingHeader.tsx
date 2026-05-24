'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4 ">
      <header
        className={[
          'flex items-center justify-between gap-6 rounded-2xl px-5 py-3 w-full max-w-5xl',
          'transition-all duration-500 ease-in-out',
          scrolled
            ? 'border border-rose-100/20 bg-white/10 backdrop-blur-2xl shadow-sm shadow-rose-200/5'
            : 'border border-rose-200/50 bg-white/92 backdrop-blur-sm shadow-lg shadow-rose-100/25',
        ].join(' ')}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-100 to-violet-100 border border-rose-200/60">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-rose-500" aria-hidden="true">
              <path
                d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span
            className={[
              'font-semibold text-lg tracking-tight select-none transition-colors duration-500',
              scrolled ? 'text-gray-600' : 'text-gray-800',
            ].join(' ')}
          >
            Req<span className="text-rose-400">tify</span>
          </span>
        </Link>

        {/* Login button */}
        <Link
          href="/login"
          className={[
            'shrink-0 rounded-xl px-6 py-1.5 text-sm font-medium transition-all duration-300',
            scrolled
              ? 'border border-rose-200/40 bg-white/30 text-gray-500 hover:bg-white/60 hover:text-rose-500'
              : 'border border-rose-300/60 bg-rose-50/60 text-gray-700 hover:bg-rose-50 hover:border-rose-400/60 hover:text-rose-600',
          ].join(' ')}
        >
          Login
        </Link>
      </header>
    </div>
  );
}
