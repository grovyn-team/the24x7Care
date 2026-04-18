'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { WhyTrustFeatureIcon } from '../../lib/about-page-icons';

export const WhyTrustUs: React.FC = () => {
  const { about, testimonials } = useSiteSettings();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slideTestimonials = testimonials.map((t, i) => ({
    id: String(i),
    quote: t.quote,
    author: t.author,
    rating: t.rating ?? 5,
  }));

  useEffect(() => {
    setCurrentIndex(0);
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonials.length === 0) return undefined;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const imgSrc = about.whyTrustImageUrl?.trim() || '/doc_placeholder.png';
  const isRemoteImage = /^https?:\/\//i.test(imgSrc);

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
          <motion.div
            className="relative"
            variants={leftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-2">
              <div className="aspect-[4/3] relative rounded-xl overflow-hidden">
                {isRemoteImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imgSrc}
                    alt={about.whyTrustImageAlt}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                ) : (
                  <Image
                    src={imgSrc}
                    alt={about.whyTrustImageAlt}
                    fill
                    className="object-cover object-top"
                    priority
                  />
                )}
              </div>

              {slideTestimonials.length > 0 && (
                <div className="mt-4 overflow-hidden relative">
                  <div
                    className="flex transition-transform duration-1000 ease-in-out"
                    style={{
                      transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                  >
                    {slideTestimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="w-full flex-shrink-0 bg-white rounded-xl shadow-xl p-5 border border-gray-200 min-h-[180px] flex flex-col"
                      >
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" strokeWidth={0} />
                          ))}
                        </div>
                        <p
                          className="text-gray-700 italic mb-2 leading-relaxed text-sm flex-1 break-words"
                          style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                        >
                          &quot;{testimonial.quote}&quot;
                        </p>
                        <p className="text-gray-900 font-semibold text-sm mt-auto">- {testimonial.author}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            variants={rightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <motion.div variants={containerVariants}>
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {about.whyTrustHeading}
              </motion.h2>
              <motion.p
                className="text-base text-teal-100 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {about.whyTrustSubheading}
              </motion.p>
            </motion.div>

            <motion.div className="space-y-4" variants={containerVariants}>
              {about.whyTrustFeatures.map((feature, index) => (
                <motion.div
                  key={`${feature.title}-${index}`}
                  variants={featureVariants}
                  className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
                  whileHover={{ x: 5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div className="flex-shrink-0" whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }}>
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                      <WhyTrustFeatureIcon iconKey={feature.iconKey} />
                    </div>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-teal-100 leading-relaxed">{feature.description}</p>
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
