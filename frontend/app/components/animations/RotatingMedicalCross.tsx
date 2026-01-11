'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface RotatingMedicalCrossProps {
  size?: number;
  color?: string;
  className?: string;
}

export const RotatingMedicalCross: React.FC<RotatingMedicalCrossProps> = ({
  size = 48,
  color = '#3D8472',
  className = '',
}) => {
  return (
    <motion.div
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
      }}
      className={className}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vertical bar */}
        <rect x="10" y="4" width="4" height="16" rx="2" fill={color} />
        {/* Horizontal bar */}
        <rect x="4" y="10" width="16" height="4" rx="2" fill={color} />
        {/* Glow effect */}
        <rect
          x="10"
          y="4"
          width="4"
          height="16"
          rx="2"
          fill={color}
          opacity="0.3"
          filter="blur(4px)"
        />
        <rect
          x="4"
          y="10"
          width="16"
          height="4"
          rx="2"
          fill={color}
          opacity="0.3"
          filter="blur(4px)"
        />
      </svg>
    </motion.div>
  );
};
