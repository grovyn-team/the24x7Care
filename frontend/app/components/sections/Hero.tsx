'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BadgeCheck, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { CONSULTATION_MODAL_PANEL_CLASS, ConsultationModalPanel } from './ConsultationModal';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

export const Hero: React.FC = () => {
  const [showForm, setShowForm] = React.useState(false);
  const { hero } = useSiteSettings();
  const heroImageSrc = hero.imageUrl?.trim() ? hero.imageUrl : '/doc_placeholder.png';
  const waHref = `https://wa.me/${hero.whatsappNumber?.replace(/\D/g, '') || '917974753889'}`;

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
                <span style={{ color: 'lab(26 28.3 -70.17)' }}>{hero.greetingPart1}</span>{' '}
                <span style={{ color: '#1A6B5E' }}>{hero.greetingPart2}</span>
              </motion.h2>

              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
                variants={itemVariants}
              >
                {hero.headline}
              </motion.h1>

              <motion.p
                className="text-base md:text-lg text-gray-800 leading-relaxed max-w-2xl"
                variants={itemVariants}
              >
                {hero.paragraph1}
              </motion.p>

              <motion.p
                className="text-lg text-gray-600 leading-relaxed max-w-2xl"
                variants={itemVariants}
              >
                {hero.paragraph2}
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
                  onClick={() => window.open(waHref, '_blank', 'noopener,noreferrer')}
                >
                  <span className="text-base font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                    {hero.busyCta}
                  </span>
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#25D366] rounded-full opacity-20 group-hover:opacity-30 group-hover:scale-125 transition-all duration-300"></div>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative inline-flex items-center justify-center p-1.5 bg-white rounded-full shadow-md group-hover:shadow-lg transition-all duration-300"
                      aria-label="WhatsApp"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle
                        className="h-6 w-6 text-[#25D366] transition-transform duration-300 group-hover:scale-110"
                        fill="currentColor"
                        strokeWidth={0}
                      />
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
                {heroImageSrc.startsWith('http') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroImageSrc}
                    alt={hero.imageAlt || 'Quality Care Guarantee - Medical Professional'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={heroImageSrc}
                    alt={hero.imageAlt || 'Quality Care Guarantee - Medical Professional'}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover"
                    priority
                  />
                )}
                
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
                        <BadgeCheck className="h-5 w-5 text-white" strokeWidth={2} />
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-900/50 via-slate-900/45 to-teal-950/40 p-4 backdrop-blur-[10px] sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowForm(false)}
        >
          <motion.div
            className={`relative z-10 ${CONSULTATION_MODAL_PANEL_CLASS}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <ConsultationModalPanel onClose={() => setShowForm(false)} />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
