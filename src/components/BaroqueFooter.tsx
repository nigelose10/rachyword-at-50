import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Brand palette for confetti/balloons
const BRAND_COLORS = ['#C9A96E', '#E8D5A3', '#F0E0B0', '#8B6914', '#FAF6F0'];

const launchCelebration = () => {
  const duration = 4000;
  const end = Date.now() + duration;

  // Gold confetti burst from left
  confetti({
    particleCount: 60,
    spread: 80,
    origin: { x: 0.15, y: 0.6 },
    colors: BRAND_COLORS,
    shapes: ['circle', 'square'],
    ticks: 200,
    gravity: 0.8,
    scalar: 1.2,
  });

  // Gold confetti burst from right
  confetti({
    particleCount: 60,
    spread: 80,
    origin: { x: 0.85, y: 0.6 },
    colors: BRAND_COLORS,
    shapes: ['circle', 'square'],
    ticks: 200,
    gravity: 0.8,
    scalar: 1.2,
  });

  // Center celebration burst
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { x: 0.5, y: 0.5 },
    colors: BRAND_COLORS,
    shapes: ['circle'],
    ticks: 250,
    gravity: 0.6,
    scalar: 1.5,
    startVelocity: 45,
  });

  // Continuous rain of gold
  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }

    // Slow falling circles (balloon-like)
    confetti({
      particleCount: 3,
      spread: 160,
      origin: { x: Math.random(), y: -0.1 },
      colors: BRAND_COLORS,
      shapes: ['circle'],
      ticks: 400,
      gravity: 0.4,
      scalar: 2.5,
      drift: (Math.random() - 0.5) * 0.5,
      startVelocity: 5,
    });

    // Small sparkles
    confetti({
      particleCount: 2,
      spread: 180,
      origin: { x: Math.random(), y: -0.05 },
      colors: ['#F0E0B0', '#E8D5A3'],
      shapes: ['circle'],
      ticks: 300,
      gravity: 0.3,
      scalar: 0.8,
      startVelocity: 2,
    });
  }, 100);
};

export const BaroqueFooter: React.FC = () => {
  const [celebrated, setCelebrated] = useState(false);

  const handleCelebrate = () => {
    launchCelebration();
    setCelebrated(true);
    setTimeout(() => setCelebrated(false), 5000);
  };

  return (
    <footer className="snap-center relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 55%, rgba(201,169,110,0.02), transparent 50%), #0A0806',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center text-center px-8 max-w-lg"
      >
        {/* Ornament */}
        <div className="w-16 ornate-line mb-16" />

        {/* Quote */}
        <p className="font-script text-2xl md:text-3xl text-gold-light/18 leading-relaxed mb-14">
          "A life well lived is a masterpiece painted in grace."
        </p>

        {/* Name */}
        <h3 className="font-display text-sm text-gold-gradient tracking-[0.2em] mb-3 font-semibold">
          DEACONESS RACHEL AKHUETIE
        </h3>

        <p className="font-display text-xs text-gold/18 tracking-[0.15em] mb-12">
          DRA @ 50
        </p>

        {/* Cities */}
        <div className="flex items-center gap-5 text-[9px] uppercase tracking-[0.35em] text-gold/12 font-body mb-16">
          {['Dubai', 'Canada', 'Europe', 'Lagos'].map((c, i) => (
            <span key={c} className="flex items-center gap-5">
              {i > 0 && <div className="diamond-sm" />}
              <span>{c}</span>
            </span>
          ))}
        </div>

        {/* Social */}
        <div className="flex items-center gap-10 mb-14">
          {['Instagram', 'WhatsApp', 'Email'].map(link => (
            <a
              key={link}
              href="#"
              className="text-[10px] uppercase tracking-[0.2em] text-gold/15 hover:text-gold-light/45 transition-colors duration-500 font-body"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-[9px] text-gold/8 font-body tracking-[0.15em] mb-10">
          © DRA 2025. All Rights Reserved.
        </p>

        {/* 🎉 Celebrate Button */}
        <motion.button
          onClick={handleCelebrate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-2.5 px-8 py-3 rounded-full border border-gold/12 hover:border-gold/30 transition-all duration-500 cursor-pointer"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold/25 group-hover:text-gold/55 font-body transition-colors">
            Celebrate
          </span>
          <span className="text-gold/20 group-hover:text-gold/50 transition-colors text-sm">✦</span>
        </motion.button>

        <AnimatePresence>
          {celebrated && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-[9px] text-gold/20 font-body tracking-wider"
            >
              🥂 To 50 glorious years!
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </footer>
  );
};
