'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function MarketplacePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('grid');
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marketplace`)
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handlePurchase = async (listingId: string) => {
    setPurchasingId(listingId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marketplace/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Success: ${data.message}`);
        setListings(prev => prev.filter(l => l.id !== listingId));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Transaction failed. Check connection.');
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#1A1A1A] font-sans selection:bg-[#1B5E3B] selection:text-white">
      
      {/* ── MARKETPLACE HEADER ── */}
      <header className="fixed top-0 inset-x-0 h-16 border-b border-[#EEEEEE] bg-white/80 backdrop-blur-xl z-50 px-8 flex items-center justify-between">
         <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
               <div className="w-6 h-6 bg-[#1A1A1A] rounded-sm" />
               <span className="text-xs font-black uppercase tracking-tighter">AmaniYield</span>
            </Link>
            <div className="h-6 w-[1px] bg-[#EEEEEE]" />
            <h1 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1B5E3B]">[ GREEN_ASSET_LEDGER ]</h1>
         </div>

         <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('grid')}
              className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === 'grid' ? 'text-[#1A1A1A]' : 'text-[#888888]'}`}
            >
              Marketplace
            </button>
            <button 
              onClick={() => setActiveTab('tracker')}
              className={`text-[10px] font-bold uppercase tracking-widest ${activeTab === 'tracker' ? 'text-[#1A1A1A]' : 'text-[#888888]'}`}
            >
              Impact Tracker
            </button>
            {user ? (
               <div className="flex items-center gap-4 ml-4">
                  <div className="w-8 h-8 rounded-full bg-[#1B5E3B] flex items-center justify-center text-white text-[10px] font-bold">U</div>
                  <button onClick={() => logout()} className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Quit</button>
               </div>
            ) : (
               <Link href="/login" className="bg-[#1A1A1A] text-white px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest">Sign In</Link>
            )}
         </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="pt-32 pb-20 max-w-[1200px] mx-auto px-8 animate-technical-entry">
         {activeTab === 'grid' && (
           <div className="space-y-12">
              <div className="flex justify-between items-end">
                 <div>
                    <h2 className="text-4xl font-bold tracking-tight mb-4">Invest in Resilience.</h2>
                    <p className="text-sm text-[#888888] font-medium max-w-lg leading-relaxed">
                       Directly fund rural reforestation by purchasing indigenous seedlings. All assets are verified by field agents and held in escrow until planting is confirmed.
                    </p>
                 </div>
                 <div className="bg-[#F9F9F9] border border-[#EEEEEE] px-6 py-4 rounded-lg text-right">
                    <p className="text-[9px] font-bold text-[#888888] uppercase tracking-widest">Total Reforested</p>
                    <p className="text-2xl font-bold text-[#1B5E3B]">12,450 Ha</p>
                 </div>
              </div>

              {isLoading ? (
                <div className="p-20 text-center text-[10px] font-bold uppercase tracking-widest text-[#888888] animate-pulse">Synchronizing ledger...</div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {listings.map((item, idx) => (
                     <div key={item.id} className="group border border-[#EEEEEE] rounded-2xl overflow-hidden bg-white hover:border-[#1B5E3B] transition-all duration-500">
                        <div className="aspect-[4/3] bg-[#F9F9F9] flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-700">
                          {item.seedlingType.includes('Mopane') ? '🌳' : item.seedlingType.includes('Acacia') ? '🌿' : '🌲'}
                        </div>
                        <div className="p-8 space-y-6">
                           <div className="flex justify-between items-start">
                              <div>
                                 <h3 className="text-sm font-bold uppercase tracking-tight">{item.seedlingType}</h3>
                                 <p className="text-[9px] font-bold text-[#888888] uppercase tracking-widest">{item.seller.region} Province</p>
                              </div>
                              <span className="text-xs font-black text-[#1B5E3B]">K{item.priceZMW}.00</span>
                           </div>
                           <div className="space-y-2">
                              <div className="flex justify-between text-[9px] font-bold uppercase">
                                 <span className="text-[#888888]">Inventory</span>
                                 <span>{item.quantity} Units</span>
                              </div>
                              <div className="w-full h-1 bg-[#F2F2F2] rounded-full overflow-hidden">
                                 <div className="h-full bg-[#1B5E3B]" style={{ width: '70%' }} />
                              </div>
                           </div>
                           <button 
                             onClick={() => handlePurchase(item.id)}
                             disabled={purchasingId === item.id}
                             className="w-full border border-[#1A1A1A] group-hover:bg-[#1A1A1A] group-hover:text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                           >
                              {purchasingId === item.id ? '[ PROCESSING... ]' : '[ INITIALIZE_PURCHASE ]'}
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </div>
         )}


         {activeTab === 'tracker' && <ImpactTrackerView />}
      </main>
    </div>
  );
}

function ImpactTrackerView() {
  return (
    <div className="space-y-12">
       <div className="grid lg:grid-cols-3 gap-8">
          <div className="border border-[#EEEEEE] p-10 rounded-2xl bg-white shadow-sm space-y-6">
             <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">🌍</div>
             <h3 className="text-xs font-black uppercase tracking-widest text-[#888888]">Carbon Offset</h3>
             <p className="text-4xl font-bold">42.5 <span className="text-lg text-[#888888]">Tons</span></p>
          </div>
          <div className="border border-[#EEEEEE] p-10 rounded-2xl bg-white shadow-sm space-y-6">
             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">💧</div>
             <h3 className="text-xs font-black uppercase tracking-widest text-[#888888]">Water Retained</h3>
             <p className="text-4xl font-bold">1.2M <span className="text-lg text-[#888888]">Liters</span></p>
          </div>
          <div className="border border-[#EEEEEE] p-10 rounded-2xl bg-white shadow-sm space-y-6">
             <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">👷</div>
             <h3 className="text-xs font-black uppercase tracking-widest text-[#888888]">Jobs Supported</h3>
             <p className="text-4xl font-bold">18 <span className="text-lg text-[#888888]">Youths</span></p>
          </div>
       </div>

       <div className="border border-[#EEEEEE] rounded-3xl overflow-hidden bg-white">
          <div className="p-10 border-b border-[#EEEEEE]">
             <h3 className="text-sm font-bold uppercase tracking-widest">[ FUNDED_PROJECT_LEDGER ]</h3>
          </div>
          <div className="p-10">
             <table className="w-full text-left">
                <thead>
                   <tr className="text-[10px] font-bold text-[#888888] uppercase tracking-widest border-b border-[#F2F2F2]">
                      <th className="pb-4">Project Date</th>
                      <th className="pb-4">Asset Type</th>
                      <th className="pb-4">Region</th>
                      <th className="pb-4 text-right">Investment</th>
                   </tr>
                </thead>
                <tbody className="text-xs font-medium">
                   {[1,2,3].map(i => (
                     <tr key={i} className="border-b border-[#F9F9F9] last:border-0 hover:bg-[#FDFDFC]">
                        <td className="py-6">APR 1{i}, 2026</td>
                        <td className="py-6 font-bold uppercase">Mopane Reforestation</td>
                        <td className="py-6 text-[#888888]">Southern Province</td>
                        <td className="py-6 text-right font-black text-[#1B5E3B]">K4,200.00</td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
