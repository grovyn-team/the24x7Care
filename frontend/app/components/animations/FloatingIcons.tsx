'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface FloatingIconProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({ 
  children, 
  delay = 0,
  duration = 3,
  y = 10
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -y, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      {children}
    </motion.div>
  );
};

export const FloatingIcons: React.FC = () => {
  const icons = [
    {
      component: (
        <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 12h5v8h10v-8h5L12 2zm0 5.5L16.5 12H14v6h-4v-6H7.5L12 7.5z" />
        </svg>
      ),
      bg: 'from-teal-50 to-teal-100',
      color: 'text-teal-700',
    },
    {
      component: (
        <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
      bg: 'from-pink-50 to-pink-100',
      color: 'text-pink-600',
    },
    {
      component: (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.36 2.72L20.78 4.14L19.36 5.56L16.95 3.15L18.36 1.72L19.36 2.72ZM11 8L13 10L11 12L9 10L11 8ZM7.94 13L5.03 10.11L3.62 11.53L6.53 14.44L7.94 13ZM17.06 11.03L20 8.09L21.41 9.5L18.47 12.44L17.06 11.03ZM12 18.97L9.09 22L7.68 20.59L10.59 17.66L12 18.97ZM8 3L10 5L8 7L6 5L8 3ZM3.67 8.39L5.08 9.8L2.17 12.71L0.76 11.3L3.67 8.39ZM19.89 7.7L18.48 6.29L21.39 3.38L22.8 4.79L19.89 7.7ZM4.1 18.36L5.51 19.77L2.6 22.68L1.19 21.27L4.1 18.36ZM16 12L18 14L16 16L14 14L16 12ZM11.5 15.5L12.5 16.5L11.5 17.5L10.5 16.5L11.5 15.5Z" />
        </svg>
      ),
      bg: 'from-blue-50 to-blue-100',
      color: 'text-blue-600',
    },
    {
      component: (
        <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      bg: 'from-purple-50 to-purple-100',
      color: 'text-purple-600',
    },
    {
      component: (
        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      ),
      bg: 'from-green-50 to-green-100',
      color: 'text-green-600',
    },
  ];

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap py-4">
      {icons.map((icon, index) => (
        <FloatingIcon
          key={index}
          delay={index * 0.15}
          duration={2.5 + index * 0.2}
          y={6 + index * 1.5}
        >
          <motion.div
            className={`p-4 bg-gradient-to-br ${icon.bg} rounded-2xl shadow-soft-lg border border-gray-200/50 cursor-pointer group transition-all duration-300 hover:shadow-soft`}
            whileHover={{ scale: 1.15, y: -5, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={`${icon.color} transition-colors duration-300`}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
            >
              {icon.component}
            </motion.div>
          </motion.div>
        </FloatingIcon>
      ))}
    </div>
  );
};
