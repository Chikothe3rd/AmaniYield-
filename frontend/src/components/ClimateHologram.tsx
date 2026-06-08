'use client';

import React, { useEffect, useRef, useState } from 'react';

type Coords = {
  lat: number;
  lon: number;
};

type Province = {
  id: string;
  name: string;
  d: string;
};

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;

  constructor(private width: number, private height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = Math.random() * 0.3 - 0.15;
    this.speedY = Math.random() * 0.3 - 0.15;
    this.opacity = Math.random() * 0.4 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > this.width) this.x = 0;
    else if (this.x < 0) this.x = this.width;

    if (this.y > this.height) this.y = 0;
    else if (this.y < 0) this.y = this.height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(27, 94, 59, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const provinces: Province[] = [
  { id: 'ZM-WP', name: 'Western', d: 'M100,300 L120,320 L150,350 L100,450 L50,420 L20,380 L10,320 Z' },
  { id: 'ZM-CP', name: 'Central', d: 'M200,200 L250,220 L280,280 L240,320 L200,300 L180,250 Z' },
  { id: 'ZM-EP', name: 'Eastern', d: 'M300,150 L350,180 L380,250 L350,300 L300,280 L280,220 Z' },
  { id: 'ZM-LP', name: 'Luapula', d: 'M250,50 L280,80 L280,150 L250,180 L220,150 L220,80 Z' },
  { id: 'ZM-NP', name: 'Northern', d: 'M280,30 L350,50 L380,120 L350,180 L300,150 L280,80 Z' },
  { id: 'ZM-NW', name: 'North-Western', d: 'M50,150 L150,180 L200,200 L180,250 L100,220 L50,180 Z' },
  { id: 'ZM-SP', name: 'Southern', d: 'M100,450 L180,500 L250,480 L280,420 L240,320 L150,350 Z' },
  { id: 'ZM-CB', name: 'Copperbelt', d: 'M150,120 L220,150 L250,180 L220,220 L150,180 L140,150 Z' },
  { id: 'ZM-LS', name: 'Lusaka', d: 'M240,320 L280,320 L300,350 L280,420 L250,420 L240,350 Z' },
  { id: 'ZM-MU', name: 'Muchinga', d: 'M350,80 L420,100 L450,200 L380,250 L350,180 L350,120 Z' },
];

export default function ClimateHologram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [coords, setCoords] = useState<Coords>({ lat: -13.1339, lon: 27.8493 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeProvince, setActiveProvince] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;

    const init = () => {
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;

      particles = [];
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle(width, height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.update();
        particle.draw(ctx);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    const mockLat = -13.1339 + (y - rect.height / 2) * 0.005;
    const mockLon = 27.8493 + (x - rect.width / 2) * 0.005;

    setCoords({ lat: mockLat, lon: mockLon });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#FDFDFC] overflow-hidden group cursor-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setActiveProvince(null);
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-1000"
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 500 550"
          preserveAspectRatio="xMidYMid meet"
          className="w-[80%] h-[80%] opacity-20 group-hover:opacity-100 transition-all duration-1000 scale-110 pointer-events-auto"
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#glow)">
            {provinces.map((p) => (
              <path
                key={p.id}
                d={p.d}
                fill={activeProvince === p.name ? 'rgba(27, 94, 59, 0.4)' : 'rgba(27, 94, 59, 0.05)'}
                stroke="#1B5E3B"
                strokeWidth={activeProvince === p.name ? 2 : 0.5}
                className="transition-all duration-300 cursor-crosshair"
                onMouseEnter={() => setActiveProvince(p.name)}
                onMouseLeave={() => setActiveProvince(null)}
              />
            ))}
          </g>

          <rect
            x="0"
            y="0"
            width="500"
            height="2"
            fill="rgba(27, 94, 59, 0.5)"
            className="animate-[scan_4s_linear_infinite]"
          />
        </svg>
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none p-10 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#1B5E3B] animate-ping" />
              <p className="text-[10px] font-black tracking-[0.3em] text-[#1B5E3B] uppercase">
                Orbital Sync: Active
              </p>
            </div>

            <div className="bg-[#1A1A1A] p-5 rounded-sm border-l-4 border-[#1B5E3B] shadow-2xl">
              <p className="text-[9px] font-bold text-[#888888] uppercase mb-2">Atmospheric Vector</p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[8px] text-[#666666] uppercase">Latitude</p>
                  <p className="text-sm font-mono font-bold text-white tracking-tighter">
                    {coords.lat.toFixed(4)}° S
                  </p>
                </div>
                <div>
                  <p className="text-[8px] text-[#666666] uppercase">Longitude</p>
                  <p className="text-sm font-mono font-bold text-white tracking-tighter">
                    {coords.lon.toFixed(4)}° E
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right space-y-1">
            <p className="text-[10px] font-black text-[#1B5E3B] uppercase tracking-widest">
              Region: {activeProvince || 'Scanning...'}
            </p>
            <p className="text-[8px] font-bold text-[#888888] uppercase">Signal Strength: Optimal</p>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[8px] font-bold text-[#1B5E3B] uppercase">Node Status: Verified</p>
            <p className="text-[8px] font-bold text-[#888888] uppercase">Protocol: ZM-2026-ALPHA</p>
          </div>

          <div className="w-32 h-1 bg-[#EEEEEE] overflow-hidden">
            <div className="h-full bg-[#1B5E3B] animate-[load_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      {isHovering && (
  <div
    className="reticle absolute z-50 pointer-events-none transition-transform duration-75 ease-out"
    style={
      {
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
      } as React.CSSProperties
    }
  >
    <div className="relative -translate-x-1/2 -translate-y-1/2">
      <div className="w-12 h-12 border border-[#1B5E3B]/40 rounded-full animate-ping" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-1 bg-[#1B5E3B] rounded-full" />
        <div className="absolute w-6 h-px bg-[#1B5E3B]" />
        <div className="absolute h-6 w-px bg-[#1B5E3B]" />
      </div>

      <div className="absolute top-8 left-8 bg-[#1A1A1A] px-2 py-1 border border-[#333] rounded shadow-xl">
        <p className="text-[8px] font-mono text-emerald-400 font-bold whitespace-nowrap">
          {coords.lat.toFixed(2)} / {coords.lon.toFixed(2)}
        </p>
      </div>
    </div>
  </div>
)}
      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10%,
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(550px);
            opacity: 0;
          }
        }

        @keyframes load {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}