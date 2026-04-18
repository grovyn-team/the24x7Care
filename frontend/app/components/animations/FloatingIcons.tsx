'use client';

import { motion } from 'framer-motion';
import { CircleCheck, Heart, Home, Plus, Stethoscope } from 'lucide-react';
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
      component: <Home className="h-8 w-8 text-teal-600" strokeWidth={1.75} />,
      bg: 'from-teal-50 to-teal-100',
      color: 'text-teal-700',
    },
    {
      component: <Heart className="h-8 w-8 fill-pink-500 text-pink-500" strokeWidth={0} />,
      bg: 'from-pink-50 to-pink-100',
      color: 'text-pink-600',
    },
    {
      component: <Stethoscope className="h-8 w-8 text-blue-500" strokeWidth={1.75} />,
      bg: 'from-blue-50 to-blue-100',
      color: 'text-blue-600',
    },
    {
      component: <CircleCheck className="h-8 w-8 text-purple-500" strokeWidth={1.75} />,
      bg: 'from-purple-50 to-purple-100',
      color: 'text-purple-600',
    },
    {
      component: <Plus className="h-8 w-8 text-green-600" strokeWidth={2} />,
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
