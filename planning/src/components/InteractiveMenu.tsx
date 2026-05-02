"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, MapPin, Users, Settings } from "lucide-react";
import guestlist from "../guestlist.json";

gsap.registerPlugin(ScrollTrigger);

export default function InteractiveMenu({ onNavigateToSeating }: { onNavigateToSeating?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !heroRef.current || !gridRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      heroRef.current.children,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
    );

    gsap.fromTo(
      gridRef.current.children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white px-4 sm:px-8 py-24">
      {/* HERO SECTION - Attention */}
      <div ref={heroRef} className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center mb-32">
        <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold tracking-tighter uppercase font-bodoni-moda mb-6 leading-none">
          DRA@50
        </h1>
        <p className="text-xl sm:text-2xl text-white/60 tracking-widest uppercase mb-12">
          The Master Planning Directory
        </p>
      </div>

      {/* BENTO GRID - Interest */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-light tracking-wider mb-12 uppercase">Command Center</h2>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Guest List Card */}
          <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
              <Users className="w-24 h-24" />
            </div>
            <h3 className="text-2xl font-medium mb-4 relative z-10">Guest List</h3>
            <p className="text-white/60 mb-8 relative z-10 max-w-sm">
              Manage invitations, RSVPs, and VIP accommodations.
            </p>
            <div className="text-5xl font-light font-bodoni-moda relative z-10">
              {guestlist.length} <span className="text-lg font-sans">Invited Guests</span>
            </div>
          </div>

          {/* Logistics Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <Settings className="w-8 h-8 mb-6 text-white/60 group-hover:text-white transition-colors" />
            <h3 className="text-xl font-medium mb-2">Logistics</h3>
            <p className="text-white/60 text-sm">Catering, Decor & Timeline</p>
          </div>

          {/* Venue Card */}
          <div onClick={onNavigateToSeating} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors group cursor-pointer">
            <MapPin className="w-8 h-8 mb-6 text-white/60 group-hover:text-white transition-colors" />
            <h3 className="text-xl font-medium mb-2">Seating Chart</h3>
            <p className="text-white/60 text-sm">Organize Tables & Guests</p>
          </div>

          {/* Schedule Card */}
          <div className="col-span-1 md:col-span-2 bg-[#f0f0f0] text-black border border-white/10 rounded-3xl p-8 hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">Event Schedule</h3>
              <Calendar className="w-8 h-8" />
            </div>
            <p className="text-black/60 max-w-sm">
              Review and finalize the minute-by-minute run of show.
            </p>
          </div>

        </div>
      </div>
      
      {/* DESIRE & ACTION section can be expanded later */}
      <div className="max-w-7xl mx-auto mt-32 text-center pb-32">
        <button className="bg-white text-black px-12 py-6 rounded-full text-xl uppercase tracking-widest font-bold hover:scale-105 transition-transform duration-300">
          Begin Planning
        </button>
      </div>
    </div>
  );
}
