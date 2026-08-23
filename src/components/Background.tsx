'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { background } from '@/data/background';
import { BackgroundItem } from '@/types';
import BackgroundDetailModal from './BackgroundDetailModal';

export default function Background() {
  const [selectedItem, setSelectedItem] = useState<BackgroundItem | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Drag state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isPointerDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const isDragging = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!scrollContainerRef.current) return;
    isPointerDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftStart.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.25;
    if (Math.abs(walk) > 4) {
      isDragging.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
    setTimeout(() => {
      isDragging.current = false;
    }, 60);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section id="background" className="py-8 px-6 overflow-hidden select-none">
      <div className="max-w-[1100px] mx-auto">
        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0f172a]">Background</h2>
        </div>

        {/* Horizontal Journey Timeline Area */}
        <div className="relative">
          {/* Left Edge Gradient Fade (when scrolled) */}
          {scrollProgress > 0.05 && (
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-[#f8fafc] to-transparent pointer-events-none z-20 transition-opacity duration-300" />
          )}

          {/* Right Edge Gradient Fade (cues horizontal overflow) */}
          {scrollProgress < 0.95 && (
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#f8fafc] to-transparent pointer-events-none z-20 transition-opacity duration-300" />
          )}

          {/* Draggable Track */}
          <div
            ref={scrollContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="overflow-x-auto pb-4 pt-3 no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Continuous Scene Container with SVG Flowing Path */}
            <div className="relative inline-flex items-start min-w-max px-4 sm:px-8 py-6">
              {/* Soft Flowing Background Path / Ribbon */}
              <div className="absolute left-0 right-0 top-16 sm:top-20 h-28 pointer-events-none z-0">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 1050 120"
                  fill="none"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="flowPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#25527e" stopOpacity="0.10" />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.18" />
                    </linearGradient>
                    <linearGradient id="flowCoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#25527e" stopOpacity="0.18" />
                      <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.30" />
                    </linearGradient>
                    <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Wide Translucent Flowing Ribbon */}
                  <path
                    d="M 20 60 C 180 50, 260 70, 420 58 C 580 46, 680 72, 860 60 C 940 54, 1000 58, 1040 60"
                    stroke="url(#flowPathGrad)"
                    strokeWidth="32"
                    strokeLinecap="round"
                    filter="url(#softGlow)"
                  />
                  {/* Subtle Inner Core Stream */}
                  <path
                    d="M 20 60 C 180 50, 260 70, 420 58 C 580 46, 680 72, 860 60 C 940 54, 1000 58, 1040 60"
                    stroke="url(#flowCoreGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Floating Organization Anchors */}
              <div className="relative z-10 flex gap-12 sm:gap-16 md:gap-20 items-start">
                {background.map((item) => (
                  <div
                    key={item.id || item.organization}
                    onClick={() => {
                      if (!isDragging.current) {
                        setSelectedItem(item);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedItem(item);
                      }
                    }}
                    className="flex flex-col items-center group cursor-pointer w-[200px] sm:w-[220px] md:w-[240px] focus:outline-none"
                  >
                    {/* 1:1 Square Frame Floating Logo */}
                    <div
                      className={`w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 aspect-square rounded-[22px] bg-white border p-3.5 sm:p-4 flex items-center justify-center relative transition-all duration-300 group-hover:-translate-y-1.5 ${
                        item.isCurrent
                          ? 'border-slate-300 shadow-[0_8px_30px_rgba(15,23,42,0.08)] group-hover:shadow-[0_18px_40px_rgba(15,23,42,0.14)] group-hover:border-[#0f172a]/40 ring-1 ring-[#0f172a]/10'
                          : 'border-slate-200/80 shadow-[0_8px_24px_rgba(15,23,42,0.05)] group-hover:shadow-[0_16px_36px_rgba(15,23,42,0.1)] group-hover:border-slate-300'
                      }`}
                    >
                      {item.logo ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={item.logo}
                            alt={item.organization}
                            fill
                            className="object-contain"
                            draggable={false}
                          />
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-slate-400 text-center">
                          {item.organization}
                        </span>
                      )}

                      {/* Subtle Current Indicator for Samsung */}
                      {item.isCurrent && (
                        <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                      )}
                    </div>

                    {/* Minimal Labels Underneath */}
                    <div className="flex flex-col items-center text-center mt-4">
                      <h3 className="font-bold text-[#0f172a] text-sm sm:text-base leading-snug group-hover:text-[#25527e] transition-colors max-w-[200px]">
                        {item.organization}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 max-w-[190px]">
                        {item.role}
                      </p>
                      <span className="text-xs text-slate-400 font-medium tabular-nums mt-1">
                        {item.period}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extra spacing on the right for clean 15-25% partial crop effect */}
              <div className="w-12 sm:w-16 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        <BackgroundDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </div>
    </section>
  );
}
