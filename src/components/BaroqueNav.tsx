import React, { useState, useEffect } from 'react';

interface BaroqueNavProps {
  onRSVP: () => void;
}

export const BaroqueNav: React.FC<BaroqueNavProps> = ({ onRSVP }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const parent = document.querySelector('.snap-y-mandatory');
    if (!parent) return;
    const handleScroll = () => setScrolled(parent.scrollTop > 80);
    parent.addEventListener('scroll', handleScroll, { passive: true });
    return () => parent.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Gallery', id: 'gallery' },
    { label: 'Dubai', id: 'dubai' },
    { label: 'Canada', id: 'canada' },
    { label: 'Europe', id: 'europe' },
    { label: 'Lagos', id: 'lagosnigeria' },
  ];

  return (
    <nav
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-noir/88 border-gold/10 shadow-2xl px-8 py-3 rounded-full border'
          : 'px-8 py-4'
      }`}
      style={{ backdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none' }}
    >
      <div className="flex items-center gap-8 md:gap-10">
        {/* Logo */}
        <a href="#" className="font-display text-base md:text-lg font-bold text-gold-light/80 tracking-[0.08em] whitespace-nowrap">
          DRA<span className="text-gold/35 font-normal">@</span>50
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(c => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="text-[10px] uppercase tracking-[0.22em] text-gold/30 hover:text-gold-light/75 transition-colors duration-400 font-body"
            >
              {c.label}
            </a>
          ))}
        </div>

        {/* Save Date */}
        <button
          onClick={onRSVP}
          className="text-[10px] uppercase tracking-[0.22em] text-gold/50 hover:text-gold-light transition-colors duration-400 font-body cursor-pointer whitespace-nowrap font-semibold"
        >
          Save Date
        </button>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-[1.5px] bg-gold/55 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`w-5 h-[1.5px] bg-gold/55 transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-[1.5px] bg-gold/55 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden pt-6 pb-3 flex flex-col gap-5">
          {navLinks.map(c => (
            <a
              key={c.id}
              href={`#${c.id}`}
              onClick={() => setMobileOpen(false)}
              className="text-[11px] uppercase tracking-[0.2em] text-gold/45 hover:text-gold-light/75 font-body text-center transition-colors"
            >
              {c.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};
