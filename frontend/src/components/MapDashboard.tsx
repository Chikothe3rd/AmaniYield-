"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Marker Icons for spatial data visualization
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPin {
  id: string;
  lat: number;
  lng: number;
  type: 'REPORT' | 'SCAN';
  resource?: string;
  status: string;
  label: string;
}

export default function MapDashboard() {
  const [data, setData] = useState<MapPin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch aggregated heatmap data from our backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/heatmap`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch map data");
        return res.json();
      })
      .then(json => {
        setData(json);
        setError(null);
      })
      .catch(err => {
        console.error("Map Load Error:", err);
        setError("Could not connect to the AmaniYield live analytics server.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[2000] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin shadow-lg"></div>
          <p className="mt-6 text-emerald-800 font-mono tracking-widest text-sm animate-pulse font-bold">SYNCING LIVE SENSORS...</p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[2000] bg-red-50 border border-red-200 backdrop-blur-md text-red-800 px-6 py-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-bold">{error}</p>
          <button onClick={() => window.location.reload()} className="ml-4 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">RETRY</button>
        </div>
      )}

      <header className="p-6 bg-white border-b border-slate-200 shadow-sm z-10 flex justify-between items-center relative">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight">AmaniYield Macro-Analytics</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Zambia Climate & Resource Monitoring Dashboard</p>
        </div>
        <div className="flex gap-4">
          <div className="px-5 py-3 bg-red-50/50 rounded-xl border border-red-100 shadow-inner flex flex-col items-end">
            <p className="text-[10px] text-red-500 uppercase font-bold tracking-widest">Active Alerts</p>
            <p className="text-3xl font-black text-red-600 leading-none mt-1">{data.filter(p => p.status === 'DRY').length}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 relative">
        <MapContainer 
          center={[-15.4167, 28.2833]} 
          zoom={7} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {data.map((pin) => (
            <Marker 
              key={pin.id} 
              position={[pin.lat, pin.lng]} 
              icon={pin.status === 'VIABLE' ? greenIcon : redIcon}
            >
              <Popup className="rounded-xl shadow-lg">
                <div className="p-1">
                  <h3 className="font-extrabold text-lg text-emerald-900 uppercase tracking-wide">{pin.type}</h3>
                  <div className="h-[2px] w-8 bg-emerald-500 my-2" />
                  <p className="text-sm font-medium text-slate-700">{pin.label}</p>
                  <p className="text-[10px] text-slate-400 mt-3 font-mono">ID: {pin.id.slice(0,8)}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-10 right-10 z-[1000] bg-white/95 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <h4 className="font-bold text-xs mb-4 text-emerald-800 uppercase tracking-widest border-b border-slate-100 pb-2">Map Legend</h4>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-red-500 mr-4 shadow-md border-2 border-white ring-2 ring-red-100" />
              <span className="text-sm font-semibold text-slate-700">Dry Borehole / Pest Alert</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-emerald-500 mr-4 shadow-md border-2 border-white ring-2 ring-emerald-100" />
              <span className="text-sm font-semibold text-slate-700">Viable Water / Healthy Crop</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
