'use client';

import { motion } from 'framer-motion';
import React from 'react';

export const PulseHeart: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1] as const,
        }}
      >
        <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </motion.div>
    </div>
  );
};
