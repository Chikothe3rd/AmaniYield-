'use client';

import React, { useState, useEffect } from 'react';

const CONFLICT_VECTORS = [
  { id: 'VEC-101', type: 'Herder Convergence', risk: 'High', location: 'Southern Prov / Node-Alpha', status: 'Potential Clash' },
  { id: 'VEC-102', type: 'Water Depletion', risk: 'Critical', location: 'Western Prov / Node-Beta', status: 'Resource Depleted' },
];

const HEATMAP_REGIONS = [
  { id: 1, name: 'Southern Province', risk: 'Critical', alerts: 12, waterLevel: '14%', status: 'Deploying', lat: -16.5, lng: 27.0 },
  { id: 2, name: 'Western Province', risk: 'High', alerts: 8, waterLevel: '22%', status: 'Monitoring', lat: -15.0, lng: 24.5 },
  { id: 3, name: 'Central Province', risk: 'Moderate', alerts: 3, waterLevel: '45%', status: 'Stable', lat: -14.2, lng: 28.5 },
  { id: 4, name: 'Eastern Province', risk: 'Low', alerts: 1, waterLevel: '68%', status: 'Stable', lat: -13.5, lng: 32.0 },
];

export default function AdminMap() {
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<'IDLE' | 'TRANSMITTING' | 'DEPLOYED'>('IDLE');
  const [activeAnalysis, setActiveAnalysis] = useState(false);

  const handleDeployRoute = async () => {
    setDeploymentStatus('TRANSMITTING');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDeploymentStatus('DEPLOYED');
    setTimeout(() => {
      setDeploymentStatus('IDLE');
      setSelectedRegion(null);
    }, 4000);
  };

  const toggleAnalysis = () => {
    setActiveAnalysis(true);
    setTimeout(() => setActiveAnalysis(false), 3000);
  };

  return (
    <div className="p-12 space-y-12">
      <div className="pb-8 border-b border-[#EEEEEE] flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold text-[#1B5E3B] uppercase tracking-[0.3em] mb-4">
            [ PROTOCOL : SPATIAL_GOVERNANCE_V5 ]
          </p>
          <h1 className="text-4xl font-bold tracking-tight">GIS Control.</h1>
          <p className="text-sm font-medium text-[#888888] mt-4 max-w-xl">
            "Air-Traffic Control" for pastoral routing. Managing water-resource access and deploying emergency safe-passages to prevent regional resource violence.
          </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={toggleAnalysis}
             className="bg-white border border-[#EEEEEE] text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-[2px] hover:border-[#1A1A1A] transition-all"
           >
             {activeAnalysis ? '[ ANALYZING_CONVERGENCE... ]' : '[ SCAN_CONFLICT_VECTORS ]'}
           </button>
           {selectedRegion && (
             <button 
               onClick={handleDeployRoute}
               disabled={deploymentStatus !== 'IDLE'}
               className={`text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-[2px] shadow-sm transition-all ${
                 deploymentStatus === 'DEPLOYED' ? 'bg-emerald-600 text-white' : 'bg-[#1A1A1A] text-white hover:bg-[#1B5E3B]'
               }`}
             >
                {deploymentStatus === 'IDLE' && `[ DEPLOY_SAFE_ROUTE : ${selectedRegion.name.split(' ')[0].toUpperCase()} ]`}
                {deploymentStatus === 'TRANSMITTING' && '[ TRANSMITTING_SMS... ]'}
                {deploymentStatus === 'DEPLOYED' && '[ ROUTE_BROADCAST_SUCCESS ]'}
             </button>
           )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="relative aspect-[16/9] bg-[#F9F9F9] border border-[#EEEEEE] rounded-[2px] overflow-hidden group cursor-crosshair">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:32px_32px] opacity-40"></div>
            
            {/* Conflict Vector Highlight Lines (Simulated) */}
            {activeAnalysis && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <line x1="40%" y1="60%" x2="45%" y2="55%" stroke="#EF4444" strokeWidth="1" strokeDasharray="4" className="animate-[pulse_1s_infinite]" />
                <circle cx="42.5%" cy="57.5%" r="20" fill="none" stroke="#EF4444" strokeWidth="0.5" className="animate-ping" />
              </svg>
            )}

            {HEATMAP_REGIONS.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region)}
                className={`absolute w-4 h-4 rounded-full border-2 border-white transition-all hover:scale-150 z-20 ${
                  region.risk === 'Critical' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-emerald-500'
                } ${selectedRegion?.id === region.id ? 'scale-150 ring-4 ring-[#1B5E3B]/20' : ''}`}
                style={{ top: `${40 + (region.lat + 14) * 10}%`, left: `${40 + (region.lng - 28) * 10}%` }}
              />
            ))}

            <div className="absolute inset-0 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-1000 pointer-events-none">
              <div className="text-center space-y-4">
                <p className="text-[10px] font-black text-[#888888] uppercase tracking-[0.4em]">[ RENDER_LAYER: ZAMBIA_INFRASTRUCTURE ]</p>
                <div className="w-64 h-[1px] bg-[#EEEEEE] mx-auto"></div>
                <p className="text-[10px] font-bold text-[#1B5E3B] uppercase tracking-widest italic">Air-Traffic Control Protocol Active</p>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 bg-white border border-[#EEEEEE] p-4 space-y-4 shadow-sm backdrop-blur-sm bg-white/90 z-30">
              <p className="text-[9px] font-black text-[#1A1A1A] uppercase tracking-widest border-b border-[#EEEEEE] pb-2">Legend Protocol</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  <p className="text-[9px] font-bold text-[#888888] uppercase tracking-tighter">Conflict Risk: Critical</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <p className="text-[9px] font-bold text-[#888888] uppercase tracking-tighter">Safe Passage Point</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-[10px] font-black text-[#888888] uppercase tracking-[0.2em] ml-1">Conflict Vector Ledger</p>
          <div className="space-y-3">
            {CONFLICT_VECTORS.map((vector) => (
              <div key={vector.id} className="p-5 bg-white border border-red-100 rounded-[2px] space-y-3">
                 <div className="flex justify-between items-start">
                    <p className="text-[11px] font-bold tracking-tight text-red-600">{vector.id}</p>
                    <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-red-50 text-red-600 border border-red-100">CRITICAL_VEC</span>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-[#1A1A1A]">{vector.type}</p>
                    <p className="text-[9px] font-medium text-[#888888] mt-1">{vector.location}</p>
                 </div>
                 <div className="pt-3 border-t border-red-50">
                    <p className="text-[9px] font-bold text-red-600 uppercase tracking-tighter animate-pulse">{vector.status}</p>
                 </div>
              </div>
            ))}
          </div>
          <div className="p-6 border border-[#EEEEEE] bg-[#FDFDFC]">
             <p className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.2em] mb-2">Routing Capacity</p>
             <p className="text-lg font-bold">128 Groups</p>
             <p className="text-[9px] font-medium text-[#888888] mt-1 italic">Managing regional migration paths.</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </div>
  );
}
