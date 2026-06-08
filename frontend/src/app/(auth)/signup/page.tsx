'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

/* ── Brand Logo Component ── */
function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="36" r="22" stroke="#1B5E3B" strokeWidth="2.5" fill="#E8F5E9" opacity="0.5" />
      <ellipse cx="32" cy="36" rx="10" ry="22" stroke="#1B5E3B" strokeWidth="1.5" fill="none" />
      <line x1="10" y1="36" x2="54" y2="36" stroke="#1B5E3B" strokeWidth="1.5" />
      <line x1="32" y1="36" x2="32" y2="10" stroke="#1B5E3B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 18 C26 12 18 14 20 20 C22 24 28 20 32 18Z" fill="#2E7D4F" />
      <path d="M32 14 C38 8 46 10 44 16 C42 20 36 16 32 14Z" fill="#1B5E3B" />
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('YOUTH_OFFICER');
  const [region, setRegion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, password, role, region })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Signup failed');
      }

      login(data.token, data.user);

      // REDIRECTION LOGIC BASED ON ROLE PROTOCOLS
      if (data.user.role === 'GOV_ADMIN' || data.user.role === 'NGO') {
        router.push('/dashboard/admin');
      } else if (data.user.role === 'YOUTH_OFFICER') {
        router.push('/dashboard/youth');
      } else if (data.user.role === 'BUYER') {
        router.push('/marketplace');
      } else if (data.user.role === 'FARMER' || data.user.role === 'HERDER') {
        router.push('/dashboard/farmer');
      } else {
        router.push('/');
      }

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] flex flex-col font-sans text-[#1A1A1A] selection:bg-[#1B5E3B] selection:text-white overflow-hidden">
      
      {/* ── Technical Nav ── */}
      <nav className="h-16 flex items-center px-8 border-b border-[#EEEEEE] bg-white/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
           <Logo size={24} />
           <span className="text-xs font-black tracking-tighter uppercase">AmaniYield</span>
           <span className="text-[9px] font-bold text-[#888888] tracking-widest uppercase ml-2">[ SIGN_UP ]</span>
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md animate-technical-entry">
          
          <div className="mb-12">
            <p className="text-[10px] font-bold text-[#1B5E3B] uppercase tracking-[0.3em] mb-4">
              [ PROTOCOL : SIGNUP ]
            </p>
            <h1 className="text-4xl font-bold tracking-tight leading-none mb-4">
              Sign Up.
            </h1>
            <p className="text-sm font-medium text-[#888888] leading-relaxed">
              Initialize your credentials to access the AmaniYield climate ledger.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-xs font-bold text-red-600 uppercase tracking-widest">
                [ ERROR : {error} ]
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.2em]">Phone Number</label>
              <input
                type="text"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+260..."
                className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#1B5E3B] focus:bg-white transition-all placeholder:text-[#CCCCCC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.2em]">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#1B5E3B] focus:bg-white transition-all placeholder:text-[#CCCCCC]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.2em]">Join As</label>
                <select                aria-label="Join As"                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg px-3 py-3.5 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-[#1B5E3B] appearance-none cursor-pointer"
                >
                  <option value="FARMER">Smallholder Farmer (Offline Beneficiary)</option>
                  <option value="HERDER">Pastoralist Herder (Offline Beneficiary)</option>
                  <option value="YOUTH_OFFICER">Youth Extension Officer (Field Agent)</option>
                  <option value="GOV_ADMIN">Government / NGO Official (Institutional Admin)</option>
                  <option value="BUYER">Urban Developer / Carbon Buyer (Market Actor)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.2em]">Region</label>
                <input
                  type="text"
                  required
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Lusaka, Southern..."
                  className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded-lg px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#1B5E3B] focus:bg-white transition-all placeholder:text-[#CCCCCC]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-[#1A1A1A] hover:bg-[#1B5E3B] disabled:bg-[#888888] text-white text-xs font-bold uppercase tracking-[0.2em] py-4 rounded-lg transition-colors shadow-sm"
            >
              {isLoading ? '[ PROCESSING... ]' : '[ SIGN_UP ]'}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-bold text-[#888888] uppercase tracking-[0.2em]">
            Existing account?{' '}
            <Link href="/login" className="text-[#1A1A1A] hover:text-[#1B5E3B] underline underline-offset-4">
              Log In
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative Technical Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03]">
        <div className="absolute top-0 left-[20%] w-px h-full bg-black" />
        <div className="absolute top-0 left-[40%] w-px h-full bg-black" />
        <div className="absolute top-0 left-[60%] w-px h-full bg-black" />
        <div className="absolute top-0 left-[80%] w-px h-full bg-black" />
        <div className="absolute top-[20%] left-0 w-full h-px bg-black" />
        <div className="absolute top-[40%] left-0 w-full h-px bg-black" />
        <div className="absolute top-[60%] left-0 w-full h-px bg-black" />
        <div className="absolute top-[80%] left-0 w-full h-px bg-black" />
      </div>

    </div>
  );
}
