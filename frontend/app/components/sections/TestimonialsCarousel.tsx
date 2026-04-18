'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 1);
};

export const TestimonialsCarousel: React.FC = () => {
  const { testimonials } = useSiteSettings();
  const displayedTestimonials = testimonials.slice(0, 3).map((t, i) => ({
    id: String(i),
    quote: t.quote,
    author: t.author,
    role: t.role,
    rating: t.rating,
    avatar: t.avatar,
  }));

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
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div
              className="inline-block mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <span className="inline-block px-4 py-1.5 bg-white rounded-full text-sm font-medium text-teal-600 border border-gray-200 shadow-sm">
                Testimonials
              </span>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              What Our Patients Say
            </motion.h2>

            <motion.p
              className="text-base text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Don&apos;t just take our word for it. Here&apos;s what families we&apos;ve cared for have to say.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {displayedTestimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 relative flex flex-col"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="flex gap-1 mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ staggerChildren: 0.1, delay: 0.3 }}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      whileHover={{ scale: 1.2, rotate: 15 }}
                    >
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" strokeWidth={0} />
                    </motion.div>
                  ))}
                </motion.div>

                <div className="absolute top-6 right-6 opacity-20">
                  <Quote className="h-12 w-12 text-gray-300" strokeWidth={1.25} />
                </div>

                <p className="text-gray-800 text-base leading-relaxed mb-6 relative z-10 flex-1">
                  &quot;{testimonial.quote}&quot;
                </p>

                <motion.div
                  className="flex items-center gap-3 mt-auto"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-white font-bold text-lg">{getInitials(testimonial.author)}</span>
                  </motion.div>

                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-900 text-sm leading-tight">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm leading-tight">{testimonial.role}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
