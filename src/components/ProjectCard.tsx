'use client';

import Image from 'next/image';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  priority?: boolean;
}

export default function ProjectCard({ project, onClick, priority = false }: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Thumbnail */}
      <div className="w-full aspect-[16/6.8] relative bg-slate-100 overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          sizes="(min-width: 768px) 520px, calc(100vw - 48px)"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          decoding="async"
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        {project.venueBadge && (
          <div className="absolute top-2 left-2 bg-[#0f172a]/80 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border border-white/10 shadow-sm">
            {project.venueBadge}
          </div>
        )}
      </div>

      {/* Compact Content */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-base font-bold text-[#0f172a] group-hover:text-[#25527e] transition-colors leading-snug">
            {project.title}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {project.period}
          </p>
        </div>
        <div className="mt-2 flex items-center text-xs font-medium text-[#25527e] group-hover:translate-x-0.5 transition-transform">
          <span>View Details</span>
          <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
