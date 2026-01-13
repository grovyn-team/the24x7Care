'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Basic Care',
    price: '₹25',
    description: 'Essential support for daily living.',
    features: [
      'Companion services',
      'Meal preparation',
      'Light housekeeping',
      'Transportation assistance',
    ],
    buttonText: 'Select Basic',
  },
  {
    name: 'Advanced Care',
    price: '₹45',
    description: 'Enhanced care for complex needs.',
    features: [
      'Personal hygiene support',
      'Medication reminders',
      'Vital signs monitoring',
      'All Basic features',
    ],
    buttonText: 'Select Advanced',
  },
  {
    name: 'Premium Care',
    price: '₹75',
    description: 'Comprehensive 24/7 professional care.',
    features: [
      '24/7 Monitoring',
      'Licensed Nursing Support',
      'Specialized Therapy',
      'All Advanced Features',
    ],
    highlighted: true,
    buttonText: 'Select Premium',
  },
];

export const PricingPlans: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
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

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };

  return (
    <section className="py-20 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.span
            className="inline-block text-sm font-semibold text-teal-700 uppercase tracking-wider mb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Pricing
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Compassionate Care, Tailored to You
          </motion.h2>
          <motion.p
            className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Transparent pricing for every level of need. No hidden fees, just dedicated support for your loved ones.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: tier.highlighted ? -10 : -5, scale: tier.highlighted ? 1.03 : 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`relative ${tier.highlighted ? 'border-2 border-teal-400 shadow-md' : 'border'}`}
              >
              {tier.highlighted && (
                <motion.div
                  className="absolute -top-3 right-4 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full"
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.5, type: 'spring' }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  BEST VALUE
                </motion.div>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 uppercase mb-3 tracking-wider">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-teal-700">
                    {tier.price}
                  </span>
                  <span className="text-gray-600">/hour</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-teal-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={tier.highlighted ? 'primary' : 'outline'}
                  size="lg"
                  className="w-full"
                >
                  {tier.buttonText}
                </Button>
              </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
