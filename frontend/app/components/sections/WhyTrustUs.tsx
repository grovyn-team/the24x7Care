'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Vetted Professionals',
    description: 'Every caregiver undergoes rigorous background checks and continuous training.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Flexible Scheduling',
    description: 'From 2-hour visits to 24/7 live-in care, we adapt to your schedule.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: 'Personalized Matching',
    description: 'We match caregivers based on compatibility, personality, and specific needs.',
  },
];

export const WhyTrustUs: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section className="py-16 bg-teal-700 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Image and Testimonial */}
          <motion.div
            className="relative"
            variants={leftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-2">
              <div className="aspect-[4/3] relative rounded-xl overflow-hidden">
                <Image
                  src="/doc_placeholder.png"
                  alt="Medical Professional - Quality Care"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
              
              {/* Clean Testimonial Bubble - Review Card */}
              <motion.div
                className="mt-4 bg-white rounded-xl shadow-xl p-4 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <motion.div
                  className="flex items-center gap-1 mb-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ staggerChildren: 0.1, delay: 0.5 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.svg
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </motion.div>
                <p className="text-gray-700 italic mb-2 leading-relaxed text-sm">
                  &quot;The caregivers treated my father like their own family. We are forever grateful.&quot;
                </p>
                <p className="text-gray-900 font-semibold text-sm">- Sarah Jenkins</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            className="space-y-6"
            variants={rightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div
              variants={containerVariants}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Why Families Trust Us With Their Loved Ones
              </motion.h2>
              <motion.p
                className="text-base text-teal-100 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                We don&apos;t just provide medical care; we build relationships. Our approach is holistic, 
                focusing on physical health, mental well-being, and emotional support.
              </motion.p>
            </motion.div>

            <motion.div
              className="space-y-4"
              variants={containerVariants}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={featureVariants}
                  className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
                  whileHover={{ x: 5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="flex-shrink-0"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                      {feature.icon}
                    </div>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-teal-100 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
