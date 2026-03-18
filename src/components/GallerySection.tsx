import React from 'react';
import { motion } from 'framer-motion';
import { ThreeDPhotoCarousel } from './ui/3d-carousel';

const GALLERY_IMAGES = [
  '/img1.png',
  '/img2.jpeg',
  '/img3.jpeg',
  '/img4.jpeg',
  '/img5.jpeg',
  '/img6.jpeg',
];

export const GallerySection: React.FC = () => {
  return (
    <section className="snap-center relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-28">
      {/* Warm ambient glow */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 50% 35% at 50% 50%, rgba(201,169,110,0.04), transparent 60%),
          #0A0806
        `,
      }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="w-14 ornate-line mx-auto mb-10" />
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gold-gradient mb-5 tracking-tight">
            The Gallery
          </h2>
          <p className="font-body text-base md:text-lg text-gold/20 tracking-[0.15em]">
            A Portrait of Elegance
          </p>
        </motion.div>

        {/* 3D Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <ThreeDPhotoCarousel images={GALLERY_IMAGES} />
        </motion.div>

        {/* Instruction */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-10 text-[11px] uppercase tracking-[0.35em] text-gold/15 font-body"
        >
          Drag to explore · Hover for colour · Click to expand
        </motion.p>
      </div>
    </section>
  );
};
