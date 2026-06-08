'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function YouthDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('scanner');

  if (!user) {
    return <div className="p-10 text-xs font-bold uppercase tracking-widest">Unauthorized Access. [ ERROR_CODE: 401 ]</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFC] flex text-[#1A1A1A] font-sans">
      
      {/* ── SIDEBAR NAV ── */}
      <aside className="w-64 border-r border-[#EEEEEE] flex flex-col p-6 space-y-8 bg-white/50 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-4">
           <div className="w-8 h-8 bg-[#1B5E3B] rounded-sm" />
           <span className="text-xs font-black uppercase tracking-tighter">AmaniYield</span>
        </div>

        <div className="space-y-1">
          {[
            { id: 'scanner', label: 'AI Crop Scanner', icon: '📡' },
            { id: 'inventory', label: 'Asset Manager', icon: '🌲' },
            { id: 'onboarding', label: 'Farmer Registration', icon: '👥' },
            { id: 'earnings', label: 'Earnings Ledger', icon: '💰' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${
                activeTab === tab.id ? 'bg-[#1A1A1A] text-white shadow-lg' : 'text-[#888888] hover:bg-[#F9F9F9]'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-[#EEEEEE]">
           <button 
             onClick={() => logout()}
             className="w-full text-left px-4 py-2 text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline"
           >
             Terminate Session
           </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <p className="text-[10px] font-bold text-[#1B5E3B] uppercase tracking-[0.3em] mb-2">
              [ PORTAL : YOUTH_FIELD_AGENT ]
            </p>
            <h1 className="text-4xl font-bold tracking-tight">Field Operations.</h1>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-bold text-[#888888] uppercase tracking-widest">Agent ID</p>
             <p className="text-xs font-mono font-bold uppercase">{user.id.slice(0,8)}</p>
          </div>
        </header>

        {/* ── DYNAMIC FEATURE RENDER ── */}
        <div className="animate-technical-entry">
          {activeTab === 'scanner' && <ScannerView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'onboarding' && <OnboardingView />}
          {activeTab === 'earnings' && <EarningsView />}
        </div>
      </main>
    </div>
  );
}

function ScannerView() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="border border-[#EEEEEE] p-8 rounded-xl bg-white space-y-6">
        <div className="aspect-video bg-[#F9F9F9] border-2 border-dashed border-[#EEEEEE] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#1B5E3B] transition-all group">
           <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">📸</span>
           <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Initialize Edge-AI Scan</p>
        </div>
        <button className="w-full bg-[#1A1A1A] text-white py-4 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#1B5E3B] transition-colors">
          Run Diagnostic Protocol
        </button>
      </div>
      <div className="space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#888888]">[ RECENT_SCAN_HISTORY ]</h3>
        {[1, 2].map(i => (
          <div key={i} className="p-4 border border-[#EEEEEE] rounded-lg flex justify-between items-center bg-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-sm" />
              <div>
                <p className="text-[10px] font-bold uppercase">Maize Leaf [ SAMPLE_{i} ]</p>
                <p className="text-[9px] text-[#888888]">Health Score: 84%</p>
              </div>
            </div>
            <span className="text-[8px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded">HEALTHY</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InventoryView() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#888888]">[ GREEN_ASSET_MANAGER ]</h3>
        <button className="bg-[#1B5E3B] text-white px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest">+ List Seedlings</button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {['Acacia', 'Mopane', 'Baobab'].map((tree, idx) => (
          <div key={idx} className="border border-[#EEEEEE] p-6 rounded-xl bg-white hover:shadow-xl transition-all">
             <div className="w-full aspect-square bg-[#F9F9F9] rounded-lg mb-4 flex items-center justify-center text-3xl">🌱</div>
             <p className="text-xs font-bold uppercase mb-1">{tree} Batch</p>
             <p className="text-[10px] text-[#888888] font-medium mb-4">50 units available</p>
             <div className="flex justify-between items-center pt-4 border-t border-[#F2F2F2]">
                <span className="text-xs font-bold text-[#1B5E3B]">K450.00</span>
                <span className="text-[8px] font-bold text-emerald-600 uppercase">AVAILABLE</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OnboardingView() {
  return (
    <div className="max-w-2xl mx-auto border border-[#EEEEEE] p-10 rounded-xl bg-white shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-widest mb-8 text-center">[ ASSISTED_FARMER_REGISTRATION ]</h3>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-[#888888] uppercase tracking-widest">Full Name</label>
            <input type="text" placeholder="Full Name" className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded p-3 text-xs" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-[#888888] uppercase tracking-widest">Phone Number</label>
            <input type="text" placeholder="Phone Number" className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded p-3 text-xs" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-bold text-[#888888] uppercase tracking-widest">Farm Region</label>
          <input type="text" placeholder="Farm Region" className="w-full bg-[#F9F9F9] border border-[#EEEEEE] rounded p-3 text-xs" />
        </div>
        <button className="w-full bg-[#1A1A1A] text-white py-4 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#1B5E3B]">Register into SMS Network</button>
      </div>
    </div>
  );
}

function EarningsView() {
  return (
    <div className="space-y-8">
       <div className="grid grid-cols-3 gap-8">
          <div className="bg-[#1B5E3B] text-white p-8 rounded-xl shadow-lg">
             <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">Total Earnings</p>
             <h4 className="text-3xl font-bold">K12,450.00</h4>
          </div>
          <div className="bg-white border border-[#EEEEEE] p-8 rounded-xl">
             <p className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-2">Escrowed Balance</p>
             <h4 className="text-3xl font-bold">K4,200.00</h4>
          </div>
          <div className="bg-white border border-[#EEEEEE] p-8 rounded-xl">
             <p className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-2">Withdrawals</p>
             <h4 className="text-3xl font-bold">K8,250.00</h4>
          </div>
       </div>
       <div className="border border-[#EEEEEE] rounded-xl overflow-hidden bg-white">
          <div className="bg-[#F9F9F9] p-4 border-b border-[#EEEEEE] text-[9px] font-bold uppercase tracking-widest">Transaction History</div>
          <div className="p-4 space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex justify-between items-center text-xs font-medium border-b border-[#F2F2F2] pb-3 last:border-0">
                  <span className="text-[#888888]">APR 2{i}, 2026</span>
                  <span className="font-bold">Seedling Sale #00{i}</span>
                  <span className="text-[#1B5E3B] font-bold">+K1,200.00</span>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
}
