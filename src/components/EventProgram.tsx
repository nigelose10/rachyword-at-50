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
      style={{ background: 'linear-gradient(180deg, #0A0806, #0D0A07, #0A0806)' }}
    >
      <div className="relative z-10 w-full max-w-2xl mx-auto px-8 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="w-14 ornate-line mx-auto mb-10" />
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gold-gradient mb-5 tracking-tight">
            The Evening
          </h2>
          <p className="font-body text-base md:text-lg text-gold/20 tracking-[0.15em]">
            Programme of Events
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative pl-10 md:pl-14">
          {/* Gold thread */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-gold/12 to-transparent" />

          <div className="space-y-16 md:space-y-20">
            {PROGRAM.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Diamond on thread */}
                <div className="absolute -left-10 md:-left-14 top-1.5 -translate-x-1/2">
                  <div className="diamond-sm" />
                </div>

                {/* Time */}
                <span className="font-display text-[11px] text-gold/22 tracking-[0.3em] uppercase block mb-3">
                  {event.time}
                </span>

                {/* Title */}
                <h3 className="font-display text-lg md:text-xl font-semibold text-gold-light/65 mb-3">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="font-body text-base text-parchment/25 leading-[1.85]">
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
