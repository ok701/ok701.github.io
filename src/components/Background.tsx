'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { background } from '@/data/background';
import { BackgroundItem } from '@/types';

export default function Background() {
  const [backgroundList, setBackgroundList] = useState<BackgroundItem[]>(background);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const lastItemRef = useRef<BackgroundItem | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jwl_cms_background');
    if (saved) {
      try {
        setBackgroundList(JSON.parse(saved));
      } catch {
        // fallback
      }
    }
  }, []);

  // Active hover index (desktop only)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // 1, 2, 3, 4 순서대로 정렬
  const sortedItems = useMemo(() => {
    return [...backgroundList].sort((a, b) => {
      const orderA = a.order ?? Infinity;
      const orderB = b.order ?? Infinity;
      return orderA - orderB;
    });
  }, [backgroundList]);

  // Keep the last selected item rendered during close animation
  if (selectedId) {
    lastItemRef.current =
      sortedItems.find((i) => i.id === selectedId) || null;
  }
  const displayItem = lastItemRef.current;
  const isOpen = selectedId !== null;

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => {
      const next = prev === id ? null : id;
      if (next !== null) {
        setTimeout(() => {
          expandedRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }, 100);
      }
      return next;
    });
  }, []);

  // Calculate size for index based on hoveredIdx (macOS Dock curve on desktop)
  const getSize = (index: number) => {
    const BASE_SIZE = 64; // 데스크톱 기본 64px
    if (hoveredIdx === null) return BASE_SIZE;

    const dist = Math.abs(index - hoveredIdx);
    if (dist < 0.5) return 104; // 호버된 중심 아이템: 104px
    if (dist < 1.5) return 86; // 바로 옆 이웃: 86px
    if (dist < 2.5) return 72; // 두 번째 이웃: 72px
    return BASE_SIZE;
  };

  return (
    <section id="background" className="py-6 px-4 sm:px-6 select-none overflow-hidden">
      <div className="max-w-[1100px] mx-auto">
        {/* Title */}
        <h2 className="text-2xl sm:text-[28px] font-light text-[#0f172a] mb-1 leading-tight">
          Background
        </h2>

        {/* Thumbnail Strip Container — fully responsive & mobile scrollable */}
        <div className="w-full relative pt-1 pb-2 flex items-center justify-start sm:justify-center overflow-x-auto sm:overflow-visible scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* Desktop Bold timeline line */}
          <div
            className="hidden sm:block absolute left-0 right-0 pointer-events-none z-0 rounded-full bg-slate-300"
            style={{ top: '50%', transform: 'translateY(-50%)', height: '4px' }}
          />

          <div
            onMouseLeave={() => setHoveredIdx(null)}
            className="relative z-10 inline-flex items-center justify-start sm:justify-center min-w-max px-2 sm:px-4 py-2 overflow-visible"
          >
            {/* Mobile Timeline line behind thumbnails inside scroll area */}
            <div
              className="sm:hidden absolute left-4 right-4 pointer-events-none z-0 rounded-full bg-slate-300"
              style={{ top: '50%', transform: 'translateY(-50%)', height: '3px' }}
            />

            {/* Thumbnails Row — Static clean size on mobile, macOS Dock magnification on desktop */}
            <div className="flex items-center justify-start sm:justify-center gap-2.5 sm:gap-3 h-[76px] sm:h-[112px]">
              {sortedItems.map((item, index) => {
                const isSelected = selectedId === item.id;
                const desktopSize = getSize(index);

                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => setHoveredIdx(index)}
                    onClick={() => handleSelect(item.id)}
                    title={item.organization || item.id}
                    className={`
                      overflow-hidden bg-white relative cursor-pointer flex-shrink-0
                      rounded-xl sm:rounded-2xl focus:outline-none transition-all
                      w-[52px] h-[52px] sm:w-[var(--d-size)] sm:h-[var(--d-size)]
                      ${
                        isSelected
                          ? 'shadow-[0_8px_20px_rgba(0,0,0,0.18)] ring-2 ring-[#0f172a] z-20 scale-105 sm:scale-100'
                          : 'shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] z-10'
                      }
                    `}
                    style={
                      {
                        '--d-size': `${desktopSize}px`,
                        transition:
                          'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, transform 0.2s ease',
                        willChange: 'width, height, transform',
                      } as React.CSSProperties
                    }
                  >
                    {item.logo ? (
                      <div
                        className="relative w-full h-full"
                        style={{
                          filter: 'blur(0.35px)',
                          transform: 'translateZ(0)',
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        <Image
                          src={item.logo}
                          alt={item.organization || item.id}
                          fill
                          sizes="(max-width: 640px) 100px, 180px"
                          quality={95}
                          className="object-cover"
                          draggable={false}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">
                          {item.organization || item.id}
                        </span>
                      </div>
                    )}

                    {/* Current indicator for Samsung */}
                    {item.isCurrent && (
                      <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex h-2 w-2 sm:h-2.5 sm:w-2.5 z-10">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expanded Detail — Fully responsive on mobile & desktop */}
        <div
          ref={expandedRef}
          className="overflow-hidden"
          style={{
            maxHeight: isOpen ? '1000px' : '0px',
            opacity: isOpen ? 1 : 0,
            transition:
              'max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
          }}
        >
          {displayItem && (
            <div
              className="pt-3 sm:pt-4 pb-4 flex flex-col items-center text-center mt-1 sm:mt-2 px-2 sm:px-4"
              style={{
                transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
                opacity: isOpen ? 1 : 0,
                transition:
                  'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
              }}
            >
              {/* Year displayed ABOVE the large photo */}
              {displayItem.year && (
                <div className="mb-1.5 sm:mb-2">
                  <span className="text-2xl sm:text-4xl font-bold text-slate-400/90 tracking-tight tabular-nums">
                    {displayItem.year}
                  </span>
                </div>
              )}

              {/* Centered Image — responsive max-height, shadowless, seamless bottom fade */}
              <div className="w-full flex justify-center mt-1 mb-3 sm:mb-4">
                {displayItem.logo && (
                  <div className="relative overflow-hidden max-w-full bg-transparent shadow-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayItem.logo}
                      alt={displayItem.organization || displayItem.id}
                      className="max-h-[260px] sm:max-h-[520px] w-auto h-auto max-w-full object-contain block mx-auto rounded-none shadow-none"
                      draggable={false}
                      style={{
                        maskImage:
                          'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage:
                          'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Clean Title & 1-line Description below photo */}
              <div className="max-w-2xl mx-auto flex flex-col items-center px-2 sm:px-4">
                {displayItem.organization && (
                  <h3 className="text-base sm:text-xl font-semibold text-[#0f172a] tracking-tight leading-snug">
                    {displayItem.organization}
                  </h3>
                )}
                {displayItem.summary && (
                  <p className="text-xs sm:text-[14px] text-slate-600 font-normal mt-1 sm:mt-1.5 leading-relaxed max-w-xl">
                    {displayItem.summary}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
