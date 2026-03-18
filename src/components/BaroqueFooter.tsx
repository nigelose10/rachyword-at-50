import React from 'react';
import { motion } from 'framer-motion';

export const BaroqueFooter: React.FC = () => {
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
        <p className="text-[9px] text-gold/8 font-body tracking-[0.15em]">
          © DRA 2025. All Rights Reserved.
        </p>
      </motion.div>
    </footer>
  );
};
