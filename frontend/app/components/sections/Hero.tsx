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
                className="flex flex-col sm:flex-row gap-4 pt-2 items-center"
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
                  className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-teal-300 transition-all duration-300 group cursor-pointer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open('https://wa.me/917974753889', '_blank', 'noopener,noreferrer')}
                >
                  <span className="text-base font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    Too Busy? Connect on
                  </span>
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#25D366] rounded-full opacity-20 group-hover:opacity-30 group-hover:scale-125 transition-all duration-300"></div>
                    <a
                      href="https://wa.me/917974753889"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative inline-flex items-center justify-center p-1.5 bg-white rounded-full shadow-md group-hover:shadow-lg transition-all duration-300"
                      aria-label="WhatsApp"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg
                        className="w-6 h-6 text-[#25D366] transition-transform duration-300 group-hover:scale-110"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </a>
                  </div>
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
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
