import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 100);
    const t2 = setTimeout(() => setPhase('exit'), 2200);
    const t3 = setTimeout(onComplete, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-700 ${
        phase === 'exit' ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
      style={{ background: '#0A0806' }}
    >
      <div className={`flex flex-col items-center gap-8 transition-all duration-1000 ${
        phase === 'enter' ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
      }`}>
        {/* Diamond */}
        <div className="diamond anim-breathe" />

        {/* Title */}
        <h1
          className="font-display text-3xl md:text-4xl tracking-[0.15em] font-bold"
          style={{
            background: 'linear-gradient(135deg, #E8D5A3, #C9A96E, #F0E0B0, #8B6914)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          DRA @ 50
        </h1>

        {/* Subtitle */}
        <span className="font-script text-lg text-gold/20">
          Deaconess Rachel Akhuetie
        </span>

        {/* Line */}
        <div className="w-10 ornate-line" />
      </div>
    </div>
  );
};
