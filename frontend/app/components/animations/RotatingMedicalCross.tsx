'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
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
      <Plus
        width={size}
        height={size}
        color={color}
        strokeWidth={Math.max(2, size / 8)}
        absoluteStrokeWidth
        aria-hidden
      />
    </motion.div>
  );
};
