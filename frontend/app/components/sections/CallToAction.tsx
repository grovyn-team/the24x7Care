'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { CONSULTATION_MODAL_PANEL_CLASS, ConsultationModalPanel } from './ConsultationModal';

export const CallToAction: React.FC = () => {
  const [showForm, setShowForm] = React.useState(false);

  return (
    <>
      <section className="py-16 bg-gray-50 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Ready to find the right care?
            </motion.h2>
            <motion.p
              className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Schedule a free consultation with our care coordinators to discuss your specific needs and create a personalized care plan.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowForm(true)}
                >
                  Get Free Consultation
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/services">
                  <Button variant="outline" size="lg">
                    View Services
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
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
