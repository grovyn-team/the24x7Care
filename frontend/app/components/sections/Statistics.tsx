'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../animations/AnimatedCounter';

interface StatItem {
  value: string;
  label: string;
}

const stats: StatItem[] = [
  { value: '15+', label: 'Years of Experience' },
  { value: '500+', label: 'Certified Professionals' },
  { value: '2k+', label: 'Happy Families' },
  { value: '24x7', label: 'Medical Support' },
];

export const Statistics: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center p-6 rounded-xl bg-white border border-gray-100 hover:border-teal-200 hover:shadow-sm transition-all duration-200"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="text-4xl md:text-5xl font-bold text-teal-700 mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <AnimatedCounter value={stat.value} duration={2} />
              </motion.div>
              <div className="text-gray-600 font-medium text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
