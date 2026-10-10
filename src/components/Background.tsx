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
  const desktopAreaRef = useRef<HTMLDivElement>(null);
  const clearDisplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollFrameRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const swapTokenRef = useRef(0);
  const autoScrollUntilRef = useRef(0);
  const [contentVisible, setContentVisible] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);

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

  const scheduleClearDisplay = useCallback(() => {
    if (clearDisplayTimeoutRef.current) clearTimeout(clearDisplayTimeoutRef.current);
    swapTokenRef.current += 1; // cancel any pending swap
    clearDisplayTimeoutRef.current = setTimeout(() => {
      setDisplayItem(null);
      setContentVisible(true);
      clearDisplayTimeoutRef.current = null;
    }, 450);
  }, []);

  // Follow-scroll: for a short while after a click, ease the page down until the
  // whole detail panel is visible. Runs per-frame because on first open the panel
  // grows from 0px (the page isn't tall enough yet for a one-shot scroll), and the
  // large photo may still be loading. Stops early if the user scrolls manually.
  const stopAutoScrollRef = useRef<(() => void) | null>(null);
  const startAutoScroll = useCallback(() => {
    stopAutoScrollRef.current?.();
    const startedAt = performance.now();
    let raf = 0;
    const stop = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', stop);
      if (stopAutoScrollRef.current === stop) stopAutoScrollRef.current = null;
    };
    const step = () => {
      const panel = expandedRef.current;
      const area = desktopAreaRef.current;
      const content = contentRef.current;
      if (panel && area && content) {
        const panelTop = panel.getBoundingClientRect().top;
        const overflow = panelTop + content.offsetHeight + 24 - window.innerHeight;
        // Never push the thumbnail strip up under the navbar
        const maxDelta = area.getBoundingClientRect().top - 80;
        const delta = Math.min(overflow, maxDelta);
        if (delta > 0.5) {
          window.scrollTo({
            top: window.scrollY + Math.max(1, delta * 0.14),
            behavior: 'instant' as ScrollBehavior,
          });
        }
      }
      if (performance.now() - startedAt < 1600) raf = requestAnimationFrame(step);
      else stop();
    };
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchmove', stop, { passive: true });
    window.addEventListener('keydown', stop);
    stopAutoScrollRef.current = stop;
    raf = requestAnimationFrame(step);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      const item = sortedItems.find((i) => i.id === id) || null;

      // Clicking the already-selected item closes it
      if (selectedId === id) {
        setSelectedId(null);
        scheduleClearDisplay();
        return;
      }

      if (clearDisplayTimeoutRef.current) {
        clearTimeout(clearDisplayTimeoutRef.current);
        clearDisplayTimeoutRef.current = null;
      }

      const token = ++swapTokenRef.current;
      setSelectedId(id);
      // Keep the detail in view while it (and its image) settles
      autoScrollUntilRef.current = Date.now() + 2000;
      startAutoScroll();

      // Opening fresh: show immediately
      if (selectedId === null || !displayItem) {
        setDisplayItem(item);
        setContentVisible(true);
        return;
      }

      // Switching between items: fade out → (preload) swap → fade in
      setContentVisible(false);
      const start = Date.now();
      let finished = false;
      const finish = () => {
        if (finished || swapTokenRef.current !== token) return;
        finished = true;
        const wait = Math.max(0, 240 - (Date.now() - start));
        setTimeout(() => {
          if (swapTokenRef.current !== token) return;
          setDisplayItem(item);
          requestAnimationFrame(() => {
            if (swapTokenRef.current === token) setContentVisible(true);
          });
        }, wait);
      };
      if (item?.logo) {
        const img = new window.Image();
        img.onload = finish;
        img.onerror = finish;
        img.src = item.logo;
        setTimeout(finish, 800); // don't wait forever on slow images
      } else {
        finish();
      }
    },
    [sortedItems, selectedId, displayItem, scheduleClearDisplay, startAutoScroll]
  );

  // Measure detail content so the panel height can animate smoothly
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContentHeight(el.offsetHeight));
    ro.observe(el);
    setContentHeight(el.offsetHeight);
    return () => ro.disconnect();
  }, [displayItem]);

  // Clean up any running auto-scroll on unmount
  useEffect(() => () => stopAutoScrollRef.current?.(), []);

  // Click outside the desktop strip / expanded detail → reset to the original state
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (desktopAreaRef.current?.contains(e.target as Node)) return;
      setSelectedId(null);
      setHoveredIdx(null);
      scheduleClearDisplay();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen, scheduleClearDisplay]);

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
  // When nothing is hovered, keep the magnification centered on the selected item.
  const selectedIdx = selectedId ? sortedItems.findIndex((i) => i.id === selectedId) : -1;
  const focusIdx = hoveredIdx ?? (selectedIdx >= 0 ? selectedIdx : null);

  const getSize = (index: number) => {
    const BASE_SIZE = 46;
    if (focusIdx === null) return BASE_SIZE;

    const dist = Math.abs(index - focusIdx);
    if (dist < 0.5) return 100;
    if (dist < 1.5) return 78;
    if (dist < 2.5) return 60;
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
        <div ref={desktopAreaRef} className="hidden sm:block">
          {/* Thumbnail Strip with squiggle → arrow timeline stretching across */}
          <div className="w-full relative pt-1 pb-2 flex items-center justify-center overflow-visible">
            {/* Timeline: wavy squiggle on the left that settles into a straight arrow */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 pointer-events-none z-0 flex items-center text-slate-300"
              style={{ top: '50%', transform: 'translateY(-50%)', height: '112px' }}
            >
              <svg
                viewBox="0 0 160 112"
                className="h-full w-auto flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 86 C4 44, 9 14, 16 14 C25 14, 24 100, 35 100 C46 100, 44 18, 55 18 C66 18, 64 94, 76 94 C87 94, 86 30, 97 30 C108 30, 106 78, 118 78 C128 78, 130 56, 143 56 L160 56" />
              </svg>
              <div className="flex-1 h-[3px] bg-current -ml-px" />
              <svg
                viewBox="0 0 16 24"
                className="h-6 w-4 flex-shrink-0 -ml-px"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M0 12 L14 12 M4 3 L14 12 L4 21" />
              </svg>
            </div>

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
                      onMouseEnter={() => {
                        setHoveredIdx(index);
                        // Warm the cache so the detail photo is ready on click
                        if (item.logo) new window.Image().src = item.logo;
                      }}
                      onClick={() => handleSelect(item.id)}
                      title={item.organization || item.id}
                      className={`
                        overflow-hidden bg-white relative cursor-pointer flex-shrink-0
                        rounded-[22%] focus:outline-none
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
                          style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
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

          {/* Expanded Detail (Desktop) — height animates to measured content */}
          <div
            ref={expandedRef}
            className="overflow-hidden"
            style={{
              height: isOpen ? `${contentHeight}px` : '0px',
              opacity: isOpen ? 1 : 0,
              transition:
                'height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
            }}
          >
            {displayItem && (
              <div
                ref={contentRef}
                className="pt-6 pb-4 flex flex-col items-center text-center"
                style={{
                  transform:
                    isOpen && contentVisible
                      ? 'translateY(0) scale(1)'
                      : 'translateY(10px) scale(0.985)',
                  opacity: isOpen && contentVisible ? 1 : 0,
                  filter: isOpen && contentVisible ? 'blur(0px)' : 'blur(4px)',
                  transition:
                    'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, filter 0.3s ease',
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
                        loading="eager"
                        decoding="async"
                        draggable={false}
                        onLoad={() => {
                          // Photo arrived shortly after a click → follow the taller panel
                          if (Date.now() < autoScrollUntilRef.current + 3000) {
                            startAutoScroll();
                          }
                        }}
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
