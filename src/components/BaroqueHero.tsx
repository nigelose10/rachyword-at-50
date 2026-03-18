import React from 'react';

interface BaroqueHeroProps {
  onSaveDate: () => void;
}

export const BaroqueHero: React.FC<BaroqueHeroProps> = ({ onSaveDate }) => {
  return (
    <section className="snap-center relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">

      {/* ── Layer 1: hero-bg.jpeg with reduced gaussian blur ── */}
      <div className="absolute -inset-6 z-0">
        <img
          src="/hero-bg.jpeg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{
            filter: 'blur(12px) saturate(1.3) brightness(0.4)',
            transform: 'scale(1.08)',
          }}
        />
      </div>

      {/* ── Layer 2: Vignette overlay ── */}
      <div className="absolute inset-0 z-[1]" style={{
        background: `
          radial-gradient(ellipse 70% 60% at 50% 40%, transparent 20%, rgba(10,8,6,0.55) 100%),
          linear-gradient(to bottom, rgba(10,8,6,0.3), transparent 30%, transparent 70%, rgba(10,8,6,0.45))
        `,
      }} />

      {/* ── Layer 3: Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-2xl">

        {/* Ornament */}
        <div className="w-20 ornate-line anim-line-reveal delay-1 mb-14" />

        {/* Name — bolder, bigger */}
        <p className="anim-rise delay-2 text-[12px] md:text-[14px] uppercase tracking-[0.5em] text-gold-light/50 font-body font-semibold mb-4">
          Deaconess Rachel Akhuetie
        </p>

        {/* Diamond */}
        <div className="anim-appear delay-3 diamond mb-10" />

        {/* Title — bigger */}
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

        {/* Script — bigger */}
        <span className="anim-rise delay-4 font-script text-4xl sm:text-5xl md:text-6xl text-gold-light/40 -mt-2 md:-mt-4">
          @ Fifty
        </span>

        <div className="h-10 md:h-14" />

        {/* Tagline — bigger */}
        <p className="anim-rise delay-5 font-body text-base md:text-lg text-parchment/40 max-w-sm leading-[1.9] tracking-wide">
          As DRA begins the Countdown to the 5th Floor
        </p>

        <div className="h-8 md:h-12" />

        {/* CTA — bigger text */}
        <button
          onClick={onSaveDate}
          className="anim-rise delay-6 btn-gold px-12 py-4 rounded-full border border-gold/25 font-body text-[12px] uppercase tracking-[0.3em] text-gold-light/80 hover:text-gold-light cursor-pointer"
        >
          Save The Date
        </button>

        {/* City pills */}
        <div className="anim-appear delay-7 mt-14 flex items-center gap-5 text-[10px] uppercase tracking-[0.4em] text-gold-light/25 font-body">
          {['Dubai', 'Canada', 'Europe', 'Lagos'].map((c, i) => (
            <React.Fragment key={c}>
              {i > 0 && <div className="diamond-sm" />}
              <span>{c}</span>
            </React.Fragment>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="anim-appear delay-8 mt-16 flex flex-col items-center">
          <div className="w-[1px] h-10 overflow-hidden">
            <div className="w-full h-3 rounded-full" style={{
              background: 'linear-gradient(to bottom, rgba(201,169,110,0.5), transparent)',
              animation: 'scroll-pulse 2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </div>
    </section>
  );
};
