import React from 'react';
import { motion } from 'framer-motion';

export const BaroqueFooter: React.FC = () => {
  return (
    <footer className="snap-center relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 60%, rgba(201,169,110,0.025), transparent 50%), #0A0806',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center text-center px-8 max-w-lg"
      >
        {/* Ornament */}
        <div className="w-16 ornate-line mb-16" />

        {/* Quote */}
        <p className="font-script text-2xl md:text-3xl text-gold-light/20 leading-relaxed mb-12">
          "A life well lived is a masterpiece painted in grace."
        </p>

        {/* Name */}
        <h3 className="font-display text-sm text-gold-gradient tracking-[0.2em] mb-2">
          DEACONESS RACHEL AKHUETIE
        </h3>

        <p className="font-display text-xs text-gold/20 tracking-[0.15em] mb-10">
          DRA @ 50
        </p>

        {/* Cities */}
        <div className="flex items-center gap-4 text-[8px] uppercase tracking-[0.4em] text-gold/15 font-body mb-16">
          {['Dubai', 'Canada', 'Europe', 'Lagos'].map((c, i) => (
            <React.Fragment key={c}>
              {i > 0 && <div className="diamond-sm" />}
              <span>{c}</span>
            </React.Fragment>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-8 mb-12">
          {['Instagram', 'WhatsApp', 'Email'].map(link => (
            <a
              key={link}
              href="#"
              className="text-[9px] uppercase tracking-[0.25em] text-gold/18 hover:text-gold-light/50 transition-colors duration-500 font-body"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-[8px] text-gold/10 font-body tracking-[0.15em]">
          © DRA 2025. All Rights Reserved.
        </p>
      </motion.div>
    </footer>
  );
};
