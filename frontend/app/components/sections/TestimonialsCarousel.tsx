'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote: 'The caregivers treated my father with such dignity and respect. It wasn\'t just about medical needs; they truly connected with him. It gave us peace of mind knowing he was in safe hands every single day.',
    author: 'Sarah Jenkins',
    role: 'Daughter of Patient',
    rating: 5,
  },
  {
    id: '2',
    quote: 'The caregivers treated my father like their own family. We are forever grateful for the compassionate care they provided during his recovery.',
    author: 'Michael Chen',
    role: 'Son of Patient',
    rating: 5,
  },
  {
    id: '3',
    quote: 'Professional, caring, and reliable. The team went above and beyond to ensure my mother\'s comfort and well-being.',
    author: 'Emily Rodriguez',
    role: 'Daughter of Patient',
    rating: 5,
  },
];

// Helper function to get initials
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 1);
};

export const TestimonialsCarousel: React.FC = () => {
  // Display first 3 testimonials in a grid
  const displayedTestimonials = testimonials.slice(0, 3);

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
          {/* Header Section */}
          <motion.div
            className="text-center mb-12"
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {/* Testimonials Badge */}
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
            
            {/* Main Heading */}
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              What Our Patients Say
            </motion.h2>
            
            {/* Subheading */}
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

          {/* Testimonial Cards Grid */}
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
                {/* Star Rating - Top Left */}
                <motion.div
                  className="flex gap-1 mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ staggerChildren: 0.1, delay: 0.3 }}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.svg
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-current"
                      viewBox="0 0 20 20"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      whileHover={{ scale: 1.2, rotate: 15 }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </motion.div>

                {/* Decorative Quotation Mark - Top Right */}
                <div className="absolute top-6 right-6 opacity-20">
                  <svg
                    className="w-12 h-12 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                  </svg>
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-800 text-base leading-relaxed mb-6 relative z-10 flex-1">
                  &quot;{testimonial.quote}&quot;
                </p>

                {/* Reviewer Information - Bottom */}
                <motion.div
                  className="flex items-center gap-3 mt-auto"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  {/* Avatar */}
                  <motion.div
                    className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-white font-bold text-lg">
                      {getInitials(testimonial.author)}
                    </span>
                  </motion.div>

                  {/* Name and Role */}
                  <div className="flex flex-col">
                    <p className="font-semibold text-gray-900 text-sm leading-tight">
                      {testimonial.author}
                    </p>
                    <p className="text-gray-500 text-sm leading-tight">
                      {testimonial.role}
                    </p>
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
