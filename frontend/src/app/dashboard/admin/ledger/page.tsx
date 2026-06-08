'use client';

import React, { useEffect, useState } from 'react';

interface Report {
  id: string;
  timestamp: string;
  province: string;
  type: string;
  node: string;
  status: string;
}

export default function AdminLedger() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLedger() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/heatmap`);
        const data = await res.json();
        
        // Transform the combined heatmap data back into a ledger format
        const ledgerItems = data.map((item: any) => ({
          id: item.id.substring(0, 8).toUpperCase(),
          timestamp: new Date().toLocaleTimeString(), // Mocking time as API doesn't return full timestamp in heatmap endpoint
          province: item.lat < -15.5 ? 'Southern' : 'Central', // Rudimentary mapping
          type: item.label,
          node: item.type === 'SCAN' ? 'Youth_Node' : 'USSD_Gateway',
          status: item.status === 'DRY' ? 'Critical' : 'Verified'
        }));

        setReports(ledgerItems);
      } catch (err) {
        console.error("Failed to fetch ledger:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLedger();
  }, []);

  return (
    <div className="p-12 space-y-12">
      
      {/* Page Protocol Header */}
      <div className="pb-8 border-b border-[#EEEEEE]">
        <p className="text-[10px] font-bold text-[#1B5E3B] uppercase tracking-[0.3em] mb-4">
          [ PROTOCOL : COMMAND_LEDGER ]
        </p>
        <h1 className="text-4xl font-bold tracking-tight">System Archive.</h1>
        <p className="text-sm font-medium text-[#888888] mt-4 max-w-xl">
          Immutable historical ledger of all provincial USSD field reports, satellite alerts, and conflict prevention directives.
        </p>
      </div>

      {/* Modular Search / Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-[#EEEEEE] p-4 bg-white">
        <div className="md:col-span-2">
          <p className="text-[8px] font-black text-[#888888] uppercase tracking-[0.2em] mb-1.5 ml-1">Search ID / Node</p>
          <input type="text" placeholder="TXN-XXXX" className="w-full bg-[#FDFDFC] border border-[#EEEEEE] px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#1B5E3B]" />
        </div>
        <div>
          <p className="text-[8px] font-black text-[#888888] uppercase tracking-[0.2em] mb-1.5 ml-1">Filter Province</p>
          <select className="w-full bg-[#FDFDFC] border border-[#EEEEEE] px-3 py-2 text-[10px] font-bold uppercase focus:outline-none">
            <option>All Provinces</option>
            <option>Southern</option>
            <option>Central</option>
          </select>
        </div>
        <div>
          <p className="text-[8px] font-black text-[#888888] uppercase tracking-[0.2em] mb-1.5 ml-1">Archive Range</p>
          <select className="w-full bg-[#FDFDFC] border border-[#EEEEEE] px-3 py-2 text-[10px] font-bold uppercase focus:outline-none">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* The Ledger Table */}
      <div className="border border-[#EEEEEE] bg-white overflow-hidden min-h-[400px] relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
            <p className="text-[10px] font-bold text-[#1B5E3B] uppercase tracking-[0.5em] animate-pulse">[ SYNCING_LEDGER... ]</p>
          </div>
        )}
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FDFDFC] border-b border-[#EEEEEE]">
              <th className="p-6 text-[9px] font-black text-[#888888] uppercase tracking-[0.1em]">Transaction ID</th>
              <th className="p-6 text-[9px] font-black text-[#888888] uppercase tracking-[0.1em]">Timestamp</th>
              <th className="p-6 text-[9px] font-black text-[#888888] uppercase tracking-[0.1em]">Province</th>
              <th className="p-6 text-[9px] font-black text-[#888888] uppercase tracking-[0.1em]">Type</th>
              <th className="p-6 text-[9px] font-black text-[#888888] uppercase tracking-[0.1em]">Active Node</th>
              <th className="p-6 text-[9px] font-black text-[#888888] uppercase tracking-[0.1em] text-right">Status Protocol</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? reports.map((row) => (
              <tr key={row.id} className="border-b border-[#F9F9F9] hover:bg-[#FDFDFC] transition-colors group cursor-default">
                <td className="p-6 text-[11px] font-bold tracking-tighter text-[#1A1A1A]">{row.id}</td>
                <td className="p-6 text-[10px] font-medium text-[#888888]">{row.timestamp}</td>
                <td className="p-6 text-[10px] font-bold uppercase tracking-tight">{row.province}</td>
                <td className="p-6 text-[10px] font-bold text-[#1B5E3B] uppercase tracking-tighter">{row.type}</td>
                <td className="p-6 text-[10px] font-bold text-[#888888] uppercase tracking-widest">{row.node}</td>
                <td className="p-6 text-right">
                  <span className={`text-[8px] font-black border px-2 py-1 rounded-[2px] uppercase ${
                    row.status === 'Critical' ? 'border-red-200 text-red-600 bg-red-50' : 'border-[#EEEEEE] text-[#1A1A1A] group-hover:border-[#1B5E3B] group-hover:text-[#1B5E3B]'
                  }`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            )) : !isLoading && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-[10px] font-bold text-[#888888] uppercase tracking-[0.3em]">
                  [ NO_RECORDS_IN_CURRENT_BUFFER ]
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="p-8 bg-[#FDFDFC] border-t border-[#EEEEEE] text-center">
          <button className="text-[10px] font-bold text-[#888888] uppercase tracking-[0.3em] hover:text-[#1A1A1A] transition-colors">
            Load Archive Page 02 // Buffer Remaining
          </button>
        </div>
      </div>

    </div>
  );
}
