'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { background } from '@/data/background';
import { BackgroundItem } from '@/types';

export default function Background() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const lastItemRef = useRef<BackgroundItem | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  // Active hover index
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // 1, 2, 3, 4 순서대로 정렬
  const sortedItems = useMemo(() => {
    return [...background].sort((a, b) => {
      const orderA = a.order ?? Infinity;
      const orderB = b.order ?? Infinity;
      return orderA - orderB;
    });
  }, []);

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

  // Calculate size for index based on hoveredIdx (macOS Dock curve) — Enlarged base & magnification
  const getSize = (index: number) => {
    const BASE_SIZE = 64; // 기본 64px (이전 54px에서 확대)
    if (hoveredIdx === null) return BASE_SIZE;

    const dist = Math.abs(index - hoveredIdx);
    if (dist < 0.5) return 104; // 호버된 중심 아이템: 104px
    if (dist < 1.5) return 86; // 바로 옆 이웃: 86px
    if (dist < 2.5) return 72; // 두 번째 이웃: 72px
    return BASE_SIZE;
  };

  return (
    <section id="background" className="py-6 px-6 select-none">
      <div className="max-w-[1100px] mx-auto">
        {/* Title */}
        <h2 className="text-[28px] font-light text-[#0f172a] mb-1 leading-tight">Background</h2>

        {/* Thumbnail Strip with bold gray line stretching wide across */}
        <div className="w-full relative pt-1 pb-2 flex items-center justify-center overflow-visible">
          {/* Bold solid gray timeline line stretching all the way across */}
          <div
            className="absolute left-0 right-0 pointer-events-none z-0 rounded-full bg-slate-300"
            style={{ top: '50%', transform: 'translateY(-50%)', height: '4px' }}
          />

          <div
            onMouseLeave={() => setHoveredIdx(null)}
            className="relative z-10 inline-flex items-center justify-center min-w-max px-4 py-2 overflow-visible"
          >
            {/* macOS Dock Magnification Row — Enlarged */}
            <div className="flex items-center justify-center gap-3 h-[112px]">
              {sortedItems.map((item, index) => {
                const isSelected = selectedId === item.id;
                const size = getSize(index);

                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => setHoveredIdx(index)}
                    onClick={() => handleSelect(item.id)}
                    title={item.organization || item.id}
                    className={`
                      overflow-hidden bg-white relative cursor-pointer flex-shrink-0
                      rounded-2xl focus:outline-none
                      ${
                        isSelected
                          ? 'shadow-[0_10px_28px_rgba(0,0,0,0.2)] ring-2 ring-[#0f172a] z-20'
                          : 'shadow-[0_3px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] z-10'
                      }
                    `}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      transition:
                        'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
                      willChange: 'width, height',
                    }}
                  >
                    {item.logo ? (
                      <div
                        className="relative w-full h-full"
                        style={{
                          // Balanced 0.35px blur for smooth antialiasing
                          filter: 'blur(0.35px)',
                          transform: 'translateZ(0)',
                          backfaceVisibility: 'hidden',
                        }}
                      >
                        <Image
                          src={item.logo}
                          alt={item.organization || item.id}
                          fill
                          sizes="180px"
                          quality={95}
                          className="object-cover"
                          draggable={false}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <span className="text-[11px] font-bold text-slate-500">
                          {item.organization || item.id}
                        </span>
                      </div>
                    )}

                    {/* Current indicator for Samsung */}
                    {item.isCurrent && (
                      <span className="absolute top-2 right-2 flex h-2.5 w-2.5 z-10">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expanded Detail — Enlarged photo and comfortable balanced spacing */}
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
              className="pt-4 pb-4 flex flex-col items-center text-center mt-2"
              style={{
                transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
                opacity: isOpen ? 1 : 0,
                transition:
                  'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
              }}
            >
              {/* Year displayed ABOVE the large photo */}
              {displayItem.year && (
                <div className="mb-2">
                  <span className="text-3xl sm:text-4xl font-bold text-slate-400/90 tracking-tight tabular-nums">
                    {displayItem.year}
                  </span>
                </div>
              )}

              {/* Centered Image — Enlarged (max-h 520px), shadowless, bottom fade */}
              <div className="w-full flex justify-center mt-1 mb-4">
                {displayItem.logo && (
                  <div className="relative overflow-hidden max-w-full bg-transparent shadow-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayItem.logo}
                      alt={displayItem.organization || displayItem.id}
                      className="max-h-[440px] sm:max-h-[520px] w-auto h-auto object-contain block mx-auto rounded-none shadow-none"
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
              <div className="max-w-2xl mx-auto flex flex-col items-center px-4">
                {displayItem.organization && (
                  <h3 className="text-lg sm:text-xl font-semibold text-[#0f172a] tracking-tight">
                    {displayItem.organization}
                  </h3>
                )}
                {displayItem.summary && (
                  <p className="text-sm sm:text-[14px] text-slate-600 font-normal mt-1.5 leading-relaxed max-w-xl">
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
