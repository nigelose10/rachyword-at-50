import React from 'react';
import { motion } from 'framer-motion';

const PROGRAM = [
  { time: '6:00 PM', title: 'Red Carpet Reception', desc: 'Champagne, canapés, and arrivals in couture.' },
  { time: '7:30 PM', title: 'The Gala Dinner', desc: 'Five-course tasting menu with rare vintage pairings.' },
  { time: '9:00 PM', title: 'The Tribute', desc: 'Speeches, tributes, and a celebration of DRA\'s legacy.' },
  { time: '10:30 PM', title: 'The After Party', desc: 'Live music, dancing, and celebrations into the night.' },
];

export const EventProgram: React.FC = () => {
  return (
    <section className="snap-center relative min-h-screen w-full flex items-center justify-center overflow-hidden py-32"
      style={{ background: 'linear-gradient(180deg, #0A0806, #0E0B08, #0A0806)' }}
    >
      <div className="relative z-10 w-full max-w-2xl mx-auto px-8 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="w-12 ornate-line mx-auto mb-8" />
          <h2 className="font-display text-4xl md:text-6xl font-bold text-gold-gradient mb-4">
            The Evening
          </h2>
          <p className="font-body text-sm text-gold/20 tracking-[0.2em]">
            Programme of Events
          </p>
        </motion.div>

        {/* Timeline — vertical, all left-aligned for elegance */}
        <div className="relative pl-8 md:pl-12">
          {/* Gold thread */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold/15 to-transparent" />

          <div className="space-y-14 md:space-y-16">
            {PROGRAM.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Diamond on gold thread */}
                <div className="absolute -left-8 md:-left-12 top-1 -translate-x-1/2">
                  <div className="diamond-sm" />
                </div>

                {/* Time */}
                <span className="font-display text-[11px] text-gold/25 tracking-[0.35em] uppercase block mb-2">
                  {event.time}
                </span>

                {/* Title */}
                <h3 className="font-display text-lg md:text-xl font-semibold text-gold-light/70 mb-2">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="font-body text-sm text-parchment/25 leading-[1.8]">
                  {event.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
