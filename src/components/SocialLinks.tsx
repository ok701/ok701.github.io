'use client';

import { useState, useRef, useEffect } from 'react';
import { SocialLink } from '@/types';

const icons: Record<SocialLink['icon'], React.ReactNode> = {
  email: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  cv: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  github: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  scholar: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

interface SocialLinksProps {
  links: SocialLink[];
}

export default function SocialLinks({ links }: SocialLinksProps) {
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const emailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emailRef.current && !emailRef.current.contains(event.target as Node)) {
        setIsEmailOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCopy = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5 items-center">
      {links.map((link) => {
        if (link.icon === 'email') {
          const emailAddress = link.url.replace(/^mailto:/, '');

          return (
            <div key={link.label} className="relative inline-flex items-center" ref={emailRef}>
              <button
                type="button"
                onClick={() => setIsEmailOpen(!isEmailOpen)}
                aria-expanded={isEmailOpen}
                aria-haspopup="true"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
                  isEmailOpen
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'text-slate-600 bg-white/90 border-slate-200 shadow-[0_2px_6px_rgba(15,23,42,0.04)] hover:bg-white hover:text-slate-900 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] hover:-translate-y-0.5'
                }`}
              >
                {icons[link.icon]}
                <span>{link.label}</span>
                <svg
                  className={`w-3 h-3 ml-0.5 text-slate-400 transition-transform duration-200 ${
                    isEmailOpen ? 'rotate-180 text-white' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isEmailOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-white/95 backdrop-blur-md p-3 shadow-2xl border border-slate-200/90 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* 이메일 주소 & 원클릭 복사 버튼 */}
                  <div className="flex items-center justify-between gap-2 p-2 bg-slate-50/90 rounded-xl border border-slate-200/70 mb-2">
                    <span className="text-xs font-mono font-medium text-slate-700 truncate select-all px-1">
                      {emailAddress}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(emailAddress)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        copied
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {copied ? (
                        <>
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 외부 연결 옵션 */}
                  <div className="flex flex-col gap-1 text-xs">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsEmailOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                      </svg>
                      <span className="font-medium">웹 Gmail로 작성</span>
                      <span className="ml-auto text-[10px] text-slate-400">새 탭 ↗</span>
                    </a>

                    <a
                      href={link.url}
                      onClick={() => setIsEmailOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <svg className="w-4 h-4 text-slate-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <span className="font-medium">기본 메일 앱 실행</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <a
            key={link.label}
            href={link.url}
            target={link.url.startsWith('/') ? undefined : '_blank'}
            rel={link.url.startsWith('/') ? undefined : 'noopener noreferrer'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 bg-white/90 border border-slate-200 shadow-[0_2px_6px_rgba(15,23,42,0.04)] hover:bg-white hover:text-slate-900 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200"
          >
            {icons[link.icon]}
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
