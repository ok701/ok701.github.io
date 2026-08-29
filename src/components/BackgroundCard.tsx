'use client';

import Image from 'next/image';
import { BackgroundItem } from '@/types';

interface BackgroundCardProps {
  item: BackgroundItem;
  onClick: () => void;
}

export default function BackgroundCard({ item, onClick }: BackgroundCardProps) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="w-[280px] sm:w-[320px] md:w-[340px] flex-shrink-0 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.09)] hover:-translate-y-1.5 hover:border-slate-300 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative"
    >
      {/* Top Section: Prominent Logo Display */}
      <div>
        {item.logo ? (
          <div className="w-full h-28 sm:h-32 rounded-xl bg-slate-50/80 border border-slate-100/90 flex items-center justify-center p-3 mb-4 group-hover:bg-white group-hover:scale-[1.02] group-hover:shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition-all duration-300 relative overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src={item.thumbnail || item.logo}
                alt={item.organization}
                fill
                sizes="340px"
                loading="lazy"
                decoding="async"
                className="object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="w-full h-28 sm:h-32 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-400 font-bold text-lg">
            {item.organization}
          </div>
        )}

        {/* Institution Name */}
        <h3 className="font-bold text-[#0f172a] text-lg leading-snug group-hover:text-[#25527e] transition-colors line-clamp-1">
          {item.organization}
        </h3>

        {/* Role */}
        <p className="text-sm text-slate-600 font-medium mt-1 line-clamp-1">
          {item.role}
        </p>
      </div>

      {/* Bottom Section: Period & Details Indicator */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium tabular-nums">
          {item.period}
        </span>
        <span className="text-xs font-semibold text-[#25527e] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
          Explore Details →
        </span>
      </div>
    </div>
  );
}
