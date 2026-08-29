'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { BackgroundItem } from '@/types';

interface BackgroundDetailModalProps {
  item: BackgroundItem | null;
  onClose: () => void;
}

export default function BackgroundDetailModal({
  item,
  onClose,
}: BackgroundDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  const handleClose = useCallback(() => {
    setActive(false);
    setTimeout(() => {
      onClose();
    }, 280);
  }, [onClose]);

  useEffect(() => {
    if (item) {
      setMounted(true);
      const timer = setTimeout(() => setActive(true), 20);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') handleClose();
      };

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      setMounted(false);
      setActive(false);
    }
  }, [item, handleClose]);

  if (!mounted || !item) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto transition-opacity duration-300 ${
        active ? 'opacity-100 bg-slate-900/50 backdrop-blur-sm' : 'opacity-0 bg-slate-900/0'
      }`}
      onClick={handleClose}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <div
        className={`bg-white border border-slate-200/90 rounded-3xl shadow-[0_24px_64px_rgba(15,23,42,0.16)] max-w-xl w-full max-h-[90vh] relative my-auto overflow-hidden flex flex-col transition-all duration-300 ${
          active
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-6 scale-[0.96]'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Pinned Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-30 p-2 text-slate-400 hover:text-slate-900 opacity-60 hover:opacity-100 transition-all duration-200 cursor-pointer focus:outline-none"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {/* Logo Showcase Header */}
          {item.logo && (
            <div className="w-full h-28 sm:h-32 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4 mb-6 shadow-inner relative">
              <div className="relative w-full h-full">
                <Image
                  src={item.thumbnail || item.logo}
                  alt={item.organization}
                  fill
                  sizes="(min-width: 640px) 512px, calc(100vw - 80px)"
                  loading="lazy"
                  decoding="async"
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {/* Metadata Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs bg-[#eef3f8] text-[#1e3e62] px-2.5 py-0.5 rounded-full font-semibold border border-[#d3e0ed]">
                {item.period}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {item.location}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#0f172a] leading-tight">
              {item.organization}
            </h3>
            <p className="text-base font-semibold text-[#25527e] mt-1">
              {item.role}
            </p>
          </div>

          {/* Natural Prose Description */}
          <div className="text-[15px] sm:text-base text-slate-600 leading-relaxed pt-4 border-t border-slate-100">
            <p>{item.summary || item.description?.join(' ') || ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
