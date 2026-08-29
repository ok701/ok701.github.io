'use client';

import { useState, useEffect, useCallback } from 'react';
import { Project, ProjectLink } from '@/types';
import ProjectGallery from './ProjectGallery';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

const getLinkIcon = (type?: ProjectLink['type']) => {
  switch (type) {
    case 'github':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case 'paper':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case 'video':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      );
  }
};

export default function ProjectDetailModal({
  project,
  onClose,
}: ProjectDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  const handleClose = useCallback(() => {
    setActive(false);
    setTimeout(() => {
      onClose();
    }, 280);
  }, [onClose]);

  useEffect(() => {
    if (project) {
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
  }, [project, handleClose]);

  if (!mounted || !project) return null;

  // Aggregate links
  const allLinks: ProjectLink[] = project.links || [];
  if (allLinks.length === 0) {
    if (project.paperUrl) allLinks.push({ label: 'Paper', url: project.paperUrl, type: 'paper' });
    if (project.githubUrl) allLinks.push({ label: 'Code', url: project.githubUrl, type: 'github' });
    if (project.videoUrl) allLinks.push({ label: 'Video', url: project.videoUrl, type: 'video' });
    if (project.projectUrl) allLinks.push({ label: 'Project', url: project.projectUrl, type: 'project' });
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto transition-opacity duration-300 ${
        active ? 'opacity-100 bg-slate-900/50 backdrop-blur-sm' : 'opacity-0 bg-slate-900/0'
      }`}
      onClick={handleClose}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {/* Modal Frame with pinned close button */}
      <div
        className={`bg-white border border-slate-200/90 rounded-3xl shadow-[0_24px_64px_rgba(15,23,42,0.16)] max-w-2xl w-full max-h-[90vh] relative my-auto overflow-hidden flex flex-col transition-all duration-300 ${
          active
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-6 scale-[0.96]'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Fixed Close Button (Top-Right, No circle, subtle to dark on hover) */}
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
          {/* Project Gallery / Images */}
          <ProjectGallery
            images={project.gallery && project.gallery.length > 0 ? project.gallery : [project.thumbnail]}
            title={project.title}
          />

          {/* Metadata Header */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs bg-[#eef3f8] text-[#1e3e62] px-2.5 py-0.5 rounded-full font-semibold border border-[#d3e0ed]">
              {project.category}
            </span>
            <span className="text-sm text-slate-400 font-medium">
              {project.period}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-4 leading-tight pr-6">
            {project.title}
          </h3>

          {/* Prose Description */}
          <div className="mb-6">
            {project.description.split('\n\n').map((paragraph, idx) => (
              <p
                key={idx}
                className="text-[15px] sm:text-base text-slate-600 leading-relaxed mb-3.5 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Subtle Secondary Topic Tags */}
          {project.keywords.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 pb-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                Focus:
              </span>
              {project.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-[11px] font-medium bg-[#f3eadc] text-[#4a2d1f] px-2.5 py-0.5 rounded-md border border-[#e2cfb7]"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Action Links */}
          {allLinks.length > 0 && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
              {allLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-[#0f172a] hover:text-white border border-slate-200 hover:border-[#0f172a] shadow-[0_1px_4px_rgba(15,23,42,0.04)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {getLinkIcon(link.type)}
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
