'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { background, normalizeBackgroundImages } from '@/data/background';
import { BackgroundItem } from '@/types';

export default function Background() {
  const [backgroundList, setBackgroundList] = useState<BackgroundItem[]>(background);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [displayItem, setDisplayItem] = useState<BackgroundItem | null>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const expandedRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('jwl_cms_background');
    if (saved) {
      try {
        const nextBackground = JSON.parse(saved).map(normalizeBackgroundImages);
        setBackgroundList(nextBackground);
        localStorage.setItem('jwl_cms_background', JSON.stringify(nextBackground));
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

  const isOpen = selectedId !== null;

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => {
      const next = prev === id ? null : id;
      if (next !== null) {
        setDisplayItem(sortedItems.find((i) => i.id === next) || null);
        setTimeout(() => {
          expandedRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });
        }, 100);
      } else {
        setTimeout(() => setDisplayItem(null), 450);
      }
      return next;
    });
  }, [sortedItems]);

  // Track mobile scroll index
  const handleMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    if (mobileScrollFrameRef.current !== null) return;

    mobileScrollFrameRef.current = requestAnimationFrame(() => {
      mobileScrollFrameRef.current = null;
      if (!mobileScrollRef.current) return;

      const { scrollLeft, clientWidth } = mobileScrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setMobileActiveIndex((prev) => (prev === index ? prev : index));
    });
  };

  useEffect(() => {
    return () => {
      if (mobileScrollFrameRef.current !== null) {
        cancelAnimationFrame(mobileScrollFrameRef.current);
      }
    };
  }, []);

  // Calculate size for index based on hoveredIdx (macOS Dock curve on desktop)
  const getSize = (index: number) => {
    const BASE_SIZE = 64;
    if (hoveredIdx === null) return BASE_SIZE;

    const dist = Math.abs(index - hoveredIdx);
    if (dist < 0.5) return 104;
    if (dist < 1.5) return 86;
    if (dist < 2.5) return 72;
    return BASE_SIZE;
  };

  return (
    <section id="background" className="py-6 px-4 sm:px-6 select-none overflow-hidden">
      <div className="max-w-[1100px] mx-auto">
        {/* Title */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl sm:text-[28px] font-light text-[#0f172a] leading-tight">
            Background
          </h2>
          {/* Mobile slide indicator (e.g. 1 / 8) */}
          <div className="sm:hidden text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {mobileActiveIndex + 1} / {sortedItems.length}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MOBILE VIEW: No small thumbnails, Direct Full-Swipe Carousel */}
        {/* ------------------------------------------------------------- */}
        <div className="sm:hidden -mx-4">
          <div
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth px-4 py-2 gap-4"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {sortedItems.map((item, idx) => (
              <div
                key={item.id}
                className="w-[calc(100vw-2rem)] flex-shrink-0 snap-center flex flex-col items-center text-center"
              >
                {/* Year displayed large in bold */}
                {item.year && (
                  <div className="mb-1">
                    <span className="text-2xl font-bold text-slate-400/90 tracking-tight tabular-nums">
                      {item.year}
                    </span>
                  </div>
                )}

                {/* Large Photo with bottom fade */}
                <div className="w-full flex justify-center mb-3">
                  {item.logo ? (
                    <div className="relative overflow-hidden max-w-full bg-transparent shadow-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.thumbnail || item.logo}
                        alt={item.organization || item.id}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="max-h-[300px] w-auto h-auto max-w-full object-contain block mx-auto rounded-none shadow-none"
                        draggable={false}
                        style={{
                          maskImage:
                            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)',
                          WebkitMaskImage:
                            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)',
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-slate-100 rounded-xl text-xs text-slate-400">
                      No Photo
                    </div>
                  )}
                </div>

                {/* Title & 1-line Description */}
                <div className="w-full px-2">
                  <h3 className="text-base font-semibold text-[#0f172a] tracking-tight leading-snug">
                    {item.organization}
                  </h3>
                  {item.summary && (
                    <p className="text-xs text-slate-600 font-normal mt-1 leading-relaxed">
                      {item.summary}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Swipe Dots Indicator */}
          <div className="flex justify-center items-center gap-1.5 pt-3 pb-1">
            {sortedItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (mobileScrollRef.current) {
                    const width = mobileScrollRef.current.clientWidth;
                    mobileScrollRef.current.scrollTo({ left: width * idx, behavior: 'smooth' });
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  mobileActiveIndex === idx ? 'w-5 bg-[#0f172a]' : 'w-1.5 bg-slate-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DESKTOP VIEW: macOS Dock Magnification Strip + Expandable Photo */}
        {/* ------------------------------------------------------------- */}
        <div className="hidden sm:block">
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
              {/* macOS Dock Magnification Row */}
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
                          'width 0.34s cubic-bezier(0.22, 1, 0.36, 1), height 0.34s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.28s ease',
                        willChange: 'width, height',
                      }}
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
                            src={item.thumbnail || item.logo}
                            alt={item.organization || item.id}
                            fill
                            sizes="112px"
                            className="object-cover"
                            loading="lazy"
                            decoding="async"
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

                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Expanded Detail (Desktop) */}
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
                        loading="lazy"
                        decoding="async"
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
      </div>
    </section>
  );
}
