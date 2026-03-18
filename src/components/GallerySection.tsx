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
    <section className="snap-center relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-24">
      {/* Subtle warm glow behind carousel */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,169,110,0.03), transparent 60%),
          #0A0806
        `,
      }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="w-12 ornate-line mx-auto mb-8" />
          <h2 className="font-display text-4xl md:text-6xl font-bold text-gold-gradient mb-4">
            The Woman
          </h2>
          <p className="font-body text-sm md:text-base text-gold/20 tracking-[0.2em]">
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

        {/* Subtle instruction */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-8 text-[10px] uppercase tracking-[0.4em] text-gold/15 font-body"
        >
          Drag to explore · Click to expand
        </motion.p>
      </div>
    </section>
  );
};
