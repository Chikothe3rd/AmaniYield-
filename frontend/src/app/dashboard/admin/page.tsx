'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import MapDashboard from '@/components/MapDashboard';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('heatmap');

  if (!user) {
    return <div className="p-10 text-xs font-bold uppercase tracking-widest">Unauthorized Access.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFC] flex flex-col text-[#1A1A1A] font-sans">
      
      {/* ── TOP NAVIGATION ── */}
      <nav className="h-20 border-b border-[#EEEEEE] flex items-center justify-between px-10 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-[#1B5E3B] rounded-sm flex items-center justify-center text-white font-black text-xl italic">A</div>
           <div>
             <h2 className="text-sm font-bold uppercase tracking-tight">Institutional Command</h2>
             <p className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.2em]">[ SECTOR : GOV_DMMU_ZAMBIA ]</p>
           </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex gap-4">
             {['heatmap', 'broadcast', 'incidents', 'migration'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`text-[10px] font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${
                   activeTab === tab ? 'border-[#1B5E3B] text-[#1A1A1A]' : 'border-transparent text-[#888888] hover:text-[#1A1A1A]'
                 }`}
               >
                 {tab}
               </button>
             ))}
           </div>
           <button onClick={() => logout()} className="text-[10px] font-bold text-red-500 uppercase tracking-widest border border-red-100 px-4 py-2 rounded-sm hover:bg-red-50">Log Out</button>
        </div>
      </nav>

      {/* ── MAIN ANALYTICS AREA ── */}
      <main className="flex-1 p-10 animate-technical-entry">
        {activeTab === 'heatmap' && (
          <div className="h-full space-y-8">
             <div className="flex justify-between items-end">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-[#888888]">[ GIS_MACRO_ANALYTICS_HEATMAP ]</h3>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[9px] font-bold uppercase">Crisis Area</span></div>
                   <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[9px] font-bold uppercase">Resource Viable</span></div>
                </div>
             </div>
             <div className="h-96 border border-[#EEEEEE] rounded-xl overflow-hidden shadow-2xl relative">
                <MapDashboard />
             </div>
          </div>
        )}

        {activeTab === 'broadcast' && <BroadcastPanel />}
        {activeTab === 'incidents' && <IncidentFeed />}
        {activeTab === 'migration' && <MigrationMonitor />}
      </main>
    </div>
  );
}

function BroadcastPanel() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="bg-[#1A1A1A] p-10 rounded-xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#1B5E3B] opacity-20 blur-3xl" />
        <h3 className="text-xs font-bold uppercase tracking-[0.4em] mb-8 text-[#1B5E3B]">[ SMS_TARGETED_BROADCAST_SYSTEM ]</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase tracking-widest text-[#888888]">Select Region</label>
            <select aria-label="Select Region" className="w-full bg-[#333] border border-[#444] p-4 rounded text-xs focus:border-[#1B5E3B] outline-none">
              <option>Southern Province</option>
              <option>Eastern Province</option>
              <option>Lusaka Central</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase tracking-widest text-[#888888]">Message Payload</label>
            <textarea rows={4} className="w-full bg-[#333] border border-[#444] p-4 rounded text-xs focus:border-[#1B5E3B] outline-none" placeholder="Alert: Extreme drought expected in next 72h. Switch to Sorghum immediately..." />
          </div>
          <button className="w-full bg-[#1B5E3B] py-4 rounded font-bold text-[10px] uppercase tracking-[0.3em]">Trigger Broadcast Sequence</button>
        </div>
      </div>
    </div>
  );
}

function IncidentFeed() {
  const [incidents, setIncidents] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/live`)
      .then(res => res.json())
      .then(data => {
        setIncidents(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center border-b border-[#EEEEEE] pb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#888888]">[ LIVE_INCIDENT_STREAM ]</h3>
          <span className="flex items-center gap-2 text-[9px] font-bold text-red-500 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Live Uplink
          </span>
       </div>
       <div className="space-y-4">
          {isLoading ? (
            <div className="p-10 text-center text-[10px] font-bold uppercase tracking-widest text-[#888888] animate-pulse">Syncing with field nodes...</div>
          ) : incidents.length === 0 ? (
            <div className="p-10 text-center text-[10px] font-bold uppercase tracking-widest text-[#888888]">No active incidents reported.</div>
          ) : (
            incidents.map((incident, i) => (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, react/no-unknown-property
              <div key={incident.id} className="bg-white border border-[#EEEEEE] p-5 rounded-lg flex justify-between items-center hover:border-[#1B5E3B] transition-all cursor-default animate-technical-entry" style={{ animationDelay: `${i * 100}ms` }}>
                 <div className="flex gap-6 items-center">
                    <div className={`w-12 h-12 flex items-center justify-center text-xl ${incident.type === 'INCIDENT' ? 'bg-red-50' : 'bg-emerald-50'}`}>
                      {incident.type === 'INCIDENT' ? '⚠️' : '📡'}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase">{incident.title}</p>
                      <p className="text-[9px] text-[#888888]">REPORTED FROM: {incident.location}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-mono font-bold tracking-tighter">
                      {new Date(incident.timestamp).toLocaleTimeString()}
                    </p>
                    <p className="text-[8px] font-bold text-[#1B5E3B] uppercase tracking-widest mt-1">
                      FIX: {incident.coords.lat.toFixed(2)} / {incident.coords.lng.toFixed(2)}
                    </p>
                 </div>
              </div>
            ))
          )}
       </div>
    </div>
  );
}


function MigrationMonitor() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
       <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#888888]">[ ACTIVE_MIGRATION_MONITOR ]</h3>
          <div className="aspect-video border border-[#EEEEEE] rounded-xl bg-[#F9F9F9] flex items-center justify-center">
             <div className="text-center space-y-2">
                <p className="text-4xl">🛰️</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#888888]">Satellite Telemetry Rendering...</p>
             </div>
          </div>
       </div>
       <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#888888]">[ HERDER_TRACKING_LIST ]</h3>
          {[1,2,3].map(i => (
            <div key={i} className="p-4 bg-white border border-[#EEEEEE] rounded-lg space-y-3">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase">HERDER_{i*100}</span>
                  <span className="text-[8px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded">IN_TRANSIT</span>
               </div>
               <div className="w-full h-1 bg-[#F2F2F2] rounded-full overflow-hidden">
                  {/* eslint-disable-next-line react/no-unknown-property */}
                  <div className="h-full bg-[#1B5E3B]" style={{ width: '65%' }} />
               </div>
               <p className="text-[8px] text-[#888888] font-bold uppercase">Dest: Oasis Alpha-9</p>
            </div>
          ))}
       </div>
    </div>
  );
}
