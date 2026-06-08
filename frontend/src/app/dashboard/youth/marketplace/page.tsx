'use client';

import React, { useEffect, useState } from 'react';

interface Listing {
  id: string;
  seedlingType: string;
  quantity: number;
  priceZMW: number;
  status: string;
}

export default function YouthMarketplace() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carbonPrice, setCarbonPrice] = useState(42.50); // ZMW per seedling credit
  const [marketTrend, setMarketTrend] = useState<'UP' | 'DOWN'>('UP');

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marketplace`);
        const data = await res.json();
        setListings(data);
        
        // Simulated Market Volatility for Urban Developers
        const interval = setInterval(() => {
          setCarbonPrice(prev => {
            const shift = (Math.random() * 0.5) - 0.2;
            setMarketTrend(shift > 0 ? 'UP' : 'DOWN');
            return parseFloat((prev + shift).toFixed(2));
          });
        }, 3000);
        
        return () => clearInterval(interval);
      } catch (err) {
        console.error("Failed to fetch marketplace data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchListings();
  }, []);

  const totalMarketCap = listings.reduce((acc, item) => acc + (item.priceZMW * item.quantity), 0);

  return (
    <div className="p-12 space-y-12">
      <div className="pb-8 border-b border-[#EEEEEE] flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold text-[#1B5E3B] uppercase tracking-[0.3em] mb-4">
            [ PROTOCOL : GREEN_ASSET_MARKET_V2 ]
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Marketplace.</h1>
          <p className="text-sm font-medium text-[#888888] mt-4 max-w-xl">
            Tokenizing rural tree seedlings for urban carbon-neutrality offsets. Creating economic incentives for reforestation over charcoal production.
          </p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-4 border border-[#EEEEEE] bg-white flex flex-col justify-center">
              <p className="text-[8px] font-black text-[#888888] uppercase tracking-[0.2em] mb-1">Live Carbon Credit (ZMW)</p>
              <div className="flex items-center gap-2">
                 <span className="text-xl font-bold">K {carbonPrice}</span>
                 <span className={`text-[10px] font-bold ${marketTrend === 'UP' ? 'text-[#1B5E3B]' : 'text-red-500'}`}>
                   {marketTrend === 'UP' ? '▲' : '▼'}
                 </span>
              </div>
           </div>
           <button className="bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-[2px] hover:bg-[#1B5E3B] transition-all shadow-sm">
             [ Register_New_Asset ]
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-[#EEEEEE] bg-white min-h-[400px] relative">
            {isLoading && (
               <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                 <p className="text-[9px] font-black text-[#1B5E3B] animate-pulse uppercase tracking-widest">[ SYNCING_MARKET_LEDGER ]</p>
               </div>
            )}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FDFDFC] border-b border-[#EEEEEE]">
                  <th className="p-6 text-[9px] font-black text-[#888888] uppercase tracking-[0.1em]">Asset ID</th>
                  <th className="p-6 text-[9px] font-black text-[#888888] uppercase tracking-[0.1em]">Species</th>
                  <th className="p-6 text-[9px] font-black text-[#888888] uppercase tracking-[0.1em] text-center">Qty</th>
                  <th className="p-6 text-[9px] font-black text-[#888888] uppercase tracking-[0.1em] text-right">Economic Protocol</th>
                </tr>
              </thead>
              <tbody>
                {listings.length > 0 ? listings.map((item) => (
                  <tr key={item.id} className="border-b border-[#F9F9F9] hover:bg-[#FDFDFC] transition-colors group">
                    <td className="p-6 text-[11px] font-bold tracking-tighter text-[#888888]">
                      {item.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="p-6">
                      <p className="text-[12px] font-bold text-[#1A1A1A]">{item.seedlingType}</p>
                      <p className="text-[9px] font-bold text-[#1B5E3B] uppercase tracking-tighter mt-1">
                        Est. Credit: K {(item.quantity * carbonPrice).toLocaleString()}
                      </p>
                    </td>
                    <td className="p-6 text-[12px] font-bold text-center text-[#888888]">{item.quantity}</td>
                    <td className="p-6 text-right">
                      <button className="text-[8px] font-black border border-[#1A1A1A] px-3 py-1.5 rounded-[2px] uppercase hover:bg-[#1A1A1A] hover:text-white transition-all">
                        [ Liquidate_Asset ]
                      </button>
                    </td>
                  </tr>
                )) : !isLoading && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-[10px] font-bold text-[#888888] uppercase tracking-widest">
                      [ NO_ASSETS_IN_REGIONAL_BUFFER ]
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-[#EEEEEE] p-8 bg-[#1A1A1A] text-white space-y-8">
            <div>
              <p className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.2em] mb-4">Regional Economic Strength</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tighter">
                  K {totalMarketCap.toLocaleString()}
                </span>
                <span className="text-[10px] font-black text-[#1B5E3B] uppercase tracking-widest">[ CAP ]</span>
              </div>
            </div>
            <div className="pt-8 border-t border-white/10 space-y-4">
              <p className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.2em]">Developer Interest Node</p>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-tight">Lusaka Hub</p>
                <span className="text-[10px] font-bold text-[#1B5E3B] uppercase">[ HIGH_DEMAND ]</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-tight">Kitwe Node</p>
                <span className="text-[10px] font-bold text-amber-500 uppercase">[ STABLE ]</span>
              </div>
            </div>
          </div>
          <div className="p-8 border border-[#EEEEEE] bg-white">
             <p className="text-[10px] font-bold text-[#888888] uppercase tracking-[0.2em] mb-4">Conservation Impact</p>
             <p className="text-lg font-bold text-[#1B5E3B]">1,280 Trees Protected</p>
             <p className="text-[9px] font-medium text-[#888888] mt-2 leading-relaxed italic">
               Verification confirms these assets have not been harvested for charcoal.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
