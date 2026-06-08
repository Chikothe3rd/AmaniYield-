'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function FarmerDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-12 max-w-[1000px]">
      <div className="mb-12">
        <p className="text-[10px] font-bold text-[#1B5E3B] uppercase tracking-[0.3em] mb-4">
          [ BENEFICIARY_PORTAL : ZM-26 ]
        </p>
        <h1 className="text-4xl font-bold tracking-tight leading-none mb-4">
          Welcome back, {user?.phoneNumber}.
        </h1>
        <div className="flex items-center gap-4">
           <p className="text-sm font-medium text-[#888888] leading-relaxed max-w-md">
             Your field data is synchronized with the central climate ledger. View your resilience protocols below.
           </p>
           <div className="h-4 w-[1px] bg-[#EEEEEE]" />
           <p className="text-[10px] font-black uppercase text-[#1B5E3B]">Region: {user?.region || 'Zambia'}</p>
        </div>
      </div>


      <div className="grid md:grid-cols-2 gap-8">
        <div className="border border-[#EEEEEE] p-8 rounded-2xl bg-white shadow-sm space-y-6">
          <div className="flex justify-between items-start">
             <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-xl">🌱</div>
             <span className="text-[8px] font-bold text-[#1B5E3B] uppercase tracking-widest border border-emerald-100 px-2 py-1 rounded">Active</span>
          </div>
          <div>
             <h3 className="text-xs font-black uppercase tracking-widest text-[#888888] mb-2">Current Planting</h3>
             <p className="text-2xl font-bold">Maize (Seedling Stage)</p>
          </div>
          <div className="pt-4 border-t border-[#F9F9F9] flex justify-between items-center">
             <p className="text-[9px] font-bold text-[#888888] uppercase">Next Scan Due</p>
             <p className="text-[9px] font-bold uppercase text-[#1B5E3B]">In 3 Days</p>
          </div>
        </div>

        <div className="border border-[#EEEEEE] p-8 rounded-2xl bg-white shadow-sm space-y-6">
          <div className="flex justify-between items-start">
             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">🌦️</div>
             <span className="text-[8px] font-bold text-[#888888] uppercase tracking-widest border border-[#EEEEEE] px-2 py-1 rounded">Protocol</span>
          </div>
          <div>
             <h3 className="text-xs font-black uppercase tracking-widest text-[#888888] mb-2">Weather Advice</h3>
             <p className="text-2xl font-bold">Drought Warning Active</p>
          </div>
          <p className="text-[11px] text-[#666666] leading-relaxed italic">
            "Prioritize irrigation in evening hours. Satellite data shows 15% lower soil moisture than average."
          </p>
        </div>
      </div>

      <div className="mt-12 p-8 border border-[#1B5E3B] bg-emerald-50/30 rounded-2xl">
         <div className="flex items-center gap-4 mb-4">
            <div className="w-2 h-2 bg-[#1B5E3B] rounded-full animate-ping" />
            <p className="text-[10px] font-black text-[#1B5E3B] uppercase tracking-[0.2em]">Live Field Bulletin</p>
         </div>
         <p className="text-sm font-bold text-[#1A1A1A]">
            New market prices for Mopane saplings are now available in the Marketplace.
         </p>
      </div>
    </div>
  );
}
