import Image from 'next/image';
import { BackgroundItem as BackgroundItemType } from '@/types';

interface BackgroundItemProps {
  item: BackgroundItemType;
  isLast: boolean;
}

export default function BackgroundItem({ item, isLast }: BackgroundItemProps) {
  return (
    <div className="relative flex gap-6">
      {/* Timeline line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#25527e] border-2 border-[#f8fafc] shadow-[0_0_0_3px_rgba(37,82,126,0.15)] mt-1.5 z-10" />
        {!isLast && (
          <div className="w-px flex-1 bg-slate-200 mt-1" />
        )}
      </div>

      {/* Content Card */}
      <div className="flex-1 pb-6">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-shadow duration-300">
          <div className="flex items-start gap-4">
            {/* Logo */}
            {item.logo && (
              <div className="w-12 h-12 md:w-14 md:h-14 relative rounded-xl overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                <Image
                  src={item.logo}
                  alt={item.organization}
                  fill
                  className="object-contain p-1.5"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-[#0f172a] leading-tight">
                {item.organization}
              </h3>
              <p className="text-sm font-medium text-slate-600 mt-0.5">
                {item.role}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
                <span>{item.period}</span>
                <span>{item.location}</span>
              </div>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            {item.description.map((desc, i) => (
              <li key={i} className="text-sm text-slate-600 leading-relaxed flex gap-2">
                <span className="text-[#25527e] mt-1 flex-shrink-0">•</span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
