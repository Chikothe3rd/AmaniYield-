'use client';

import React, { useState, useEffect } from 'react';

const WEATHER_TIPS = [
  "EL NIÑO ALERT: Delayed rains expected in Southern Zambia. Shift to early-maturing Sorghum P-21.",
  "PRECIPITATION DROP: 40% decrease in Eastern Province water tables. Mulch all current vegetable beds.",
  "HEATWAVE WARNING: Temperatures exceeding 38°C in Gwembe Valley. Suspend mid-day transplanting.",
];

export default function AdminWeather() {
  const [broadcastStatus, setBroadcastStatus] = useState<'IDLE' | 'TRANSMITTING' | 'SENT'>('IDLE');
  const [activeTip, setActiveTip] = useState(WEATHER_TIPS[0]);

  const handleBroadcast = () => {
    setBroadcastStatus('TRANSMITTING');
    setTimeout(() => setBroadcastStatus('SENT'), 2000);
    setTimeout(() => setBroadcastStatus('IDLE'), 5000);
  };

  return (
    <div className="p-12 space-y-12">
      <div className="pb-8 border-b border-[#EEEEEE] flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold text-[#1B5E3B] uppercase tracking-[0.3em] mb-4">
            [ PROTOCOL : WEATHER_TRANSLATION_ENGINE ]
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Weather Protocols.</h1>
          <p className="text-sm font-medium text-[#888888] mt-4 max-w-xl">
            Translating complex multi-spectral satellite data into actionable, offline SMS planting strategies for non-connected farming communities.
          </p>
        </div>
        <button 
          onClick={handleBroadcast}
          className="bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-[2px] hover:bg-[#1B5E3B] transition-all shadow-sm"
        >
          {broadcastStatus === 'IDLE' ? '[ BROADCAST_STRATEGY_VIA_SMS ]' : '[ TRANSMITTING... ]'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="p-12 bg-white border border-[#EEEEEE] space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-8xl font-black italic">SMS</span>
          </div>
          <p className="text-[10px] font-black text-[#888888] uppercase tracking-[0.3em] mb-8">Active SMS Payload</p>
          <div className="bg-[#F9F9F9] p-8 border border-[#EEEEEE] font-mono text-sm leading-relaxed text-[#1A1A1A] rounded-lg">
             {activeTip}
          </div>
          <div className="flex gap-4">
             {WEATHER_TIPS.map((tip, i) => (
               <button 
                 key={i} 
                 onClick={() => setActiveTip(tip)}
                 className={`w-3 h-3 rounded-full border transition-all ${activeTip === tip ? 'bg-[#1B5E3B] scale-125' : 'bg-[#EEEEEE]'}`}
               />
             ))}
          </div>
        </div>

        <div className="space-y-6">
           <div className="p-8 bg-[#FDFDFC] border border-[#EEEEEE]">
              <p className="text-[10px] font-bold text-[#888888] uppercase tracking-[0.2em] mb-4">Satellite Intelligence Source</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">Sentinel-2B</p>
                <span className="text-[10px] font-bold text-[#1B5E3B] uppercase">[ DATA_SYNCHRONIZED ]</span>
              </div>
           </div>
           <div className="p-8 bg-[#FDFDFC] border border-[#EEEEEE]">
              <p className="text-[10px] font-bold text-[#888888] uppercase tracking-[0.2em] mb-4">Target Reach</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tighter">4,280</span>
                <span className="text-[10px] font-black text-[#888888] uppercase">Farmers Offline</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
