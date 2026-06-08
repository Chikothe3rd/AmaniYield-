'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth, ProtectedRoute } from '@/context/AuthContext';

/* ── Brand Logo ── */
function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="36" r="22" stroke="#1B5E3B" strokeWidth="2.5" fill="#E8F5E9" opacity="0.5" />
      <line x1="32" y1="36" x2="32" y2="10" stroke="#1B5E3B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 18 C26 12 18 14 20 20 C22 24 28 20 32 18Z" fill="#2E7D4F" />
      <path d="M32 14 C38 8 46 10 44 16 C42 20 36 16 32 14Z" fill="#1B5E3B" />
    </svg>
  );
}

function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isInstitutional = user?.role === 'GOV_ADMIN' || user?.role === 'NGO';
  const isOfficer = user?.role === 'YOUTH_OFFICER';

  let navItems;
  if (isInstitutional) {
    navItems = [
      { href: '/dashboard/admin', label: '01 Overview', tag: 'MACRO' },
      { href: '/dashboard/admin/map', label: '02 GIS Heatmap', tag: 'SPATIAL' },
      { href: '/dashboard/admin/weather', label: '03 Weather Protocols', tag: 'SATELLITE' },
      { href: '/dashboard/admin/ledger', label: '04 Command Ledger', tag: 'ARCHIVE' },
    ];
  } else if (isOfficer) {
    navItems = [
      { href: '/dashboard/youth', label: '01 Overview', tag: 'FIELD' },
      { href: '/dashboard/youth/scans', label: '02 Scan Terminal', tag: 'AI_DIAG' },
      { href: '/dashboard/youth/marketplace', label: '03 Marketplace', tag: 'ASSET' },
    ];
  } else {
    // Farmer / Herder Dashboard
    navItems = [
      { href: '/dashboard/farmer', label: '01 My Farm', tag: 'HOME' },
      { href: '/dashboard/farmer/weather', label: '02 Weather Advice', tag: 'FORECAST' },
      { href: '/dashboard/youth/marketplace', label: '03 Market Access', tag: 'TRADE' },
    ];
  }

  return (
    <aside className="w-64 bg-white border-r border-[#EEEEEE] flex flex-col min-h-screen">
      {/* Brand & Protocol */}
      <div className="p-8 border-b border-[#EEEEEE]">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={22} />
          <span className="text-xs font-black tracking-tighter uppercase">AmaniYield</span>
        </Link>
        <div className="mt-6 flex items-center gap-2">
           <span className="text-[9px] font-bold text-[#1B5E3B] tracking-[0.2em] border border-[#EEEEEE] px-1.5 py-0.5 rounded-xs uppercase">
             [ PROTOCOL : {isInstitutional ? 'GOV' : isOfficer ? 'FLD' : 'BNF'} ]
           </span>
           <span className="text-[9px] font-bold text-[#888888] tracking-widest uppercase italic">
             v.26.4
           </span>
        </div>
      </div>

      {/* Technical Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <p className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.3em] mb-6 ml-2">Navigation Index</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex flex-col px-4 py-4 border transition-all duration-200 ${
                isActive
                  ? 'border-[#1B5E3B] bg-[#FDFDFC]'
                  : 'border-transparent hover:border-[#EEEEEE] hover:bg-[#F9F9F9]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold tracking-wider uppercase ${isActive ? 'text-[#1B5E3B]' : 'text-[#888888] group-hover:text-[#1A1A1A]'}`}>
                  {item.label}
                </span>
                <span className="text-[8px] font-bold text-[#CCCCCC] uppercase tracking-tighter">{item.tag}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Session Protocol */}
      <div className="p-6 border-t border-[#EEEEEE] bg-[#FDFDFC]">
        <div className="p-4 border border-[#EEEEEE] rounded-xs space-y-3">
          <div>
            <p className="text-[8px] font-bold text-[#888888] uppercase tracking-widest">Active User</p>
            <p className="text-[11px] font-bold text-[#1A1A1A] mt-1 truncate">{user?.phoneNumber || 'SESSION_01'}</p>
          </div>
          <div>
            <p className="text-[8px] font-bold text-[#888888] uppercase tracking-widest">Uptime Strength</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1 h-1 rounded-full bg-[#1B5E3B]"></span>
              <p className="text-[9px] font-bold text-[#1B5E3B] uppercase tracking-tighter">Optimal Connect</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-2 text-center py-2 text-[10px] font-bold text-red-600 border border-transparent hover:border-red-100 hover:bg-red-50 uppercase tracking-[0.2em] transition-all"
          >
            [ Terminate_Session ]
          </button>
        </div>
      </div>
    </aside>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FDFDFC] animate-technical-entry">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <style jsx global>{`
        @keyframes technicalSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-technical-entry {
          animation: technicalSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute allowedRoles={['GOV_ADMIN', 'NGO', 'YOUTH_OFFICER', 'FARMER', 'HERDER']}>
        <DashboardShell>{children}</DashboardShell>
      </ProtectedRoute>
    </AuthProvider>
  );
}

