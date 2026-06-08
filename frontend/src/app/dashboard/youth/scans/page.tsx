'use client';

import React, { useState, useEffect } from 'react';

interface ScanResult {
  id: string;
  crop: string;
  category: string;
  healthPercentage: number;
  detectedPest: string;
  status: string;
  time: string;
}

export default function YouthScans() {
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [currentResult, setCurrentResult] = useState<any>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/heatmap`);
        const data = await res.json();
        const scans = data.filter((item: any) => item.type === 'SCAN').map((s: any) => ({
           id: s.id.substring(0, 8).toUpperCase(),
           crop: s.label.includes(']') ? s.label.split(']')[1].split(':')[0].trim() : 'Maize',
           category: s.label.includes('[') ? s.label.split('[')[1].split(']')[0] : 'CEREAL',
           healthPercentage: parseInt(s.label.match(/\((\d+)%\)/)?.[1] || '0'),
           detectedPest: s.label.includes('Crop:') ? s.label.split(':')[1].split('(')[0].trim() : 'None',
           status: s.status === 'VIABLE' ? 'Optimal' : 'Anomaly',
           time: 'Recent'
        }));
        setRecentScans(scans);
      } catch (err) {
        console.error("Failed to fetch scan history:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    }
    fetchHistory();
  }, []);

  const handleNewScan = async () => {
    setIsScanning(true);
    setCurrentResult(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: 'https://placeholder.com/field.jpg' })
      });
      const result = await res.json();
      
      if (result.success) {
        const newScan = {
          id: result.data.id.substring(0, 8).toUpperCase(),
          crop: result.data.cropName,
          category: result.data.category,
          healthPercentage: result.data.healthPercentage,
          detectedPest: result.data.detectedPest,
          status: result.data.healthPercentage > 70 ? 'Optimal' : 'Anomaly',
          time: 'Just Now'
        };
        setCurrentResult(result);
        setRecentScans([newScan, ...recentScans]);
      }
    } catch (err) {
      console.error("Scan failed:", err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-12 space-y-12">
      <div className="pb-8 border-b border-[#EEEEEE] flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold text-[#1B5E3B] uppercase tracking-[0.3em] mb-4">
            [ PROTOCOL : FIELD_DIAGNOSTICS_V2 ]
          </p>
          <h1 className="text-4xl font-bold tracking-tight">AI Scan Terminal.</h1>
          <p className="text-sm font-medium text-[#888888] mt-4 max-w-xl">
            Agricultural classification and health analysis. Distinguishing fruits, vegetables, and cereals with automated pest-vector detection.
          </p>
        </div>
        <button 
          onClick={handleNewScan}
          disabled={isScanning}
          className="bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-[2px] hover:bg-[#1B5E3B] transition-all shadow-sm disabled:bg-[#888888]"
        >
          {isScanning ? '[ ANALYZING_CROP... ]' : '[ Initialize_New_Scan ]'}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          <div className="relative aspect-video bg-[#F9F9F9] border border-[#EEEEEE] rounded-[2px] flex items-center justify-center group overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
            
            {currentResult && !isScanning ? (
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 bg-white/40 backdrop-blur-md">
                 <div className="text-center space-y-6">
                    <p className="text-[11px] font-black text-[#1B5E3B] uppercase tracking-[0.5em] animate-fade-in">[ ANALYSIS_COMPLETE ]</p>
                    <h2 className="text-6xl font-bold tracking-tighter">{currentResult.data.cropName}</h2>
                    <div className="flex gap-4 justify-center">
                       <span className="px-3 py-1 bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-widest">{currentResult.data.category}</span>
                       <span className={`px-3 py-1 border text-[9px] font-bold uppercase tracking-widest ${currentResult.data.healthPercentage > 70 ? 'border-emerald-500 text-emerald-600' : 'border-red-500 text-red-600'}`}>
                         {currentResult.data.healthPercentage}% Health
                       </span>
                    </div>
                    <p className="text-sm font-medium text-[#888888] max-w-md mx-auto italic">
                      "{currentResult.data.recommendedAction.split(':').slice(1).join(':').trim()}"
                    </p>
                 </div>
              </div>
            ) : (
              <div className="relative z-10 text-center space-y-6">
                {isScanning ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 border-2 border-[#1B5E3B] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-[10px] font-black text-[#1B5E3B] uppercase tracking-[0.4em] animate-pulse">
                      [ CATEGORIZING_PRODUCT_TYPE ]
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="w-20 h-20 border border-dashed border-[#1B5E3B]/40 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-700">
                      <span className="text-2xl">📷</span>
                    </div>
                    <p className="text-[10px] font-black text-[#888888] uppercase tracking-[0.4em]">
                      [ AWAITING_OPTICAL_INPUT ]
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-[#1B5E3B]/30"></div>
            <div className="absolute top-8 right-8 w-8 h-8 border-t border-r border-[#1B5E3B]/30"></div>
            <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-[#1B5E3B]/30"></div>
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-[#1B5E3B]/30"></div>
            
            {isScanning && (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B5E3B]/20 to-transparent h-1/4 w-full animate-[scan_2s_linear_infinite] z-20" />
            )}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="p-6 border border-[#EEEEEE] bg-white">
              <p className="text-[9px] font-bold text-[#888888] uppercase tracking-widest mb-2">AI Confidence</p>
              <p className="text-xs font-black uppercase">{currentResult?.aiConfidence || '98.4%'}</p>
            </div>
            <div className="p-6 border border-[#EEEEEE] bg-white">
              <p className="text-[9px] font-bold text-[#888888] uppercase tracking-widest mb-2">Classify Protocol</p>
              <p className="text-xs font-black uppercase text-[#1B5E3B]">Enabled</p>
            </div>
            <div className="p-6 border border-[#EEEEEE] bg-white">
              <p className="text-[9px] font-bold text-[#888888] uppercase tracking-widest mb-2">Sync Status</p>
              <p className="text-xs font-black uppercase text-amber-600">{isScanning ? 'Syncing' : 'Verified'}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <p className="text-[10px] font-black text-[#888888] uppercase tracking-[0.2em] ml-1">Historical Logs</p>
          <div className="border border-[#EEEEEE] bg-white divide-y divide-[#F9F9F9] min-h-[300px] relative">
            {isLoadingHistory && (
               <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                 <p className="text-[9px] font-black text-[#888888] animate-pulse uppercase tracking-widest">[ SYNCING_LOGS ]</p>
               </div>
            )}
            {recentScans.length > 0 ? recentScans.map((scan: any) => (
              <div key={scan.id} className="p-6 group hover:bg-[#FDFDFC] transition-colors cursor-default">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[11px] font-black tracking-tight">{scan.id}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-tighter ${scan.healthPercentage < 50 ? 'text-red-600' : 'text-[#1B5E3B]'}`}>
                    {scan.healthPercentage}%
                  </span>
                </div>
                <p className="text-[12px] font-bold text-[#1A1A1A]">{scan.crop} — <span className="text-[#888888]">{scan.category}</span></p>
                <div className="mt-4 flex items-center justify-between">
                   <p className="text-[9px] font-bold text-[#888888] uppercase tracking-tighter">Pest: {scan.detectedPest}</p>
                   <p className="text-[9px] font-medium text-[#CCCCCC]">{scan.time}</p>
                </div>
              </div>
            )) : !isLoadingHistory && (
              <div className="p-12 text-center">
                <p className="text-[10px] font-bold text-[#888888] uppercase">No scans logged</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
      `}</style>
    </div>
  );
}
