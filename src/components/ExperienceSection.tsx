import React from 'react';
import { motion } from 'framer-motion';

const EXPERIENCES = [
  {
    number: '01',
    title: 'The Gala',
    desc: 'An evening of grandeur — world-class entertainment and a celebration worthy of royalty.',
  },
  {
    number: '02',
    title: 'The Fellowship',
    desc: 'An intimate gathering of family, friends, and loved ones. Breaking bread in gratitude and joy.',
  },
  {
    number: '03',
    title: 'The Journey',
    desc: 'Four cities. Four chapters. A global celebration that spans continents and communities.',
  },
  {
    number: '04',
    title: 'The Legacy',
    desc: 'Honouring 50 years of grace, faith, and impact. A life that has touched thousands.',
  },
];

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  },
  item: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  },
};

export const ExperienceSection: React.FC = () => {
  return (
    <section className="snap-center relative min-h-screen w-full flex items-center justify-center overflow-hidden py-32">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.02), transparent 55%), #0A0806',
      }} />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-8 md:px-16">
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
            The Experience
          </h2>
          <p className="font-body text-base md:text-lg text-gold/20 tracking-[0.15em]">
            What Awaits You
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
        >
          {EXPERIENCES.map((exp) => (
            <motion.div
              key={exp.number}
              variants={stagger.item}
              className="glass-card rounded-2xl p-8 md:p-10 group cursor-default"
            >
              <span className="font-display text-[11px] text-gold/12 tracking-[0.3em] uppercase block mb-6">
                {exp.number}
              </span>

              <h3 className="font-display text-xl md:text-2xl font-semibold text-gold-light/75 group-hover:text-gold-light transition-colors duration-500 mb-5">
                {exp.title}
              </h3>

              <p className="font-body text-base text-parchment/28 leading-[1.85]">
                {exp.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
