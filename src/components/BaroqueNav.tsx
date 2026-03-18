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

  const cities = [
    { label: 'Dubai', id: 'dubai' },
    { label: 'Canada', id: 'canada' },
    { label: 'Europe', id: 'europe' },
    { label: 'Lagos', id: 'lagosnigeria' },
  ];

  return (
    <nav
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-noir/85 border-gold/12 shadow-xl px-8 py-3.5 rounded-full border'
          : 'px-8 py-4'
      }`}
      style={{ backdropFilter: scrolled ? 'blur(16px)' : 'none' }}
    >
      <div className="flex items-center gap-7 md:gap-9">
        {/* Logo — bigger */}
        <a href="#" className="font-display text-base md:text-lg font-bold text-gold-light/80 tracking-wider whitespace-nowrap">
          DRA<span className="text-gold/40 font-normal">@</span>50
        </a>

        {/* Desktop Links — bigger */}
        <div className="hidden md:flex items-center gap-7">
          {cities.map(c => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="text-[11px] uppercase tracking-[0.2em] text-gold/40 hover:text-gold-light/80 transition-colors font-body"
            >
              {c.label}
            </a>
          ))}
        </div>

        {/* Save Date — bigger */}
        <button
          onClick={onRSVP}
          className="text-[11px] uppercase tracking-[0.2em] text-gold/55 hover:text-gold-light transition-colors font-body cursor-pointer whitespace-nowrap font-semibold"
        >
          Save Date
        </button>

        {/* Mobile toggle — bigger */}
        <button
          className="md:hidden flex flex-col gap-1.5 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`w-5 h-[1.5px] bg-gold/60 transition-transform ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
          <span className={`w-5 h-[1.5px] bg-gold/60 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-[1.5px] bg-gold/60 transition-transform ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden pt-5 pb-3 flex flex-col gap-4">
          {cities.map(c => (
            <a
              key={c.id}
              href={`#${c.id}`}
              onClick={() => setMobileOpen(false)}
              className="text-[11px] uppercase tracking-[0.2em] text-gold/55 font-body text-center"
            >
              {c.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};
