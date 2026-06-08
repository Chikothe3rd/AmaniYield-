'use client';

import React from 'react';
import Link from 'next/link';

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function DashboardShell({ children, title, subtitle }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-duration:400ms]">
      {/* Institutional Top Navigation */}
      <nav className="h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 pr-6 border-r border-neutral-200">
            <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="36" r="22" stroke="#1B5E3B" strokeWidth="2.5" fill="#E8F5E9" opacity="0.5" />
              <line x1="32" y1="36" x2="32" y2="10" stroke="#1B5E3B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M32 18 C26 12 18 14 20 20 C22 24 28 20 32 18Z" fill="#2E7D4F" />
              <path d="M32 14 C38 8 46 10 44 16 C42 20 36 16 32 14Z" fill="#1B5E3B" />
            </svg>
            <span className="text-sm font-bold tracking-tight text-neutral-900 uppercase">AmaniYield</span>
          </Link>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{title}</p>
            <p className="text-[13px] font-medium text-neutral-600">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-500">
            UN
          </div>
          <button className="text-[12px] font-semibold text-neutral-400 hover:text-neutral-900 transition-colors">
            Sign out
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto p-8">
        {children}
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn ease-out forwards;
        }
      `}</style>
    </div>
  );
}
