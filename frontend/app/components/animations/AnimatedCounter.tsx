'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useMotionValueEvent } from 'framer-motion';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  suffix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  duration = 2,
  suffix = ''
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [display, setDisplay] = useState(0);
  
  // Extract numeric value and suffix from string like "15+" or "2k+"
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const originalSuffix = value.replace(/[0-9.]/g, '') || suffix;
  
  const spring = useSpring(0, {
    damping: 60,
    stiffness: 100,
  });

  useMotionValueEvent(spring, 'change', (latest) => {
    setDisplay(Math.round(latest));
  });

  useEffect(() => {
    if (isInView) {
      spring.set(numericValue);
    }
  }, [spring, isInView, numericValue]);

  return (
    <span ref={ref}>
      {display}{originalSuffix}
    </span>
  );
};
