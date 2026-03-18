import React from 'react';
import { motion } from 'framer-motion';

interface CityData {
  name: string;
  date: string;
  venue: string;
  image: string;
  description: string;
}

interface CityShowcaseProps {
  city: CityData;
  index: number;
  onRSVP: (cityName: string) => void;
}

export const CityShowcase: React.FC<CityShowcaseProps> = ({ city, index, onRSVP }) => {
  const isEven = index % 2 === 0;

  return (
    <section
      id={city.name.toLowerCase().replace(/[^a-z]/g, '')}
      className="city-section snap-center relative h-screen w-full flex items-center justify-center"
    >
      {/* ── Gaussian-blurred background ── */}
      <div className="city-bg">
        <img
          src={city.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      </div>
      <div className="city-vignette" />

      {/* ── Content ── */}
      <div className={`relative z-10 w-full max-w-6xl mx-auto px-8 md:px-20 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-24`}>
        
        {/* ── Image — sharp, inside gold frame, floating ── */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(15px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: '-10%' }}
          className="flex-shrink-0"
        >
          <div className="relative group">
            {/* Ambient glow behind image */}
            <div
              className="absolute -inset-8 rounded-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"
              style={{
                background: `radial-gradient(circle, rgba(201,169,110,0.15), transparent 70%)`,
              }}
            />

            {/* Gold frame */}
            <div className="relative w-[240px] h-[320px] sm:w-[280px] sm:h-[370px] md:w-[320px] md:h-[430px]">
              <div className="absolute inset-0 gold-frame" />

              {/* Image with inner padding */}
              <div className="absolute inset-[10px] overflow-hidden">
                <img
                  src={city.image}
                  alt={`${city.name} celebration`}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-noir/30 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Text — generous whitespace ── */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: '-10%' }}
          className={`flex-1 ${isEven ? 'md:text-left' : 'md:text-right'} text-center`}
        >
          {/* Label */}
          <div className={`flex items-center gap-3 mb-6 ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-center`}>
            <div className="diamond-sm" />
            <span className="text-[9px] uppercase tracking-[0.5em] text-gold/30 font-body">
              Join DRA to Celebrate
            </span>
          </div>

          {/* City Name — big, bold, breathing */}
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gold-gradient leading-[0.85] mb-6">
            {city.name}
          </h2>

          {/* Venue in script */}
          <p className="font-script text-xl md:text-2xl text-gold-light/30 mb-8">
            {city.venue}
          </p>

          {/* Date — extra spacing */}
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold/25 font-body mb-6">
            {city.date}
          </p>

          {/* Description — limited width for readability */}
          <p className={`text-sm md:text-base text-parchment/30 font-body leading-[1.9] max-w-sm mb-12 ${isEven ? '' : 'md:ml-auto'} mx-auto md:mx-0`}>
            {city.description}
          </p>

          {/* Button */}
          <button
            onClick={() => onRSVP(city.name)}
            className={`btn-gold px-10 py-3.5 rounded-full border border-gold/15 font-body text-[10px] uppercase tracking-[0.3em] text-gold-light/60 hover:text-gold-light cursor-pointer ${isEven ? '' : 'md:ml-auto'}`}
          >
            Save The Date
          </button>
        </motion.div>
      </div>
    </section>
  );
};
