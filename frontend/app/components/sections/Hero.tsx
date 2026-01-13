'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ConsultationForm } from './ConsultationForm';

export const Hero: React.FC = () => {
  const [showForm, setShowForm] = React.useState(false);

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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, x: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <>
      <section className="relative bg-gradient-to-br from-teal-50/80 via-white to-white py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <motion.h2
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                variants={itemVariants}
              >
                <span style={{ color: 'lab(26 28.3 -70.17)' }}>जय</span>{' '}
                <span style={{ color: '#1A6B5E' }}>जोहार</span>
              </motion.h2>
              
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
                variants={itemVariants}
              >
                Compassionate <span className="text-teal-700">Healthcare</span>, Delivered at Home
              </motion.h1>
              
              <motion.p
                className="text-base md:text-lg text-gray-800 leading-relaxed max-w-2xl"
                variants={itemVariants}
              >
                Welcome to The 247 Care, we understand that your health is more than just physical; 
                it&apos;s about nurturing your mind, body, and spirit. Our comprehensive home healthcare 
                services are designed to provide you with personalized, compassionate care in the 
                comfort of your own home.
              </motion.p>

              <motion.p
                className="text-lg text-gray-600 leading-relaxed max-w-2xl"
                variants={itemVariants}
              >
                Experience premium medical services in the comfort of your own sanctuary.
              </motion.p>
              
              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-2"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowForm(true)}
                  >
                    Get a Consultation
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="outline" size="lg">
                    Explore Services
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div
                className="flex items-center gap-3 pt-4"
                variants={itemVariants}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 rounded-full bg-teal-500 border-2 border-white"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  +2k Trusted by families nationwide
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-square">
                <Image
                  src="/doc_placeholder.png"
                  alt="Quality Care Guarantee - Medical Professional"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
                
                <motion.div
                  className="absolute top-6 right-6 bg-white rounded-xl shadow-lg px-4 py-3 border border-gray-100 z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-teal-700 leading-tight">24x7</h3>
                    <p className="text-xs text-gray-600 mt-0.5">Medical Support</p>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-5 max-w-xs border border-gray-100 z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      className="flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1 text-sm leading-tight">Quality Care Guarantee</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Our professionals are vetted, certified, and trained to provide the highest standard of care.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {showForm && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowForm(false)}
        >
          <motion.div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">Schedule a Consultation</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 rounded-full p-2 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <motion.div
              className="p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ConsultationForm onClose={() => setShowForm(false)} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
