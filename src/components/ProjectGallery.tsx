'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const currentDragX = useRef(0);

  const total = images.length;

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(total - 1, prev + 1));
  }, [total]);

  // Pointer event handlers for unified Mouse + Touch dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    if (total <= 1) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    currentDragX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    currentDragX.current = e.clientX;
    let delta = e.clientX - dragStartX.current;

    // Apply friction at bounds
    if ((currentIndex === 0 && delta > 0) || (currentIndex === total - 1 && delta < 0)) {
      delta *= 0.3;
    }
    setDragOffset(delta);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = currentDragX.current - dragStartX.current;
    const threshold = 40; // minimum drag distance in pixels to trigger slide

    if (delta < -threshold && currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (delta > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }

    setDragOffset(0);
  };

  // Keyboard navigation when gallery is in view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative mb-5 group">
      {/* Gallery Frame */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`w-full aspect-[16/10] sm:aspect-[16/9] relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner select-none touch-pan-y ${
          total > 1 ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      >
        {/* Slider Track */}
        <div
          className="flex h-full w-full"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {images.map((src, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0 relative flex items-center justify-center bg-slate-100"
            >
              <Image
                src={src}
                alt={`${title} - image ${index + 1}`}
                fill
                className="object-cover pointer-events-none"
                priority={index === 0}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Counter Badge */}
        {total > 1 && (
          <div className="absolute top-3 right-3 bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full tabular-nums shadow-sm pointer-events-none z-10">
            {currentIndex + 1} / {total}
          </div>
        )}

        {/* Arrow Navigation (Desktop/Hover) */}
        {total > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-slate-700 shadow-[0_2px_8px_rgba(15,23,42,0.12)] border border-slate-200/80 flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-10"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {currentIndex < total - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white text-slate-700 shadow-[0_2px_8px_rgba(15,23,42,0.12)] border border-slate-200/80 flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-10"
                aria-label="Next image"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {total > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-2.5">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-5 bg-[#0f172a]'
                  : 'w-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
