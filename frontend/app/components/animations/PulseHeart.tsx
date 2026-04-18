'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
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
        <Heart className="h-5 w-5 fill-teal-600 text-teal-600" strokeWidth={0} />
      </motion.div>
    </div>
  );
};
