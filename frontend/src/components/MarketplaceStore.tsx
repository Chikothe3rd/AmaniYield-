"use client";

import React, { useEffect, useState } from 'react';

interface Listing {
  id: string;
  seedlingType: string;
  quantity: number;
  priceZMW: number;
  seller?: {
    region: string;
  };
}

export default function MarketplaceStore() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchListings = () => {
    setIsFetching(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marketplace`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch listings");
        return res.json();
      })
      .then(json => {
        setListings(json);
      })
      .catch(err => {
        console.error("Marketplace Error:", err);
        showToast("Could not connect to the marketplace server.", "error");
      })
      .finally(() => setIsFetching(false));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleBuy = async (id: string) => {
    setLoading(id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/marketplace/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: id }),
      });
      const data = await response.json();
      if (data.success) {
        showToast(data.message, "success");
        fetchListings(); // Refresh grid
      } else {
        showToast(data.error || "Checkout failed.", "error");
      }
    } catch (err) {
      showToast("Checkout failed due to a network error.", "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-10 right-10 z-[3000] px-6 py-4 rounded-xl shadow-2xl bg-white border-l-4 animate-bounce ${toast.type === 'success' ? 'border-emerald-500 text-emerald-800' : 'border-red-500 text-red-800'}`}>
          <p className="font-bold flex items-center gap-3">
            <span className="text-2xl">{toast.type === 'success' ? '✅' : '⚠️'}</span>
            {toast.message}
          </p>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-emerald-900 tracking-tight">
            Green Livelihoods Marketplace
          </h1>
          <p className="text-slate-600 mt-2 font-medium text-lg">Empowering rural youth through indigenous seedling reforestation trade.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isFetching ? (
            // Skeleton Loaders
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden animate-pulse shadow-sm">
                <div className="h-48 bg-slate-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/3 mb-8"></div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-10 bg-slate-200 rounded-xl w-1/3"></div>
                  </div>
                </div>
              </div>
            ))
          ) : listings.length > 0 ? listings.map((item) => (
            <div key={item.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-emerald-50 to-emerald-100/50 relative flex items-center justify-center overflow-hidden border-b border-slate-50">
                <div className="text-7xl group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">🌱</div>
                <div className="absolute top-4 right-4 bg-white/80 text-emerald-800 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-100 shadow-sm backdrop-blur-sm">
                  {item.quantity} available
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-emerald-900">{item.seedlingType}</h3>
                    <p className="text-slate-500 text-xs mt-1 font-medium tracking-wide uppercase">REGION: {item.seller?.region || "Zambia Rural"}</p>
                  </div>
                </div>
                
                <div className="mt-8 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Investment</p>
                    <p className="text-2xl font-mono text-emerald-700 font-bold leading-none">ZMW {item.priceZMW}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleBuy(item.id)}
                    disabled={loading === item.id}
                    className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 disabled:text-slate-500 text-white px-7 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:shadow-none"
                  >
                    {loading === item.id ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-100 animate-ping" />
                        Buying...
                      </span>
                    ) : "Buy Now"}
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-300 rounded-3xl bg-white/50">
              <p className="text-2xl font-bold text-slate-500 italic">Marketplace is currently being restocked by rural youth.</p>
              <p className="text-slate-400 text-sm mt-2">Please check back shortly for new indigenous listings.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
