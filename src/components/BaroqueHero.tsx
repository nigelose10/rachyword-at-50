import React from 'react';

interface BaroqueHeroProps {
  onSaveDate: () => void;
}

export const BaroqueHero: React.FC<BaroqueHeroProps> = ({ onSaveDate }) => {
  return (
    <section className="snap-center relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">

      {/* Layer 1: hero-bg.jpeg — reduced blur */}
      <div className="absolute -inset-6 z-0">
        <img
          src="/hero-bg.jpeg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{
            filter: 'blur(10px) saturate(1.25) brightness(0.35)',
            transform: 'scale(1.08)',
          }}
        />
      </div>

      {/* Layer 2: Vignette */}
      <div className="absolute inset-0 z-[1]" style={{
        background: `
          radial-gradient(ellipse 65% 55% at 50% 42%, transparent 15%, rgba(10,8,6,0.6) 100%),
          linear-gradient(to bottom, rgba(10,8,6,0.25), transparent 25%, transparent 75%, rgba(10,8,6,0.5))
        `,
      }} />

      {/* Layer 3: Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-2xl">

        {/* Ornament */}
        <div className="w-20 ornate-line anim-line-reveal delay-1 mb-16" />

        {/* Name */}
        <p className="anim-rise delay-2 font-display text-2xl md:text-3xl tracking-[0.12em] text-gold-light/55 font-semibold mb-5">
          Deaconess Rachel Akhuetie
        </p>

        {/* Diamond */}
        <div className="anim-appear delay-3 diamond mb-12" />

        {/* Title */}
        <h1
          className="anim-blur-reveal delay-3 font-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold leading-[0.8] tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #E8D5A3 0%, #C9A96E 30%, #F0E0B0 50%, #C9A96E 70%, #8B6914 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'text-shimmer 8s linear infinite',
          }}
        >
          DRA
        </h1>

        {/* Script */}
        <span className="anim-rise delay-4 font-script text-4xl sm:text-5xl md:text-6xl text-gold-light/35 -mt-2 md:-mt-4">
          @ 50
        </span>

        <div className="h-12 md:h-16" />

        {/* Tagline */}
        <p className="anim-rise delay-5 font-body text-base md:text-lg text-parchment/35 max-w-md leading-[1.8] tracking-wide">
          As DRA begins the Countdown to the 5th Floor
        </p>

        <div className="h-10 md:h-14" />

        {/* CTA */}
        <button
          onClick={onSaveDate}
          className="anim-rise delay-6 btn-gold px-14 py-4 rounded-full border border-gold/20 font-body text-[11px] uppercase tracking-[0.3em] text-gold-light/75 hover:text-gold-light cursor-pointer"
        >
          Save The Date
        </button>

        {/* City pills */}
        <div className="anim-appear delay-7 mt-16 flex items-center gap-6 text-[10px] uppercase tracking-[0.35em] text-gold-light/20 font-body">
          {['Dubai', 'Canada', 'Europe', 'Lagos'].map((c, i) => (
            <span key={c} className="flex items-center gap-6">
              {i > 0 && <div className="diamond-sm" />}
              <span>{c}</span>
            </span>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="anim-appear delay-8 mt-20 flex flex-col items-center">
          <div className="w-[1px] h-12 overflow-hidden">
            <div className="w-full h-3 rounded-full" style={{
              background: 'linear-gradient(to bottom, rgba(201,169,110,0.4), transparent)',
              animation: 'scroll-pulse 2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </div>
    </section>
  );
};
