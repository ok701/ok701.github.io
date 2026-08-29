'use client';

import { useState, useEffect } from 'react';
import { Bodoni_Moda } from 'next/font/google';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

const navItems = [
  { label: 'Profile', href: '#profile' },
  { label: 'News', href: '#news' },
  { label: 'Research', href: '#research' },
  { label: 'Background', href: '#background' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      const offsetTop = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? 'bg-[#F5F5F7]/85 backdrop-blur-md border-slate-200/80 shadow-[0_1px_8px_rgba(15,23,42,0.04)]'
          : 'bg-transparent border-transparent shadow-none backdrop-blur-none'
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <a
            href="#profile"
            onClick={(e) => handleClick(e, '#profile')}
            className={`${bodoni.className} text-[1.45rem] font-bold tracking-[0.08em] text-[#0f172a] hover:text-[#25527e] transition-colors select-none`}
          >
            JWL
          </a>
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className="text-sm px-3 py-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
