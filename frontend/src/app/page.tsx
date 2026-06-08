'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

/* ── Architectural Reveal Hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal-slide ${className}`}>{children}</div>;
}

import ClimateHologram from '@/components/ClimateHologram';

/* ══════════════════════════════════════════════════════════
   AMANIYIELD: ARCHITECTURAL MINIMALISM
   ══════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#1A1A1A] selection:bg-[#1B5E3B] selection:text-white">
      
      {/* ── TECHNICAL NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FDFDFC]/80 backdrop-blur-xl hairline-b">
        <div className="max-w-[1400px] mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
               <span className="text-xs font-black tracking-tighter uppercase">AmaniYield</span>
               <span className="text-[10px] font-bold text-[#888888] tracking-[0.2em] border border-[#EEEEEE] px-1.5 py-0.5 rounded-[2px]">[ v.26 ]</span>
            </Link>
          </div>
          <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.15em]">
            <a href="#protocol" className="hover:text-[#1B5E3B] transition-colors">Protocol</a>
            <a href="#mission" className="hover:text-[#1B5E3B] transition-colors">Mission</a>
            <Link href="/login" className="text-[#888888] hover:text-[#1A1A1A]">Log In</Link>
            <Link href="/signup" className="bg-[#1A1A1A] text-white px-4 py-2 rounded-[2px] hover:bg-[#1B5E3B] transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO: THE BLUEPRINT ── */}
      <section className="pt-44 pb-32 max-w-[1400px] mx-auto px-8 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 animate-technical-entry">
          <p className="text-[10px] font-bold text-[#1B5E3B] uppercase tracking-[0.3em] mb-10">
            [ INFRASTRUCTURE // ZMB-26 ]
          </p>
          <h1 className="text-[clamp(3.5rem,8vw,7rem)] font-bold leading-[0.9] tracking-[-0.04em] mb-12">
            Data for the <br /> 
            <span className="text-[#888888]">Last Mile.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#888888] font-medium leading-relaxed max-w-xl">
            Architecting climate resilience for offline communities. Satellite-derived drought warnings and pastoral routing protocols delivered via basic mobile networks.
          </p>
        </div>
        <div className="lg:col-span-4 flex flex-col justify-end animate-technical-entry [animation-delay:200ms]">
          <div className="hairline-t pt-8 space-y-6">
            <div>
              <p className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.2em] mb-2">Compliance</p>
              <p className="text-xs font-bold leading-relaxed">SDG 2, 13, 16 PROTOCOL READY.</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.2em] mb-2">Deployment</p>
              <p className="text-xs font-bold leading-relaxed">100% OFFLINE-FIRST ARCHITECTURE.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISUAL ANCHOR: HOLOGRAPHIC CLIMATE INTERFACE ── */}
      <section className="max-w-[1400px] mx-auto px-8 pb-32 animate-technical-entry [animation-delay:400ms]">
        <div className="aspect-[21/9] bg-[#FDFDFC] hairline-all relative grayscale group hover:grayscale-0 transition-all duration-700 cursor-none">
           <ClimateHologram />
        </div>
      </section>

      {/* ── MODULAR GRID: PROTOCOL ── */}
      <section id="protocol" className="hairline-t bg-[#FDFDFC]">
        <div className="max-w-[1400px] mx-auto flex flex-wrap">
          {[
            { tag: "1.0", title: "Preventing Harvest Failure (Offline SMS Protocol)", desc: "Off-grid farmers are entirely blind to upcoming extreme weather. AmaniYield solves this by translating complex satellite data into simple text messages, warning them to change their planting strategy before a drought wipes out their food supply." },
            { tag: "2.0", title: "Stopping Resource Violence (Spatial Water Routing)", desc: "During droughts, pastoral herders blindly migrate to the same scarce water holes, leading to deadly clashes. AmaniYield solves this by acting as an \"air-traffic controller,\" sending SMS text messages to guide different groups to separate, viable water sources." },
            { tag: "3.0", title: "Intercepting Famine (Edge-AI Crop Scan)", desc: "Governments often don't know a harvest has failed until people are already starving because rural farms are disconnected. AmaniYield solves this by allowing youth workers to scan diseased crops offline, quickly pushing that data to the government to trigger early food aid or insurance payouts." },
            { tag: "4.0", title: "Reversing Deforestation (Green Asset Ledger)", desc: "Rural communities burn down forests to make charcoal because they desperately need cash to survive. AmaniYield solves this by providing a digital marketplace where they can sell live tree seedlings to urban developers, making it more profitable to plant trees than to cut them down." }
          ].map((item, idx) => (
            <div key={idx} className="w-full md:w-1/2 lg:w-1/4 p-12 hairline-r hairline-b group hover:bg-[#F9F9F9] transition-colors cursor-default">
              <Reveal>
                <p className="text-[10px] font-black text-[#1B5E3B] mb-8">{item.tag}</p>
                <h3 className="text-sm font-bold tracking-[0.1em] mb-4 uppercase">{item.title}</h3>
                <p className="text-xs font-medium text-[#888888] leading-relaxed">{item.desc}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION: THE HUMAN INDEX ── */}
      <section id="mission" className="py-44 max-w-[1400px] mx-auto px-8 grid lg:grid-cols-2 gap-24">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Resilience by <br /> 
            <span className="italic text-[#888888]">Design.</span>
          </h2>
        </Reveal>
        <Reveal>
          <p className="text-xl text-[#666666] leading-relaxed mb-8">
            We believe information is a human right. In a warming world, the gap between data and action is where lives are lost. AmaniYield bridges that gap by transforming complex satellite intelligence into simple, life-saving field directives.
          </p>
          <div className="flex gap-12">
            <div>
              <p className="text-2xl font-bold">2.5M</p>
              <p className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.2em] mt-1">Impact Target</p>
            </div>
            <div>
              <p className="text-2xl font-bold">100%</p>
              <p className="text-[9px] font-bold text-[#888888] uppercase tracking-[0.2em] mt-1">Uptime Reliability</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER: TECHNICAL SPEC ── */}
      <footer className="hairline-t py-16">
        <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <span className="text-xs font-black uppercase">AmaniYield</span>
            <span className="text-[10px] text-[#888888] uppercase tracking-widest">[ Protocol ZM-2026 ]</span>
          </div>
          <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888]">
            <a href="#" className="hover:text-[#1A1A1A]">Terminal</a>
            <a href="#" className="hover:text-[#1A1A1A]">Archive</a>
            <a href="#" className="hover:text-[#1A1A1A]">Contact</a>
          </div>
          <p className="text-[10px] font-bold text-[#CCCCCC] uppercase tracking-[0.1em]">
            © All Rights Reserved. Infrastructure for Peace.
          </p>
        </div>
      </footer>

    </div>
  );
}
